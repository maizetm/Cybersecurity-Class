interface Props {
  hat?: string;
  frame?: string;
  size?: number;
  className?: string;
}

export default function CharacterAvatar({ hat, frame, size = 120, className = '' }: Props) {
  const frameColor =
    frame === 'frame-fire' ? '#ff4444' :
    frame === 'frame-ice' ? '#88ddff' :
    frame === 'frame-matrix' ? '#00ff88' : undefined;

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {/* Frame glow ring */}
      {frameColor && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            boxShadow: `0 0 ${size * 0.15}px ${frameColor}, 0 0 ${size * 0.3}px ${frameColor}40`,
            border: `2px solid ${frameColor}`,
          }}
        />
      )}

      <svg viewBox="0 0 120 120" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#16213e" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="hoodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d2d44" />
            <stop offset="100%" stopColor="#1a1a2e" />
          </linearGradient>
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#ff8800" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Body / Torso */}
        <path
          d="M36,78 Q36,72 42,68 L60,62 L78,68 Q84,72 84,78 L88,110 Q88,116 82,116 L38,116 Q32,116 32,110 Z"
          fill="url(#bodyGrad)"
          stroke="#00d4ff"
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />
        {/* Chest detail line */}
        <line x1="60" y1="68" x2="60" y2="100" stroke="#00d4ff" strokeWidth="0.5" strokeOpacity="0.3" />
        {/* Shoulder pads */}
        <ellipse cx="40" cy="72" rx="8" ry="4" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="0.6" strokeOpacity="0.5" />
        <ellipse cx="80" cy="72" rx="8" ry="4" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="0.6" strokeOpacity="0.5" />

        {/* Head */}
        <circle cx="60" cy="42" r="22" fill="url(#bodyGrad)" stroke="#00d4ff" strokeWidth="0.8" strokeOpacity="0.4" />

        {/* Visor / Eyes */}
        <rect x="42" y="38" width="36" height="8" rx="4" fill="url(#visorGrad)" filter="url(#glow)" opacity="0.9" />
        {/* Visor shine */}
        <rect x="44" y="39" width="12" height="2" rx="1" fill="white" opacity="0.3" />

        {/* Mouth area - small line */}
        <line x1="54" y1="52" x2="66" y2="52" stroke="#00d4ff" strokeWidth="0.6" strokeOpacity="0.3" />

        {/* ─── Hats ─── */}

        {/* Default: small antenna */}
        {!hat && (
          <g>
            <line x1="60" y1="20" x2="60" y2="12" stroke="#00d4ff" strokeWidth="1.5" />
            <circle cx="60" cy="10" r="2.5" fill="#00d4ff" filter="url(#glow)" />
          </g>
        )}

        {/* Hacker Hood */}
        {hat === 'hat-hacker' && (
          <g>
            <path
              d="M34,50 Q32,30 40,22 Q50,12 60,14 Q70,12 80,22 Q88,30 86,50"
              fill="url(#hoodGrad)"
              stroke="#4a4a6a"
              strokeWidth="1"
            />
            {/* Hood inner shadow */}
            <path
              d="M38,48 Q36,32 44,25 Q52,18 60,19 Q68,18 76,25 Q84,32 82,48"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="0.4"
              strokeOpacity="0.3"
            />
          </g>
        )}

        {/* Shield Helm */}
        {hat === 'hat-shield' && (
          <g>
            <path
              d="M36,46 L36,28 Q36,16 60,14 Q84,16 84,28 L84,46"
              fill="url(#shieldGrad)"
              stroke="#9ca3af"
              strokeWidth="1"
            />
            {/* Helm ridge */}
            <path d="M60,14 L60,46" stroke="#9ca3af" strokeWidth="2" />
            {/* Helm visor cutout */}
            <rect x="40" y="36" width="40" height="10" rx="2" fill="#0a0e1a" stroke="#9ca3af" strokeWidth="0.5" />
            {/* Re-draw visor inside cutout */}
            <rect x="42" y="38" width="36" height="8" rx="4" fill="url(#visorGrad)" filter="url(#glow)" opacity="0.9" />
          </g>
        )}

        {/* Cyber Crown */}
        {hat === 'hat-crown' && (
          <g>
            <path
              d="M38,26 L42,10 L50,20 L60,6 L70,20 L78,10 L82,26 Z"
              fill="url(#crownGrad)"
              stroke="#ffd700"
              strokeWidth="0.8"
              filter="url(#softGlow)"
            />
            {/* Crown jewels */}
            <circle cx="60" cy="18" r="2" fill="#ff4444" />
            <circle cx="48" cy="20" r="1.5" fill="#00d4ff" />
            <circle cx="72" cy="20" r="1.5" fill="#a855f7" />
            {/* Crown base band */}
            <rect x="38" y="24" width="44" height="4" rx="1" fill="#ffd700" opacity="0.8" />
          </g>
        )}

        {/* Chest emblem - small shield icon */}
        <g transform="translate(54, 78)">
          <path d="M6,0 L12,3 L12,8 Q12,12 6,14 Q0,12 0,8 L0,3 Z" fill="none" stroke="#00d4ff" strokeWidth="0.8" strokeOpacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
