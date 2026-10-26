import { useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Check, HelpCircle, X, Zap } from "lucide-react";
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
import { Badge } from "../components/Badge";
import { Hud } from "../components/Hud";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
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
  const [lastDamage, setLastDamage] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [powerupLeft, setPowerupLeft] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [topic, setTopic] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [showIntel, setShowIntel] = useState(false);

  const started = useRef(false); // React StrictMode guard
  const busy = useRef(false);    // Double-click guard

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

    // Load topic intel alongside quiz session
    api.lesson(missionId)
      .then((data) => {
        setTopic(data.topic);
        setLesson(data.lesson);
      })
      .catch(() => {});

    (async () => {
      try {
        const { sessionId: id } = await api.startQuiz(state.playerId!, missionId, state.grade);
        setSessionId(id);
        await loadQuestion(id);
      } catch (e) { handleError(e); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionId, state.playerId, state.grade]);

  async function check() {
    if (phase.name !== "answering" || phase.selected === null || busy.current || !sessionId) return;
    busy.current = true;
    const { q: current, selected } = phase;
    dispatch({ type: "submit" });
    try {
      const result = await api.answer(sessionId, current.questionId, selected);
      const n: string[] = [];
      if (result.difficultyChanged === "up") n.push(`Power up! You're now taking on ${TIER_LABEL[result.difficulty]} questions.`);
      if (result.difficultyChanged === "down") n.push(`Let's warm up on ${TIER_LABEL[result.difficulty]} questions.`);
      if (result.bossHp === 0 && bossHp > 0) n.push("Boss defeated! Finish the quest to claim your bonus stars.");
      setNotes(n);
      setResults((r) => { const copy = [...r]; copy[current.questionNumber - 1] = result.correct; return copy; });

      const damage = Math.max(0, bossHp - result.bossHp);
      if (result.correct) {
        setHits((h) => h + 1);
        setLastDamage(damage > 0 ? damage : 15);
        play(result.combo >= 3 ? "combo" : "hit");
      } else {
        setLastDamage(null);
        play("oops");
      }

      setBossHp(result.bossHp);
      setCombo(result.combo);
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
      play("click");
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
      if (e.key === "Enter" && e.target instanceof HTMLButtonElement) return;
      const i = "abcd".indexOf(e.key.toLowerCase());
      if (i >= 0 && e.key.length === 1 && phase.name === "answering") {
        dispatch({ type: "select", index: i });
      }
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
    return (
      <PageScene>
        <Hud />
        <LoadingState
          message="Loading your quest..."
          subMessage="Summoning mathematical scrolls and boss arena..."
        />
      </PageScene>
    );
  }

  if (phase.name === "expired") {
    return (
      <PageScene>
        <Hud />
        <ErrorState
          title="Your quest timed out"
          message="Your session has concluded. Return to the briefing room to start a fresh adventure."
          actionLabel="Start New Quest"
          onRetry={() => navigate(`/briefing/${missionId}`)}
        />
      </PageScene>
    );
  }

  if (phase.name === "error") {
    return (
      <PageScene>
        <Hud />
        <ErrorState
          title="We couldn't load your quest"
          message={phase.message}
          actionLabel="Try Again"
          onRetry={() => window.location.reload()}
        />
      </PageScene>
    );
  }

  if (!q) return null;

  const feedback = phase.name === "feedback" ? phase.result : null;

  return (
    <PageScene>
      <Hud />

      <main className="mx-auto max-w-5xl px-4 pb-80 pt-4 space-y-6">
        {/* Section A: Quest Header */}
        <section aria-label="Quest Header" className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/map"
              aria-label="Return to Map"
              className="tile inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-ink text-sm font-bold cursor-pointer hover:bg-slate-100"
            >
              <ArrowLeft className="size-4" />
              <span>Map</span>
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone="world" size="sm">
                  {world === "space" ? "Space Mission" : "Jungle Quest"}
                </Badge>
                <Badge tone="neutral" size="sm">
                  Grade {state.grade}
                </Badge>
                {topic?.standardCode && (
                  <Badge tone="primary" size="sm">
                    {topic.standardCode}
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-xl sm:text-2xl text-paper mt-1">
                {topic?.title || "Quest Challenge"}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowIntel((prev) => !prev)}
            className={`tile inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold cursor-pointer ${
              showIntel ? "bg-[var(--world-pop)] text-ink" : "bg-white text-ink hover:bg-slate-100"
            }`}
          >
            <HelpCircle className="size-4" />
            <span>Mission Intel</span>
          </button>
        </section>

        {/* Section D: Contextual Learning Panel (Expandable Drawer) */}
        {showIntel && (
          <Panel className="p-4 sm:p-5 bg-white border-3 border-ink rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-mango" />
                <h3 className="font-display text-lg text-ink">Mission Intel & Strategy</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIntel(false)}
                className="text-xs font-bold text-ink/70 hover:text-ink px-2 py-1"
              >
                Close
              </button>
            </div>
            <p className="text-sm font-medium text-ink/80 leading-relaxed">
              {topic?.objective || "Apply mathematical concepts carefully to defeat the boss."}
            </p>
            {lesson?.explanation && (
              <div className="p-3 bg-amber-50 rounded-xl border-2 border-amber-300 text-sm font-medium text-ink">
                <div className="font-bold text-xs text-amber-900 mb-1">Concept Guide:</div>
                <div>{renderMath(lesson.explanation)}</div>
              </div>
            )}
          </Panel>
        )}

        {/* Section B & C: Main Grid (Boss & Questions) */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Section B: Boss Combat Arena & Gauge */}
          <aside className="space-y-4">
            <Panel className="p-4 bg-slate-900/60 border-2 border-white/20 text-paper">
              <Boss world={world} hits={hits} defeated={bossHp === 0} lastDamage={lastDamage} />
              <div className="mt-3">
                <BossBar name={bossName} hp={bossHp} />
              </div>
            </Panel>

            <div className="flex items-center justify-between gap-2 p-3 bg-black/25 rounded-2xl border-2 border-white/20">
              <DifficultyGauge difficulty={q.difficulty} />
              <ComboMeter combo={combo} />
            </div>
          </aside>

          {/* Section C: Progress Trail & Question Card */}
          <section className="space-y-5">
            <ProgressTrail total={q.totalQuestions} current={q.questionNumber - 1} results={results} />

            <Panel className="p-6">
              <div className="flex items-center justify-between text-xs font-bold text-ink/60 mb-2">
                <span>Question {q.questionNumber} of {q.totalQuestions}</span>
                <span>Tier: {TIER_LABEL[q.difficulty]}</span>
              </div>
              <div className="text-2xl font-semibold leading-snug sm:text-3xl text-ink">
                {renderMath(q.question)}
              </div>
            </Panel>

            <div className="grid gap-3.5" role="group" aria-label="Answers">
              {q.options.map((text, i) => (
                <AnswerTile
                  key={i}
                  letter={"ABCD"[i]}
                  text={text}
                  state={tileState(i)}
                  disabled={phase.name !== "answering"}
                  onClick={() => dispatch({ type: "select", index: i })}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Section E: Sticky Controls & Feedback Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none">
        <div className="mx-auto max-w-5xl pointer-events-auto">
          {feedback ? (
            <Panel className="p-5" role="status">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 font-display text-2xl text-ink">
                  {feedback.correct ? (
                    <>
                      <span className="size-8 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center text-emerald-700">
                        <Check className="size-5" />
                      </span>
                      <span>Direct hit! +{feedback.pointsAwarded} XP</span>
                    </>
                  ) : (
                    <>
                      <span className="size-8 rounded-full bg-rose-100 border-2 border-rose-600 flex items-center justify-center text-rose-700">
                        <X className="size-5" />
                      </span>
                      <span>Not quite. Here's how it works:</span>
                    </>
                  )}
                </div>

                {combo >= 2 && feedback.correct && (
                  <span className="font-display text-sm bg-[var(--world-pop)] text-ink px-3 py-1 rounded-full border-2 border-ink">
                    Combo x{combo}!
                  </span>
                )}
              </div>

              {/* Step-by-step worked explanation */}
              <div className="mt-3 p-3.5 bg-slate-50 border-2 border-ink/20 rounded-xl text-base leading-relaxed text-ink">
                <div className="font-bold text-xs text-ink/70 mb-1">Step-by-step explanation:</div>
                <div>{renderMath(feedback.explanation)}</div>
              </div>

              {notes.map((n) => (
                <div key={n} className="mt-2.5 px-3 py-1.5 rounded-lg bg-[var(--world-glow)]/15 border-2 border-[var(--world-glow)] text-sm font-bold text-ink">
                  {n}
                </div>
              ))}

              <GameButton className="mt-4 w-full" onClick={() => void next()}>
                <span>{feedback.quizComplete ? "Claim Victory & See Results" : "Next Question (Press Enter)"}</span>
              </GameButton>
            </Panel>
          ) : (
            <div className="flex gap-3">
              <GameButton
                variant="secondary"
                disabled={!powerupLeft || phase.name !== "answering"}
                onClick={() => void fiftyFifty()}
                title={powerupLeft ? "Eliminate two incorrect options" : "50/50 already used"}
                className="shrink-0"
              >
                <Zap className={`size-4 ${powerupLeft ? "text-amber-500" : "text-gray-400"}`} />
                <span>{powerupLeft ? "50/50" : "Used"}</span>
              </GameButton>

              <GameButton
                className="flex-1"
                loading={phase.name === "submitting"}
                disabled={phase.name !== "answering" || phase.selected === null}
                onClick={() => void check()}
              >
                Check answer
              </GameButton>
            </div>
          )}
        </div>
      </div>
    </PageScene>
  );
}
