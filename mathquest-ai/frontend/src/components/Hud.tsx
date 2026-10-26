import { Link } from "react-router-dom";
import { Sparkles, Trophy, Volume2, VolumeX } from "lucide-react";
import { Avatar } from "../art/avatars";
import { useGame } from "../context/GameContext";
import { useProgress } from "../context/ProgressContext";
import { useCountUp } from "../hooks/useCountUp";
import { frameFor } from "../frames";

export function Hud() {
  const { state, update } = useGame();
  const { progress } = useProgress();
  const level = progress?.playerLevel ?? 1;
  const totalXp = useCountUp(progress?.xp ?? 0);
  const into = progress?.xpIntoLevel ?? 0;
  const need = progress?.xpForNextLevel ?? 100;
  const pct = Math.min(100, (into / Math.max(1, need)) * 100);
  const frame = frameFor(level);

  return (
    <header className="sticky top-0 z-30 bg-[var(--world-arena)] px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <Link to="/map" aria-label="Back to the map" className="rounded-full border-4 bg-paper shrink-0" style={{ borderColor: frame.color }}>
          <Avatar id={state.avatarId} size={48} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between text-paper">
            <span className="font-display text-xl">Level {level}</span>
            <span className="font-semibold tabular-nums">{totalXp} XP</span>
          </div>
          <div role="progressbar" aria-label="Progress to next level" aria-valuemin={0} aria-valuemax={need} aria-valuenow={into}
               className="h-4 overflow-hidden rounded-full border-[3px] border-paper bg-black/40">
            <div className="glow h-full bg-[var(--world-glow)] transition-[width] duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button type="button" className="tile grid size-12 place-items-center bg-white cursor-pointer shrink-0" aria-pressed={state.soundOn}
                aria-label="Sound" title="Sound" onClick={() => update({ soundOn: !state.soundOn })}>
          {state.soundOn ? <Volume2 aria-hidden /> : <VolumeX aria-hidden />}
        </button>
        <button type="button" className="tile grid size-12 place-items-center bg-white cursor-pointer shrink-0" aria-pressed={state.motionOn}
                aria-label="Animations" title="Animations" onClick={() => update({ motionOn: !state.motionOn })}>
          <Sparkles aria-hidden />
        </button>
        <Link to="/passport" aria-label="Passport and trophies" title="Passport" className="tile grid size-12 place-items-center bg-white cursor-pointer shrink-0">
          <Trophy aria-hidden />
        </Link>
      </div>
    </header>
  );
}
