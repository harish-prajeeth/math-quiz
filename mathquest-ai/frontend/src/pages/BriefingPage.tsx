import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Play, BookOpen, Lightbulb, AlertTriangle, Sparkles } from "lucide-react";
import { PageScene } from "../components/PageScene";
import { Hud } from "../components/Hud";
import { Panel } from "../components/Panel";
import { GameButton } from "../components/GameButton";
import { renderMath } from "../components/math";
import { useSpeech } from "../hooks/useSpeech";
import { api } from "../services/api";

export default function BriefingPage() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const { speak, stop, speaking } = useSpeech();

  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!missionId) return;
    setLoading(false);
    api.lesson(missionId)
      .then((data) => {
        setTopic(data.topic);
        setLesson(data.lesson);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading lesson:", err);
        setLoading(false);
      });
  }, [missionId]);

  const slides = lesson
    ? [
        {
          tag: "Core Concept",
          icon: <BookOpen className="w-5 h-5 text-mango" />,
          title: "Mission Briefing",
          body: lesson.explanation,
          tip: `Master Georgia standard ${topic?.standardCode || "GSE"} for this quest.`,
        },
        {
          tag: "Step-by-Step",
          icon: <Lightbulb className="w-5 h-5 text-lime" />,
          title: "Strategy Blueprint",
          body: Array.isArray(lesson.workedExample?.steps)
            ? lesson.workedExample.steps.join("\n\n")
            : "Follow each calculation step carefully.",
          tip: "Write out intermediate calculations on scratch paper.",
        },
        {
          tag: "Worked Example",
          icon: <Sparkles className="w-5 h-5 text-comet" />,
          title: "Practice Walkthrough",
          body: `Problem: ${lesson.workedExample?.problem || "Solve the equation"}\n\nSolution: ${lesson.workedExample?.answer || "Complete"}`,
          tip: "Observe how each term is aligned.",
        },
        {
          tag: "Common Traps",
          icon: <AlertTriangle className="w-5 h-5 text-oops" />,
          title: "Watch Out!",
          body: `Common Mistake: ${lesson.commonMistake?.mistake || "Rushing calculation"}\n\nPro Strategy: ${lesson.commonMistake?.correction || "Double check work"}`,
          tip: "Avoid negative signs or misplaced decimals!",
        },
      ]
    : [];

  const currentSlide = slides[slideIndex] || {
    tag: "Concept",
    icon: <BookOpen className="w-5 h-5 text-mango" />,
    title: topic?.title || "Mission",
    body: "Prepare to engage in this mathematical quest.",
    tip: "Every correct answer deals direct damage to the boss!",
  };

  const handleReadAloud = () => {
    if (speaking) {
      stop();
    } else {
      speak(`${currentSlide.title}. ${currentSlide.body}. Strategy tip: ${currentSlide.tip}`);
    }
  };

  return (
    <PageScene>
      <Hud />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Navigation & Topic Header */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/map")}
            className="tile px-4 py-2 bg-white flex items-center gap-2 font-semibold text-ink"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </button>

          <button
            type="button"
            onClick={handleReadAloud}
            className={`tile px-4 py-2 flex items-center gap-2 font-semibold ${
              speaking ? "bg-lime text-ink" : "bg-white text-ink"
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {speaking ? "Stop Narration" : "Read Aloud"}
          </button>
        </div>

        {loading ? (
          <Panel className="p-8 text-center font-display text-2xl">
            Assembling Mission Intel...
          </Panel>
        ) : (
          <div className="space-y-6">
            {/* Mission Title Header */}
            <div className="text-center space-y-1">
              <span className="inline-block px-3 py-1 rounded-full border-[3px] border-ink bg-[var(--world-pop)] font-display text-xs text-ink">
                Standard {topic?.standardCode || "GSE"}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-paper">
                {topic?.title || "Math Mission"}
              </h1>
              <p className="text-paper/80 font-medium">
                {topic?.objective || "Review the briefing slides before engaging the boss."}
              </p>
            </div>

            {/* Slide Player in Panel */}
            <Panel className="p-6 sm:p-8 space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b-2 border-ink/20 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl border-2 border-ink bg-white">
                    {currentSlide.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ink/70">
                      Slide {slideIndex + 1} of {slides.length || 1} • {currentSlide.tag}
                    </span>
                    <h2 className="font-display text-2xl text-ink">
                      {currentSlide.title}
                    </h2>
                  </div>
                </div>

                {/* Slide indicator dots */}
                <div className="flex gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSlideIndex(i)}
                      className={`size-3 rounded-full border-2 border-ink transition-all ${
                        i === slideIndex ? "bg-[var(--world-pop)] scale-125" : "bg-white"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Slide Body */}
              <div className="min-h-[160px] flex flex-col justify-center">
                <div className="text-lg sm:text-xl font-medium leading-relaxed text-ink whitespace-pre-line">
                  {renderMath(currentSlide.body)}
                </div>
              </div>

              {/* Pro Tip Box */}
              <div className="p-4 rounded-2xl border-2 border-ink bg-white flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-mango shrink-0 mt-0.5" />
                <div className="text-sm font-semibold text-ink">
                  <span className="font-display">Coach's Tip: </span>
                  {currentSlide.tip}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-ink/20">
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={slideIndex === 0}
                    onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
                    className="tile px-4 py-2 bg-white font-semibold disabled:opacity-40 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={slideIndex >= slides.length - 1}
                    onClick={() => setSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
                    className="tile px-4 py-2 bg-white font-semibold disabled:opacity-40 flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <GameButton
                  variant="primary"
                  onClick={() => navigate(`/quest/${missionId}`)}
                  className="px-6 py-3 text-lg flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-ink" />
                  Launch Boss Fight!
                </GameButton>
              </div>
            </Panel>
          </div>
        )}
      </main>
    </PageScene>
  );
}
