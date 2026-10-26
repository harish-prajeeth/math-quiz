export function ProgressTrail(props: { total: number; current: number; results: (boolean | null | undefined)[] }) {
  const { total, current, results } = props;
  return (
    <ol className="flex items-center" aria-label={`Question ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const fill = results[i] === true ? "bg-correct" : results[i] === false ? "bg-oops"
          : i === current ? "bg-[var(--world-pop)]" : "bg-white";
        return (
          <li key={i} className="flex flex-1 items-center last:flex-none">
            <span className={`grid size-7 place-items-center rounded-full border-[3px] border-paper text-xs font-semibold text-ink ${fill}`}>{i + 1}</span>
            {i < total - 1 && <span className="h-[3px] flex-1 bg-paper/60" />}
          </li>
        );
      })}
    </ol>
  );
}
