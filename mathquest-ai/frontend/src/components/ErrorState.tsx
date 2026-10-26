import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Panel } from "./Panel";
import { GameButton } from "./GameButton";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionLabel?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered a momentary disturbance in the mathematical realm.",
  onRetry,
  actionLabel = "Try Again",
}: ErrorStateProps) {
  return (
    <Panel className="mx-auto mt-20 max-w-md p-8 text-center space-y-5">
      <div className="size-16 rounded-2xl bg-oops/10 border-2 border-oops flex items-center justify-center mx-auto text-oops">
        <AlertCircle className="size-8" />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-display text-2xl text-ink">{title}</h3>
        <p className="text-sm font-medium text-ink/70 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <GameButton variant="primary" onClick={onRetry} className="w-full">
          <RotateCcw className="size-5" />
          <span>{actionLabel}</span>
        </GameButton>
      )}
    </Panel>
  );
}
