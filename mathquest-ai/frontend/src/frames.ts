export const FRAMES = [
  { minLevel: 1, name: "Plain", color: "#FFFFFF" },
  { minLevel: 3, name: "Bronze", color: "#CD7F32" },
  { minLevel: 5, name: "Silver", color: "#C0C8D8" },
  { minLevel: 8, name: "Gold", color: "#FFC83D" },
];

export const frameFor = (level: number) =>
  [...FRAMES].reverse().find((f) => level >= f.minLevel) ?? FRAMES[0];
