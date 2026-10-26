import React, { type ComponentProps } from "react";

export type PanelVariant = "paper" | "dark" | "translucent";

export interface PanelProps extends ComponentProps<"div"> {
  variant?: PanelVariant;
}

export function Panel({
  variant = "paper",
  className = "",
  children,
  ...rest
}: PanelProps) {
  const variantClass =
    variant === "dark"
      ? "panel-dark"
      : variant === "translucent"
      ? "bg-[#0B1528] border-3 border-slate-600/50 text-paper rounded-[24px]"
      : "panel";

  return (
    <div {...rest} className={`${variantClass} ${className}`}>
      {children}
    </div>
  );
}
