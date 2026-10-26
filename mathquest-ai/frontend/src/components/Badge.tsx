import React from "react";

export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger" | "world";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

export function Badge({
  tone = "neutral",
  size = "md",
  icon,
  className = "",
  children,
  ...rest
}: BadgeProps) {
  const tones: Record<BadgeTone, string> = {
    neutral: "bg-white text-ink border-ink/30",
    primary: "bg-[var(--world-pop)] text-ink border-ink",
    success: "bg-emerald-100 text-emerald-950 border-emerald-600/40",
    warning: "bg-amber-100 text-amber-950 border-amber-600/40",
    danger: "bg-rose-100 text-rose-950 border-rose-600/40",
    world: "bg-[var(--world-glow)]/20 text-paper border-[var(--world-glow)]/50",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-0.5 rounded-full font-bold",
    md: "text-sm px-3.5 py-1 rounded-full font-extrabold",
  };

  return (
    <span
      {...rest}
      className={`inline-flex items-center gap-1.5 border-2 select-none tracking-wide ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
