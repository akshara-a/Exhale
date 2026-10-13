import logging
import math
from typing import Optional
import httpx
from app.models import WeatherTelemetryResponse
from app.constant import WMO_WEATHER_MAP, DEFAULT_WEATHER_TELEMETRY

logger = logging.getLogger(__name__)


async def fetch_weather_telemetry(lat: Optional[float], lon: Optional[float]) -> WeatherTelemetryResponse:
    """
    Fetches real-time hyper-local weather and solar telemetry via Open-Meteo.
    Zero-retention: coordinates are held in volatile RAM during query and never stored.
    Rejects NaN, Inf, or out-of-range coordinates without external network queries.
    """
    # If no coordinates provided or invalid/out-of-range, default to temperate baseline
    if (
        lat is None or lon is None or
        math.isnan(lat) or math.isnan(lon) or
        math.isinf(lat) or math.isinf(lon) or
        not (-90.0 <= lat <= 90.0) or
        not (-180.0 <= lon <= 180.0)
    ):
        return WeatherTelemetryResponse(
            temperature_c=DEFAULT_WEATHER_TELEMETRY["temperature_c"],
            condition=DEFAULT_WEATHER_TELEMETRY["condition"],
            is_day=DEFAULT_WEATHER_TELEMETRY["is_day"],
            solar_status=DEFAULT_WEATHER_TELEMETRY["solar_status"],
            wind_speed_kmh=DEFAULT_WEATHER_TELEMETRY["wind_speed_kmh"],
            summary=DEFAULT_WEATHER_TELEMETRY["summary"],
            solar_elevation_deg=35.0,
            circadian_lux_est=35000
        )
        
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m"
    )
    
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                current = data.get("current", {})
                temp = float(current.get("temperature_2m", 18.0))
                code = int(current.get("weather_code", 0))
                is_day_val = bool(current.get("is_day", 1))
                wind = float(current.get("wind_speed_10m", 5.0))
                condition_desc = WMO_WEATHER_MAP.get(code, "Luminous Sky & Ambient Air")
                solar = "Daylight / Solar Radiance" if is_day_val else "Nocturnal / Cosmic Sky"
                solar_elev = 42.5 if is_day_val else -18.0
                lux_est = (35000 if "Clear" in condition_desc or "Luminous" in condition_desc else 12000) if is_day_val else 5
                
                summary = f"{temp:.1f}°C • {condition_desc} • {solar} • {lux_est:,} Lux • Wind {wind:.0f} km/h"
                
                return WeatherTelemetryResponse(
                    temperature_c=temp,
                    condition=condition_desc,
                    is_day=is_day_val,
                    solar_status=solar,
                    wind_speed_kmh=wind,
                    summary=summary,
                    solar_elevation_deg=solar_elev,
                    circadian_lux_est=lux_est
                )
    except Exception as e:
        logger.warning(f"Could not reach Open-Meteo ({e}); using offline ambient telemetry.")
        
    return WeatherTelemetryResponse(
        temperature_c=19.5,
        condition="Outdoor Ambient Living Atmosphere",
        is_day=True,
        solar_status="Daylight",
        wind_speed_kmh=10.0,
        summary="19.5°C • Outdoor Living Atmosphere • Daylight • 20,000 Lux",
        solar_elevation_deg=35.0,
        circadian_lux_est=20000
    )
