import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageScene } from "../components/PageScene";
import { Panel } from "../components/Panel";
import { GameButton } from "../components/GameButton";
import { Avatar } from "../art/avatars";
import { useGame } from "../context/GameContext";
import { api } from "../services/api";
import { Sparkles, Compass, Rocket, Lightbulb, Swords } from "lucide-react";

export default function StartPage() {
  const navigate = useNavigate();
  const { state, update } = useGame();
  const [nickname, setNickname] = useState(state.nickname || "Explorer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectGrade = (grade: 5 | 6) => {
    update({ grade });
  };

  const handleSelectAvatar = (id: number) => {
    update({ avatarId: id });
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.createPlayer({
        grade: state.grade,
        nickname: nickname.trim(),
        avatarId: state.avatarId,
      });
      update({ playerId: res.playerId, nickname: nickname.trim() });
      navigate("/map");
    } catch (err: any) {
      console.error("Failed to create player:", err);
      // Fallback: assign a client-generated ID if server error so user can still explore
      const fallbackId = `player_${Date.now()}`;
      update({ playerId: fallbackId, nickname: nickname.trim() });
      navigate("/map");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageScene>
      <div className="min-h-dvh flex items-center justify-center p-4 py-12">
        <Panel className="w-full max-w-xl p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-[3px] border-ink bg-white font-display text-sm">
              <Sparkles className="w-4 h-4 text-mango fill-mango" />
              Georgia Mathematics Quest
            </div>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-ink">
              MathQuest AI
            </h1>
            <p className="text-ink/80 text-lg font-medium">
              Choose your expedition and prepare for battle!
            </p>
          </div>

          <form onSubmit={handleStart} className="space-y-6">
            {/* World Selection */}
            <div className="space-y-2">
              <label className="block font-display text-lg text-ink">
                1. Choose your World
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Jungle World (Grade 5) */}
                <button
                  type="button"
                  onClick={() => handleSelectGrade(5)}
                  className={`tile text-left p-4 rounded-2xl relative overflow-hidden transition-[transform,opacity,border-color] ${
                    state.grade === 5
                      ? "ring-4 ring-lime scale-[1.02]"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: "#0B2E24",
                    color: "#EAF2FF",
                    borderColor: "#1B1F4B",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Compass className="w-5 h-5 text-lime" />
                    <span className="font-display text-lg text-lime">Jungle</span>
                  </div>
                  <div className="text-sm font-bold text-lime/90 mb-2">
                    Grade 5 Quest
                  </div>
                  <p className="text-xs text-paper/80 font-medium">
                    Fractions, Decimals, Volume & the Vine Guardian
                  </p>
                  {state.grade === 5 && (
                    <div className="absolute top-2 right-2 size-3 rounded-full bg-lime" />
                  )}
                </button>

                {/* Space World (Grade 6) */}
                <button
                  type="button"
                  onClick={() => handleSelectGrade(6)}
                  className={`tile text-left p-4 rounded-2xl relative overflow-hidden transition-[transform,opacity,border-color] ${
                    state.grade === 6
                      ? "ring-4 ring-comet scale-[1.02]"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: "#0A0F2E",
                    color: "#EAF2FF",
                    borderColor: "#1B1F4B",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Rocket className="w-5 h-5 text-comet" />
                    <span className="font-display text-lg text-comet">Space</span>
                  </div>
                  <div className="text-sm font-bold text-comet/90 mb-2">
                    Grade 6 Mission
                  </div>
                  <p className="text-xs text-paper/80 font-medium">
                    Ratios, Expressions, Geometry & the Asteroid Beast
                  </p>
                  {state.grade === 6 && (
                    <div className="absolute top-2 right-2 size-3 rounded-full bg-comet" />
                  )}
                </button>
              </div>
            </div>

            {/* Avatar Radio Group */}
            <div className="space-y-2">
              <label className="block font-display text-lg text-ink">
                2. Pick your Avatar
              </label>
              <div
                role="radiogroup"
                aria-label="Avatars"
                className="grid grid-cols-6 gap-2 sm:gap-3"
              >
                {[0, 1, 2, 3, 4, 5].map((id) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={state.avatarId === id}
                    onClick={() => handleSelectAvatar(id)}
                    className={`tile p-1.5 flex items-center justify-center rounded-2xl bg-white transition-transform ${
                      state.avatarId === id
                        ? "scale-110 ring-4 ring-ink bg-paper"
                        : "hover:scale-105 opacity-85"
                    }`}
                  >
                    <Avatar id={id} size={48} />
                  </button>
                ))}
              </div>
            </div>

            {/* Nickname Field */}
            <div className="space-y-1.5">
              <label htmlFor="nickname" className="block font-display text-lg text-ink">
                3. Explorer Nickname
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={18}
                placeholder="e.g. StarVoyager"
                required
                className="w-full px-4 py-3 rounded-xl border-[3px] border-ink bg-white font-semibold text-ink focus:outline-none focus:ring-4 focus:ring-lime"
              />
              <p className="text-xs text-ink/75 font-medium flex items-center gap-1.5">
                <Lightbulb className="size-4 text-mango shrink-0" />
                <span>Use a fun nickname, not your real name.</span>
              </p>
            </div>

            {error && (
              <p className="text-sm font-semibold text-oops bg-oops/10 p-2 rounded-lg border-2 border-oops">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <GameButton
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-4 text-xl"
            >
              <span>Start Adventure</span>
              <Swords className="size-5" />
            </GameButton>
          </form>
        </Panel>
      </div>
    </PageScene>
  );
}
