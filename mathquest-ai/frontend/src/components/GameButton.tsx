import type { ComponentProps } from "react";

type Props = ComponentProps<"button"> & { variant?: "primary" | "secondary"; loading?: boolean };

export function GameButton({ variant = "primary", loading, className = "", children, disabled, ...rest }: Props) {
  const bg = variant === "primary" ? "bg-[var(--world-pop)]" : "bg-white";
  return (
    <button type="button" {...rest} disabled={disabled || loading}
      className={`tile min-h-14 px-6 py-3 text-lg font-semibold disabled:opacity-50 ${bg} ${className}`}>
      {loading ? "Working..." : children}
    </button>
  );
}
