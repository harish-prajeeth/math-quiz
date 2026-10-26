import React from 'react';
import { Topic } from '../types';
import { BookOpen, ArrowRight, Star } from 'lucide-react';
import { MathDiagram } from './MathIcons';
import { sounds } from '../utils/audio';

interface TopicCardProps {
  topic: Topic;
  onOpenLesson: (topicId: string) => void;
  onStartQuiz: (topicId: string, grade: number) => void;
  masteryStars?: number;
}

const getDomainLabel = (id: string): string => {
  if (id.includes('fractions')) return 'Fractions & Rational Numbers';
  if (id.includes('decimals')) return 'Base Ten & Decimal System';
  if (id.includes('multiplication') || id.includes('division')) return 'Operations & Algebraic Reasoning';
  if (id.includes('ratios')) return 'Ratios & Proportions';
  if (id.includes('integers')) return 'Integers & The Coordinate Plane';
  if (id.includes('expressions')) return 'Expressions & Equations';
  return 'Georgia Mathematics Standards';
};

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onOpenLesson,
  onStartQuiz,
  masteryStars = 2,
}) => {
  const domain = getDomainLabel(topic.id);

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col justify-between hover:border-stone-400 transition-colors">
      <div>
        {/* Top Domain & Standard Pill */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
          <span className="text-sm font-semibold text-teal-800">
            {domain}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-sm px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
              Grade {topic.grade}
            </span>
            <span className="text-sm px-2 py-0.5 rounded bg-stone-50 border border-stone-200 text-stone-600 font-medium">
              {topic.standardCode}
            </span>
          </div>
        </div>

        {/* Title & Embedded Visual Model */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-stone-900 font-sans-display tracking-tight leading-snug mb-1">
              {topic.title}
            </h3>
            <p className="text-sm font-medium text-stone-600">
              {topic.objective}
            </p>
          </div>
          <div className="shrink-0 p-1">
            <MathDiagram topicId={topic.id} className="w-12 h-12" />
          </div>
        </div>

        {/* Student Explanatory Summary */}
        <p className="text-sm text-stone-700 leading-relaxed mb-5">
          {topic.summary || topic.standardDescription}
        </p>

        {/* Mastery Tracker for Grades 5 & 6 */}
        <div className="mb-4 p-3 bg-stone-50 rounded-lg border border-stone-200/60 flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-stone-800 block">
              Mastery Progress
            </span>
            <span className="text-xs text-stone-500">
              {masteryStars === 3 ? 'Mastered standard' : `${masteryStars} of 3 milestones completed`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s < masteryStars
                    ? 'text-amber-700 fill-amber-700'
                    : 'text-stone-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
        <button
          onClick={() => {
            sounds.playClick();
            onOpenLesson(topic.id);
          }}
          className="text-sm font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1.5 py-2.5 px-3 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-stone-500" />
          <span>Study lesson</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onStartQuiz(topic.id, topic.grade);
          }}
          className="btn-primary text-sm font-semibold py-2.5 px-5 rounded-lg flex items-center gap-1.5"
        >
          <span>Start quiz</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
