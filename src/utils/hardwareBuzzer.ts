// Hardware Piezo Buzzer Synthesizer (Simulates active 5V buzzer on ESP32 GPIO 18)
class HardwareBuzzer {
  private audioCtx: AudioContext | null = null;
  private isBeeping: boolean = false;
  private intervalId: any = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Single short beep (e.g. keypress or threshold tick)
  public singleBeep(freq: number = 2048, durationMs: number = 120) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square'; // Typical piezo square wave
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) {
      // Audio not permitted yet or muted
    }
  }

  // Orange Warning Beep pattern (2 short pulses every 2 seconds)
  public startWarningAlarm() {
    if (this.isMuted || this.isBeeping) return;
    this.isBeeping = true;
    this.stop();

    this.intervalId = setInterval(() => {
      this.singleBeep(1800, 100);
      setTimeout(() => this.singleBeep(1800, 100), 180);
    }, 2000);
  }

  // Red Severe Alarm pattern (Continuous rapid pulses at 2.4 kHz)
  public startSevereAlarm() {
    if (this.isMuted) return;
    this.stop();
    this.isBeeping = true;

    this.intervalId = setInterval(() => {
      this.singleBeep(2400, 120);
    }, 280);
  }

  // Stop buzzer
  public stop() {
    this.isBeeping = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Test buzzer button
  public testBuzzer() {
    this.singleBeep(2200, 180);
    setTimeout(() => this.singleBeep(2500, 250), 220);
  }
}

export const hardwareBuzzer = new HardwareBuzzer();
