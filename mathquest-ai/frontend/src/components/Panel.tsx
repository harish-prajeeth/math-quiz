import type { ComponentProps } from "react";

export function Panel({ className = "", ...rest }: ComponentProps<"div">) {
  return <div {...rest} className={`panel ${className}`} />;
}
