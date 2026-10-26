import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMotionAllowed } from "../hooks/useMotionAllowed";

export function PageScene({ children }: { children: ReactNode }) {
  const allowed = useMotionAllowed();
  return (
    <motion.div className="arena min-h-dvh"
      initial={allowed ? { clipPath: "circle(0% at 50% 50%)" } : false}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
