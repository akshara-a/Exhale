import io
import os
os.environ["FORCE_FALLBACK"] = "1"
from PIL import Image
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models import GroundingMission, ProofOfTouchResponse, WeatherTelemetryResponse

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["privacy"] == "zero-retention"
    assert "Hyper-Local Weather Anchoring" in data["features"]
    assert response.headers["X-Data-Retention"] == "zero"
    assert response.headers["X-Circuit-Breaker"] == "engaged"

def test_weather_context_endpoint():
    response = client.get("/weather-context?lat=45.5152&lon=-122.6784")
    assert response.status_code == 200
    data = response.json()
    telemetry = WeatherTelemetryResponse.model_validate(data)
    assert telemetry.temperature_c is not None
    assert telemetry.condition
    assert telemetry.solar_status

def test_generate_mission_with_cultural_and_weather():
    payload = {
        "brain_dump": "I have been staring at this bug for 6 hours, I am exhausted and my chest is tight.",
        "weather_summary": "14°C • Light Drizzle • Daylight",
        "cultural_framework": "Japanese Shinrin-yoku (森林浴 - Forest Bathing & Komorebi)"
    }
    response = client.post("/generate-mission", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    mission = GroundingMission.model_validate(data)
    assert len(mission.steps) == 5
    assert [s.step_number for s in mission.steps] == [1, 2, 3, 4, 5]
    assert "Shinrin-yoku" in mission.cultural_framework
    assert mission.weather_context
    assert len(mission.reasoning_trace) >= 4

def test_generate_mission_tamil_ainthinai():
    payload = {
        "brain_dump": "Exhausted from endless debugging in front of this hot laptop screen.",
        "cultural_framework": "Tamil Ainthinai & Siddha (ஐந்திணை - Sangam Eco-Landscape Alchemy)"
    }
    response = client.post("/generate-mission", json=payload)
    assert response.status_code == 200
    data = response.json()
    mission = GroundingMission.model_validate(data)
    assert len(mission.steps) == 5
    assert "Ainthinai" in mission.cultural_framework or "Siddha" in mission.cultural_framework
    assert any("earth" in s.physical_action.lower() or "mann" in s.physical_action.lower() for s in mission.steps)

def test_generate_mission_indian_pancha_mahabhuta():
    payload = {
        "brain_dump": "My mind is scattered across 10 open tabs and I can't concentrate.",
        "cultural_framework": "Indian Pancha Mahabhuta (पञ्चमहाभूत - Five Elemental Earth Calibration)"
    }
    response = client.post("/generate-mission", json=payload)
    assert response.status_code == 200
    data = response.json()
    mission = GroundingMission.model_validate(data)
    assert len(mission.steps) == 5
    assert "Pancha Mahabhuta" in mission.cultural_framework

def test_generate_mission_african_ubuntu_and_scientific():
    # African Ubuntu
    res_ubuntu = client.post("/generate-mission", json={
        "brain_dump": "Feeling isolated in my home office staring at Jira tickets.",
        "cultural_framework": "African Ubuntu & Khoisan Terra-Tracking (Ubuntu / Ilẹ̀ Earth Grounding)"
    })
    assert res_ubuntu.status_code == 200
    data_ubuntu = res_ubuntu.json()
    assert len(data_ubuntu["steps"]) == 5
    assert "Ubuntu" in data_ubuntu["cultural_framework"]

    # Scientific Polyvagal
    res_polyvagal = client.post("/generate-mission", json={
        "brain_dump": "Severe chest pressure and deadline panic.",
        "cultural_framework": "Scientific Polyvagal & Attention Restoration (Kaplan ART & Biophilia)"
    })
    assert res_polyvagal.status_code == 200
    data_polyvagal = res_polyvagal.json()
    assert len(data_polyvagal["steps"]) == 5
    assert "Scientific" in data_polyvagal["cultural_framework"] or "Polyvagal" in data_polyvagal["cultural_framework"]

def test_generate_mission_broad_emotional_scope():
    # Test Acute Panic
    res_panic = client.post("/generate-mission", json={
        "brain_dump": "My heart is racing so fast, I am having a severe panic attack and shaking."
    })
    assert res_panic.status_code == 200
    data_panic = res_panic.json()
    assert len(data_panic["steps"]) == 5
    assert "Panic" in data_panic["detected_emotion"]

    # Test Grief & Heartbreak
    res_grief = client.post("/generate-mission", json={
        "brain_dump": "I cannot stop crying, the grief and heartbreak feel so heavy in my chest."
    })
    assert res_grief.status_code == 200
    data_grief = res_grief.json()
    assert len(data_grief["steps"]) == 5
    assert "Grief" in data_grief["detected_emotion"]

    # Test ADHD Executive Freeze
    res_freeze = client.post("/generate-mission", json={
        "brain_dump": "Complete executive freeze and paralysis, stuck in a loop unable to start anything."
    })
    assert res_freeze.status_code == 200
    data_freeze = res_freeze.json()
    assert len(data_freeze["steps"]) == 5
    assert "Freeze" in data_freeze["detected_emotion"] or "Paralysis" in data_freeze["detected_emotion"]

    # Test Imposter Syndrome
    res_imposter = client.post("/generate-mission", json={
        "brain_dump": "I feel like a total failure and imposter, completely inadequate compared to everyone else."
    })
    assert res_imposter.status_code == 200
    data_imposter = res_imposter.json()
    assert len(data_imposter["steps"]) == 5
    assert "Imposter" in data_imposter["detected_emotion"]

def test_verify_proof_of_touch_synthetic_leaf():
    # Create an in-memory green image (mimicking a fresh leaf)
    img = Image.new("RGB", (120, 120), color=(34, 139, 34))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    
    response = client.post(
        "/verify-touch",
        files={"file": ("leaf.jpg", buf, "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    res = ProofOfTouchResponse.model_validate(data)
    assert res.verified is True
    assert "Living Foliage" in res.detected_element or "Flora" in res.detected_element
    assert res.confidence > 0.7

def test_verify_proof_of_touch_synthetic_bark():
    # Create an in-memory warm brown image (mimicking tree bark/soil)
    img = Image.new("RGB", (120, 120), color=(101, 67, 33))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    
    response = client.post(
        "/verify-touch",
        files={"file": ("bark.jpg", buf, "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    res = ProofOfTouchResponse.model_validate(data)
    assert res.verified is True
    assert "Bark" in res.detected_element or "Soil" in res.detected_element

def test_verify_proof_of_touch_sample_endpoints():
    # Test leaf sample
    res_leaf = client.get("/verify-touch/sample?sample_type=leaf")
    assert res_leaf.status_code == 200
    assert res_leaf.json()["verified"] is True

    # Test bark sample
    res_bark = client.get("/verify-touch/sample?sample_type=bark")
    assert res_bark.status_code == 200
    assert res_bark.json()["verified"] is True

    # Test screen sample rejection
    res_screen = client.get("/verify-touch/sample?sample_type=screen")
    assert res_screen.status_code == 200
    assert res_screen.json()["verified"] is False
    assert "Digital Display" in res_screen.json()["detected_element"] or "Synthetic" in res_screen.json()["detected_element"]

def test_generate_mission_empty_payload_fails():
    response = client.post("/generate-mission", json={"brain_dump": ""})
    assert response.status_code == 422

def test_auto_healing_five_steps():
    from app.generator import _normalize_and_enforce_five_steps
    # Test 4 steps auto-healing
    payload_4 = {
        "steps": [
            {"step_number": 1, "physical_action": "Touch living tree bark", "sensory_focus": "Touch"},
            {"step_number": 2, "physical_action": "Scan the cloud horizon", "sensory_focus": "Sight"},
            {"step_number": 3, "physical_action": "Inhale geosmin from damp soil", "sensory_focus": "Smell"},
            {"step_number": 4, "physical_action": "Feel ambient breeze on wrists", "sensory_focus": "Touch / Temperature"}
        ]
    }
    healed_4 = _normalize_and_enforce_five_steps(payload_4, "Shinrin-yoku", "Daylight")
    assert len(healed_4["steps"]) == 5
    assert [s["step_number"] for s in healed_4["steps"]] == [1, 2, 3, 4, 5]
    assert any("sound" in s["sensory_focus"].lower() for s in healed_4["steps"])

    # Test 6 steps truncation
    payload_6 = {
        "steps": [{"step_number": i, "physical_action": f"Action {i}", "sensory_focus": "Focus"} for i in range(1, 7)]
    }
    healed_6 = _normalize_and_enforce_five_steps(payload_6, "Shinrin-yoku", "Daylight")
    assert len(healed_6["steps"]) == 5
    assert [s["step_number"] for s in healed_6["steps"]] == [1, 2, 3, 4, 5]


def test_security_headers_present():
    response = client.get("/health")
    assert response.headers.get("X-Frame-Options") == "DENY"
    assert response.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("Cache-Control") == "no-store, no-cache, must-revalidate, private"


def test_cors_security_no_credential_wildcard_reflection():
    response = client.options(
        "/health",
        headers={
            "Origin": "https://untrusted-site.com",
            "Access-Control-Request-Method": "GET"
        }
    )
    # When allow_credentials is False with wildcard origin, Access-Control-Allow-Credentials must NOT be true
    assert response.headers.get("access-control-allow-credentials") != "true"


def test_verify_touch_fail_closed_on_corrupt_payload():
    corrupt_buf = io.BytesIO(b"this is corrupt data not an image")
    response = client.post(
        "/verify-touch",
        files={"file": ("fake.jpg", corrupt_buf, "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    # Must fail closed: verified is False
    assert data["verified"] is False
    assert "Unrecognized" in data["detected_element"] or "Malformed" in data["detected_element"]


def test_verify_touch_rejects_empty_file():
    empty_buf = io.BytesIO(b"")
    response = client.post(
        "/verify-touch",
        files={"file": ("empty.jpg", empty_buf, "image/jpeg")}
    )
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_weather_context_validation_bounds():
    # Out of range coordinates should be rejected with 422 Unprocessable Entity
    res_oor = client.get("/weather-context?lat=999.0&lon=999.0")
    assert res_oor.status_code == 422

    # NaN / Inf coordinates should be rejected with 422
    res_nan = client.get("/weather-context?lat=nan&lon=nan")
    assert res_nan.status_code == 422

