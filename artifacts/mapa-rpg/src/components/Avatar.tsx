interface AvatarProps {
  character: 1 | 2;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Avatar({ character, size = 48, className = "", style = {} }: AvatarProps) {
  if (character === 1) {
    return <Char1Avatar size={size} className={className} style={style} />;
  }
  return <Char2Avatar size={size} className={className} style={style} />;
}

function Char1Avatar({ size, className, style }: { size: number; className: string; style: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="c1-circle">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
        <radialGradient id="c1-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2a1a40" />
          <stop offset="100%" stopColor="#130d22" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#c1-bg)" />

      <g clipPath="url(#c1-circle)">
        {/* Hair back layer */}
        <ellipse cx="50" cy="42" rx="26" ry="30" fill="#2c1408" />
        <rect x="24" y="50" width="10" height="55" rx="5" fill="#2c1408" />
        <rect x="66" y="50" width="10" height="55" rx="5" fill="#2c1408" />

        {/* Neck */}
        <rect x="44" y="70" width="12" height="16" rx="4" fill="#f5cfa0" />

        {/* Body */}
        <ellipse cx="50" cy="94" rx="26" ry="14" fill="#7c3aed" />
        <ellipse cx="50" cy="88" rx="18" ry="10" fill="#9d5df5" />

        {/* Face */}
        <ellipse cx="50" cy="54" rx="20" ry="22" fill="#f5cfa0" />

        {/* Hair front */}
        <ellipse cx="50" cy="36" rx="22" ry="16" fill="#3d1c08" />
        <path d="M28 42 Q24 36 26 28 Q30 22 38 26 Q44 20 50 22 Q56 20 62 26 Q70 22 74 28 Q76 36 72 42" fill="#3d1c08" />

        {/* Side hair */}
        <path d="M30 48 Q26 52 27 60 Q28 66 30 70" stroke="#3d1c08" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M70 48 Q74 52 73 60 Q72 66 70 70" stroke="#3d1c08" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Eyes */}
        <ellipse cx="42" cy="54" rx="4" ry="4.5" fill="#fff" />
        <ellipse cx="58" cy="54" rx="4" ry="4.5" fill="#fff" />
        <circle cx="43" cy="55" r="2.5" fill="#5c2e0a" />
        <circle cx="59" cy="55" r="2.5" fill="#5c2e0a" />
        <circle cx="44" cy="54" r="1" fill="#000" />
        <circle cx="60" cy="54" r="1" fill="#000" />
        <circle cx="44.5" cy="53.5" r="0.7" fill="#fff" />
        <circle cx="60.5" cy="53.5" r="0.7" fill="#fff" />

        {/* Eyebrows */}
        <path d="M38 49 Q42 47 46 49" stroke="#3d1c08" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M54 49 Q58 47 62 49" stroke="#3d1c08" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Nose */}
        <path d="M49 60 Q48 63 50 64 Q52 63 51 60" stroke="#e0a87a" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Smile */}
        <path d="M44 68 Q50 73 56 68" stroke="#d4824a" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Blush */}
        <ellipse cx="38" cy="62" rx="5" ry="3" fill="#f4a0a0" opacity="0.4" />
        <ellipse cx="62" cy="62" rx="5" ry="3" fill="#f4a0a0" opacity="0.4" />
      </g>

      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(200,140,40,0.5)" strokeWidth="2" />
    </svg>
  );
}

function Char2Avatar({ size, className, style }: { size: number; className: string; style: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="c2-circle">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
        <radialGradient id="c2-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a2a40" />
          <stop offset="100%" stopColor="#0d1622" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#c2-bg)" />

      <g clipPath="url(#c2-circle)">
        {/* Hair base / crown */}
        <ellipse cx="50" cy="38" rx="24" ry="20" fill="#1a0a02" />

        {/* Braids — left */}
        <path d="M32 55 Q28 65 30 75 Q32 82 30 90 Q28 96 26 102" stroke="#1a0a02" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M32 55 Q28 65 30 75 Q32 82 30 90 Q28 96 26 102" stroke="#3d1c08" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray="4 5" />
        {/* Braids lighter tips left */}
        <path d="M30 90 Q28 96 26 102" stroke="#7a4520" strokeWidth="7" strokeLinecap="round" fill="none" />

        {/* Braids — right */}
        <path d="M68 55 Q72 65 70 75 Q68 82 70 90 Q72 96 74 102" stroke="#1a0a02" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M68 55 Q72 65 70 75 Q68 82 70 90 Q72 96 74 102" stroke="#3d1c08" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray="4 5" />
        {/* Braids lighter tips right */}
        <path d="M70 90 Q72 96 74 102" stroke="#7a4520" strokeWidth="7" strokeLinecap="round" fill="none" />

        {/* Extra small braids framing face */}
        <path d="M36 46 Q33 55 35 65 Q36 70 34 76" stroke="#2a1008" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M64 46 Q67 55 65 65 Q64 70 66 76" stroke="#2a1008" strokeWidth="7" strokeLinecap="round" fill="none" />

        {/* Neck */}
        <rect x="44" y="70" width="12" height="16" rx="4" fill="#8b5e3c" />

        {/* Body */}
        <ellipse cx="50" cy="94" rx="26" ry="14" fill="#e53935" />
        <ellipse cx="50" cy="88" rx="18" ry="10" fill="#f06060" />

        {/* Face */}
        <ellipse cx="50" cy="54" rx="20" ry="22" fill="#9b6340" />

        {/* Hair crown front */}
        <path d="M28 44 Q30 30 50 28 Q70 30 72 44" fill="#1a0a02" />

        {/* Decorative hair tie accent */}
        <circle cx="32" cy="56" r="3" fill="#e8c060" opacity="0.9" />
        <circle cx="68" cy="56" r="3" fill="#e8c060" opacity="0.9" />

        {/* Eyes */}
        <ellipse cx="42" cy="53" rx="4" ry="4.5" fill="#fff" />
        <ellipse cx="58" cy="53" rx="4" ry="4.5" fill="#fff" />
        <circle cx="43" cy="54" r="2.8" fill="#2c1408" />
        <circle cx="59" cy="54" r="2.8" fill="#2c1408" />
        <circle cx="44" cy="53" r="1.2" fill="#000" />
        <circle cx="60" cy="53" r="1.2" fill="#000" />
        <circle cx="44.5" cy="52.5" r="0.7" fill="#fff" />
        <circle cx="60.5" cy="52.5" r="0.7" fill="#fff" />

        {/* Eyebrows */}
        <path d="M38 48 Q42 46 46 48" stroke="#1a0a02" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M54 48 Q58 46 62 48" stroke="#1a0a02" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Nose */}
        <path d="M48 60 Q47 63 50 64 Q53 63 52 60" stroke="#7a4520" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Smile */}
        <path d="M44 67 Q50 72 56 67" stroke="#c07050" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Blush */}
        <ellipse cx="37" cy="61" rx="5" ry="3" fill="#c07050" opacity="0.35" />
        <ellipse cx="63" cy="61" rx="5" ry="3" fill="#c07050" opacity="0.35" />
      </g>

      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(200,140,40,0.5)" strokeWidth="2" />
    </svg>
  );
}
