import React from "react";
import { Fraction } from "./Fraction";

export function renderMath(text: string): React.ReactNode {
  if (!text) return null;
  
  // Look for simple fraction patterns like 1/2 or 3/4 or \frac{1}{2}
  const parts = text.split(/(\b\d+\/\d+\b)/g);
  if (parts.length === 1) return <span>{text}</span>;

  return (
    <span>
      {parts.map((part, i) => {
        if (/^\d+\/\d+$/.test(part)) {
          const [num, den] = part.split("/");
          return <Fraction key={i} num={num} den={den} />;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
}
