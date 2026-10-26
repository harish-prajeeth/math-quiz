import React from 'react';

interface MathIconProps {
  topicId: string;
  className?: string;
}

export const MathDiagram: React.FC<MathIconProps> = ({ topicId, className = 'w-10 h-10' }) => {
  switch (topicId) {
    case 'g5-fractions':
      // Visual fraction bar with 3 of 4 parts shaded
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
          <rect x="2" y="10" width="36" height="20" rx="4" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1.5" />
          <rect x="2" y="10" width="9" height="20" rx="2" fill="#0f766e" />
          <rect x="11" y="10" width="9" height="20" fill="#0f766e" />
          <rect x="20" y="10" width="9" height="20" fill="#0f766e" />
          <line x1="11" y1="10" x2="11" y2="30" stroke="#ffffff" strokeWidth="1" />
          <line x1="20" y1="10" x2="20" y2="30" stroke="#ffffff" strokeWidth="1" />
          <line x1="29" y1="10" x2="29" y2="30" stroke="#d6d3d1" strokeWidth="1" />
        </svg>
      );

    case 'g5-decimals':
      // Place value decimal hundredths matrix
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="32" height="32" rx="4" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1.5" />
          <rect x="6" y="6" width="14" height="28" rx="2" fill="#0f766e" />
          <circle cx="27" cy="27" r="3" fill="#b45309" />
          <line x1="20" y1="4" x2="20" y2="36" stroke="#e7e5e4" strokeWidth="1" />
          <line x1="4" y1="20" x2="36" y2="20" stroke="#e7e5e4" strokeWidth="1" />
        </svg>
      );

    case 'g5-multiplication':
      // Geometric area model grid
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="32" height="32" rx="4" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1.5" />
          <rect x="4" y="4" width="18" height="20" rx="2" fill="#0f766e" />
          <rect x="22" y="4" width="14" height="20" fill="#e7e5e4" />
          <rect x="4" y="24" width="18" height="12" fill="#e7e5e4" />
          <rect x="22" y="24" width="14" height="12" fill="#d6d3d1" />
          <line x1="22" y1="4" x2="22" y2="36" stroke="#ffffff" strokeWidth="1" />
          <line x1="4" y1="24" x2="36" y2="24" stroke="#ffffff" strokeWidth="1" />
        </svg>
      );

    case 'g5-division':
      // Division bracket symbol with quotient and remainder representation
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
          <path d="M12 28 C12 18, 14 12, 20 12 L34 12" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="8" cy="20" r="2.5" fill="#57534e" />
          <circle cx="27" cy="22" r="2.5" fill="#57534e" />
          <circle cx="27" cy="6" r="2.5" fill="#b45309" />
        </svg>
      );

    case 'g6-ratios':
      // Ratio proportional balance tiles
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="14" width="12" height="12" rx="2" fill="#0f766e" />
          <rect x="18" y="14" width="6" height="12" rx="1" fill="#b45309" />
          <rect x="26" y="14" width="6" height="12" rx="1" fill="#b45309" />
          <rect x="34" y="14" width="6" height="12" rx="1" fill="#b45309" />
          <line x1="2" y1="32" x2="38" y2="32" stroke="#d6d3d1" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'g6-fractions-decimals':
      // Fraction and decimal conversion wheel
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="15" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1.5" />
          <path d="M20 20 L20 5 A15 15 0 0 1 35 20 Z" fill="#0f766e" />
          <path d="M20 20 L35 20 A15 15 0 0 1 20 35 Z" fill="#0d9488" />
        </svg>
      );

    case 'g6-integers':
      // Number line with zero origin and positive/negative arrows
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
          <line x1="4" y1="20" x2="36" y2="20" stroke="#57534e" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="12" x2="20" y2="28" stroke="#0f766e" strokeWidth="2.5" />
          <line x1="12" y1="16" x2="12" y2="24" stroke="#b91c1c" strokeWidth="1.5" />
          <line x1="28" y1="16" x2="28" y2="24" stroke="#0f766e" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="3" fill="#0f766e" />
        </svg>
      );

    case 'g6-expressions':
      // Algebraic equation balance with variable block
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
          <line x1="6" y1="26" x2="34" y2="26" stroke="#57534e" strokeWidth="2" strokeLinecap="round" />
          <polygon points="20,26 16,34 24,34" fill="#a8a29e" />
          <rect x="8" y="16" width="10" height="10" rx="2" fill="#0f766e" />
          <text x="13" y="24" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">x</text>
          <rect x="24" y="18" width="8" height="8" rx="2" fill="#b45309" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="32" height="32" rx="4" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1.5" />
          <line x1="12" y1="20" x2="28" y2="20" stroke="#0f766e" strokeWidth="2" />
          <line x1="20" y1="12" x2="20" y2="28" stroke="#0f766e" strokeWidth="2" />
        </svg>
      );
  }
};
