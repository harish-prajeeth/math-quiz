export function ComboMeter({ combo }: { combo: number }) {
  const hot = combo >= 3;
  return (
    <div className={`rounded-full border-[3px] border-ink px-3 py-1 font-display text-lg text-ink ${hot ? "glow bg-[var(--world-pop)]" : "bg-white"}`}>
      Combo x{combo}
    </div>
  );
}
