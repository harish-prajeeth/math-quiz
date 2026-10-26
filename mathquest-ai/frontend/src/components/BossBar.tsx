export function BossBar({ name, hp }: { name: string; hp: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between font-display text-lg text-paper">
        <span>{name}</span>
        <span className="tabular-nums">{hp}%</span>
      </div>
      <div role="progressbar" aria-label={`${name} health`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={hp}
           className="h-7 overflow-hidden rounded-full border-[3px] border-paper bg-black/40">
        <div className="h-full bg-oops transition-[width] duration-500" style={{ width: `${hp}%` }} />
      </div>
    </div>
  );
}
