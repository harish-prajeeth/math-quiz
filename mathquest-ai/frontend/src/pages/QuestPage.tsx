import { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { ApiError, api } from "../services/api";
import type { AnswerResult, Question } from "../types/game";
import { useGame } from "../context/GameContext";
import { useSound } from "../hooks/useSound";
import { AnswerTile, type TileState } from "../components/AnswerTile";
import { Boss } from "../art/Boss";
import { BossBar } from "../components/BossBar";
import { ComboMeter } from "../components/ComboMeter";
import { DifficultyGauge, TIER_LABEL } from "../components/DifficultyGauge";
import { GameButton } from "../components/GameButton";
import { Hud } from "../components/Hud";
import { PageScene } from "../components/PageScene";
import { Panel } from "../components/Panel";
import { ProgressTrail } from "../components/ProgressTrail";
import { renderMath } from "../components/math";

type Phase =
  | { name: "loading" }
  | { name: "answering"; q: Question; selected: number | null; hidden: number[] }
  | { name: "submitting"; q: Question; selected: number; hidden: number[] }
  | { name: "feedback"; q: Question; selected: number; hidden: number[]; result: AnswerResult }
  | { name: "expired" }
  | { name: "error"; message: string };

type Action =
  | { type: "loading" }
  | { type: "loaded"; q: Question }
  | { type: "select"; index: number }
  | { type: "hide"; hidden: number[] }
  | { type: "submit" }
  | { type: "answered"; result: AnswerResult }
  | { type: "expired" }
  | { type: "failed"; message: string };

export function reducer(s: Phase, a: Action): Phase {
  switch (a.type) {
    case "loading": return { name: "loading" };
    case "loaded": return { name: "answering", q: a.q, selected: null, hidden: a.q.hiddenOptions ?? [] };
    case "select":
      return s.name === "answering" && !s.hidden.includes(a.index) ? { ...s, selected: a.index } : s;
    case "hide":
      return s.name === "answering"
        ? { ...s, hidden: a.hidden, selected: s.selected !== null && a.hidden.includes(s.selected) ? null : s.selected }
        : s;
    case "submit":
      return s.name === "answering" && s.selected !== null
        ? { name: "submitting", q: s.q, selected: s.selected, hidden: s.hidden } : s;
    case "answered":
      return s.name === "submitting"
        ? { name: "feedback", q: s.q, selected: s.selected, hidden: s.hidden, result: a.result } : s;
    case "expired": return { name: "expired" };
    case "failed": return { name: "error", message: a.message };
  }
}

export default function QuestPage() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const { state, world } = useGame();
  const play = useSound();

  const [phase, dispatch] = useReducer(reducer, { name: "loading" } as Phase);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [results, setResults] = useState<(boolean | undefined)[]>([]);
  const [bossHp, setBossHp] = useState(100);
  const [hits, setHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [powerupLeft, setPowerupLeft] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const started = useRef(false); // React StrictMode mounts twice in dev: never start two sessions
  const busy = useRef(false);    // second guard against double clicks

  const bossName = world === "space" ? "Asteroid Beast" : "Vine Guardian";
  const q = phase.name === "answering" || phase.name === "submitting" || phase.name === "feedback" ? phase.q : null;

  function handleError(e: unknown) {
    if (e instanceof ApiError && e.code === "SESSION_EXPIRED") dispatch({ type: "expired" });
    else dispatch({ type: "failed", message: e instanceof Error ? e.message : "Something went wrong." });
  }

  async function loadQuestion(id: string) {
    const next = await api.currentQuestion(id);
    setPowerupLeft(next.powerupAvailable);
    dispatch({ type: "loaded", q: next });
  }

  useEffect(() => {
    if (started.current || !missionId || !state.playerId) return;
    started.current = true;
    (async () => {
      try {
        const { sessionId: id } = await api.startQuiz(state.playerId!, missionId);
        setSessionId(id);
        await loadQuestion(id);
      } catch (e) { handleError(e); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionId, state.playerId]);

  async function check() {
    if (phase.name !== "answering" || phase.selected === null || busy.current || !sessionId) return;
    busy.current = true;
    const { q: current, selected } = phase;
    dispatch({ type: "submit" });
    try {
      const result = await api.answer(sessionId, current.questionId, selected);
      const n: string[] = [];
      if (result.difficultyChanged === "up") n.push(`Power up. You're on ${TIER_LABEL[result.difficulty]} questions.`);
      if (result.difficultyChanged === "down") n.push(`Let's warm up on ${TIER_LABEL[result.difficulty]} questions.`);
      if (result.bossHp === 0 && bossHp > 0) n.push("Boss defeated. Finish the quest to earn bonus stars.");
      setNotes(n);
      setResults((r) => { const copy = [...r]; copy[current.questionNumber - 1] = result.correct; return copy; });
      setBossHp(result.bossHp);
      setCombo(result.combo);
      if (result.correct) { setHits((h) => h + 1); play(result.combo >= 3 ? "combo" : "hit"); }
      else play("oops");
      if (result.difficultyChanged) play("tier");
      dispatch({ type: "answered", result });
    } catch (e) { handleError(e); }
    finally { busy.current = false; }
  }

  async function fiftyFifty() {
    if (phase.name !== "answering" || !sessionId || !powerupLeft || busy.current) return;
    busy.current = true;
    try {
      const { hidden } = await api.powerup(sessionId, phase.q.questionId);
      dispatch({ type: "hide", hidden });
      setPowerupLeft(false);
    } catch (e) { handleError(e); }
    finally { busy.current = false; }
  }

  async function next() {
    if (phase.name !== "feedback" || !sessionId) return;
    if (phase.result.quizComplete) { navigate(`/victory/${sessionId}`); return; }
    dispatch({ type: "loading" });
    try { await loadQuestion(sessionId); } catch (e) { handleError(e); }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.target instanceof HTMLButtonElement) return; // the focused button handles it
      const i = "abcd".indexOf(e.key.toLowerCase());
      if (i >= 0 && e.key.length === 1) dispatch({ type: "select", index: i });
      if (e.key === "Enter") {
        if (phase.name === "answering") void check();
        else if (phase.name === "feedback") void next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function tileState(i: number): TileState {
    if (phase.name === "answering") {
      if (phase.hidden.includes(i)) return "removed";
      return phase.selected === i ? "selected" : "idle";
    }
    if (phase.name === "submitting") return phase.selected === i ? "selected" : phase.hidden.includes(i) ? "removed" : "dim";
    if (phase.name === "feedback") {
      if (i === phase.result.correctIndex) return "correct";
      if (i === phase.selected) return "wrong";
      return phase.hidden.includes(i) ? "removed" : "dim";
    }
    return "idle";
  }

  if (phase.name === "loading") {
    return <PageScene><Hud /><Panel className="mx-auto mt-24 max-w-md p-6 text-center">Loading your quest...</Panel></PageScene>;
  }
  if (phase.name === "expired") {
    return (
      <PageScene><Hud />
        <Panel className="mx-auto mt-24 max-w-md p-6 text-center">
          <p className="font-display text-2xl">Your quest timed out.</p>
          <GameButton className="mt-4" onClick={() => navigate(`/briefing/${missionId}`)}>Start a new quest</GameButton>
        </Panel>
      </PageScene>
    );
  }
  if (phase.name === "error") {
    return (
      <PageScene><Hud />
        <Panel className="mx-auto mt-24 max-w-md p-6 text-center">
          <p className="font-display text-2xl">We couldn't load your quest.</p>
          <p className="mt-2">{phase.message}</p>
          <GameButton className="mt-4" onClick={() => window.location.reload()}>Try again</GameButton>
        </Panel>
      </PageScene>
    );
  }
  if (!q) return null;

  const feedback = phase.name === "feedback" ? phase.result : null;

  return (
    <PageScene>
      <Hud />
      <main className="mx-auto grid max-w-5xl gap-6 px-4 pb-80 pt-4 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-3">
          <Boss world={world} hits={hits} defeated={bossHp === 0} />
          <BossBar name={bossName} hp={bossHp} />
          <div className="flex items-center justify-between gap-2">
            <DifficultyGauge difficulty={q.difficulty} />
            <ComboMeter combo={combo} />
          </div>
        </aside>

        <section>
          <ProgressTrail total={q.totalQuestions} current={q.questionNumber - 1} results={results} />
          <Panel className="mt-5 p-5">
            <p className="text-2xl font-semibold leading-snug lg:text-3xl">{renderMath(q.question)}</p>
          </Panel>
          <div className="mt-5 grid gap-4" role="group" aria-label="Answers">
            {q.options.map((text, i) => (
              <AnswerTile key={i} letter={"ABCD"[i]} text={text} state={tileState(i)}
                disabled={phase.name !== "answering"} onClick={() => dispatch({ type: "select", index: i })} />
            ))}
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-5xl">
          {feedback ? (
            <Panel className="p-4" role="status">
              <p className="flex items-center gap-2 font-display text-2xl">
                {feedback.correct
                  ? <><Check aria-hidden /> Direct hit! +{feedback.pointsAwarded} XP</>
                  : <><X aria-hidden /> Not quite. Here's how it works.</>}
              </p>
              <p className="mt-2 text-lg leading-snug">{renderMath(feedback.explanation)}</p>
              {notes.map((n) => <p key={n} className="mt-2 font-semibold">{n}</p>)}
              <GameButton className="mt-3 w-full" onClick={() => void next()}>
                {feedback.quizComplete ? "See results" : "Next question"}
              </GameButton>
            </Panel>
          ) : (
            <div className="flex gap-3">
              <GameButton variant="secondary" disabled={!powerupLeft || phase.name !== "answering"} onClick={() => void fiftyFifty()}>
                50/50
              </GameButton>
              <GameButton className="flex-1" loading={phase.name === "submitting"}
                disabled={phase.name !== "answering" || phase.selected === null} onClick={() => void check()}>
                Check answer
              </GameButton>
            </div>
          )}
        </div>
      </div>
    </PageScene>
  );
}
