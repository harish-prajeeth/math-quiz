import { Check, X } from "lucide-react";
import { renderMath } from "./math";

export type TileState = "idle" | "selected" | "correct" | "wrong" | "dim" | "removed";

const styles: Record<TileState, string> = {
  idle: "bg-white",
  selected: "bg-[var(--world-pop)]",
  correct: "bg-correct",
  wrong: "bg-oops",
  dim: "bg-white opacity-60",
  removed: "bg-white opacity-25 line-through",
};

export function AnswerTile(props: { letter: string; text: string; state: TileState; disabled?: boolean; onClick: () => void }) {
  const { letter, text, state, disabled, onClick } = props;
  return (
    <button type="button" onClick={onClick} disabled={disabled || state === "removed"}
      aria-pressed={state === "selected"}
      className={`tile flex min-h-16 w-full items-center gap-4 px-4 py-3 text-left text-xl font-semibold cursor-pointer ${styles[state]}`}>
      <span className="grid size-10 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-paper font-display text-ink">{letter}</span>
      <span className="flex-1">{renderMath(text)}</span>
      {state === "correct" && (<><Check aria-hidden /><span className="sr-only">Correct</span></>)}
      {state === "wrong" && (<><X aria-hidden /><span className="sr-only">Not quite</span></>)}
      {state === "removed" && <span className="sr-only">Removed by 50/50</span>}
    </button>
  );
}
