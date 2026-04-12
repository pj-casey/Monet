/**
 * WaterLilyLogo — animated water lily icon that breathes with app activity.
 *
 * The petals open and close in response to the activity store, synced with
 * the MonetWordmark animations. Each petal has a --petal-i CSS variable
 * for staggered animation delays.
 *
 * Usage:
 *   <WaterLilyLogo size={18} />              — static (no activity animation)
 *   <WaterLilyLogo size={18} animate />       — reads activity store, animates
 */

import { useActivityStore } from '../stores/activity-store';

interface WaterLilyLogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export function WaterLilyLogo({ size = 18, animate = false, className = '' }: WaterLilyLogoProps) {
  const activity = useActivityStore((s) => s.activity);

  const stateClass = !animate ? '' :
    activity === 'loading'    ? 'lily-loading' :
    activity === 'processing' ? 'lily-processing' :
    activity === 'success'    ? 'lily-success' :
    activity === 'error'      ? 'lily-error' :
                                'lily-idle';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`water-lily-logo ${stateClass} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lily-grad" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d4a574" />
          <stop offset="1" stopColor="#a85a3a" />
        </linearGradient>
      </defs>

      {/* Center dot */}
      <circle cx="16" cy="16" r="2.5" fill="url(#lily-grad)" className="lily-center" />

      {/* 5 petals radiating from center — each is a tear/leaf shape */}
      {/* Petal 1 — top */}
      <path
        d="M16 14 C14 10, 13 6, 16 3 C19 6, 18 10, 16 14Z"
        fill="url(#lily-grad)"
        className="lily-petal"
        style={{ '--petal-i': 0, transformOrigin: '16px 14px' } as React.CSSProperties}
      />
      {/* Petal 2 — top-right */}
      <path
        d="M17.5 15 C20 12, 23 9.5, 27 10.5 C25 13, 21 14, 17.5 15Z"
        fill="url(#lily-grad)"
        className="lily-petal"
        style={{ '--petal-i': 1, transformOrigin: '17.5px 15px' } as React.CSSProperties}
      />
      {/* Petal 3 — bottom-right */}
      <path
        d="M17.5 17.5 C21 18.5, 25 20, 26.5 23.5 C23 22.5, 20 20, 17.5 17.5Z"
        fill="url(#lily-grad)"
        className="lily-petal"
        style={{ '--petal-i': 2, transformOrigin: '17.5px 17.5px' } as React.CSSProperties}
      />
      {/* Petal 4 — bottom-left */}
      <path
        d="M14.5 17.5 C11 18.5, 7 20, 5.5 23.5 C9 22.5, 12 20, 14.5 17.5Z"
        fill="url(#lily-grad)"
        className="lily-petal"
        style={{ '--petal-i': 3, transformOrigin: '14.5px 17.5px' } as React.CSSProperties}
      />
      {/* Petal 5 — top-left */}
      <path
        d="M14.5 15 C12 12, 9 9.5, 5 10.5 C7 13, 11 14, 14.5 15Z"
        fill="url(#lily-grad)"
        className="lily-petal"
        style={{ '--petal-i': 4, transformOrigin: '14.5px 15px' } as React.CSSProperties}
      />
    </svg>
  );
}
