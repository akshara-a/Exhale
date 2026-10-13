from typing import List, Optional
from pydantic import BaseModel, Field

class BrainDumpRequest(BaseModel):
    brain_dump: str = Field(
        ...,
        min_length=2,
        max_length=1000,
        description="A raw statement or sentence expressing current emotional state.",
        examples=["I have been staring at this bug for 6 hours, I am exhausted and my chest is tight."]
    )
    latitude: Optional[float] = Field(
        default=None,
        description="Optional GPS latitude for hyper-local weather anchoring."
    )
    longitude: Optional[float] = Field(
        default=None,
        description="Optional GPS longitude for hyper-local weather anchoring."
    )
    weather_summary: Optional[str] = Field(
        default=None,
        description="Hyper-local weather telemetry (e.g., '14°C, Rain, Dusk')."
    )
    cultural_framework: Optional[str] = Field(
        default="Auto-Detect",
        description="Target nature grounding philosophy (Shinrin-yoku, Friluftsliv, Earthing, Waldeinsamkeit)."
    )

class GroundingStep(BaseModel):
    step_number: int = Field(..., ge=1, le=5, description="Sequential step index (1-5).")
    physical_action: str = Field(
        ...,
        description="A highly specific, physical outdoor action (e.g., 'Find a rough piece of tree bark and trace it with your thumb')."
    )
    sensory_focus: str = Field(
        ...,
        description="The sense being targeted (Sight, Touch, Sound, Smell, Temperature/Wind)."
    )

class GroundingMission(BaseModel):
    detected_emotion: str = Field(
        ...,
        description="The core emotion identified (e.g., 'Burnout / Anxiety')."
    )
    mission_title: str = Field(
        ...,
        description="A punchy, tactile title for this outdoor grounding mission."
    )
    steps: List[GroundingStep] = Field(
        ...,
        min_length=5,
        max_length=5,
        description="List of strictly 5 physical, outdoor grounding actions."
    )
    post_mission_encouragement: str = Field(
        ...,
        description="A short, validating message hidden until the user returns."
    )
    cultural_framework: str = Field(
        default="Shinrin-yoku (Forest Bathing)",
        description="Cultural methodology applied to this intervention."
    )
    weather_context: Optional[str] = Field(
        default=None,
        description="Hyper-local telemetry anchor that shaped the mission."
    )
    reasoning_trace: List[str] = Field(
        default_factory=list,
        description="DevRelay verifiable agent reasoning trace steps."
    )
    ephemeral_purge_hash: Optional[str] = Field(
        default=None,
        description="Cryptographic SHA-256 volatile RAM purge attestation digest."
    )

class WeatherTelemetryResponse(BaseModel):
    temperature_c: float
    condition: str
    is_day: bool
    solar_status: str
    wind_speed_kmh: float
    summary: str
    solar_elevation_deg: float = Field(default=35.0, description="Estimated solar angle above horizon.")
    circadian_lux_est: int = Field(default=15000, description="Estimated photon lux disengaging melatonin.")

class ProofOfTouchResponse(BaseModel):
    verified: bool
    detected_element: str
    confidence: float
    message: str
    timestamp: str
