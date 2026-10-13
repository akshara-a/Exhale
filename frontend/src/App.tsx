import React, { useState, useEffect, useRef } from 'react';
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
  RotateCcw, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Headphones, 
  Vibrate, 
  Footprints, 
  Camera, 
  Copy, 
  Download, 
  CloudSun, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Activity, 
  Trees, 
  Check, 
  Share2, 
  FileImage, 
  WifiOff, 
  BookOpen, 
  X,
  ChevronRight,
  Layers
} from 'lucide-react';
import { AppState, GroundingMission, GroundingStep, WeatherTelemetry, ProofOfTouchResponse } from './types';
import { soundscape } from './audio';
import { generateOfflineMission } from './offlineEngine';
import { generateReceiptImage } from './receiptCanvas';
import { CULTURAL_TAXONOMY, CulturalTradition } from './culturalLore';

// Example acute somatic expressions for instant evaluation
const PRESETS = [
  "Staring at unresolved bugs for hours; my chest is constricted and my eyes burn from the monitor.",
  "Drowning in Slack pings, sprint pressure, and cognitive noise; my nervous system is buzzing with panic.",
  "Paralyzed by an impending deadline, shallow breathing, and mental static that won't quiet down.",
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

  // Screen Lock & Timer State
  const [demoFastMode, setDemoFastMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerExpired, setTimerExpired] = useState(false);
  
  // Page Visibility & Tab Switch Penalty
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showPenaltyToast, setShowPenaltyToast] = useState(false);
  const [penaltyMessage, setPenaltyMessage] = useState('');

  // Audio & Soundscape State
  const [ambientSoundActive, setAmbientSoundActive] = useState(false);
  const [pocketModeActive, setPocketModeActive] = useState(false);

  // Pocket Haptics (Box Breathing: 4-4-4-4)
  const [hapticsEnabled, setHapticsEnabled] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'HoldEmpty'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);

  // Motion & Step-Pacing Verification
  const [stepCount, setStepCount] = useState(0);

  // Multimodal Proof of Touch
  const [proofOfTouch, setProofOfTouch] = useState<ProofOfTouchResponse | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Offline Sanctuary Mode Indicator
  const [isOfflineTrailMode, setIsOfflineTrailMode] = useState(false);

  // DevRelay Session Trace Drawer
  const [showTraceDrawer, setShowTraceDrawer] = useState(false);

  // Receipt Copy & Image Export Feedback
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  
  // Modals
  const [activeLoreModal, setActiveLoreModal] = useState<CulturalTradition | null>(null);
  const [showTraditionsSelectorModal, setShowTraditionsSelectorModal] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cooperative Cancellation Handler (Abort Signal)
  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
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

  // Submit Brain Dump (With Trail-Ready Offline Resilience)
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!brainDump.trim() || brainDump.trim().length < 2) {
      setErrorMsg("Please express at least a few words about what you are experiencing.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

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
      setPenaltyMessage(`${reason} Timer reset to ${demoFastMode ? '10 seconds' : '10:00'}.`);
      setShowPenaltyToast(true);

      soundscape.playBowlChime(220, 1.2);

      setTimeout(() => {
        setShowPenaltyToast(false);
      }, 4500);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [appState, timerExpired, demoFastMode]);

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
    if (!('speechSynthesis' in window) || !mission) return;
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

  // Pocket Haptics (Box Breathing: 4s Inhale, 4s Hold, 4s Exhale, 4s Hold)
  useEffect(() => {
    if (!hapticsEnabled || appState !== 'LOCK' || timerExpired) {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      return;
    }

    let phaseIndex = 0;
    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'HoldEmpty'> = ['Inhale', 'Hold', 'Exhale', 'HoldEmpty'];

    const triggerHapticPulse = () => {
      const curPhase = phases[phaseIndex % 4];
      setBreathPhase(curPhase);
      setBreathCountdown(4);
      
      if ('vibrate' in navigator) {
        if (curPhase === 'Inhale' || curPhase === 'Exhale') {
          navigator.vibrate([150, 100, 150]);
        } else {
          navigator.vibrate(80);
        }
      }
      phaseIndex++;
    };

    triggerHapticPulse();
    breathTimerRef.current = setInterval(triggerHapticPulse, 4000);

    const countdownInterval = setInterval(() => {
      setBreathCountdown((prev) => (prev > 1 ? prev - 1 : 4));
    }, 1000);

    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      clearInterval(countdownInterval);
    };
  }, [hapticsEnabled, appState, timerExpired]);

  // Multimodal Proof of Touch Upload Handler
  const handleProofOfTouchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProof(true);
    setErrorMsg(null);

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
      }
    } catch (err: any) {
      console.error('Proof of touch failed:', err);
      setErrorMsg(err.message || 'Failed to analyze touch photograph');
    } finally {
      setIsUploadingProof(false);
    }
  };

  // Fast Evaluator Synthetic Test Sample Loader
  const loadTestSample = async (sampleType: 'leaf' | 'bark' | 'screen') => {
    setIsUploadingProof(true);
    try {
      const baseUrl = getApiUrl();
      const res = await fetch(`${baseUrl}/verify-touch/sample?sample_type=${sampleType}`);
      if (res.ok) {
        const result: ProofOfTouchResponse = await res.json();
        setProofOfTouch(result);
        if (result.verified) {
          soundscape.playBowlChime(528, 2.0);
        } else {
          soundscape.playBowlChime(220, 1.0);
        }
      }
    } catch (e) {
      console.warn("Failed fetching sample:", e);
    } finally {
      setIsUploadingProof(false);
    }
  };

  // Toggle Ambient Soundscape
  const toggleAmbientSound = () => {
    if (ambientSoundActive) {
      soundscape.stopAmbientSoundscape();
      setAmbientSoundActive(false);
    } else {
      soundscape.startAmbientSoundscape();
      setAmbientSoundActive(true);
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
    } catch (e) {
      console.warn("Failed generating PNG:", e);
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
    setStepCount(0);
    setTabSwitches(0);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

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
          <Headphones className="w-12 h-12 text-emerald-950 mx-auto animate-pulse" />
          <p className="font-mono text-neutral-800 text-sm">
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

  // Active Tradition Lore lookup
  const currentTraditionLore = CULTURAL_TAXONOMY.find(
    (t) => t.id === culturalChoice || (culturalChoice !== 'Auto-Detect' && t.name.toLowerCase().includes(culturalChoice.toLowerCase().split(' ')[0]))
  );

  return (
    <div className="min-h-screen bg-[#08090d] text-[#f1f5f9] font-sans flex flex-col justify-between relative selection:bg-emerald-500 selection:text-black">
      {/* Ambient background glow */}
      <div className="fixed inset-0 ambient-glow"></div>

      {/* Global Minimalist Top Nav Bar */}
      <header className="border-b border-white/[0.06] bg-[#08090d]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between z-20 sticky top-0 transition-all">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-mono text-xs sm:text-sm tracking-[0.25em] font-semibold text-neutral-100 uppercase">
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

        <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-mono">
          {/* Ambient Soundscape Toggle */}
          <button
            onClick={toggleAmbientSound}
            className={`px-3 py-1.5 rounded-full border text-[11px] transition flex items-center space-x-1.5 ${
              ambientSoundActive 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                : 'bg-white/[0.03] border-white/[0.08] text-neutral-400 hover:text-white'
            }`}
            title="Toggle synthesized 432Hz vagus nerve calming soundscape"
          >
            {ambientSoundActive ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3 text-neutral-500" />}
            <span className="hidden md:inline">{ambientSoundActive ? '432Hz SOUNDSCAPE' : '432Hz DRONE'}</span>
          </button>

          {/* Live Weather Telemetry Badge */}
          {weatherTelemetry && (
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-neutral-300 text-[11px]">
              <CloudSun className="w-3 h-3 text-amber-400" />
              <span>{weatherTelemetry.temperature_c.toFixed(0)}°C</span>
              <span className="hidden lg:inline text-neutral-500">• {weatherTelemetry.condition}</span>
            </div>
          )}

          {/* Testing Mode Toggle */}
          <button
            onClick={() => {
              const next = !demoFastMode;
              setDemoFastMode(next);
              if (appState === 'LOCK') {
                setTimeLeft(next ? 10 : 600);
              }
            }}
            className={`px-2.5 py-1.5 rounded-full border text-[11px] transition font-mono ${
              demoFastMode 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                : 'bg-white/[0.03] border-white/[0.08] text-neutral-500 hover:text-neutral-300'
            }`}
            title="Toggle fast 10s evaluation timer"
          >
            {demoFastMode ? '⚡ 10s TEST' : '⏱ 10m REAL'}
          </button>
        </div>
      </header>

      {/* Penalty Warning Toast */}
      {showPenaltyToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md bg-red-950/90 border border-red-500/60 text-red-200 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-start space-x-3 glow-red animate-bounce">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-mono font-bold text-xs text-red-300 uppercase tracking-wide">
              CIRCUIT BREAKER PENALTY TRIGGERED
            </p>
            <p className="text-xs mt-0.5 text-red-100 font-sans">{penaltyMessage}</p>
          </div>
        </div>
      )}

      {/* Hidden File Input for Multimodal Proof of Touch */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProofOfTouchUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 flex flex-col justify-center z-10">
        
        {/* ============================================================== */}
        {/* STATE 1: INPUT (MINIMALIST & CLASSY CLEAN) */}
        {/* ============================================================== */}
        {appState === 'INPUT' && (
          <div className="space-y-10 animate-fade-in">
            {/* Minimalist Editorial Headline */}
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 font-mono text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                <Flame className="w-3 h-3" />
                <span>HACKTOBERFEST // "TOUCH GRASS" & BEST USE OF RENDER</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.15]">
                Step away from the screen.<br />
                <span className="font-serif italic text-emerald-300 font-normal">Return to the living earth.</span>
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                Digital feeds and compiler loops trap the nervous system in artificial vigilance. 
                Exhale is a zero-retention emotional circuit breaker. Speak your acute burden below to generate 
                a 5-step sensory grounding protocol and step into the open air.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Brain Dump Input Area */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-neutral-400">
                  Where does the burden sit right now? (Acute state):
                </label>
                <div className="glass-panel rounded-2xl p-4 sm:p-5 transition-all duration-300 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20">
                  <textarea
                    rows={4}
                    value={brainDump}
                    onChange={(e) => setBrainDump(e.target.value)}
                    placeholder='e.g., "I have been staring at this compiler error for seven hours. My chest is constricted, my head is throbbing, and I cannot catch a full breath."'
                    className="w-full bg-transparent text-base sm:text-lg font-mono text-white placeholder-neutral-600 outline-none resize-none leading-relaxed"
                    disabled={isLoading}
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px] font-mono text-neutral-500">
                    <span>Zero bytes logged. In-memory only.</span>
                    <span>{brainDump.length} chars</span>
                  </div>
                </div>
              </div>

              {/* Minimalist Cultural Lineage Selector Bar */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5">
                    <Trees className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cultural Grounding Lineage:</span>
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

                {/* Horizontal Minimalist Quick Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
                  {TOP_CULTURAL_PILLS.map((pill) => (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setCulturalChoice(pill.id)}
                      className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition flex items-center space-x-1.5 flex-shrink-0 ${
                        culturalChoice === pill.id
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
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
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono text-neutral-400">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-emerald-400 font-serif italic text-sm">{currentTraditionLore.nativeScript}</span>
                      <span className="text-neutral-300 truncate">{currentTraditionLore.name}</span>
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

              {/* Preset Scenarios as Discreet Whispers */}
              <div className="space-y-2">
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  Or load acute state scenario:
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBrainDump(preset)}
                      className="text-xs font-sans px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-neutral-400 hover:text-emerald-300 hover:border-emerald-500/30 transition text-left truncate max-w-full"
                    >
                      "{preset.slice(0, 52)}..."
                    </button>
                  ))}
                </div>
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
                className="w-full py-4 sm:py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-bold text-sm sm:text-base uppercase tracking-wider transition-all duration-200 glow-emerald transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
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
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Zero-Retention Contract: Volatile RAM only. 0 bytes persisted.</span>
              </div>
              <span className="text-neutral-400">Zero-Retention • Sovereign Open-Weight Runtime</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 2: THE MISSION (CLEAN & CLASSY) */}
        {/* ============================================================== */}
        {appState === 'MISSION' && mission && (
          <div className="space-y-8 animate-fade-in">
            {/* Mission Header */}
            <div className="space-y-3 border-b border-white/[0.08] pb-6">
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
                    <span className="truncate max-w-[220px]">{mission.cultural_framework}</span>
                    <BookOpen className="w-3 h-3 text-emerald-400" />
                  </button>
                  {mission.ephemeral_purge_hash && (
                    <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-white/[0.02] text-neutral-500 border border-white/[0.06]">
                      SHA [{mission.ephemeral_purge_hash.slice(0, 8)}]
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white">
                {mission.mission_title}
              </h2>
              {mission.weather_context && (
                <p className="text-xs font-mono text-neutral-400">
                  Atmospheric Anchoring: {mission.weather_context}
                </p>
              )}
            </div>

            {/* Steps Container */}
            <div className="space-y-3.5">
              {mission.steps.map((step: GroundingStep) => (
                <div
                  key={step.step_number}
                  className="glass-panel p-5 sm:p-6 rounded-2xl hover:border-emerald-500/30 transition flex items-start space-x-4 sm:space-x-5"
                >
                  <div className="font-mono text-xl sm:text-2xl font-light text-emerald-400 flex-shrink-0 w-8">
                    0{step.step_number}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center space-x-1.5">
                      {getSensoryIcon(step.sensory_focus)}
                      <span className="font-mono text-[11px] uppercase tracking-wider font-medium text-emerald-400">
                        {step.sensory_focus}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-normal text-neutral-200 leading-relaxed">
                      {step.physical_action}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Lock Activation Section */}
            <div className="pt-4 space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-mono flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Anti-Engagement Covenant: Clicking below will silence this display for{' '}
                  <strong className="underline text-amber-300">
                    {demoFastMode ? '10 seconds (Speedrun)' : '10 minutes of genuine offline presence'}
                  </strong>
                  . If you switch tabs, the circuit resets automatically. The living earth is waiting for you.
                </span>
              </div>

              <button
                onClick={handleGoOutside}
                className="w-full py-5 sm:py-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-bold text-base sm:text-lg uppercase tracking-wider transition-all duration-200 glow-emerald transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3"
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
            <div className="max-w-xl w-full space-y-8 animate-fade-in py-6">
              
              {/* Lock Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs uppercase tracking-widest">
                <Lock className="w-3.5 h-3.5" />
                <span>CIRCUIT BREAKER ENGAGED // SCREEN SILENCED</span>
              </div>

              {/* Massive Minimalist Countdown Clock */}
              <div className="space-y-1">
                <div className="font-mono text-7xl sm:text-9xl font-extralight tracking-tight text-white glow-emerald">
                  {formatTime(timeLeft)}
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {timerExpired ? "RECONNECTION CYCLE COMPLETE" : "TIME REMAINING IN THE LIVING WORLD"}
                </p>
              </div>

              {/* Box Breathing Visualizer Orb */}
              {hapticsEnabled && (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <div className={`w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 ${
                    breathPhase === 'Inhale' 
                      ? 'scale-125 border-emerald-400 bg-emerald-500/10 glow-emerald' 
                      : breathPhase === 'Hold' || breathPhase === 'HoldEmpty'
                      ? 'scale-110 border-purple-400 bg-purple-500/10' 
                      : 'scale-90 border-blue-400 bg-blue-500/10'
                  }`}>
                    <span className="font-mono text-xs uppercase font-semibold text-white">{breathPhase}</span>
                    <span className="font-mono text-xs text-emerald-300">{breathCountdown}s</span>
                  </div>
                  <span className="font-mono text-[10px] text-purple-300 uppercase tracking-widest">
                    Vagus Nerve 4-4-4-4 Box Breathing Pacer
                  </span>
                </div>
              )}

              {/* Directives */}
              <div className="space-y-2">
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

              {/* Sensory Interaction Controls: Pocket Mode & Haptics */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <button
                  onClick={startAudioNarration}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center space-x-1.5 transition"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>POCKET MODE (AUDIO)</span>
                </button>

                <button
                  onClick={() => setHapticsEnabled(!hapticsEnabled)}
                  className={`px-3.5 py-2 rounded-xl border font-mono text-xs flex items-center space-x-1.5 transition ${
                    hapticsEnabled
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200 animate-pulse'
                      : 'bg-white/[0.03] border-white/[0.08] text-neutral-400 hover:text-white'
                  }`}
                >
                  <Vibrate className="w-3.5 h-3.5" />
                  <span>{hapticsEnabled ? `HAPTICS [${breathPhase}]` : 'BOX BREATHING HAPTICS'}</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingProof}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-blue-500/30 text-blue-300 font-mono text-xs flex items-center space-x-1.5 transition"
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

              {/* Fast Evaluator Preset Chips */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] max-w-sm mx-auto space-y-1.5">
                <div className="text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>EVALUATOR TEST PRESETS:</span>
                  <span className="text-amber-400">TEST CAMERA</span>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <button
                    onClick={() => loadTestSample('leaf')}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 transition"
                  >
                    🌿 Leaf
                  </button>
                  <button
                    onClick={() => loadTestSample('bark')}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 transition"
                  >
                    🌳 Bark
                  </button>
                  <button
                    onClick={() => loadTestSample('screen')}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-red-500/10 border border-red-500/30 text-red-300 transition"
                    title="Tests classifier rejection of indoor digital code screens"
                  >
                    💻 Code Screen (Reject)
                  </button>
                </div>
              </div>

              {/* Proof of Touch Verification Banner */}
              {proofOfTouch && (
                <div className={`p-3 rounded-xl border text-xs font-mono max-w-sm mx-auto ${
                  proofOfTouch.verified ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200' : 'bg-red-500/10 border-red-500/40 text-red-200'
                }`}>
                  <div className="font-semibold">{proofOfTouch.message}</div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    {proofOfTouch.detected_element} | Confidence: {(proofOfTouch.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              )}

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
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 font-mono text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CIRCUIT BREAKER COMPLETE // RE-REGULATED</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
                Welcome back to <span className="font-serif italic text-emerald-300 font-normal">reality</span>.
              </h2>
            </div>

            {/* Validation Message Card */}
            <div className="glass-panel p-6 sm:p-10 rounded-3xl glow-emerald-subtle space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-500 border-b border-white/[0.06] pb-4 flex-wrap gap-2">
                <span>SOMATIC DIAGNOSIS: {mission.detected_emotion.toUpperCase()}</span>
                <span className="text-emerald-400">VOLATILE RAM DISSOLVED</span>
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
                    {proofOfTouch?.verified ? 'Authenticated ✓' : 'Unattested'}
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

            {/* Ephemeral Field Log Artifact */}
            <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-2 font-mono text-xs text-emerald-400 font-bold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>EPHEMERAL FIELD ATTESTATION</span>
                </div>
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                  <button
                    onClick={copyReceiptToClipboard}
                    className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white flex items-center space-x-1.5 transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedReceipt ? 'COPIED!' : 'COPY'}</span>
                  </button>
                  <button
                    onClick={downloadReceiptPng}
                    disabled={isGeneratingPng}
                    className="px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono text-emerald-300 hover:text-white flex items-center space-x-1.5 transition"
                  >
                    <FileImage className="w-3 h-3 text-emerald-400" />
                    <span>{isGeneratingPng ? 'RENDERING...' : 'SAVE PNG'}</span>
                  </button>
                  <button
                    onClick={shareReceipt}
                    className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white flex items-center space-x-1.5 transition"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>SHARE</span>
                  </button>
                  <button
                    onClick={downloadReceiptTextFile}
                    className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white flex items-center space-x-1.5 transition"
                  >
                    <Download className="w-3 h-3" />
                    <span>.TXT</span>
                  </button>
                </div>
              </div>

              <pre className="font-mono text-xs text-neutral-300 bg-black/40 p-4 rounded-xl border border-white/[0.06] overflow-x-auto leading-relaxed select-all">
                {generateReceiptText()}
              </pre>
            </div>

            {/* DevRelay Session Trace Drawer */}
            {mission.reasoning_trace && mission.reasoning_trace.length > 0 && (
              <div className="glass-panel rounded-2xl overflow-hidden">
                <button
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

            {/* Destroy Session Button */}
            <div className="pt-2">
              <button
                onClick={handleFullReset}
                className="w-full py-4 sm:py-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] text-white font-mono font-medium text-sm sm:text-base uppercase tracking-wider transition flex items-center justify-center space-x-2.5"
              >
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <span>PURGE VOLATILE MEMORY // RETURN TO LIFE</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* 15 WORLDWIDE TRADITIONS EXPLORER MODAL */}
      {/* ============================================================== */}
      {showTraditionsSelectorModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowTraditionsSelectorModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel-elevated rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative"
          >
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  15 PLANETARY NATURE TRADITIONS
                </span>
                <h3 className="text-xl sm:text-2xl font-light text-white mt-1.5">
                  Select a Grounding Lineage
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  Rooted in centuries of indigenous wisdom and peer-reviewed autonomic neurobiology.
                </p>
              </div>
              <button 
                onClick={() => setShowTraditionsSelectorModal(false)}
                className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of 15 traditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
              {CULTURAL_TAXONOMY.map((tradition) => (
                <div
                  key={tradition.id}
                  onClick={() => {
                    setCulturalChoice(tradition.id);
                    setShowTraditionsSelectorModal(false);
                  }}
                  className={`p-4 rounded-2xl border text-left transition font-mono text-xs flex flex-col justify-between cursor-pointer ${
                    culturalChoice === tradition.id
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg'
                      : 'bg-white/[0.02] border-white/[0.06] text-neutral-300 hover:border-emerald-500/40 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-emerald-400 border border-white/[0.08]">
                          {tradition.region}
                        </span>
                        <span className="text-[10px] text-neutral-500">{tradition.historicalPeriod}</span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-1">{tradition.name}</div>
                      <div className="text-xs text-emerald-400 font-serif italic mt-0.5">{tradition.nativeScript}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLoreModal(tradition);
                      }}
                      className="p-1.5 hover:text-emerald-300 text-neutral-500 hover:bg-white/[0.05] rounded-full transition"
                      title="Inspect clinical evidence"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-sans mt-2 line-clamp-2">
                    {tradition.philosophicalCore}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => {
                  setCulturalChoice('Auto-Detect');
                  setShowTraditionsSelectorModal(false);
                }}
                className="text-xs font-mono text-emerald-400 hover:underline"
              >
                Reset to Auto-Detect
              </button>
              <button
                type="button"
                onClick={() => setShowTraditionsSelectorModal(false)}
                className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 font-mono text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* HISTORICAL PROVENANCE & CLINICAL EVIDENCE MODAL */}
      {/* ============================================================== */}
      {activeLoreModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveLoreModal(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel-elevated rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {activeLoreModal.region}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {activeLoreModal.historicalPeriod}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-light text-white mt-1.5">
                  {activeLoreModal.name}
                </h3>
                <div className="text-emerald-400 font-serif italic text-lg tracking-wide mt-0.5">
                  {activeLoreModal.nativeScript}
                </div>
              </div>
              <button 
                onClick={() => setActiveLoreModal(null)}
                className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Philosophical Core */}
            <div className="space-y-1.5">
              <h4 className="font-mono text-xs text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Indigenous Lineage & Philosophy:</span>
              </h4>
              <p className="text-sm text-neutral-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06] font-sans">
                {activeLoreModal.philosophicalCore}
              </p>
            </div>

            {/* Clinical Neurobiology & Evidence */}
            <div className="space-y-1.5">
              <h4 className="font-mono text-xs text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Clinical Trials & Modern Neurobiology:</span>
              </h4>
              <p className="text-sm text-neutral-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06] border-l-2 border-l-emerald-500 font-sans">
                {activeLoreModal.clinicalEvidence}
              </p>
            </div>

            {/* Ancestral Quote */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] italic text-emerald-200/90 text-sm font-serif">
              "{activeLoreModal.ancestralQuote}"
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCulturalChoice(activeLoreModal.id);
                  setActiveLoreModal(null);
                  setShowTraditionsSelectorModal(false);
                }}
                className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-semibold text-xs uppercase tracking-wider transition"
              >
                Apply This Lineage
              </button>
              <button
                type="button"
                onClick={() => setActiveLoreModal(null)}
                className="px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 font-mono text-xs uppercase tracking-wider transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Minimalist Footer */}
      <footer className="border-t border-white/[0.06] bg-[#08090d]/80 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-2 z-10">
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
