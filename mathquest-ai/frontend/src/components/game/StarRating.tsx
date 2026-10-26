import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface StarRatingProps {
  stars: number; // 0, 1, 2, or 3
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  size = 'md',
  animated = false,
  className = '',
}) => {
  const { reducedMotion } = useGame();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      {[1, 2, 3].map((starIndex) => {
        const isFilled = starIndex <= stars;

        return (
          <motion.div
            key={starIndex}
            initial={animated && !reducedMotion ? { scale: 0, rotate: -30 } : false}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 18,
              delay: animated ? starIndex * 0.15 : 0,
            }}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                isFilled
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                  : 'text-stone-300 dark:text-stone-700'
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
