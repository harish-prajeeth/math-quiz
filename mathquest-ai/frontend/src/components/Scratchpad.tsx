import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, PenTool, Grid } from 'lucide-react';
import { sounds } from '../utils/audio';

export const Scratchpad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#0f766e');
  const [lineWidth, setLineWidth] = useState(2.5);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set display buffer to match rendered size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-stone-600" />
          <span className="text-xs font-semibold text-stone-800 font-sans-display">
            Math scratchpad
          </span>
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            Work out your steps with pen or touch
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Grid */}
          <button
            onClick={() => { sounds.playClick(); setShowGrid(!showGrid); }}
            className={`p-1.5 rounded text-xs font-medium border flex items-center gap-1 transition-colors ${
              showGrid ? 'bg-stone-100 border-stone-300 text-stone-900' : 'bg-white border-stone-200 text-stone-600'
            }`}
            title="Toggle math grid paper"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>

          {/* Color picks */}
          <div className="flex items-center gap-1 pl-1 border-l border-stone-200">
            <button
              onClick={() => { setColor('#0f766e'); setLineWidth(2.5); }}
              className={`w-5 h-5 rounded-full bg-teal-700 border-2 ${color === '#0f766e' ? 'border-stone-900' : 'border-transparent'}`}
              title="Teal pen"
              aria-label="Teal pen"
            />
            <button
              onClick={() => { setColor('#1c1917'); setLineWidth(2.5); }}
              className={`w-5 h-5 rounded-full bg-stone-900 border-2 ${color === '#1c1917' ? 'border-teal-600' : 'border-transparent'}`}
              title="Black pen"
              aria-label="Black pen"
            />
            <button
              onClick={() => { setColor('#b91c1c'); setLineWidth(2.5); }}
              className={`w-5 h-5 rounded-full bg-red-700 border-2 ${color === '#b91c1c' ? 'border-stone-900' : 'border-transparent'}`}
              title="Red correction pen"
              aria-label="Red correction pen"
            />
          </div>

          {/* Clear */}
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 flex items-center gap-1 transition-colors"
            title="Clear scratchpad"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Canvas Working Area */}
      <div className="relative w-full h-44 rounded-lg border border-stone-200 overflow-hidden cursor-crosshair touch-none bg-stone-50">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};
