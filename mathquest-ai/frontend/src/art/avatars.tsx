const SKINS = ["#FFB627", "#7CFF6B", "#5BE1E6", "#FF6B9A", "#B79CFF", "#FF8A5B"];
const S = { stroke: "#1B1F4B", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function Avatar({ id, size = 48 }: { id: number; size?: number }) {
  const mouth = ["M16 30 Q24 38 32 30", "M17 31 L31 31", "M16 29 Q24 35 32 29"][id % 3];
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill={SKINS[id % SKINS.length]} {...S} />
      <circle cx="17" cy="21" r="3" fill="#1B1F4B" />
      <circle cx="31" cy="21" r="3" fill="#1B1F4B" />
      <path d={mouth} fill="none" {...S} />
    </svg>
  );
}
