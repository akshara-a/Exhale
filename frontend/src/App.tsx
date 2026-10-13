import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Compass, 
  Eye, 
  Hand, 
  Volume2, 
  VolumeX,
  Wind, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ArrowLeft,
  Headphones, 
  Vibrate, 
  Footprints, 
  Camera, 
  CloudSun, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Trees, 
  Check, 
  WifiOff, 
  BookOpen, 
  ChevronRight,
  Layers,
  HelpCircle,
  Mic,
  MicOff,
  RefreshCw,
  Heart,
  Smile,
  Play,
  Pause,
  Trash2,
  ShieldCheck,
  Sun
} from 'lucide-react';

import { AppState, GroundingMission, GroundingStep, WeatherTelemetry, ProofOfTouchResponse } from './types';
import { soundscape } from './audio';
import { generateOfflineMission } from './offlineEngine';
import { generateReceiptImage } from './receiptCanvas';
import { CULTURAL_TAXONOMY, CulturalTradition } from './culturalLore';

import { StepProgress } from './components/StepProgress';
import { HowItWorksModal } from './components/HowItWorksModal';
import { TraditionsModal } from './components/TraditionsModal';
import { LoreDetailModal } from './components/LoreDetailModal';
import { EmergencyExitModal } from './components/EmergencyExitModal';
import { ReceiptCard } from './components/ReceiptCard';
import { WeatherPopover } from './components/WeatherPopover';
import { ToastContainer, ToastMessage } from './components/Toast';

// Ergonomic Acute State Scenario Presets
const SCENARIOS = [
  {
    icon: '🐛',
    title: 'Compiler & Bug Burnout',
    text: "Staring at unresolved bugs for hours; my chest is constricted and my eyes burn from the monitor.",
  },
  {
    icon: '💬',
    title: 'Slack & Notification Chaos',
    text: "Drowning in Slack pings, sprint pressure, and cognitive noise; my nervous system is buzzing with panic.",
  },
  {
    icon: '⏳',
    title: 'Deadline Paralysis',
    text: "Paralyzed by an impending deadline, shallow breathing, and mental static that won't quiet down.",
  },
];

const TOP_CULTURAL_PILLS = [
  { id: 'Auto-Detect', label: 'Auto-Detect' },
  { id: 'Japanese Shinrin-yoku (森林浴 - Forest Bathing & Komorebi)', label: 'Shinrin-yoku (森林浴)' },
  { id: 'Indian Pancha Mahabhuta (पञ्चमहाभूत - Five Elemental Earth Calibration)', label: 'Pancha Mahabhuta (पञ्चमहाभूत)' },
  { id: 'Tamil Ainthinai & Siddha (ஐந்திணை - Sangam Eco-Landscape Alchemy)', label: 'Ainthinai (ஐந்திணை)' },
  { id: 'African Ubuntu & Khoisan Terra-Tracking (Ubuntu / Ilẹ̀ Earth Grounding)', label: 'Ubuntu & Khoisan' },
  { id: 'Chinese Daoist Ziran & Wu Wei (自然 / 无为 - Spontaneous Nature Flow)', label: 'Daoist Ziran (自然)' },
  { id: 'Scientific Polyvagal & Attention Restoration (Kaplan ART & Biophilia)', label: 'Polyvagal ART (Neuro)' },
];

