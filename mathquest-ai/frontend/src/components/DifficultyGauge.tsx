import type { Difficulty } from "../types/game";

const ORDER: Difficulty[] = ["rookie", "pro", "champion"];
export const TIER_LABEL: Record<Difficulty, string> = { rookie: "Rookie", pro: "Pro", champion: "Champion" };

export function DifficultyGauge({ difficulty }: { difficulty: Difficulty }) {
  const level = ORDER.indexOf(difficulty);
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`Power tier: ${TIER_LABEL[difficulty]}`}>
      <div className="flex gap-1">
        {ORDER.map((d, i) => (
          <span key={d} className={`h-4 w-7 rounded-sm border-[3px] border-paper ${i <= level ? "glow bg-[var(--world-glow)]" : "bg-transparent"}`} />
        ))}
      </div>
      <span className="font-semibold text-paper">{TIER_LABEL[difficulty]}</span>
    </div>
  );
}
