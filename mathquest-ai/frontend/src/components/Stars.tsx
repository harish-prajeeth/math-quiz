import { Star } from "lucide-react";

export function Stars({ count, size = 32 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-1 items-center" role="img" aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          size={size}
          stroke="#1B1F4B"
          strokeWidth={3}
          className={`transition-transform duration-300 ${
            i < count
              ? "fill-[var(--world-pop)] scale-110 drop-shadow-[0_2px_0_#1B1F4B]"
              : "fill-white opacity-40"
          }`}
        />
      ))}
    </div>
  );
}
