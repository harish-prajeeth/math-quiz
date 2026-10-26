import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Shield, Play, Sparkles } from "lucide-react";
import { PageScene } from "../components/PageScene";
import { Hud } from "../components/Hud";
import { MapDecor } from "../components/MapDecor";
import { Panel } from "../components/Panel";
import { useGame } from "../context/GameContext";
import { useProgress } from "../context/ProgressContext";
import { api } from "../services/api";
import type { Mission } from "../types/game";

export default function MapPage() {
  const { state, world } = useGame();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.topics(state.grade)
      .then((data) => {
        if (active) {
          setMissions(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load topics:", err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [state.grade]);

  const worldTitle = state.grade === 6 ? "Space Mission" : "Jungle Quest";
  const bossName = state.grade === 6 ? "Asteroid Beast" : "Vine Guardian";

  return (
    <PageScene>
      <Hud />
      <div className="relative min-h-[calc(100dvh-5rem)] pb-24 overflow-hidden">
        {/* Parallax background decor */}
        <MapDecor world={world} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-6">
          {/* World Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border-[3px] border-ink bg-white text-xs font-bold text-ink mb-1">
                <Sparkles className="w-3.5 h-3.5 text-mango" />
                {worldTitle} • Grade {state.grade}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-paper">
                Georgia Standards Trail
              </h1>
            </div>

            <Link
              to="/"
              className="tile px-4 py-2 bg-white text-sm font-semibold flex items-center gap-2 hover:bg-paper"
            >
              <Shield className="w-4 h-4" />
              Switch World
            </Link>
          </div>

          {loading ? (
            <Panel className="max-w-md mx-auto p-6 text-center mt-12 font-display text-xl">
              Mapping your adventures...
            </Panel>
          ) : (
            <div className="relative py-8">
              {/* Connecting Trail Line */}
              <div
                className="absolute left-1/2 top-12 bottom-12 w-3 -translate-x-1/2 rounded-full border-2 border-ink pointer-events-none"
                style={{
                  backgroundColor: "var(--world-glow)",
                  filter: "drop-shadow(0 0 8px var(--world-glow))",
                }}
              />

              {/* Mission Nodes */}
              <div className="space-y-16 relative">
                {missions.map((m, i) => {
                  const s = progress?.completedMissions?.[m.id] ?? progress?.starsByTopic?.[m.id] ?? 0;
                  const isUnlocked = i === 0 || (progress?.completedMissions?.[missions[i - 1]?.id] ?? 0) > 0 || true; // Friendly access
                  const isLeft = i % 2 === 0;

                  return (
                    <div
                      key={m.id}
                      className={`flex items-center gap-6 ${
                        isLeft ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      {/* Node Button in Center */}
                      <div className="flex-1 flex justify-center">
                        <div className="flex flex-col items-center group">
                          <button
                            type="button"
                            onClick={() => navigate(`/briefing/${m.id}`)}
                            className="tile size-20 rounded-full bg-[var(--world-pop)] grid place-items-center text-ink font-display text-2xl hover:scale-110 active:scale-95 transition-transform relative z-10"
                            aria-label={`Mission ${i + 1}: ${m.title}`}
                          >
                            <span>{i + 1}</span>
                            <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-white border-2 border-ink grid place-items-center">
                              <Play className="w-3.5 h-3.5 fill-ink text-ink ml-0.5" />
                            </div>
                          </button>

                          {/* Paper Chip with Title and Stars */}
                          <div className="panel flex flex-col items-center px-4 py-1.5 mt-3 text-center max-w-[200px] z-10">
                            <span className="text-sm font-bold text-ink leading-tight line-clamp-1">
                              {m.title}
                            </span>
                            <span className="flex gap-0.5 mt-1" aria-hidden="true">
                              {[0, 1, 2].map((n) => (
                                <Star
                                  key={n}
                                  size={16}
                                  stroke="#1B1F4B"
                                  strokeWidth={3}
                                  className={
                                    n < s
                                      ? "fill-[var(--world-pop)] drop-shadow-[0_1px_0_#1B1F4B]"
                                      : "fill-white"
                                  }
                                />
                              ))}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Side description / standard details */}
                      <div className="flex-1 hidden sm:block">
                        <Panel className={`p-4 max-w-xs ${isLeft ? "mr-auto text-left" : "ml-auto text-right"}`}>
                          <div className="text-xs font-bold uppercase tracking-wider text-ink/70">
                            Objective
                          </div>
                          <p className="text-sm font-medium text-ink mt-0.5 line-clamp-2">
                            {m.objective || `Master Georgia standard ${m.title} and battle the ${bossName}!`}
                          </p>
                        </Panel>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageScene>
  );
}
