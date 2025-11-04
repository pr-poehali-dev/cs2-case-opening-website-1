class SoundManager {
  private context: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private createOscillator(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.context) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

    gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  }

  playSpinStart(): void {
    this.createOscillator(400, 0.2, 'triangle');
    setTimeout(() => this.createOscillator(600, 0.2, 'triangle'), 100);
  }

  playSpinning(): void {
    if (!this.context) return;
    
    const interval = setInterval(() => {
      this.createOscillator(200 + Math.random() * 100, 0.05, 'square');
    }, 100);

    setTimeout(() => clearInterval(interval), 4500);
  }

  playWin(rarity: 'common' | 'rare' | 'epic' | 'legendary'): void {
    if (!this.context) return;

    const frequencies = {
      common: [400, 450],
      rare: [500, 600, 700],
      epic: [600, 750, 900],
      legendary: [700, 850, 1000, 1200],
    };

    const notes = frequencies[rarity];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.createOscillator(freq, 0.3, 'sine');
      }, index * 150);
    });
  }

  playClick(): void {
    this.createOscillator(300, 0.05, 'square');
  }

  playHover(): void {
    this.createOscillator(200, 0.03, 'sine');
  }
}

export const soundManager = new SoundManager();
