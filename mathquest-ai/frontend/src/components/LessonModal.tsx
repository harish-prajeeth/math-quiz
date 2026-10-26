import React, { useState } from 'react';
import { LessonContent, Topic } from '../types';
import { InfographicVisualizer } from './InfographicVisualizer';
import { X, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface LessonModalProps {
  lesson: LessonContent;
  topic: Topic;
  onClose: () => void;
  onStartQuiz: (topicId: string, grade: number) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  topic,
  onClose,
  onStartQuiz,
}) => {
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div data-ui="dialog" className="relative w-full max-w-3xl max-h-[90svh] bg-white rounded-2xl overflow-hidden flex flex-col border border-stone-200">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-start justify-between gap-4 bg-stone-50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-medium">
                Grade {topic.grade}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-white border border-stone-300 text-stone-700 font-medium">
                {topic.standardCode}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-sans-display">{lesson.title}</h2>
            <p className="text-xs text-stone-600 mt-1">{topic.standardDescription}</p>
          </div>

          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
            aria-label="Close lesson"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Objective */}
          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200">
            <span className="text-xs font-semibold text-stone-600 block mb-1">Learning objective</span>
            <p className="text-sm font-medium text-stone-900">{lesson.objective}</p>
          </div>

          {/* Explanation */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2 font-sans-display">
              Concept overview
            </h3>
            <div className="p-4 rounded-xl bg-white border border-stone-200 text-stone-700 leading-relaxed text-sm">
              {lesson.explanation}
            </div>
          </div>

          {/* Infographic */}
          {lesson.infographicData && (
            <InfographicVisualizer data={lesson.infographicData} />
          )}

          {/* Worked Example */}
          <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-semibold text-teal-800 block mb-1">Worked solution</span>
            <h4 className="text-base font-bold text-stone-900 mb-4 font-sans-display">
              {lesson.workedExample.problem}
            </h4>

            <ol className="space-y-2 mb-4 list-decimal list-inside text-sm text-stone-700">
              {lesson.workedExample.steps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>

            <div className="p-3 bg-white border border-stone-200 rounded-lg flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600">Answer:</span>
              <span className="text-base font-bold text-teal-900 tabular-nums">{lesson.workedExample.answer}</span>
            </div>
          </div>

          {/* Common Mistake */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-1">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Common student error</span>
            </div>
            <p className="text-sm text-stone-800 mb-2">
              {lesson.commonMistake.mistake}
            </p>
            <p className="text-xs text-stone-700">
              <span className="font-semibold text-stone-900">How to solve correctly:</span> {lesson.commonMistake.correction}
            </p>
          </div>

          {/* Practice Question */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-700">Quick check question</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowPracticeAnswer(!showPracticeAnswer);
                }}
                className="text-xs font-medium text-teal-700 hover:text-teal-900 underline"
              >
                {showPracticeAnswer ? 'Hide answer' : 'Reveal answer'}
              </button>
            </div>
            <p className="text-sm font-medium text-stone-900 mb-2">
              {lesson.practiceQuestion.question}
            </p>
            {showPracticeAnswer && (
              <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{lesson.practiceQuestion.answer}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-4">
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="btn-secondary text-xs font-semibold py-2 px-4 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onStartQuiz(topic.id, topic.grade);
            }}
            className="btn-primary text-xs font-semibold py-2 px-5 rounded-lg flex items-center gap-2"
          >
            <span>Start quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
