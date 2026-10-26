import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { api } from "../services/api";
import type { BadgeDef, QuizResults } from "../types/game";
import { useCountUp } from "../hooks/useCountUp";
import { useMotionAllowed } from "../hooks/useMotionAllowed";
import { useProgress } from "../context/ProgressContext";
import { useSound } from "../hooks/useSound";
import { Chest } from "../components/Chest";
import { GameButton } from "../components/GameButton";
import { Hud } from "../components/Hud";
import { PageScene } from "../components/PageScene";
import { Panel } from "../components/Panel";
import { Stars } from "../components/Stars";

export default function VictoryPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { refresh } = useProgress();
  const play = useSound();
  const allowed = useMotionAllowed();
  const [res, setRes] = useState<QuizResults | null>(null);
  const [badges, setBadges] = useState<BadgeDef[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const loaded = useRef(false);
  const xpShown = useCountUp(opened && res ? res.xpEarned : 0, 900);

  useEffect(() => {
    if (loaded.current || !sessionId) return;
    loaded.current = true;
    Promise.all([api.results(sessionId), api.badges()])
      .then(([r, b]) => { setRes(r); setBadges(b); })
      .catch((e) => setError(e instanceof Error ? e.message : "Something went wrong."));
  }, [sessionId]);

  function openChest() {
    if (!res || opened) return;
    setOpened(true);
    const leveledUp = res.playerLevel > res.previousLevel;
    play(leveledUp ? "levelup" : res.stars >= 2 ? "win" : "chest");
    if (res.stars >= 2 && allowed) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, disableForReducedMotion: true });
    }
    void refresh(); // the HUD's XP ticks up when the chest opens
  }

  if (error) {
    return <PageScene><Hud /><Panel className="mx-auto mt-24 max-w-md p-6 text-center">
      <p className="font-display text-2xl">We couldn't load your results.</p><p className="mt-2">{error}</p>
      <GameButton className="mt-4" onClick={() => navigate("/map")}>Back to the map</GameButton></Panel></PageScene>;
  }
  if (!res) return <PageScene><Hud /><Panel className="mx-auto mt-24 max-w-md p-6 text-center">Loading your results...</Panel></PageScene>;

  const headline = res.stars >= 2 ? "Boss defeated!"
    : res.stars === 1 ? "The boss is wounded."
    : "The boss wasn't scratched this time.";
  const sub = res.stars >= 2 ? "Open your chest to see what you won."
    : "Read the briefing again and come back for more stars.";
  const leveledUp = res.playerLevel > res.previousLevel;
  const earned = badges.filter((b) => res.newBadges.includes(b.id));

  return (
    <PageScene>
      <Hud />
      <main className="mx-auto max-w-xl px-4 pb-16 pt-6 text-center">
        <h1 className="font-display text-4xl">{headline}</h1>
        <p className="mt-2 text-lg">{sub}</p>
        <div className="mt-8"><Chest open={opened} onOpen={openChest} /></div>
        {!opened && <p className="mt-3 font-semibold">Tap the chest to open it.</p>}

        {opened && (
          <Panel className="mt-8 space-y-5 p-6" role="status">
            <div className="flex justify-center"><Stars count={res.stars} /></div>
            
            <div>
              <p className="font-display text-4xl tabular-nums text-ink">+{xpShown} XP</p>
              {leveledUp && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border-2 border-emerald-600 text-emerald-950 font-display text-lg">
                  Level Up! You reached Level {res.playerLevel}!
                </div>
              )}
            </div>

            {/* Structured 3-stat performance grid */}
            <div className="grid grid-cols-3 gap-3 py-1">
              <div className="p-3 rounded-2xl bg-white border-2 border-ink text-center">
                <div className="text-xs font-bold text-ink/70">Accuracy</div>
                <div className="font-display text-2xl text-ink">{res.scorePercent}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-white border-2 border-ink text-center">
                <div className="text-xs font-bold text-ink/70">Solved</div>
                <div className="font-display text-2xl text-ink">{res.correctCount}/{res.totalQuestions}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white border-2 border-ink text-center">
                <div className="text-xs font-bold text-ink/70">Max Combo</div>
                <div className="font-display text-2xl text-ink">x{res.bestCombo}</div>
              </div>
            </div>

            {earned.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300">
                <p className="font-display text-base text-amber-950">New Trophies Unlocked!</p>
                <ul className="mt-2 flex flex-wrap justify-center gap-2">
                  {earned.map((b) => (
                    <li key={b.id} className="tile bg-[var(--world-pop)] px-3 py-1 font-bold text-sm text-ink">
                      {b.title || (b as any).name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <GameButton onClick={() => navigate(`/quest/${res.missionId}`)}>
                Play Again
              </GameButton>
              <GameButton variant="secondary" onClick={() => navigate("/passport")}>
                Passport & Trophies
              </GameButton>
              <GameButton variant="secondary" onClick={() => navigate("/map")}>
                World Map
              </GameButton>
            </div>
          </Panel>
        )}
      </main>
    </PageScene>
  );
}
