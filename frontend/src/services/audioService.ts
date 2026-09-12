class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    const saved = localStorage.getItem('life_rpg_sound_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('life_rpg_sound_muted', String(this.isMuted));
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    localStorage.setItem('life_rpg_sound_muted', String(muted));
  }

  // Micro tactile click
  public playClick(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  // Quest Completed - Radiant Chime
  public playQuestComplete(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.08);
        osc.stop(ctx.currentTime + index * 0.08 + 0.45);
      });
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  // Level Up - Triumphant Fanfare
  public playLevelUp(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Ascending fanfare
      const melody = [
        { f: 440.0, d: 0.12 },  // A4
        { f: 554.37, d: 0.12 }, // C#5
        { f: 659.25, d: 0.12 }, // E5
        { f: 880.0, d: 0.25 },  // A5
        { f: 783.99, d: 0.12 }, // G5
        { f: 880.0, d: 0.4 },   // A5
      ];

      let curTime = ctx.currentTime;
      melody.forEach(({ f, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(f, curTime);

        gain.gain.setValueAtTime(0, curTime);
        gain.gain.linearRampToValueAtTime(0.1, curTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, curTime + d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(curTime);
        osc.stop(curTime + d + 0.05);

        curTime += d * 0.85;
      });
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  // Shop Purchase - Coin Clink
  public playPurchase(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const freqs = [1800, 2400];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.3);
      });
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  // Error Alert
  public playError(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.setValueAtTime(140, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // AudioContext policy suppression fallback
    }
  }
}

export const audio = new SoundSynthesizer();
export default audio;
