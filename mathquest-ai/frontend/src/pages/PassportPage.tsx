import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, ArrowLeft, Lock, Award, CheckCircle } from "lucide-react";
import { PageScene } from "../components/PageScene";
import { Hud } from "../components/Hud";
import { Panel } from "../components/Panel";
import { useProgress } from "../context/ProgressContext";
import { useGame } from "../context/GameContext";
import { api } from "../services/api";
import { FRAMES, frameFor } from "../frames";
import { Avatar } from "../art/avatars";
import type { BadgeDef } from "../types/game";

export default function PassportPage() {
  const navigate = useNavigate();
  const { state } = useGame();
  const { progress } = useProgress();
  const [allBadges, setAllBadges] = useState<BadgeDef[]>([]);
  const [loading, setLoading] = useState(true);

  const playerLevel = progress?.playerLevel ?? 1;
  const earnedIds = new Set(progress?.badges || []);
  const currentFrame = frameFor(playerLevel);

  useEffect(() => {
    let active = true;
    api.badges()
      .then((badges) => {
        if (active) {
          setAllBadges(badges);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load badges:", err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageScene>
      <Hud />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/map")}
            className="tile px-4 py-2 bg-white flex items-center gap-2 font-semibold text-ink"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </button>
          <div className="font-display text-2xl text-paper">
            Explorer Passport & Trophies
          </div>
        </div>

        {/* Player Profile & Cosmetic Frames Section */}
        <Panel className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              className="rounded-full border-4 bg-paper p-1 shrink-0"
              style={{ borderColor: currentFrame.color }}
            >
              <Avatar id={state.avatarId} size={84} />
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-display text-2xl text-ink">
                  {state.nickname || "Explorer"}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full border-2 border-ink bg-[var(--world-pop)] font-bold text-ink">
                  Level {playerLevel}
                </span>
              </div>
              <p className="text-sm font-medium text-ink/80">
                Grade {state.grade} {state.grade === 6 ? "Space Voyager" : "Jungle Pathfinder"} • Total XP: {progress?.xp ?? 0}
              </p>
              <p className="text-xs font-semibold text-ink/60">
                Active Frame: <strong className="text-ink">{currentFrame.name}</strong>
              </p>
            </div>
          </div>

          {/* Cosmetic Avatar Frames Unlocks */}
          <div className="border-t-2 border-ink/20 pt-4">
            <h3 className="font-display text-lg text-ink mb-3">
              Cosmetic Avatar Frames
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FRAMES.map((f) => {
                const unlocked = playerLevel >= f.minLevel;
                const isEquipped = currentFrame.name === f.name;

                return (
                  <div
                    key={f.name}
                    className={`tile p-3 text-center rounded-xl bg-white relative transition-[transform,opacity,border-color] ${
                      unlocked ? "border-solid" : "border-dashed opacity-60"
                    }`}
                  >
                    <div
                      className="size-8 rounded-full border-4 mx-auto mb-2"
                      style={{ borderColor: f.color }}
                    />
                    <div className="font-display text-sm text-ink">{f.name}</div>
                    <div className="text-xs font-medium text-ink/70">
                      {unlocked ? "Unlocked" : `Requires Lvl ${f.minLevel}`}
                    </div>
                    {isEquipped && (
                      <span className="absolute top-1 right-1 text-xs">
                        <CheckCircle className="w-4 h-4 text-correct inline" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>

        {/* Sticker Book Trophy Room */}
        <Panel className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-mango" />
              <h2 className="font-display text-2xl text-ink">Trophy Collection</h2>
            </div>
            <div className="text-sm font-bold text-ink bg-white px-3 py-1 rounded-full border-2 border-ink">
              {earnedIds.size} / {allBadges.length} Earned
            </div>
          </div>

          {loading ? (
            <p className="text-center font-display text-lg py-8 text-ink">
              Opening the Trophy Hall...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allBadges.map((badge) => {
                const isEarned = earnedIds.has(badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`tile p-4 rounded-2xl flex flex-col justify-between transition-[transform,opacity,border-color] ${
                      isEarned
                        ? "bg-[var(--world-pop)] border-solid scale-[1.01]"
                        : "bg-white/70 border-dashed border-ink/40 opacity-70"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="size-10 rounded-xl bg-white/80 border-2 border-ink flex items-center justify-center">
                          {isEarned ? (
                            <Trophy className="w-6 h-6 text-ink" />
                          ) : (
                            <Lock className="w-5 h-5 text-ink/40" />
                          )}
                        </div>
                        {isEarned ? (
                          <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full border border-ink text-ink">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-ink/60 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Locked
                          </span>
                        )}
                      </div>

                      <div className="font-display text-lg text-ink leading-tight">
                        {badge.title}
                      </div>
                      <p className="text-xs font-medium text-ink/80 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>

                    {!isEarned && (
                      <div className="mt-3 p-2 bg-slate-100 rounded-lg text-xs font-semibold text-ink/70">
                        Hint: {badge.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </main>
    </PageScene>
  );
}
