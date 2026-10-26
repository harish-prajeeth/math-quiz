import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, api } from "../services/api";
import type { Progress } from "../types/game";
import { useGame } from "./GameContext";

const Ctx = createContext<{ progress: Progress | null; refresh: () => Promise<void> } | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { state, update } = useGame();
  const [progress, setProgress] = useState<Progress | null>(null);

  const refresh = useCallback(async () => {
    if (!state.playerId) return;
    try {
      setProgress(await api.progress(state.playerId));
    } catch (e) {
      // The server forgot this player (for example after a restart): start over
      if (e instanceof ApiError && e.code === "PLAYER_NOT_FOUND") update({ playerId: null });
    }
  }, [state.playerId, update]);

  useEffect(() => { void refresh(); }, [refresh]);

  const value = useMemo(() => ({ progress, refresh }), [progress, refresh]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProgress must be used inside ProgressProvider");
  return v;
}
