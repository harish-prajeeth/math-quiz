import { useEffect, useRef, useState } from "react";
import { useMotionAllowed } from "./useMotionAllowed";

export function useCountUp(target: number, ms = 700) {
  const allowed = useMotionAllowed();
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    if (!allowed) { setValue(target); from.current = target; return; }
    const begin = from.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const v = Math.round(begin + (target - begin) * (1 - Math.pow(1 - t, 3)));
      setValue(v);
      from.current = v;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, allowed, ms]);

  return value;
}
