import React from 'react';
import { X, GraduationCap } from 'lucide-react';
import { sounds } from '../utils/audio';

interface StandardsModalProps {
  onClose: () => void;
}

export const StandardsModal: React.FC<StandardsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div data-ui="dialog" className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col max-h-[85svh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-sans-display">
                Georgia K-12 Mathematics Standards
              </h2>
              <p className="text-xs text-stone-600">Curriculum alignment specification for Grades 5 and 6</p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-xs text-stone-600 leading-relaxed">
            MathQuest aligns directly with Georgia’s Department of Education K-12 Mathematics Standards (GSE), focusing on procedural fluency, conceptual visual models, and adaptive progression.
          </p>

          {/* Grade 5 Standards */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-2 font-sans-display">
              Grade 5 standards
            </h3>
            <div className="space-y-2">
              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-xs font-semibold text-teal-800 block mb-0.5">MGSE5.NF.1 — Fractions</span>
                <p className="text-xs text-stone-700">
                  Add and subtract fractions with unlike denominators by replacing given fractions with equivalent fractions.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-xs font-semibold text-teal-800 block mb-0.5">MGSE5.NBT.7 — Decimals</span>
                <p className="text-xs text-stone-700">
                  Add, subtract, and multiply decimals to hundredths using concrete models and place value strategies.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-xs font-semibold text-teal-800 block mb-0.5">MGSE5.NBT.5 & MGSE5.NBT.6 — Whole number operations</span>
                <p className="text-xs text-stone-700">
                  Fluently multiply multi-digit numbers and find quotients with up to four-digit dividends and two-digit divisors.
                </p>
              </div>
            </div>
          </div>

          {/* Grade 6 Standards */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-2 font-sans-display">
              Grade 6 standards
            </h3>
            <div className="space-y-2">
              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-xs font-semibold text-teal-800 block mb-0.5">MGSE6.RP.1 — Ratios and rates</span>
                <p className="text-xs text-stone-700">
                  Understand the concept of a ratio and use ratio language to describe proportional relationships between quantities.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-xs font-semibold text-teal-800 block mb-0.5">MGSE6.NS.5 — Integers and the number system</span>
                <p className="text-xs text-stone-700">
                  Understand that positive and negative numbers describe quantities having opposite directions or values.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-xs font-semibold text-teal-800 block mb-0.5">MGSE6.EE.2 — Expressions and equations</span>
                <p className="text-xs text-stone-700">
                  Write, read, and evaluate expressions in which letters stand for numbers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="btn-secondary text-xs font-semibold py-2 px-4 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
