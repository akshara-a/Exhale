export type SensoryFocus = 
  | 'Touch'
  | 'Sight'
  | 'Sound'
  | 'Smell'
  | 'Touch / Temperature'
  | 'Touch / Smell'
  | string;

export interface GroundingStep {
  step_number: number;
  physical_action: string;
  sensory_focus: SensoryFocus;
}

export interface GroundingMission {
  detected_emotion: string;
  mission_title: string;
  steps: GroundingStep[];
  post_mission_encouragement: string;
  cultural_framework?: string;
  weather_context?: string;
  reasoning_trace?: string[];
  ephemeral_purge_hash?: string;
}

export interface WeatherTelemetry {
  temperature_c: number;
  condition: string;
  is_day: boolean;
  solar_status: string;
  wind_speed_kmh: number;
  summary: string;
  solar_elevation_deg?: number;
  circadian_lux_est?: number;
}

export interface ProofOfTouchResponse {
  verified: boolean;
  detected_element: string;
  confidence: number;
  message: string;
  timestamp: string;
}

export type AppState = 'INPUT' | 'MISSION' | 'LOCK' | 'VALIDATION';
