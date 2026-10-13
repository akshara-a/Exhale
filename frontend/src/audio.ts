/**
 * Exhale Generative Audio Engine
 * Zero external audio files; uses pure Web Audio API synthesis.
 * Synthesizes:
 *  - 432 Hz Solfeggio / Vagus Harmonic Drone
 *  - Organic Ambient Wind / Canopy Rustle (Pink/Brown noise with resonant filters)
 *  - Singing Bowl Chime (for lock initiation and completion)
 */

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private noiseGain: GainNode | null = null;
  private isPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play Tibetan Singing Bowl / Gong on milestone events
  public playBowlChime(pitch: number = 432, duration: number = 4) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      // Gentle frequency bend simulating physical metal bowl
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.995, now + duration);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn("Audio chime failed:", e);
    }
  }

  // Start continuous 432Hz ambient grounding drone + wind
  public startAmbientSoundscape() {
    if (this.isPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Solfeggio 432 Hz sine tone with subtle detuned chorus
      this.droneOsc = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();
      this.droneOsc.type = 'sine';
      this.droneOsc.frequency.setValueAtTime(216, now); // Sub-harmonic 216Hz for warmth

      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.linearRampToValueAtTime(0.08, now + 2.0);

      this.droneOsc.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);
      this.droneOsc.start();

      // 2. Synthesized wind / foliage noise
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.08;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Resonant low-pass filter simulating wind whistling through trees
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.001, now);
      this.noiseGain.gain.linearRampToValueAtTime(0.07, now + 2.5);

      whiteNoise.connect(filter);
      filter.connect(this.noiseGain);
      this.noiseGain.connect(this.ctx.destination);
      whiteNoise.start();

      this.noiseNode = whiteNoise;
      this.isPlaying = true;
    } catch (e) {
      console.warn("Ambient soundscape failed:", e);
    }
  }

  public stopAmbientSoundscape() {
    if (!this.isPlaying || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.droneGain) {
        this.droneGain.gain.linearRampToValueAtTime(0.001, now + 1.0);
      }
      if (this.noiseGain) {
        this.noiseGain.gain.linearRampToValueAtTime(0.001, now + 1.0);
      }

      setTimeout(() => {
        if (this.droneOsc) {
          try { this.droneOsc.stop(); } catch {}
          this.droneOsc.disconnect();
          this.droneOsc = null;
        }
        if (this.noiseNode) {
          try { (this.noiseNode as AudioBufferSourceNode).stop(); } catch {}
          this.noiseNode.disconnect();
          this.noiseNode = null;
        }
        this.isPlaying = false;
      }, 1000);
    } catch (e) {
      console.warn("Failed stopping soundscape:", e);
      this.isPlaying = false;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const soundscape = new SoundscapeEngine();