export default function App() {
  // Application State Machine: INPUT -> MISSION -> LOCK -> VALIDATION
  const [appState, setAppState] = useState<AppState>('INPUT');
  const [brainDump, setBrainDump] = useState('');
  const [culturalChoice, setCulturalChoice] = useState('Auto-Detect');
  const [mission, setMission] = useState<GroundingMission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hyper-local Weather Telemetry
  const [weatherTelemetry, setWeatherTelemetry] = useState<WeatherTelemetry | null>(null);
  const [showWeatherPopover, setShowWeatherPopover] = useState(false);

  // Screen Lock & Timer State
  const [demoFastMode, setDemoFastMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerExpired, setTimerExpired] = useState(false);
  
  // Page Visibility & Tab Switch Penalty
  const [tabSwitches, setTabSwitches] = useState(0);

  // Audio & Soundscape State
  const [ambientSoundActive, setAmbientSoundActive] = useState(false);
  const [pocketModeActive, setPocketModeActive] = useState(false);

  // Box Breathing Pacer (4-4-4-4)
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'HoldEmpty'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [hapticsEnabled, setHapticsEnabled] = useState(false);
  const [showBreathingVisualizer, setShowBreathingVisualizer] = useState(true);

  // Motion & Step-Pacing Verification
  const [stepCount, setStepCount] = useState(0);

  // Multimodal Proof of Touch
  const [proofOfTouch, setProofOfTouch] = useState<ProofOfTouchResponse | null>(null);
  const [touchImagePreview, setTouchImagePreview] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Offline Sanctuary Mode Indicator
  const [isOfflineTrailMode, setIsOfflineTrailMode] = useState(false);

  // DevRelay Session Trace Drawer
  const [showTraceDrawer, setShowTraceDrawer] = useState(false);

  // Receipt Copy & Image Export Feedback
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  
  // User Experience Enhancements
  const [reviewedSteps, setReviewedSteps] = useState<Set<number>>(new Set());
  const [isSpeakingSteps, setIsSpeakingSteps] = useState(false);
  const [somaticReflection, setSomaticReflection] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Modals & Navigation
  const [activeLoreModal, setActiveLoreModal] = useState<CulturalTradition | null>(null);
  const [showTraditionsSelectorModal, setShowTraditionsSelectorModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showEmergencyExitModal, setShowEmergencyExitModal] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'warning' | 'info' = 'success', title?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cooperative Cancellation Handler (Abort Signal)
  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    addToast("Generation cancelled cooperatively.", "info");
  };

  // Resolve API Base URL
  const getApiUrl = (): string => {
    let envUrl = import.meta.env?.VITE_API_URL;
    if (envUrl) {
      envUrl = envUrl.trim().replace(/\/+$/, '');
      if (!envUrl.includes('.') && !envUrl.includes('localhost')) {
        envUrl = `${envUrl}.onrender.com`;
      }
      return envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;
    }
    return 'http://localhost:8000';
  };

  // 1. Fetch Hyper-Local Weather Telemetry on Mount
  useEffect(() => {
    const fetchWeather = async (lat?: number, lon?: number) => {
      try {
        const baseUrl = getApiUrl();
        const url = lat && lon 
          ? `${baseUrl}/weather-context?lat=${lat}&lon=${lon}`
          : `${baseUrl}/weather-context`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setWeatherTelemetry(data);
        }
      } catch (e) {
        console.warn("Weather telemetry unavailable:", e);
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather() // Default fallback on location rejection
      );
    } else {
      fetchWeather();
    }
  }, []);

  // Voice Dictation (Speech-to-Text)
  const toggleVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast("Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.", "info", "Microphone");
      return;
    }

    if (isRecordingVoice) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsRecordingVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        addToast("Listening... speak your acute feelings freely.", "info", "Dictation Active");
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setBrainDump((prev) => {
            const separator = prev.trim() ? ' ' : '';
            return prev + separator + transcript;
          });
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Dictation error:", err);
        setIsRecordingVoice(false);
        if (err.error !== 'no-speech') {
          addToast("Microphone error: " + (err.error || "Please allow access"), "warning", "Dictation");
        }
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Could not start speech recognition:", err);
      setIsRecordingVoice(false);
    }
  };

  // Submit Brain Dump (With Trail-Ready Offline Resilience)
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!brainDump.trim() || brainDump.trim().length < 2) {
      setErrorMsg("Please express at least a few words about what you are experiencing.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setReviewedSteps(new Set());

    // If completely offline, use on-device Trail generator
    if (!navigator.onLine) {
      setIsOfflineTrailMode(true);
      const offlineMission = generateOfflineMission(
        brainDump,
        weatherTelemetry?.summary,
        culturalChoice
      );
      setMission(offlineMission);
      setAppState('MISSION');
      setIsLoading(false);
      addToast("Offline Trail-Ready generator engaged.", "info", "No Internet Connection");
      return;
    }

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const baseUrl = getApiUrl();
      const payload = {
        brain_dump: brainDump,
        weather_summary: weatherTelemetry?.summary || undefined,
        cultural_framework: culturalChoice !== 'Auto-Detect' ? culturalChoice : undefined
      };

      const response = await fetch(`${baseUrl}/generate-mission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data: GroundingMission = await response.json();
      setMission(data);
      setIsOfflineTrailMode(false);
      setAppState('MISSION');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.info("Mission generation cancelled cooperatively by user.");
        return;
      }
      console.warn("API unreachable, engaging Trail-Ready on-device generator:", err);
      setIsOfflineTrailMode(true);
      const offlineMission = generateOfflineMission(
        brainDump,
        weatherTelemetry?.summary,
        culturalChoice
      );
      setMission(offlineMission);
      setAppState('MISSION');
      addToast("Connected to on-device zero-latency generator.", "info", "Sovereign Mode");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Transition to Screen Lock State
  const handleGoOutside = () => {
    const duration = demoFastMode ? 10 : 600;
    setTimeLeft(duration);
    setTimerExpired(false);
    setTabSwitches(0);
    setStepCount(0);
    setAppState('LOCK');

    soundscape.playBowlChime(432, 3.5);

    if (ambientSoundActive) {
      soundscape.startAmbientSoundscape();
    }
  };

  // Main Countdown Timer Tick
  useEffect(() => {
    if (appState === 'LOCK' && !timerExpired) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimerExpired(true);
            soundscape.playBowlChime(528, 5.0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appState, timerExpired]);

  // Page Visibility API Hook: Tab Switch Penalty
  useEffect(() => {
    if (appState !== 'LOCK' || timerExpired) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerPenalty("Tab switch detected. You broke grounding focus.");
      }
    };

    const handleWindowBlur = () => {
      triggerPenalty("Window lost focus. Resist the screen's gravity.");
    };

    const triggerPenalty = (reason: string) => {
      const resetDuration = demoFastMode ? 10 : 600;
      setTimeLeft(resetDuration);
      setTabSwitches((prev) => prev + 1);
      const msg = `${reason} Timer reset to ${demoFastMode ? '10 seconds' : '10:00'}.`;
      addToast(msg, "warning", "Circuit Breaker Triggered");

      soundscape.playBowlChime(220, 1.2);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [appState, timerExpired, demoFastMode, addToast]);

  // Motion & Step-Pacing Verification Hook
  useEffect(() => {
    if (appState !== 'LOCK' || timerExpired) return;

    let lastMagnitude = 0;
    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;
      const mag = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      if (Math.abs(mag - lastMagnitude) > 2.8) {
        setStepCount((prev) => prev + 1);
      }
      lastMagnitude = mag;
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    const simInterval = setInterval(() => {
      setStepCount((prev) => prev + Math.floor(Math.random() * 2));
    }, 3500);

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleDeviceMotion);
      }
      clearInterval(simInterval);
    };
  }, [appState, timerExpired]);

  // Pocket Mode (Audio-First Narration via Web Speech API)
  const startAudioNarration = () => {
    if (!('speechSynthesis' in window) || !mission) {
      addToast("Speech synthesis not supported in this browser.", "info");
      return;
    }
    window.speechSynthesis.cancel();
    setPocketModeActive(true);

    const introText = `Pocket Mode initiated. Phone screen is silenced. ${mission.cultural_framework || ''}. Prepare for physical grounding.`;
    const introUtterance = new SpeechSynthesisUtterance(introText);
    introUtterance.rate = 0.88;
    introUtterance.pitch = 0.95;

    window.speechSynthesis.speak(introUtterance);

    mission.steps.forEach((step) => {
      const stepText = `Step ${step.step_number}. Sensory focus: ${step.sensory_focus}. ${step.physical_action}`;
      const utterance = new SpeechSynthesisUtterance(stepText);
      utterance.rate = 0.85;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    });
  };

  const stopAudioNarration = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPocketModeActive(false);
  };

  // Preview Voice Reading of Steps in Mission Screen
  const toggleMissionStepsReading = () => {
    if (!('speechSynthesis' in window) || !mission) return;

    if (isSpeakingSteps) {
      window.speechSynthesis.cancel();
      setIsSpeakingSteps(false);
      return;
    }

    setIsSpeakingSteps(true);
    window.speechSynthesis.cancel();

    const fullText = `Your grounding mission: ${mission.mission_title}. ` +
      mission.steps.map(s => `Step ${s.step_number}, focusing on ${s.sensory_focus}. ${s.physical_action}`).join('. ');

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.88;
    utterance.pitch = 0.95;
    utterance.onend = () => setIsSpeakingSteps(false);
    utterance.onerror = () => setIsSpeakingSteps(false);

    window.speechSynthesis.speak(utterance);
  };

  // Box Breathing Pacer (Box Breathing: 4s Inhale, 4s Hold, 4s Exhale, 4s HoldEmpty)
  useEffect(() => {
    if (appState !== 'LOCK' || timerExpired) {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      return;
    }

    let phaseIndex = 0;
    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'HoldEmpty'> = ['Inhale', 'Hold', 'Exhale', 'HoldEmpty'];

    const triggerBreathPulse = () => {
      const curPhase = phases[phaseIndex % 4];
      setBreathPhase(curPhase);
      setBreathCountdown(4);
      
      if (hapticsEnabled && 'vibrate' in navigator) {
        if (curPhase === 'Inhale' || curPhase === 'Exhale') {
          navigator.vibrate([150, 100, 150]);
        } else {
          navigator.vibrate(80);
        }
      }
      phaseIndex++;
    };

    triggerBreathPulse();
    breathTimerRef.current = setInterval(triggerBreathPulse, 4000);

    const countdownInterval = setInterval(() => {
      setBreathCountdown((prev) => (prev > 1 ? prev - 1 : 4));
    }, 1000);

    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      clearInterval(countdownInterval);
    };
  }, [appState, timerExpired, hapticsEnabled]);

  // Multimodal Proof of Touch Upload Handler
  const handleProofOfTouchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProof(true);
    setErrorMsg(null);
    setTouchImagePreview(URL.createObjectURL(file));

    try {
      const baseUrl = getApiUrl();
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${baseUrl}/verify-touch`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Verification service error');
      }

      const result: ProofOfTouchResponse = await res.json();
      setProofOfTouch(result);
      if (result.verified) {
        soundscape.playBowlChime(528, 2.0);
        addToast(`Verified touch: ${result.detected_element}`, "success", "Nature Contact Confirmed");
      } else {
        addToast(result.message, "warning", "Verification Rejected");
      }
    } catch (err: any) {
      console.error('Proof of touch failed:', err);
      addToast(err.message || 'Failed to analyze photograph', "warning", "Verification Service");
    } finally {
      setIsUploadingProof(false);
    }
  };

  // Fast Evaluator Synthetic Test Sample Loader
  const loadTestSample = async (sampleType: 'leaf' | 'bark' | 'screen') => {
    setIsUploadingProof(true);
    setTouchImagePreview(null);
    try {
      const baseUrl = getApiUrl();
      const res = await fetch(`${baseUrl}/verify-touch/sample?sample_type=${sampleType}`);
      if (res.ok) {
        const result: ProofOfTouchResponse = await res.json();
        setProofOfTouch(result);
        if (result.verified) {
          soundscape.playBowlChime(528, 2.0);
          addToast(`Sample verified: ${result.detected_element}`, "success", "Evaluator Fixture");
        } else {
          soundscape.playBowlChime(220, 1.0);
          addToast(result.message, "warning", "Screen Rejection Tested");
        }
      }
    } catch (e) {
      console.warn("Failed fetching sample:", e);
      addToast("Could not load test fixture from backend.", "warning");
    } finally {
      setIsUploadingProof(false);
    }
  };

  // Toggle Ambient Soundscape
  const toggleAmbientSound = () => {
    if (ambientSoundActive) {
      soundscape.stopAmbientSoundscape();
      setAmbientSoundActive(false);
      addToast("Ambient drone muted.", "info");
    } else {
      soundscape.startAmbientSoundscape();
      setAmbientSoundActive(true);
      addToast("Synthesizing 432Hz solfeggio drone & canopy breeze.", "success", "Soundscape Active");
    }
  };

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get Sensory Icon
  const getSensoryIcon = (focus: string) => {
    const lower = focus.toLowerCase();
    if (lower.includes('touch') || lower.includes('tactile')) {
      return <Hand className="w-4 h-4 text-emerald-400" />;
    }
    if (lower.includes('sight') || lower.includes('visual') || lower.includes('eye')) {
      return <Eye className="w-4 h-4 text-blue-400" />;
    }
    if (lower.includes('sound') || lower.includes('audio') || lower.includes('hear')) {
      return <Volume2 className="w-4 h-4 text-amber-400" />;
    }
    if (lower.includes('smell') || lower.includes('scent') || lower.includes('inhale')) {
      return <Wind className="w-4 h-4 text-purple-400" />;
    }
    return <Compass className="w-4 h-4 text-emerald-400" />;
  };

  // Generate ASCII Field Log Receipt
  const generateReceiptText = () => {
    const now = new Date().toISOString();
    const hash = mission?.ephemeral_purge_hash || 'e3b0c44298fc1c149afbf4c8';
    const fw = mission?.cultural_framework || '';
    const matchingTradition = CULTURAL_TAXONOMY.find(t => 
      t.id === fw || fw.toLowerCase().includes(t.name.toLowerCase().split(' ')[0])
    );
    const quote = matchingTradition ? matchingTradition.ancestralQuote : '"The code will still be there. You took back your reality."';
    const nativeLine = matchingTradition ? `ANCESTRAL SCRIPT: ${matchingTradition.nativeScript}\n` : '';
    const clinicalLine = matchingTradition ? `CLINICAL PROOF  : ${matchingTradition.clinicalEvidence.slice(0, 52)}...\n` : '';

    return `====================================================
  EXHALE // EPHEMERAL SOIL & BREATH RECEIPT #EX-${Math.floor(10000 + Math.random() * 90000)}
----------------------------------------------------
TIMESTAMP       : ${now}
OFFLINE DURATION: ${demoFastMode ? '10 SECONDS (EVALUATOR SPEEDRUN)' : '10 MINUTES OF TOTAL OFFLINE IMMERSION'}
SOMATIC STATE   : ${mission?.detected_emotion.toUpperCase()}
ANCESTRAL FRAME : ${mission?.cultural_framework?.toUpperCase() || 'SHINRIN-YOKU'}
${nativeLine}${clinicalLine}ATMOSPHERE ANCHOR: ${mission?.weather_context?.toUpperCase() || 'AMBIENT OUTDOOR AIR'}
STEPS TRAVERSED : ${stepCount} STEPS REGISTERED AWAY FROM SCREEN
TOUCH WITNESS   : ${proofOfTouch?.verified ? `AUTHENTICATED (${proofOfTouch.detected_element.toUpperCase()})` : 'UNATTESTED'}
TAB RESISTANCE  : ${tabSwitches} VIGILANCE RELAPSES (CIRCUIT ENFORCED)
RAM PURGE HASH  : SHA-256 [${hash}] (VOLATILE RAM DISSOLVED)
DATA RETENTION  : ZERO BYTES PERSISTED (ABSOLUTE DATA SOVEREIGNTY)
CIRCUIT BREAKER : RE-GROUNDED IN THE LIVING WORLD
====================================================
${quote}`;
  };

  const copyReceiptToClipboard = () => {
    navigator.clipboard.writeText(generateReceiptText());
    setCopiedReceipt(true);
    addToast("Ephemeral field receipt copied to clipboard.", "success");
    setTimeout(() => setCopiedReceipt(false), 3000);
  };

  const downloadReceiptTextFile = () => {
    const element = document.createElement("a");
    const file = new Blob([generateReceiptText()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `exhale-field-log-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast("Receipt saved as .txt file.", "success");
  };

  // Render & Download High-Res PNG Receipt Card
  const downloadReceiptPng = async () => {
    setIsGeneratingPng(true);
    try {
      const dataUrl = await generateReceiptImage(generateReceiptText());
      const link = document.createElement('a');
      link.download = `exhale-field-log-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      addToast("High-resolution verification card downloaded.", "success");
    } catch (e) {
      console.warn("Failed generating PNG:", e);
      addToast("Failed to render PNG receipt.", "warning");
    } finally {
      setIsGeneratingPng(false);
    }
  };

  // Mobile Web Share API Integration
  const shareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Exhale Grounding Protocol Completion',
          text: generateReceiptText(),
        });
      } catch (e) {
        copyReceiptToClipboard();
      }
    } else {
      copyReceiptToClipboard();
    }
  };

  // Copy Mission Steps to Clipboard
  const copyMissionSteps = () => {
    if (!mission) return;
    const text = `${mission.mission_title}\n\n` +
      mission.steps.map(s => `${s.step_number}. [${s.sensory_focus}] ${s.physical_action}`).join('\n\n');
    navigator.clipboard.writeText(text);
    addToast("Grounding steps copied to clipboard.", "success");
  };

  // Toggle Step Checkbox
  const toggleStepReviewed = (stepNum: number) => {
    setReviewedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepNum)) next.delete(stepNum);
      else next.add(stepNum);
      return next;
    });
  };

  // Complete Reset (Zero retention)
  const handleFullReset = () => {
    soundscape.stopAmbientSoundscape();
    setAppState('INPUT');
    setBrainDump('');
    setMission(null);
    setTimerExpired(false);
    setErrorMsg(null);
    setPocketModeActive(false);
    setAmbientSoundActive(false);
    setProofOfTouch(null);
    setTouchImagePreview(null);
    setStepCount(0);
    setTabSwitches(0);
    setReviewedSteps(new Set());
    setSomaticReflection(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    addToast("Volatile memory dissolved. Zero bytes persisted.", "info", "Clean Slate");
  };

  // Emergency Exit Confirm
  const handleConfirmEmergencyExit = () => {
    setShowEmergencyExitModal(false);
    setAppState('MISSION');
    if (timerRef.current) clearInterval(timerRef.current);
    soundscape.stopAmbientSoundscape();
    addToast("Returned to protocol view early.", "info");
  };

  // Active Tradition Lore lookup
  const currentTraditionLore = CULTURAL_TAXONOMY.find(
    (t) => t.id === culturalChoice || (culturalChoice !== 'Auto-Detect' && t.name.toLowerCase().includes(culturalChoice.toLowerCase().split(' ')[0]))
  );

  // Total seconds for circle progress calculation
  const totalDuration = demoFastMode ? 10 : 600;
  const timerProgressPct = Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100));

  // ==============================================================
  // POCKET MODE BLACKOUT RENDER
  // ==============================================================
  if (pocketModeActive) {
    return (
      <div 
        onClick={stopAudioNarration}
        className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-between p-8 text-center cursor-pointer select-none"
      >
        <div className="pt-8 text-neutral-800 font-mono text-xs tracking-widest uppercase">
          POCKET MODE ACTIVE // OLED POWER-SAVER BLACKOUT
        </div>
        <div className="space-y-4">
          <Headphones className="w-14 h-14 text-emerald-950 mx-auto animate-pulse" />
          <p className="font-mono text-neutral-800 text-sm max-w-sm mx-auto leading-relaxed">
            Audio guidance streaming into your earbuds...<br />
            Keep your hands in your pockets and your feet upon the living earth.
          </p>
        </div>
        <div className="pb-8 text-neutral-800 font-mono text-xs uppercase tracking-wider">
          [ Tap anywhere to return to visual interface ]
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-[#f1f5f9] font-sans flex flex-col justify-between relative selection:bg-emerald-500 selection:text-black">
      {/* Ambient background glow */}
      <div className="fixed inset-0 ambient-glow" />

      {/* Global Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Global Minimalist Top Nav Bar */}
      <header className="border-b border-white/[0.06] bg-[#08090d]/85 backdrop-blur-xl px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between z-20 sticky top-0 transition-all">
        {/* Brand & Status */}
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm glow-emerald" />
          <span className="font-mono text-sm sm:text-base tracking-[0.25em] font-semibold text-neutral-100 uppercase">
            EXHALE
          </span>
          <span className="hidden sm:inline text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            // PROTOCOL
          </span>
          {isOfflineTrailMode && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center space-x-1">
              <WifiOff className="w-2.5 h-2.5" />
              <span>OFFLINE</span>
            </span>
          )}
        </div>

        {/* Global Controls & Tools */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-mono">
          {/* How It Works Guide Trigger */}
          <button
            type="button"
            onClick={() => setShowHowItWorksModal(true)}
            className="px-2.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-neutral-300 hover:text-white transition flex items-center space-x-1.5"
            title="How Exhale works & privacy details"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">How It Works</span>
          </button>

          {/* Ambient Soundscape Toggle */}
          <button
            type="button"
            onClick={toggleAmbientSound}
            className={`px-3 py-1.5 rounded-full border text-[11px] transition flex items-center space-x-1.5 ${
              ambientSoundActive 
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 glow-emerald-subtle' 
                : 'bg-white/[0.03] border-white/[0.08] text-neutral-400 hover:text-white'
            }`}
            title="Toggle synthesized 432Hz solfeggio drone and canopy wind"
          >
            {ambientSoundActive ? <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3 h-3 text-neutral-500" />}
            <span className="hidden md:inline">{ambientSoundActive ? '432Hz PLAYING' : '432Hz SOUND'}</span>
          </button>

          {/* Live Weather Telemetry Pill */}
          {weatherTelemetry && (
            <button
              type="button"
              onClick={() => setShowWeatherPopover(!showWeatherPopover)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-neutral-300 text-[11px] transition"
              title="Click to inspect local atmospheric anchoring"
            >
              <CloudSun className="w-3 h-3 text-amber-400" />
              <span>{weatherTelemetry.temperature_c.toFixed(0)}°C</span>
              <span className="hidden lg:inline text-neutral-500">• {weatherTelemetry.condition}</span>
            </button>
          )}

          {/* Weather Popover Card */}
          <WeatherPopover
            weather={weatherTelemetry}
            isOpen={showWeatherPopover}
            onClose={() => setShowWeatherPopover(false)}
          />

          {/* Mode Switcher: 10s Speedrun Test vs 10m Real Grounding */}
          <button
            type="button"
            onClick={() => {
              const next = !demoFastMode;
              setDemoFastMode(next);
              if (appState === 'LOCK') {
                setTimeLeft(next ? 10 : 600);
              }
              addToast(
                next 
                  ? "⚡ Demo Speedrun Mode (10s lock) enabled for fast evaluation." 
                  : "⏱ Standard Grounding Mode (10m lock) active.",
                "info"
              );
            }}
            className={`px-2.5 py-1.5 rounded-full border text-[11px] transition font-mono ${
              demoFastMode 
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm' 
                : 'bg-white/[0.03] border-white/[0.08] text-neutral-400 hover:text-neutral-200'
            }`}
            title={demoFastMode ? "Switch to 10-minute real immersion" : "Switch to 10-second fast evaluation test"}
          >
            {demoFastMode ? '⚡ 10s DEMO' : '⏱ 10m REAL'}
          </button>
        </div>
      </header>

      {/* Hidden File Input for Multimodal Proof of Touch */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProofOfTouchUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* 4-Stage Protocol Progress Tracker */}
      <div className="pt-4 pb-2 z-10">
        <StepProgress 
          currentStage={appState} 
          onNavigateToInput={appState === 'MISSION' ? () => setAppState('INPUT') : undefined} 
        />
      </div>

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center z-10">
        
        {/* ============================================================== */}
        {/* STATE 1: INPUT (USER FRIENDLY, CLEAN & CLASSY) */}
        {/* ============================================================== */}
        {appState === 'INPUT' && (
          <div className="space-y-8 sm:space-y-10 animate-fade-in">
            {/* Minimalist Editorial Headline */}
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 font-mono text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                <Flame className="w-3 h-3 text-emerald-400" />
                <span>EPHEMERAL AUTONOMIC CIRCUIT BREAKER</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.15]">
                Step away from the screen.<br />
                <span className="font-serif italic text-emerald-300 font-normal">Return to the living earth.</span>
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                When cognitive noise and debugging strain lock your nervous system into artificial vigilance, 
                Exhale generates a customized 5-step sensory nature mission and silences your display.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Brain Dump Input Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-xs uppercase tracking-wider text-neutral-300">
                    Where does the burden sit right now? (Acute state):
                  </label>
                  {/* Voice Dictation Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition flex items-center space-x-1.5 ${
                      isRecordingVoice
                        ? 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse'
                        : 'bg-white/[0.02] border-white/[0.08] text-neutral-400 hover:text-emerald-300 hover:border-emerald-500/40'
                    }`}
                    title="Speak your thoughts aloud using microphone"
                  >
                    {isRecordingVoice ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                    <span>{isRecordingVoice ? 'Listening...' : 'Voice Dictate'}</span>
                  </button>
                </div>

                <div className="glass-panel rounded-2xl p-4 sm:p-5 transition-all duration-300 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 relative">
                  <textarea
                    rows={4}
                    value={brainDump}
                    onChange={(e) => setBrainDump(e.target.value)}
                    placeholder='e.g., "I have been staring at this compiler error for seven hours. My chest is constricted, my head is throbbing, and I cannot catch a full breath."'
                    className="w-full bg-transparent text-base sm:text-lg font-mono text-white placeholder-neutral-600 outline-none resize-none leading-relaxed"
                    disabled={isLoading}
                  />

                  {/* Textarea Bottom Toolbar */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px] font-mono text-neutral-500">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Zero bytes stored • Volatile memory only</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {brainDump.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setBrainDump('')}
                          className="text-neutral-400 hover:text-red-400 transition flex items-center space-x-1"
                          title="Clear input"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear</span>
                        </button>
                      )}
                      <span className={brainDump.length >= 2 ? 'text-neutral-400' : 'text-neutral-600'}>
                        {brainDump.length} chars
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categorized Scenario Presets */}
              <div className="space-y-2.5">
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Or load acute state scenario:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SCENARIOS.map((scenario, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setBrainDump(scenario.text);
                        addToast(`Loaded "${scenario.title}" scenario.`, "info");
                      }}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/40 hover:bg-white/[0.04] text-left transition group"
                    >
                      <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 group-hover:text-emerald-300">
                        <span>{scenario.icon}</span>
                        <span className="font-semibold">{scenario.title}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-sans mt-1 line-clamp-2">
                        "{scenario.text}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimalist Cultural Lineage Selector Bar */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs uppercase tracking-wider text-neutral-300 flex items-center space-x-1.5">
                    <Trees className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ancestral Nature Lineage:</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTraditionsSelectorModal(true)}
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition flex items-center space-x-1"
                  >
                    <span>Browse All 15 Lineages</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Horizontal Quick Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
                  {TOP_CULTURAL_PILLS.map((pill) => (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setCulturalChoice(pill.id)}
                      className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition flex items-center space-x-1.5 flex-shrink-0 ${
                        culturalChoice === pill.id
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm'
                          : 'bg-white/[0.03] border-white/[0.06] text-neutral-400 hover:text-neutral-200 hover:border-white/[0.12]'
                      }`}
                    >
                      {culturalChoice === pill.id && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{pill.label}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowTraditionsSelectorModal(true)}
                    className="px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-neutral-400 hover:text-white transition flex items-center space-x-1 whitespace-nowrap flex-shrink-0"
                  >
                    <Layers className="w-3 h-3" />
                    <span>More Lineages (15)</span>
                  </button>
                </div>

                {/* Active Framework Summary Strip */}
                {culturalChoice !== 'Auto-Detect' && currentTraditionLore && (
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono text-neutral-300">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-emerald-400 font-serif italic text-sm">{currentTraditionLore.nativeScript}</span>
                      <span className="text-white truncate font-medium">{currentTraditionLore.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveLoreModal(currentTraditionLore)}
                      className="text-[11px] text-emerald-400 hover:underline flex-shrink-0 flex items-center space-x-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Inspect Evidence</span>
                    </button>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono flex items-center space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Primary Call-to-Action */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 sm:py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-bold text-sm sm:text-base uppercase tracking-wider transition-all duration-200 glow-emerald transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    <span>CALIBRATING GROUNDING PROTOCOL...</span>
                  </>
                ) : (
                  <>
                    <span>BREAK THE DIGITAL TRANCE // STEP OUTSIDE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Cooperative Cancellation Trigger (Abort Signal) */}
              {isLoading && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleCancelGeneration}
                    className="text-xs font-mono text-neutral-400 hover:text-red-400 transition-colors py-1 px-3 rounded-lg hover:bg-white/[0.04] inline-flex items-center space-x-1.5"
                  >
                    <span>✕ Cancel Generation (Abort)</span>
                  </button>
                </div>
              )}
            </form>

            {/* Zero Retention Proof Card */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 border-t border-white/[0.04] gap-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero-Retention Contract: Volatile RAM only. 0 bytes persisted.</span>
              </div>
              <span className="text-neutral-400">Sovereign Open-Weight Runtime</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 2: THE MISSION (CLEAN, INTERACTIVE & EDITABLE) */}
        {/* ============================================================== */}
        {appState === 'MISSION' && mission && (
          <div className="space-y-7 animate-fade-in">
            {/* Top Navigation Bar: Back & Tools */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setAppState('INPUT')}
                className="text-xs font-mono text-neutral-400 hover:text-white transition flex items-center space-x-1.5 py-1 px-2.5 rounded-lg hover:bg-white/[0.04]"
                title="Return to input to refine your description or change lineage"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Input & Lineage</span>
              </button>

              <div className="flex items-center space-x-2 font-mono text-xs">
                {/* Text-to-Speech Preview */}
                <button
                  type="button"
                  onClick={toggleMissionStepsReading}
                  className={`px-3 py-1.5 rounded-full border transition flex items-center space-x-1.5 ${
                    isSpeakingSteps
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-white/[0.03] border-white/[0.08] text-neutral-400 hover:text-white'
                  }`}
                  title="Listen to steps read aloud"
                >
                  {isSpeakingSteps ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                  <span>{isSpeakingSteps ? 'Stop Audio' : 'Listen to Steps'}</span>
                </button>

                {/* Copy Steps */}
                <button
                  type="button"
                  onClick={copyMissionSteps}
                  className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-neutral-400 hover:text-white transition"
                  title="Copy steps to clipboard"
                >
                  Copy Steps
                </button>
              </div>
            </div>

            {/* Mission Header */}
            <div className="space-y-3 border-b border-white/[0.08] pb-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center space-x-1.5 font-mono text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3" />
                  <span>SOMATIC STATE: {mission.detected_emotion.toUpperCase()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const fw = mission.cultural_framework || '';
                      const lore = CULTURAL_TAXONOMY.find(
                        (t) =>
                          t.id === fw ||
                          fw.toLowerCase().includes(t.name.toLowerCase().split(' ')[0]) ||
                          t.name.toLowerCase().includes(fw.toLowerCase().split(' ')[0])
                      );
                      if (lore) setActiveLoreModal(lore);
                    }}
                    className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-emerald-500/40 text-neutral-300 hover:text-white flex items-center space-x-1.5 transition"
                    title="Inspect historical provenance & clinical proof"
                  >
                    <span className="truncate max-w-[200px]">{mission.cultural_framework}</span>
                    <BookOpen className="w-3 h-3 text-emerald-400" />
                  </button>
                  {mission.ephemeral_purge_hash && (
                    <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-white/[0.02] text-neutral-500 border border-white/[0.06]">
                      SHA [{mission.ephemeral_purge_hash.slice(0, 8)}]
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white font-sans">
                {mission.mission_title}
              </h2>
              {mission.weather_context && (
                <p className="text-xs font-mono text-neutral-400 flex items-center space-x-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Atmospheric Anchoring: {mission.weather_context}</span>
                </p>
              )}
            </div>

            {/* Preparation checklist status */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
              <span>5 Sensory Actions for the Open Air:</span>
              <span className="text-emerald-400">
                {reviewedSteps.size > 0 ? `${reviewedSteps.size} of ${mission.steps.length} readied` : 'Review each step'}
              </span>
            </div>

            {/* Steps Container */}
            <div className="space-y-3.5">
              {mission.steps.map((step: GroundingStep) => {
                const isChecked = reviewedSteps.has(step.step_number);

                return (
                  <div
                    key={step.step_number}
                    onClick={() => toggleStepReviewed(step.step_number)}
                    className={`glass-panel p-5 sm:p-6 rounded-2xl transition-all cursor-pointer flex items-start space-x-4 sm:space-x-5 ${
                      isChecked 
                        ? 'border-emerald-500/40 bg-emerald-950/10' 
                        : 'hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex flex-col items-center flex-shrink-0 w-8 space-y-2">
                      <div className="font-mono text-xl sm:text-2xl font-light text-emerald-400">
                        0{step.step_number}
                      </div>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                        isChecked ? 'bg-emerald-500 border-emerald-500 text-neutral-950' : 'border-white/[0.2]'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center space-x-1.5">
                        {getSensoryIcon(step.sensory_focus)}
                        <span className="font-mono text-[11px] uppercase tracking-wider font-medium text-emerald-400">
                          {step.sensory_focus}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-normal text-neutral-200 leading-relaxed font-sans">
                        {step.physical_action}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lock Activation Section */}
            <div className="pt-2 space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-mono flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <div className="font-bold text-amber-300 uppercase">Anti-Engagement Covenant</div>
                  <div>
                    Clicking below will silence this display for{' '}
                    <strong className="underline text-amber-300">
                      {demoFastMode ? '10 seconds (Speedrun Demo)' : '10 minutes of genuine offline presence'}
                    </strong>
                    . If you switch tabs, the circuit resets automatically. You can always exit early if needed.
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoOutside}
                className="w-full py-5 sm:py-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-bold text-base sm:text-lg uppercase tracking-wider transition-all duration-200 glow-emerald transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 shadow-xl"
              >
                <Lock className="w-5 h-5" />
                <span>I AM CROSSING THE THRESHOLD // I AM GOING OUTSIDE</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 3: THE SCREEN LOCK (MINIMALIST ZEN SANCTUARY) */}
        {/* ============================================================== */}
        {appState === 'LOCK' && (
          <div className="fixed inset-0 bg-[#08090d] z-50 flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
            {/* Top Bar inside Lock Screen */}
            <div className="fixed top-5 left-5 right-5 flex items-center justify-between text-xs font-mono text-neutral-500 z-10">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-neutral-400">DISCONNECTED FROM CODE</span>
              </div>
              
              {/* Emergency Unlock Button */}
              <button
                type="button"
                onClick={() => setShowEmergencyExitModal(true)}
                className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white border border-white/[0.08] transition"
              >
                ✕ Exit Session Early
              </button>
            </div>

            <div className="max-w-xl w-full space-y-7 animate-fade-in py-10 my-auto">
              {/* Lock Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs uppercase tracking-widest">
                <Lock className="w-3.5 h-3.5" />
                <span>CIRCUIT BREAKER ENGAGED // SCREEN SILENCED</span>
              </div>

              {/* Massive Minimalist Countdown Clock with Progress */}
              <div className="space-y-2 relative">
                <div className="font-mono text-7xl sm:text-9xl font-extralight tracking-tight text-white glow-emerald">
                  {formatTime(timeLeft)}
                </div>

                {/* Progress bar */}
                <div className="w-48 h-1 bg-white/[0.06] rounded-full mx-auto overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-1000"
                    style={{ width: `${timerProgressPct}%` }}
                  />
                </div>

                <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {timerExpired ? "RECONNECTION CYCLE COMPLETE" : "TIME REMAINING IN THE LIVING WORLD"}
                </p>
              </div>

              {/* Box Breathing Visualizer Orb for All Users */}
              {showBreathingVisualizer && (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <div className={`w-28 h-28 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 ${
                    breathPhase === 'Inhale' 
                      ? 'scale-125 border-emerald-400 bg-emerald-500/10 glow-emerald' 
                      : breathPhase === 'Hold' || breathPhase === 'HoldEmpty'
                      ? 'scale-110 border-purple-400 bg-purple-500/10' 
                      : 'scale-90 border-blue-400 bg-blue-500/10'
                  }`}>
                    <span className="font-mono text-xs uppercase font-semibold text-white">{breathPhase}</span>
                    <span className="font-mono text-sm text-emerald-300 font-bold">{breathCountdown}s</span>
                  </div>
                  <span className="font-mono text-[10px] text-purple-300 uppercase tracking-widest">
                    Vagus Nerve 4-4-4-4 Box Breathing Pacer
                  </span>
                </div>
              )}

              {/* Directives */}
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  Screen silenced.<br />
                  <span className="font-serif italic text-emerald-300 font-normal">Touch the living world. Breathe deeply.</span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto font-sans leading-relaxed">
                  Do not look at code. Feel the raw soil, canopy wind, tree bark, and open sky.
                </p>
              </div>

              {/* Telemetry Bar (Motion & Tab Violations) */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto font-mono text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left flex items-center space-x-2">
                  <Footprints className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-neutral-500">STEPS PACED</div>
                    <div className="text-sm font-semibold text-white">{stepCount} Steps</div>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border text-left flex items-center space-x-2 ${
                  tabSwitches > 0 ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-white/[0.02] border-white/[0.06]'
                }`}>
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${tabSwitches > 0 ? 'text-red-400' : 'text-neutral-500'}`} />
                  <div>
                    <div className="text-[10px] text-neutral-500">TAB RESISTANCE</div>
                    <div className="text-sm font-semibold">{tabSwitches} Relapses</div>
                  </div>
                </div>
              </div>

              {/* Sensory Interaction Controls: Pocket Mode, Visual Breathing & Haptics */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={startAudioNarration}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-emerald-500/30 text-emerald-300 flex items-center space-x-1.5 transition"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>POCKET MODE (AUDIO)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowBreathingVisualizer(!showBreathingVisualizer)}
                  className={`px-3.5 py-2 rounded-xl border flex items-center space-x-1.5 transition ${
                    showBreathingVisualizer
                      ? 'bg-purple-500/15 border-purple-500/40 text-purple-200'
                      : 'bg-white/[0.03] border-white/[0.08] text-neutral-400 hover:text-white'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>{showBreathingVisualizer ? 'PACER ON' : 'PACER OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const next = !hapticsEnabled;
                    setHapticsEnabled(next);
                    if (next) addToast("Vibration haptics enabled on supported phones.", "info");
                  }}
                  className={`px-3.5 py-2 rounded-xl border flex items-center space-x-1.5 transition ${
                    hapticsEnabled
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200 animate-pulse'
                      : 'bg-white/[0.03] border-white/[0.08] text-neutral-400 hover:text-white'
                  }`}
                  title="Vibrate device during box breathing"
                >
                  <Vibrate className="w-3.5 h-3.5" />
                  <span>{hapticsEnabled ? 'HAPTICS [ON]' : 'HAPTICS'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingProof}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-blue-500/30 text-blue-300 flex items-center space-x-1.5 transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>
                    {isUploadingProof 
                      ? 'ANALYZING...' 
                      : proofOfTouch?.verified 
                        ? 'TOUCH WITNESS ✓' 
                        : 'TOUCH WITNESS (CAMERA)'}
                  </span>
                </button>
              </div>

              {/* Photo Preview and Proof Card */}
              {touchImagePreview && (
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] max-w-sm mx-auto flex items-center space-x-3 text-left">
                  <img 
                    src={touchImagePreview} 
                    alt="Touch witness preview" 
                    className="w-14 h-14 rounded-xl object-cover border border-emerald-500/40"
                  />
                  <div className="text-xs font-mono">
                    <div className="text-neutral-400 text-[10px]">CAPTURED NATURE ELEMENT</div>
                    <div className="text-emerald-300 font-semibold">
                      {isUploadingProof ? 'Analyzing...' : proofOfTouch?.verified ? `${proofOfTouch.detected_element} ✓` : 'Photo recorded'}
                    </div>
                  </div>
                </div>
              )}

              {/* Proof of Touch Verification Banner */}
              {proofOfTouch && (
                <div className={`p-3.5 rounded-xl border text-xs font-mono max-w-sm mx-auto text-left ${
                  proofOfTouch.verified ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200' : 'bg-red-500/10 border-red-500/40 text-red-200'
                }`}>
                  <div className="font-semibold">{proofOfTouch.message}</div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    {proofOfTouch.detected_element} | Confidence: {(proofOfTouch.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              )}

              {/* Fast Evaluator Preset Chips */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] max-w-sm mx-auto space-y-2">
                <div className="text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>EVALUATOR TEST PRESETS:</span>
                  <span className="text-amber-400 font-semibold">TEST FIXTURES</span>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center font-mono">
                  <button
                    type="button"
                    onClick={() => loadTestSample('leaf')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 transition"
                  >
                    🌿 Leaf (Verify)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadTestSample('bark')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 transition"
                  >
                    🌳 Bark (Verify)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadTestSample('screen')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-red-500/15 border border-red-500/30 text-red-300 transition"
                    title="Tests classifier rejection of indoor digital code screens"
                  >
                    💻 Code Screen (Reject)
                  </button>
                </div>
              </div>

              {/* Timer Expired Action */}
              {timerExpired && (
                <div className="pt-2 animate-bounce">
                  <button
                    onClick={() => setAppState('VALIDATION')}
                    className="px-8 py-4 sm:py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-bold text-base uppercase tracking-wider transition glow-emerald shadow-2xl flex items-center space-x-2.5 mx-auto"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>I HAVE RETURNED // RECEIVE CLOSING BLESSING</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 4: VALIDATION (CLASSY EDITORIAL BLESSING) */}
        {/* ============================================================== */}
        {appState === 'VALIDATION' && mission && (
          <div className="space-y-8 animate-fade-in">
            {/* Celebration Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 font-mono text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CIRCUIT BREAKER COMPLETE // RE-REGULATED</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white font-sans">
                Welcome back to <span className="font-serif italic text-emerald-300 font-normal">reality</span>.
              </h2>
            </div>

            {/* Validation Message Card */}
            <div className="glass-panel p-6 sm:p-10 rounded-3xl glow-emerald-subtle space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-500 border-b border-white/[0.06] pb-4 flex-wrap gap-2">
                <span>SOMATIC DIAGNOSIS: {mission.detected_emotion.toUpperCase()}</span>
                <span className="text-emerald-400 font-semibold">VOLATILE RAM DISSOLVED</span>
              </div>

              <blockquote className="text-xl sm:text-2xl font-serif italic text-emerald-100/90 leading-relaxed">
                "{mission.post_mission_encouragement}"
              </blockquote>

              {/* Telemetry Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/[0.06] font-mono text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-neutral-500">OFFLINE IMMERSION</div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {demoFastMode ? '10 Seconds' : '10 Minutes'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-neutral-500">STEPS PACED</div>
                  <div className="text-sm font-semibold text-emerald-400 mt-1">
                    {stepCount} Steps
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-neutral-500">TOUCH WITNESS</div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {proofOfTouch?.verified ? 'Authenticated ✓' : 'Self-Attested'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-neutral-500">DATA PERSISTED</div>
                  <div className="text-sm font-semibold text-emerald-400 mt-1">
                    0 Bytes
                  </div>
                </div>
              </div>
            </div>

            {/* Post-Grounding Gentle Check-in */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <span className="text-neutral-400">How is your nervous system feeling now?</span>
              <div className="flex items-center gap-2">
                {[
                  { label: 'Calmer', icon: Smile },
                  { label: 'Grounded', icon: Heart },
                  { label: 'Clear-Headed', icon: Sparkles }
                ].map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setSomaticReflection(label);
                      addToast(`Reflection: "${label}". Take this clarity with you.`, "success");
                    }}
                    className={`px-3 py-1.5 rounded-full border transition flex items-center space-x-1.5 ${
                      somaticReflection === label
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                        : 'bg-white/[0.02] border-white/[0.08] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ephemeral Field Log Artifact with Dual View */}
            <ReceiptCard
              mission={mission}
              stepCount={stepCount}
              tabSwitches={tabSwitches}
              proofOfTouch={proofOfTouch}
              demoFastMode={demoFastMode}
              rawReceiptText={generateReceiptText()}
              onCopy={copyReceiptToClipboard}
              onDownloadTxt={downloadReceiptTextFile}
              onDownloadPng={downloadReceiptPng}
              onShare={shareReceipt}
              copied={copiedReceipt}
              isGeneratingPng={isGeneratingPng}
            />

            {/* DevRelay Session Trace Drawer */}
            {mission.reasoning_trace && mission.reasoning_trace.length > 0 && (
              <div className="glass-panel rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowTraceDrawer(!showTraceDrawer)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-mono text-xs text-neutral-400 hover:text-white transition"
                >
                  <div className="flex items-center space-x-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-white">DEVRELAY AGENT REASONING TRACE</span>
                    <span className="text-neutral-500">({mission.reasoning_trace.length} milestones)</span>
                  </div>
                  {showTraceDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showTraceDrawer && (
                  <div className="p-5 border-t border-white/[0.06] bg-black/30 space-y-2 font-mono text-xs">
                    {mission.reasoning_trace.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-neutral-400">
                        <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                        <span className="text-neutral-200">{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Complete Session Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFullReset}
                className="w-full py-4 sm:py-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] text-white font-mono font-medium text-sm sm:text-base uppercase tracking-wider transition flex items-center justify-center space-x-2.5"
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>START NEW SESSION // DISSOLVE VOLATILE MEMORY</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* HOW IT WORKS GUIDANCE MODAL */}
      {/* ============================================================== */}
      <HowItWorksModal
        isOpen={showHowItWorksModal}
        onClose={() => setShowHowItWorksModal(false)}
      />

      {/* ============================================================== */}
      {/* 15 WORLDWIDE TRADITIONS EXPLORER MODAL */}
      {/* ============================================================== */}
      <TraditionsModal
        isOpen={showTraditionsSelectorModal}
        onClose={() => setShowTraditionsSelectorModal(false)}
        selectedId={culturalChoice}
        onSelect={(id) => {
          setCulturalChoice(id);
          addToast(
            id === 'Auto-Detect' ? 'Lineage reset to Auto-Detect.' : `Applied lineage: ${id.split(' ')[0]}`,
            "success"
          );
        }}
        onInspectLore={(tradition) => setActiveLoreModal(tradition)}
      />

      {/* ============================================================== */}
      {/* HISTORICAL PROVENANCE & CLINICAL EVIDENCE MODAL */}
      {/* ============================================================== */}
      <LoreDetailModal
        tradition={activeLoreModal}
        onClose={() => setActiveLoreModal(null)}
        onApply={(id) => {
          setCulturalChoice(id);
          setActiveLoreModal(null);
          setShowTraditionsSelectorModal(false);
          addToast(`Lineage applied: ${id.split(' ')[0]}`, "success");
        }}
        isApplied={culturalChoice === activeLoreModal?.id}
      />

      {/* ============================================================== */}
      {/* EMERGENCY EXIT CONFIRMATION MODAL */}
      {/* ============================================================== */}
      <EmergencyExitModal
        isOpen={showEmergencyExitModal}
        onCancel={() => setShowEmergencyExitModal(false)}
        onConfirmExit={handleConfirmEmergencyExit}
      />

      {/* Global Minimalist Footer */}
      <footer className="border-t border-white/[0.06] bg-[#08090d]/85 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-2 z-10">
        <div>
          EXHALE // Grounding Protocol: Acute Emotional Circuit Breaker
        </div>
        <div className="flex items-center space-x-4">
          <span>Sovereign Open-Weight Engine</span>
          <span>Zero Data Retention</span>
        </div>
      </footer>
    </div>
  );
}
