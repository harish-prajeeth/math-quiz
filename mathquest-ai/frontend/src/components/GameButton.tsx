import React from "react";
import { motion } from "framer-motion";
import { sounds } from "../utils/audio";
import { useMotionAllowed } from "../hooks/useMotionAllowed";

export type ButtonVariant = "primary" | "secondary" | "accent" | "danger" | "ghost" | "space";
export type ButtonSize = "sm" | "md" | "lg";

export interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  tone?: ButtonVariant; // Backward compatibility with tone
  size?: ButtonSize;
  loading?: boolean;
}

export const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  (
    {
      variant,
      tone,
      size = "md",
      loading = false,
      className = "",
      disabled,
      onClick,
      children,
      ...rest
    },
    ref
  ) => {
    const motionAllowed = useMotionAllowed();
    const effectiveVariant: ButtonVariant = variant || tone || "primary";

    const variantClasses: Record<ButtonVariant, string> = {
      primary: "bg-[var(--world-pop)] text-ink hover:brightness-105 active:brightness-95",
      secondary: "bg-white text-ink hover:bg-slate-50",
      accent: "bg-[var(--world-glow)] text-ink hover:brightness-105",
      danger: "bg-oops text-white hover:brightness-110",
      ghost: "bg-transparent text-paper border-transparent shadow-none hover:bg-white/10 active:translate-y-0",
      space: "bg-comet text-ink hover:brightness-105",
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: "min-h-10 px-4 py-1.5 text-sm font-semibold rounded-xl",
      md: "min-h-12 sm:min-h-14 px-6 py-2.5 sm:py-3 text-base sm:text-lg font-bold rounded-2xl",
      lg: "min-h-14 sm:min-h-16 px-8 py-3.5 sm:py-4 text-lg sm:text-xl font-display rounded-2xl",
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      sounds.playClick();
      if (onClick) onClick(e);
    };

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        onClick={handleClick}
        whileTap={motionAllowed && !disabled && !loading ? { y: 3 } : undefined}
        className={`tile inline-flex items-center justify-center gap-2 select-none cursor-pointer text-center font-bold disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[effectiveVariant]} ${sizeClasses[size]} ${className}`}
        {...(rest as any)}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Working...</span>
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

GameButton.displayName = "GameButton";
