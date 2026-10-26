import { useGame } from "../context/GameContext";

type Note = [freq: number, start: number, dur: number];
const SOUNDS: Record<string, Note[]> = {
  hit: [[520, 0, 0.06], [300, 0.05, 0.12], [700, 0.12, 0.14]],
  oops: [[300, 0, 0.2]],
  combo: [[660, 0, 0.08], [880, 0.08, 0.08], [1100, 0.16, 0.14]],
  tier: [[520, 0, 0.1], [660, 0.1, 0.1], [880, 0.2, 0.2]],
  chest: [[392, 0, 0.1], [523, 0.1, 0.1], [659, 0.2, 0.1], [784, 0.3, 0.25]],
  win: [[523, 0, 0.12], [659, 0.12, 0.12], [784, 0.24, 0.12], [1047, 0.36, 0.3]],
  levelup: [[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.1], [1047, 0.3, 0.1], [1319, 0.4, 0.3]],
};
const VIBES: Record<string, number | number[]> = { hit: 25, oops: 15, win: [40, 60, 40], levelup: [40, 60, 40] };
let ctx: AudioContext | null = null;

export type SoundName = keyof typeof SOUNDS;

export function useSound() {
  const { state } = useGame();
  return (name: SoundName) => {
    if (!state.soundOn) return;
    try { if (name in VIBES) navigator.vibrate?.(VIBES[name]); } catch { /* unsupported */ }
    try {
      ctx ??= new AudioContext();
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;
      for (const [freq, start, dur] of SOUNDS[name]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + start);
        gain.gain.exponentialRampToValueAtTime(0.08, now + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.05);
      }
    } catch { /* audio unavailable: ignore */ }
  };
}
