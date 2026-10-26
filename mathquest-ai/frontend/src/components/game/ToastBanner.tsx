import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Zap, Trophy, X } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export interface ToastData {
  type: 'level-up' | 'trophy' | 'difficulty';
  title: string;
  message: string;
}

interface ToastBannerProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({ toast, onDismiss }) => {
  const { reducedMotion } = useGame();

  if (!toast) return null;

  const icons = {
    'level-up': <Zap className="w-5 h-5 text-amber-300 shrink-0" />,
    trophy: <Trophy className="w-5 h-5 text-amber-300 shrink-0" />,
    difficulty: <Award className="w-5 h-5 text-emerald-300 shrink-0" />,
  };

  const bgStyles = {
    'level-up': 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white border-amber-300',
    trophy: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400',
    difficulty: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-400',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md shadow-2xl"
      >
        <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${bgStyles[toast.type]}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              {icons[toast.type]}
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base leading-tight">
                {toast.title}
              </h4>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                {toast.message}
              </p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-white transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
