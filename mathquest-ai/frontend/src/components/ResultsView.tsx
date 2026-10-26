import React from 'react';
import { QuizResults, Topic } from '../types';
import { sounds } from '../utils/audio';
import { Award, Check, X, RotateCcw, ArrowLeft, BookOpen } from 'lucide-react';

interface ResultsViewProps {
  results: QuizResults;
  topic: Topic;
  onPlayAgain: () => void;
  onSelectNewTopic: () => void;
  onOpenLesson: (topicId: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  topic,
  onPlayAgain,
  onSelectNewTopic,
  onOpenLesson,
}) => {
  const percentage = Math.round((results.correctAnswers / results.totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Overview Card */}
      <div className="bg-white border border-stone-200 rounded-xl p-8 mb-6 text-center">
        <span className="text-xs px-2.5 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
          Grade {topic.grade} • {topic.standardCode}
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-3 mb-2 font-display">
          Quiz complete
        </h1>

        <p className="text-sm text-stone-600 mb-6">
          {percentage >= 80 ? 'Strong mastery demonstrated on this standard.' : 'Review the worked examples to reinforce key concepts.'}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
            <span className="text-xs text-stone-500 font-medium block">Score</span>
            <span className="text-2xl font-bold text-teal-800 tabular-nums">{results.score}</span>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
            <span className="text-xs text-stone-500 font-medium block">Accuracy</span>
            <span className="text-2xl font-bold text-stone-900 tabular-nums">{percentage}%</span>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
            <span className="text-xs text-stone-500 font-medium block">Correct</span>
            <span className="text-2xl font-bold text-stone-900 tabular-nums">
              {results.correctAnswers}/{results.totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      {results.badges && results.badges.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-bold text-stone-900 mb-4 font-sans-display flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-700" />
            <span>Achievement achievements</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.badges.map(badge => (
              <div
                key={badge.id}
                className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 font-sans-display">{badge.name}</h4>
                  <p className="text-xs text-stone-600 mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Difficulty Progression */}
      {results.difficultyProgression && results.difficultyProgression.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-bold text-stone-900 mb-1 font-sans-display">
            Adaptive progression
          </h2>
          <p className="text-xs text-stone-600 mb-4">
            Difficulty levels adapted in real-time based on your consecutive answers.
          </p>

          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
            {results.difficultyProgression.map((diff, index) => (
              <div key={index} className="flex flex-col items-center gap-1 shrink-0 px-2">
                <span className="text-xs text-stone-500 tabular-nums">Q{index + 1}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium capitalize">
                  {diff}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => { sounds.playClick(); onSelectNewTopic(); }}
          className="btn-secondary text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All topics</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); onOpenLesson(topic.id); }}
          className="btn-secondary text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-stone-600" />
          <span>Review lesson</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); onPlayAgain(); }}
          className="btn-primary text-xs font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake quiz</span>
        </button>
      </div>
    </div>
  );
};
