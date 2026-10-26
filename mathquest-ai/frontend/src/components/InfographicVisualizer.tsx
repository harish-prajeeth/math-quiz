import React from 'react';
import { InfographicData, VisualElement } from '../types';
import { ArrowRight, Check } from 'lucide-react';

interface InfographicProps {
  data: InfographicData;
}

export const InfographicVisualizer: React.FC<InfographicProps> = ({ data }) => {
  // Helper to render fraction visual bar
  const renderFractionBar = (fractionStr: string, subContent?: string, highlight?: boolean) => {
    const parts = fractionStr.split('/');
    if (parts.length !== 2) {
      return (
        <div className="p-3 bg-stone-100 rounded-lg text-stone-900 font-semibold text-sm">
          {fractionStr}
        </div>
      );
    }

    const num = parseInt(parts[0], 10);
    const den = parseInt(parts[1], 10);
    const safeDen = isNaN(den) || den <= 0 ? 1 : Math.min(den, 16);
    const safeNum = isNaN(num) ? 0 : Math.min(num, safeDen);

    return (
      <div className={`p-4 rounded-xl ${highlight ? 'bg-teal-50 border border-teal-200' : 'bg-stone-50 border border-stone-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-stone-900 font-sans-display">
            {fractionStr}
          </span>
          <span className="text-xs text-stone-600 font-medium">
            {safeNum} of {safeDen} parts
          </span>
        </div>

        {/* Visual segmented bar */}
        <div className="w-full h-8 rounded-lg overflow-hidden flex bg-white border border-stone-300">
          {Array.from({ length: safeDen }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full border-r border-stone-300 last:border-r-0 ${
                idx < safeNum ? 'bg-teal-700' : 'bg-transparent'
              }`}
              style={{ width: `${100 / safeDen}%` }}
            />
          ))}
        </div>

        {subContent && (
          <p className="mt-2 text-xs text-stone-600">{subContent}</p>
        )}
      </div>
    );
  };

  // Helper to render ratio visual
  const renderRatioVisual = (ratioStr: string, subContent?: string, highlight?: boolean) => {
    const parts = ratioStr.split(':');
    const partA = parseInt(parts[0], 10) || 2;
    const partB = parseInt(parts[1], 10) || 3;

    return (
      <div className={`p-4 rounded-xl ${highlight ? 'bg-teal-50 border border-teal-200' : 'bg-stone-50 border border-stone-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-stone-900 font-sans-display">{ratioStr}</span>
          <span className="text-xs text-stone-600">Ratio visual model</span>
        </div>
        <div className="flex items-center gap-3 py-1">
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(partA, 10) }).map((_, i) => (
              <div key={i} className="w-6 h-6 rounded bg-teal-800 text-white flex items-center justify-center text-xs font-bold">
                A
              </div>
            ))}
          </div>
          <span className="text-sm font-bold text-stone-400">:</span>
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(partB, 10) }).map((_, i) => (
              <div key={i} className="w-6 h-6 rounded bg-stone-300 text-stone-800 flex items-center justify-center text-xs font-bold">
                B
              </div>
            ))}
          </div>
        </div>
        {subContent && <p className="mt-2 text-xs text-stone-600">{subContent}</p>}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="mb-5 pb-3 border-b border-stone-200">
        <h4 className="text-base font-bold text-stone-900 font-sans-display">{data.title}</h4>
        <p className="text-xs text-stone-600">Visual model and step derivation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.visualElements.map((el: VisualElement, index: number) => {
          if (el.type === 'fraction-visual') {
            return (
              <div key={index} className="col-span-1">
                {renderFractionBar(el.content, el.subContent, el.highlight)}
              </div>
            );
          }

          if (el.type === 'ratio-visual') {
            return (
              <div key={index} className="col-span-1">
                {renderRatioVisual(el.content, el.subContent, el.highlight)}
              </div>
            );
          }

          if (el.type === 'label') {
            return (
              <div key={index} className="col-span-full flex justify-center items-center py-1">
                <span className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-sm">
                  {el.content}
                </span>
              </div>
            );
          }

          if (el.type === 'step') {
            return (
              <div
                key={index}
                className="col-span-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-sm"
              >
                <ArrowRight className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{el.content}</span>
              </div>
            );
          }

          if (el.type === 'equation') {
            return (
              <div
                key={index}
                className={`col-span-full p-3.5 rounded-lg flex items-center justify-between text-base font-semibold ${
                  el.highlight
                    ? 'bg-teal-50 border border-teal-300 text-teal-900'
                    : 'bg-stone-50 border border-stone-200 text-stone-900'
                }`}
              >
                <span>{el.content}</span>
                {el.highlight && (
                  <Check className="w-4 h-4 text-teal-700 shrink-0" />
                )}
              </div>
            );
          }

          return (
            <div key={index} className="col-span-full p-3 rounded-lg bg-stone-50 text-stone-700 text-sm">
              {el.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
