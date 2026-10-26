import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { Sliders, RotateCcw } from 'lucide-react';

export const MathSandbox: React.FC = () => {
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(8);
  const [mode, setMode] = useState<'fraction' | 'ratio'>('fraction');

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(numerator, denominator);
  const simplifiedNum = numerator / divisor;
  const simplifiedDen = denominator / divisor;
  const decimalValue = (numerator / denominator).toFixed(3);
  const percentValue = Math.round((numerator / denominator) * 100);

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <h3 className="text-xl font-bold text-stone-900 font-sans-display">
            Interactive visual laboratory
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Adjust the sliders to observe equivalent fractions, decimals, and ratio models in real time.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-stone-100 p-1 rounded-lg">
          <button
            onClick={() => { sounds.playClick(); setMode('fraction'); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              mode === 'fraction' ? 'bg-white text-stone-900 border border-stone-200' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Fraction model
          </button>
          <button
            onClick={() => { sounds.playClick(); setMode('ratio'); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              mode === 'ratio' ? 'bg-white text-stone-900 border border-stone-200' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Ratio comparison
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Visual Area: 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          {mode === 'fraction' ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-600">
                  Visual fraction strip ({numerator} of {denominator} parts)
                </span>
                <span className="text-xs font-semibold text-teal-800 tabular-nums">
                  {percentValue}% filled
                </span>
              </div>

              {/* Segmented bar: Clickable interactive fraction manipulative */}
              <div className="w-full h-11 bg-white rounded-lg border border-stone-300 overflow-hidden flex">
                {Array.from({ length: denominator }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setNumerator(i + 1);
                    }}
                    className={`h-full border-r border-stone-300 last:border-r-0 transition-colors cursor-pointer ${
                      i < numerator ? 'bg-teal-700 hover:bg-teal-800' : 'bg-transparent hover:bg-stone-100'
                    }`}
                    style={{ flex: 1 }}
                    title={`Click to set ${i + 1}/${denominator}`}
                    aria-label={`Select ${i + 1} of ${denominator} parts`}
                  />
                ))}
              </div>

              {/* Unit parts grid: Clickable tiles */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-2">
                {Array.from({ length: denominator }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setNumerator(i + 1);
                    }}
                    className={`py-1.5 rounded text-center text-xs font-semibold tabular-nums cursor-pointer transition-colors ${
                      i < numerator
                        ? 'bg-teal-50 border border-teal-200 text-teal-900'
                        : 'bg-stone-50 border border-stone-200 text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    1/{denominator}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-600">
                  Ratio blocks ({numerator} to {denominator})
                </span>
                <span className="text-xs font-semibold text-stone-800 tabular-nums">
                  {numerator + denominator} total parts
                </span>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-20 text-xs font-semibold text-stone-700">Group A ({numerator}):</span>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {Array.from({ length: numerator }).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded bg-teal-800 text-white flex items-center justify-center text-xs font-bold">
                        A
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-20 text-xs font-semibold text-stone-700">Group B ({denominator}):</span>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {Array.from({ length: denominator }).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded bg-stone-300 text-stone-800 flex items-center justify-center text-xs font-bold">
                        B
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mathematical Form Conversion */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-center">
              <span className="text-xs text-stone-500 font-medium block">Standard form</span>
              <span className="text-lg font-bold text-stone-900 tabular-nums">{numerator}/{denominator}</span>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-center">
              <span className="text-xs text-stone-500 font-medium block">Simplest form</span>
              <span className="text-lg font-bold text-teal-800 tabular-nums">
                {simplifiedDen === 1 ? simplifiedNum : `${simplifiedNum}/${simplifiedDen}`}
              </span>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-center">
              <span className="text-xs text-stone-500 font-medium block">Decimal value</span>
              <span className="text-lg font-bold text-stone-900 tabular-nums">{decimalValue}</span>
            </div>
          </div>
        </div>

        {/* Right Controls: 5 cols */}
        <div className="lg:col-span-5 bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-stone-600" />
              <span>Adjust parameters</span>
            </span>
            <button
              onClick={() => {
                sounds.playClick();
                setNumerator(3);
                setDenominator(8);
              }}
              className="text-xs font-medium text-stone-500 hover:text-stone-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-stone-600">Numerator (Group A):</span>
              <span className="font-semibold text-teal-800 tabular-nums">{numerator}</span>
            </div>
            <input
              type="range"
              min="1"
              max={denominator}
              value={numerator}
              onChange={(e) => {
                sounds.playClick();
                setNumerator(parseInt(e.target.value, 10));
              }}
              className="w-full accent-teal-700 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-stone-600">Denominator (Group B):</span>
              <span className="font-semibold text-stone-800 tabular-nums">{denominator}</span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              value={denominator}
              onChange={(e) => {
                sounds.playClick();
                const newDen = parseInt(e.target.value, 10);
                setDenominator(newDen);
                if (numerator > newDen) setNumerator(newDen);
              }}
              className="w-full accent-teal-700 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-lg bg-white border border-stone-200 text-xs text-stone-600">
            <span className="font-semibold text-stone-900">Key rule:</span> A fraction represents parts of a whole. Dividing both numerator and denominator by their greatest common factor ({divisor > 1 ? divisor : 1}) produces an equivalent fraction.
          </div>
        </div>
      </div>
    </div>
  );
};
