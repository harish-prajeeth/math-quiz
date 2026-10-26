import React from 'react';
import { Topic } from '../types';
import { MathDiagram } from './MathIcons';
import { sounds } from '../utils/audio';
import { Check, ArrowRight, BookOpen, Star } from 'lucide-react';

interface AdventureTrailProps {
  topics: Topic[];
  onOpenLesson: (topicId: string) => void;
  onStartQuiz: (topicId: string, grade: number) => void;
}

export const AdventureTrail: React.FC<AdventureTrailProps> = ({
  topics,
  onOpenLesson,
  onStartQuiz,
}) => {
  // Ordered standards roadmap for Grades 5 and 6
  const roadmapOrder = [
    'g5-fractions',
    'g5-decimals',
    'g5-multiplication',
    'g5-division',
    'g6-ratios',
    'g6-fractions-decimals',
    'g6-integers',
    'g6-expressions',
  ];

  const orderedTopics = roadmapOrder
    .map((id) => topics.find((t) => t.id === id))
    .filter((t): t is Topic => Boolean(t));

  return (
    <div className="w-full bg-white border border-stone-200 rounded-2xl p-6 sm:p-8">
      {/* Roadmap Header */}
      <div className="max-w-2xl mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-semibold">
            Georgia Standards Roadmap
          </span>
          <span className="text-sm text-stone-500">
            Grades 5 & 6 Sequential Learning Path
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-sans-display tracking-tight">
          Curriculum Adventure Trail
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Follow the sequential learning path from foundational fraction arithmetic to middle school algebraic thinking.
        </p>
      </div>

      {/* Sequential Trail Cards */}
      <div className="relative">
        <div className="space-y-6">
          {orderedTopics.map((topic, index) => {
            const isFirstInGrade6 = topic.grade === 6 && (index === 0 || orderedTopics[index - 1]?.grade === 5);
            const isCompleted = index < 3;
            const isCurrent = index === 3;

            return (
              <React.Fragment key={topic.id}>
                {/* Milestone Divider between Grade 5 and Grade 6 */}
                {isFirstInGrade6 && (
                  <div className="my-8 pt-4 pb-2 border-t-2 border-dashed border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold uppercase tracking-wider text-teal-800 block">
                        Milestone: Transition to Middle School Mathematics
                      </span>
                      <span className="text-sm text-stone-600">
                        Advancing from concrete arithmetic models to abstract ratios and algebraic structures.
                      </span>
                    </div>
                    <span className="text-sm px-3 py-1 rounded bg-stone-100 text-stone-700 font-bold shrink-0">
                      Grade 6 Standards
                    </span>
                  </div>
                )}

                <div
                  className={`border rounded-xl p-5 sm:p-6 transition-colors ${
                    isCurrent
                      ? 'border-teal-700 bg-teal-50/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Step marker + Concept info */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                          isCompleted
                            ? 'bg-teal-700 text-white'
                            : isCurrent
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : index + 1}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-stone-500">
                            Stage {index + 1}
                          </span>
                          <span className="text-sm px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                            Grade {topic.grade}
                          </span>
                          <span className="text-sm px-2 py-0.5 rounded bg-stone-50 border border-stone-200 text-stone-600 font-medium">
                            {topic.standardCode}
                          </span>
                          {isCurrent && (
                            <span className="text-sm px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                              Recommended Next
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-stone-900 font-sans-display">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-stone-600 mt-0.5 max-w-xl">
                          {topic.objective}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Math Diagram Preview */}
                    <div className="hidden md:flex items-center justify-center px-4 shrink-0">
                      <MathDiagram topicId={topic.id} className="w-10 h-10" />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2.5 sm:self-center shrink-0">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          onOpenLesson(topic.id);
                        }}
                        className="text-sm font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1.5 py-2.5 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-stone-500" />
                        <span>Lesson</span>
                      </button>

                      <button
                        onClick={() => {
                          sounds.playClick();
                          onStartQuiz(topic.id, topic.grade);
                        }}
                        className={`text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center gap-1.5 transition-colors ${
                          isCurrent
                            ? 'btn-primary'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        <span>Start quiz</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
