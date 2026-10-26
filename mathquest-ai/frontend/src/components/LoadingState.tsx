import React from "react";
import { Sparkles } from "lucide-react";
import { Panel } from "./Panel";

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

export function LoadingState({
  message = "Loading your quest...",
  subMessage = "Consulting ancient mathematical scrolls...",
}: LoadingStateProps) {
  return (
    <Panel className="mx-auto mt-20 max-w-md p-8 text-center space-y-4">
      <div className="relative size-16 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-ink/20 border-t-[var(--world-glow)] animate-spin" />
        <Sparkles className="size-6 text-mango" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-2xl text-ink">{message}</h3>
        <p className="text-sm font-medium text-ink/70">{subMessage}</p>
      </div>
    </Panel>
  );
}
