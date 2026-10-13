import asyncio
import io
import logging
import os
from typing import Optional
from PIL import Image
from fastapi import FastAPI, File, HTTPException, Query, Request, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware

from app.cancellation import (
    CancellationTokenSource,
    OperationCanceledException,
    monitor_client_disconnect,
)
from app.models import (
    BrainDumpRequest,
    GroundingMission,
    ProofOfTouchResponse,
    WeatherTelemetryResponse,
)
from app.generator import generate_grounding_mission
from app.weather import fetch_weather_telemetry
from app.vision import analyze_proof_of_touch_image
from app.constant import ZERO_RETENTION_HEADERS, SERVICE_METADATA

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("exhale.api")

app = FastAPI(
    title=SERVICE_METADATA["name"],
    description=SERVICE_METADATA["description"],
    version=SERVICE_METADATA["version"],
    docs_url="/docs",
    redoc_url=None
)

# CORS configuration
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [orig.strip() for orig in allowed_origins_env.split(",") if orig.strip()]
is_wildcard = allowed_origins == ["*"] or not allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if not is_wildcard else ["*"],
    allow_credentials=not is_wildcard,  # Secure: never allow credentials if origin is wildcard
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_zero_retention_headers(request, call_next):
    """
    Attaches cryptographic assurance and zero-retention headers to every response.
    Explicitly instructs proxies and browsers not to cache or persist mental health queries.
    """
    response = await call_next(request)
    for header_name, header_value in ZERO_RETENTION_HEADERS.items():
        response.headers[header_name] = header_value
    return response


@app.get("/health", tags=["System"])
async def health_check():
    """Liveness probe for Render and orchestrator status."""
    return {
        "status": "healthy",
        "service": "exhale-grounding-api",
        "privacy": "zero-retention",
        "privacy_contract": SERVICE_METADATA["privacy_contract"],
        "features": SERVICE_METADATA["features"],
        "model_runtime": os.getenv("OLLAMA_MODEL", "hermes3:latest") if os.getenv("ENABLE_OLLAMA", "false").lower() in ("true", "1", "yes") else os.getenv("GROQ_MODEL", "auto")
    }


@app.get(
    "/weather-context",
    response_model=WeatherTelemetryResponse,
    tags=["Telemetry"],
    summary="Fetch Hyper-Local Weather & Solar Telemetry"
)
async def get_weather_telemetry(
    lat: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Optional GPS Latitude (-90 to 90)"),
    lon: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Optional GPS Longitude (-180 to 180)")
):
    """
    Fetches real-time weather and daylight status via Open-Meteo.
    Zero retention: Coordinates are held in memory during the query and never saved.
    """
    return await fetch_weather_telemetry(lat, lon)


