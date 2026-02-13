interface Props {
  domain: number;
  size?: number;
  defeated?: boolean;
  className?: string;
}

export default function BossAvatar({ domain, size = 140, defeated = false, className = '' }: Props) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size, opacity: defeated ? 0.5 : 1 }}>
      <svg viewBox="0 0 140 140" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={`bossGlow${domain}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`bossSoftGlow${domain}`}>
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {domain === 1 && <PhantomBoss />}
        {domain === 2 && <MechBoss />}
        {domain === 3 && <GolemBoss />}
        {domain === 4 && <CommanderBoss />}
        {domain === 5 && <JudgeBoss />}

        {/* Defeated overlay */}
        {defeated && (
          <g>
            <line x1="20" y1="20" x2="120" y2="120" stroke="#ff4444" strokeWidth="4" opacity="0.7" />
            <line x1="120" y1="20" x2="20" y2="120" stroke="#ff4444" strokeWidth="4" opacity="0.7" />
          </g>
        )}
      </svg>
    </div>
  );
}

/** Domain 1: Phantom — ghostly floating figure with red eyes */
function PhantomBoss() {
  return (
    <g>
      {/* Ethereal body glow */}
      <ellipse cx="70" cy="85" rx="35" ry="10" fill="#ef4444" opacity="0.1" filter="url(#bossSoftGlow1)" />

      {/* Ghost body - flowing shape */}
      <path
        d="M45,50 Q45,25 70,20 Q95,25 95,50 L95,90 Q90,100 85,90 Q80,100 75,90 Q70,100 65,90 Q60,100 55,90 Q50,100 45,90 Z"
        fill="#1a0a0a"
        stroke="#ef4444"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />
      {/* Inner glow */}
      <path
        d="M50,52 Q50,30 70,26 Q90,30 90,52 L90,85"
        fill="none"
        stroke="#ef4444"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />

      {/* Face */}
      {/* Left eye */}
      <ellipse cx="58" cy="48" rx="6" ry="7" fill="#0a0000" stroke="#ef4444" strokeWidth="0.8" />
      <ellipse cx="58" cy="48" rx="3" ry="4" fill="#ef4444" filter="url(#bossGlow1)" />
      <circle cx="57" cy="46" r="1" fill="#ff8888" />
      {/* Right eye */}
      <ellipse cx="82" cy="48" rx="6" ry="7" fill="#0a0000" stroke="#ef4444" strokeWidth="0.8" />
      <ellipse cx="82" cy="48" rx="3" ry="4" fill="#ef4444" filter="url(#bossGlow1)" />
      <circle cx="81" cy="46" r="1" fill="#ff8888" />

      {/* Mouth - jagged */}
      <path d="M55,62 L60,66 L65,62 L70,66 L75,62 L80,66 L85,62" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeOpacity="0.7" />

      {/* Floating data particles */}
      <text x="30" y="35" fill="#ef4444" opacity="0.4" fontSize="6" fontFamily="monospace">01</text>
      <text x="100" y="40" fill="#ef4444" opacity="0.3" fontSize="5" fontFamily="monospace">10</text>
      <text x="25" y="75" fill="#ef4444" opacity="0.2" fontSize="7" fontFamily="monospace">0</text>
      <text x="110" y="70" fill="#ef4444" opacity="0.3" fontSize="6" fontFamily="monospace">1</text>

      {/* Title */}
      <text x="70" y="125" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold" fontFamily="monospace">
        PHANTOM
      </text>
    </g>
  );
}

/** Domain 2: Mech — robotic armored head, blue glow */
function MechBoss() {
  return (
    <g>
      {/* Base glow */}
      <ellipse cx="70" cy="110" rx="30" ry="8" fill="#3b82f6" opacity="0.1" filter="url(#bossSoftGlow2)" />

      {/* Neck / body base */}
      <rect x="55" y="85" width="30" height="25" rx="3" fill="#0f172a" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="62" y1="88" x2="62" y2="108" stroke="#3b82f6" strokeWidth="0.4" strokeOpacity="0.3" />
      <line x1="78" y1="88" x2="78" y2="108" stroke="#3b82f6" strokeWidth="0.4" strokeOpacity="0.3" />

      {/* Shoulder plates */}
      <rect x="30" y="88" width="25" height="12" rx="3" fill="#0f172a" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.5" />
      <rect x="85" y="88" width="25" height="12" rx="3" fill="#0f172a" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.5" />

      {/* Head - angular robot */}
      <path
        d="M40,80 L40,40 L50,28 L90,28 L100,40 L100,80 Z"
        fill="#0f172a"
        stroke="#3b82f6"
        strokeWidth="1.2"
      />
      {/* Head inner panel */}
      <path
        d="M45,75 L45,44 L53,34 L87,34 L95,44 L95,75 Z"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="0.4"
        strokeOpacity="0.3"
      />

      {/* Antenna */}
      <line x1="70" y1="28" x2="70" y2="16" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="70" cy="14" r="3" fill="#3b82f6" filter="url(#bossGlow2)" />

      {/* Eyes - horizontal visor */}
      <rect x="46" y="50" width="48" height="10" rx="2" fill="#0a1628" stroke="#3b82f6" strokeWidth="1" />
      {/* Left eye */}
      <rect x="50" y="52" width="14" height="6" rx="1" fill="#3b82f6" filter="url(#bossGlow2)" opacity="0.9" />
      {/* Right eye */}
      <rect x="76" y="52" width="14" height="6" rx="1" fill="#3b82f6" filter="url(#bossGlow2)" opacity="0.9" />

      {/* Mouth grille */}
      {[68, 72, 76].map(y => (
        <line key={y} x1="52" y1={y} x2="88" y2={y} stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.4" />
      ))}

      {/* Rivets */}
      {[[44, 38], [96, 38], [44, 78], [96, 78]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.5" />
      ))}

      <text x="70" y="125" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold" fontFamily="monospace">
        ARCHITECT
      </text>
    </g>
  );
}

/** Domain 3: Golem — mechanical creature with circuit patterns, green */
function GolemBoss() {
  return (
    <g>
      {/* Ground glow */}
      <ellipse cx="70" cy="108" rx="35" ry="8" fill="#10b981" opacity="0.1" filter="url(#bossSoftGlow3)" />

      {/* Body - large blocky torso */}
      <rect x="40" y="60" width="60" height="45" rx="5" fill="#0a1a14" stroke="#10b981" strokeWidth="1" strokeOpacity="0.6" />
      {/* Circuit lines on body */}
      <path d="M50,68 L50,80 L65,80 L65,95" fill="none" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.4" />
      <path d="M90,68 L90,75 L75,75 L75,95" fill="none" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.4" />
      <circle cx="50" cy="68" r="1.5" fill="#10b981" opacity="0.6" />
      <circle cx="65" cy="80" r="1.5" fill="#10b981" opacity="0.6" />
      <circle cx="90" cy="68" r="1.5" fill="#10b981" opacity="0.6" />
      <circle cx="75" cy="75" r="1.5" fill="#10b981" opacity="0.6" />

      {/* Arms */}
      <rect x="22" y="62" width="18" height="35" rx="5" fill="#0a1a14" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.5" />
      <rect x="100" y="62" width="18" height="35" rx="5" fill="#0a1a14" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.5" />
      {/* Arm joints */}
      <circle cx="31" cy="75" r="3" fill="#0a1a14" stroke="#10b981" strokeWidth="0.8" />
      <circle cx="109" cy="75" r="3" fill="#0a1a14" stroke="#10b981" strokeWidth="0.8" />

      {/* Head */}
      <rect x="48" y="24" width="44" height="38" rx="6" fill="#0a1a14" stroke="#10b981" strokeWidth="1.2" />

      {/* Eyes - glowing circles */}
      <circle cx="60" cy="40" r="7" fill="#021a0f" stroke="#10b981" strokeWidth="1" />
      <circle cx="60" cy="40" r="4" fill="#10b981" filter="url(#bossGlow3)" />
      <circle cx="80" cy="40" r="7" fill="#021a0f" stroke="#10b981" strokeWidth="1" />
      <circle cx="80" cy="40" r="4" fill="#10b981" filter="url(#bossGlow3)" />

      {/* Mouth - horizontal bar */}
      <rect x="55" y="52" width="30" height="4" rx="2" fill="#10b981" opacity="0.4" />

      {/* Wrench symbol on forehead */}
      <path d="M66,30 L70,26 L74,30" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" />

      <text x="70" y="125" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">
        FORGEMASTER
      </text>
    </g>
  );
}

/** Domain 4: Commander — tactical figure with targeting overlay, orange */
function CommanderBoss() {
  return (
    <g>
      {/* Ground glow */}
      <ellipse cx="70" cy="112" rx="28" ry="6" fill="#f59e0b" opacity="0.1" filter="url(#bossSoftGlow4)" />

      {/* Body */}
      <path
        d="M45,72 L55,65 L85,65 L95,72 L98,110 L42,110 Z"
        fill="#1a1200"
        stroke="#f59e0b"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      {/* Chest medal / badge */}
      <polygon points="70,75 75,82 70,89 65,82" fill="#f59e0b" opacity="0.5" />
      <polygon points="70,78 73,82 70,86 67,82" fill="#f59e0b" opacity="0.3" />
      {/* Belt */}
      <rect x="44" y="95" width="52" height="3" fill="#f59e0b" opacity="0.3" />

      {/* Head */}
      <circle cx="70" cy="42" r="22" fill="#1a1200" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.6" />

      {/* Beret / cap */}
      <path
        d="M48,36 Q48,22 70,20 Q92,22 92,36 L48,36 Z"
        fill="#2a1a00"
        stroke="#f59e0b"
        strokeWidth="0.8"
      />
      <line x1="46" y1="36" x2="94" y2="36" stroke="#f59e0b" strokeWidth="1.5" />
      {/* Cap star */}
      <polygon points="70,26 72,30 76,30 73,33 74,37 70,35 66,37 67,33 64,30 68,30" fill="#f59e0b" opacity="0.7" />

      {/* Eyes - sharp angular */}
      <path d="M56,42 L62,39 L68,42 L62,44 Z" fill="#f59e0b" filter="url(#bossGlow4)" opacity="0.9" />
      <path d="M72,42 L78,39 L84,42 L78,44 Z" fill="#f59e0b" filter="url(#bossGlow4)" opacity="0.9" />

      {/* Mouth - firm line */}
      <line x1="62" y1="52" x2="78" y2="52" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />

      {/* Targeting reticle overlay */}
      <circle cx="70" cy="42" r="30" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 4" />
      <line x1="70" y1="8" x2="70" y2="18" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="70" y1="66" x2="70" y2="72" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="36" y1="42" x2="44" y2="42" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="96" y1="42" x2="104" y2="42" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.3" />

      <text x="70" y="128" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold" fontFamily="monospace">
        WARDEN
      </text>
    </g>
  );
}

/** Domain 5: Judge — robed figure with scales and gavel, purple */
function JudgeBoss() {
  return (
    <g>
      {/* Ground glow */}
      <ellipse cx="70" cy="112" rx="32" ry="8" fill="#8b5cf6" opacity="0.1" filter="url(#bossSoftGlow5)" />

      {/* Robe body - flowing */}
      <path
        d="M40,60 L60,55 L80,55 L100,60 L105,115 L35,115 Z"
        fill="#0f0a1a"
        stroke="#8b5cf6"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      {/* Robe center fold */}
      <line x1="70" y1="58" x2="70" y2="115" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.3" />
      {/* Robe collar */}
      <path d="M50,60 L70,55 L90,60" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.5" />

      {/* Head */}
      <circle cx="70" cy="36" r="20" fill="#0f0a1a" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.6" />

      {/* Wig / headdress */}
      <path
        d="M48,40 Q46,20 58,16 Q70,12 82,16 Q94,20 92,40"
        fill="#1a1028"
        stroke="#8b5cf6"
        strokeWidth="0.8"
      />
      {/* Wig curls */}
      <path d="M48,40 Q44,44 46,48" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M92,40 Q96,44 94,48" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.4" />

      {/* Eyes */}
      <ellipse cx="62" cy="35" rx="4" ry="5" fill="#050210" stroke="#8b5cf6" strokeWidth="0.6" />
      <ellipse cx="62" cy="35" rx="2" ry="3" fill="#8b5cf6" filter="url(#bossGlow5)" />
      <ellipse cx="78" cy="35" rx="4" ry="5" fill="#050210" stroke="#8b5cf6" strokeWidth="0.6" />
      <ellipse cx="78" cy="35" rx="2" ry="3" fill="#8b5cf6" filter="url(#bossGlow5)" />

      {/* Mouth */}
      <path d="M64,46 Q70,48 76,46" fill="none" stroke="#8b5cf6" strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Scales of justice - left hand */}
      <g transform="translate(25, 65)">
        <line x1="10" y1="0" x2="10" y2="25" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="0" y1="4" x2="20" y2="4" stroke="#8b5cf6" strokeWidth="1.2" />
        {/* Left pan */}
        <path d="M-2,4 L2,14 L-2,14 Z" fill="#8b5cf6" opacity="0.3" />
        {/* Right pan */}
        <path d="M18,4 L22,18 L18,18 Z" fill="#8b5cf6" opacity="0.3" />
        {/* Chains */}
        <line x1="0" y1="4" x2="0" y2="14" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="20" y1="4" x2="20" y2="18" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.4" />
      </g>

      {/* Gavel - right hand */}
      <g transform="translate(95, 68)">
        <rect x="0" y="0" width="6" height="16" rx="1" fill="#2a1a40" stroke="#8b5cf6" strokeWidth="0.8" />
        <rect x="-3" y="14" width="12" height="5" rx="1" fill="#2a1a40" stroke="#8b5cf6" strokeWidth="0.8" />
      </g>

      <text x="70" y="130" textAnchor="middle" fill="#8b5cf6" fontSize="9" fontWeight="bold" fontFamily="monospace">
        ARBITER
      </text>
    </g>
  );
}
