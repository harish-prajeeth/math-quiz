export function Fraction({ num, den }: { num: string | number; den: string | number }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-[0.85em] leading-none">
      <span className="border-b-2 border-ink px-1 pb-0.5">{num}</span>
      <span className="px-1 pt-0.5">{den}</span>
    </span>
  );
}
