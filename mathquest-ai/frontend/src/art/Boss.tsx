import { motion } from "framer-motion";
import { useMotionAllowed } from "../hooks/useMotionAllowed";

const S = { stroke: "#1B1F4B", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Eyes({ defeated }: { defeated: boolean }) {
  if (defeated) {
    return <path d="M56 56l12 12M68 56L56 68M92 56l12 12M104 56L92 68" fill="none" {...S} />;
  }
  return (
    <g>
      <circle cx="62" cy="62" r="7" fill="#fff" {...S} />
      <circle cx="98" cy="62" r="7" fill="#fff" {...S} />
      <circle cx="62" cy="62" r="3" fill="#1B1F4B" />
      <circle cx="98" cy="62" r="3" fill="#1B1F4B" />
    </g>
  );
}

function VineGuardian({ defeated }: { defeated: boolean }) {
  return (
    <>
      <path d="M30 124 Q8 84 28 50" fill="none" stroke="#0E7A4F" strokeWidth="9" strokeLinecap="round" />
      <path d="M130 124 Q152 84 132 50" fill="none" stroke="#0E7A4F" strokeWidth="9" strokeLinecap="round" />
      <circle cx="80" cy="76" r="48" fill="#2DBE75" {...S} />
      <path d="M52 34 Q60 10 70 30 M90 30 Q100 8 108 34" fill="#7CFF6B" {...S} />
      <Eyes defeated={defeated} />
      <path d={defeated ? "M64 96 Q80 90 96 96" : "M60 90 Q80 108 100 90"} fill="none" {...S} />
    </>
  );
}

function AsteroidBeast({ defeated }: { defeated: boolean }) {
  return (
    <>
      <path d="M34 90 L26 58 L50 30 L88 24 L122 44 L134 82 L110 114 L64 120 Z" fill="#7B86B5" {...S} />
      <circle cx="52" cy="100" r="7" fill="#5C6692" {...S} />
      <circle cx="112" cy="90" r="5" fill="#5C6692" {...S} />
      <Eyes defeated={defeated} />
      <path d={defeated ? "M60 96 L72 92 L84 96 L96 92 L108 96" : "M58 90 L70 100 L82 90 L94 100 L106 90"} fill="none" {...S} />
    </>
  );
}

export function Boss({
  world,
  hits,
  defeated,
  lastDamage,
}: {
  world: "jungle" | "space";
  hits: number;
  defeated: boolean;
  lastDamage?: number | null;
}) {
  const allowed = useMotionAllowed();
  const name = world === "space" ? "Asteroid Beast" : "Vine Guardian";
  return (
    <div className="relative">
      <motion.div
        key={hits}
        initial={{ x: 0 }}
        animate={hits > 0 && allowed ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className={defeated ? "opacity-60 grayscale" : ""}
      >
        <svg
          viewBox="0 0 160 140"
          role="img"
          aria-label={`${name}${defeated ? ", defeated" : ""}`}
          className="mx-auto h-28 lg:h-56"
        >
          {world === "space" ? (
            <AsteroidBeast defeated={defeated} />
          ) : (
            <VineGuardian defeated={defeated} />
          )}
        </svg>
      </motion.div>
      {lastDamage != null && lastDamage > 0 && (
        <motion.div
          key={`dmg-${hits}`}
          initial={{ opacity: 1, y: 0, scale: 0.8 }}
          animate={{ opacity: 0, y: -40, scale: 1.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 font-display text-2xl font-black text-oops"
        >
          -{lastDamage} HP
        </motion.div>
      )}
    </div>
  );
}