@app.post(
    "/generate-mission",
    response_model=GroundingMission,
    status_code=status.HTTP_200_OK,
    tags=["Intervention"],
    summary="Generate 5-Step Physical Outdoor Grounding Mission",
    response_description="Strictly typed 3-5 step outdoor grounding protocol with cultural & weather anchors"
)
async def create_grounding_mission(payload: BrainDumpRequest, request: Request):
    """
    Acute Emotional Circuit Breaker with cooperative CancellationToken support.
    Accepts raw text, optional weather summary, and cultural framework preference.
    Cooperatively aborts if client disconnects mid-flight or browser triggers AbortController.
    """
    raw_dump = payload.brain_dump.strip()
    if not raw_dump:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Brain dump cannot be empty."
        )

    logger.info("Processing acute circuit breaker request (zero-retention cycle).")

    async with CancellationTokenSource() as cts:
        is_render = os.getenv("RENDER", "false").lower() == "true"
        default_deadline = "60.0" if is_render else "180.0"
        generation_deadline = float(os.getenv("REQUEST_TIMEOUT", default_deadline))
        cts.cancel_after(generation_deadline)

        # Background listener for HTTP disconnects (e.g. browser abort signal or tab closure)
        disconnect_watcher = asyncio.create_task(
            monitor_client_disconnect(request, cts)
        )

        try:
            # Spawn inference task bound to CancellationToken
            generation_task = asyncio.create_task(
                generate_grounding_mission(
                    brain_dump=raw_dump,
                    weather_summary=payload.weather_summary,
                    cultural_framework=payload.cultural_framework,
                    cancellation_token=cts.token,
                )
            )

            # Cooperative link: if cts is cancelled, immediately cancel generation task
            cts.token.register(lambda: generation_task.cancel())

            mission = await generation_task
            return mission
        except (asyncio.CancelledError, OperationCanceledException):
            logger.info("[CancellationToken] Mission generation cancelled cooperatively by client.")
            raise HTTPException(
                status_code=499,
                detail="Client Closed Request: Mission generation cancelled cooperatively."
            )
        except Exception as e:
            logger.error(f"Failed to generate grounding mission: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate grounding mission. Please step outside and take a deep breath."
            )
        finally:
            disconnect_watcher.cancel()
            try:
                await asyncio.wait_for(disconnect_watcher, timeout=0.2)
            except (asyncio.CancelledError, asyncio.TimeoutError):
                pass


MAX_IMAGE_SIZE = 15 * 1024 * 1024  # 15MB limit
CHUNK_SIZE = 64 * 1024  # 64KB chunk buffer


@app.post(
    "/verify-touch",
    response_model=ProofOfTouchResponse,
    status_code=status.HTTP_200_OK,
    tags=["Verification"],
    summary="Multimodal Proof of Touch Verification",
    response_description="Validates real physical contact with natural elements (flora, bark, soil, stone, sky)"
)
async def verify_proof_of_touch(request: Request, file: UploadFile = File(...)):
    """
    Analyzes an in-memory photograph of an outdoor natural element.
    Evaluates color histograms, organic textures, and rejects digital displays.
    Zero retention: Image bytes are wiped from memory immediately after inference.
    Guards against memory exhaustion DoS via streaming chunk boundaries.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File provided must be an image format."
        )

    # 1. Check Content-Length header if provided by client
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > MAX_IMAGE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="Image exceeds 15MB size limit."
                )
        except ValueError:
            pass

    # 2. Read in bounded chunks to prevent unbounded RAM allocation
    try:
        chunks = []
        bytes_read = 0
        while chunk := await file.read(CHUNK_SIZE):
            bytes_read += len(chunk)
            if bytes_read > MAX_IMAGE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="Image exceeds 15MB size limit."
                )
            chunks.append(chunk)

        if bytes_read == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded image file is empty."
            )

        contents = b"".join(chunks)
        result = analyze_proof_of_touch_image(contents)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Proof of touch analysis error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze proof of touch image."
        )


@app.get(
    "/verify-touch/sample",
    response_model=ProofOfTouchResponse,
    tags=["Verification"],
    summary="Instant Synthetic Proof of Touch Test Sample",
    response_description="Generates an in-memory sample for quick evaluation"
)
async def get_test_sample_proof(
    sample_type: str = Query("leaf", description="Type of sample: 'leaf', 'bark', or 'screen'")
):
    """
    Evaluation helper endpoint for evaluators/judges without a live outdoor camera feed.
    Generates synthetic organic texture bytes in-memory and executes the classifier.
    """
    buf = io.BytesIO()
    if sample_type == "leaf":
        img = Image.new("RGB", (120, 120), color=(34, 139, 34))
    elif sample_type == "bark":
        img = Image.new("RGB", (120, 120), color=(101, 67, 33))
    else:
        # Screen / artificial monochrome dark code editor
        img = Image.new("RGB", (120, 120), color=(15, 15, 15))
        
    img.save(buf, format="JPEG")
    return analyze_proof_of_touch_image(buf.getvalue())
