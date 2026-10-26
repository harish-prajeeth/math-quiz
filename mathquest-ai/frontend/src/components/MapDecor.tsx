export function MapDecor({ world }: { world: "jungle" | "space" }) {
  const dots = Array.from({ length: 24 }, (_, i) => ({
    x: (i * 37) % 100,
    y: (i * 53) % 100,
    r: 1 + (i % 3),
  }));

  return (
    <svg
      className="drift pointer-events-none absolute inset-0 size-full opacity-60"
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {dots.map((d, i) =>
        world === "space" ? (
          <circle key={i} cx={d.x} cy={d.y} r={d.r * 0.25} fill="var(--world-glow)" />
        ) : (
          <ellipse
            key={i}
            cx={d.x}
            cy={d.y}
            rx={d.r * 0.6}
            ry={d.r * 0.3}
            fill="var(--world-glow)"
            transform={`rotate(${i * 25} ${d.x} ${d.y})`}
          />
        )
      )}
    </svg>
  );
}
