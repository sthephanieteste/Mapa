interface AvatarProps {
  character: 1 | 2;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Avatar({ character, size = 48, className = "", style = {} }: AvatarProps) {
  if (character === 1) return <Char1Avatar size={size} className={className} style={style} />;
  return <Char2Avatar size={size} className={className} style={style} />;
}

/* ─────────────────────────────────────────────────────────
   PERSONAGEM 1
   Pele clara, cabelo longo liso castanho escuro
   Estilo: ilustração de jogo de aventura romântico
───────────────────────────────────────────────────────── */
function Char1Avatar({ size, className, style }: { size: number; className: string; style: React.CSSProperties }) {
  const id = "c1";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* portrait circle clip */}
        <clipPath id={`${id}-clip`}><circle cx="60" cy="60" r="57"/></clipPath>
        {/* background gradient — warm parchment */}
        <radialGradient id={`${id}-bg`} cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor="#2e1a08"/>
          <stop offset="100%" stopColor="#0e0804"/>
        </radialGradient>
        {/* skin gradient — warm ivory */}
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8dab6"/>
          <stop offset="60%" stopColor="#f0c898"/>
          <stop offset="100%" stopColor="#dba870"/>
        </linearGradient>
        {/* skin shadow */}
        <radialGradient id={`${id}-skin-shadow`} cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor="#d4935a" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#d4935a" stopOpacity="0"/>
        </radialGradient>
        {/* hair gradient — deep brown */}
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#1c0a02"/>
          <stop offset="40%" stopColor="#2e1206"/>
          <stop offset="100%" stopColor="#4a2010"/>
        </linearGradient>
        {/* hair highlight */}
        <linearGradient id={`${id}-hair-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6a3520" stopOpacity="0"/>
          <stop offset="40%" stopColor="#7a4025" stopOpacity="0.6"/>
          <stop offset="60%" stopColor="#8a5030" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#6a3520" stopOpacity="0"/>
        </linearGradient>
        {/* eye iris */}
        <radialGradient id={`${id}-iris`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#6b3a15"/>
          <stop offset="60%" stopColor="#3d1e08"/>
          <stop offset="100%" stopColor="#1a0900"/>
        </radialGradient>
        {/* golden rim */}
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4a040"/>
          <stop offset="50%" stopColor="#f0c860"/>
          <stop offset="100%" stopColor="#a07820"/>
        </linearGradient>
        {/* cloth */}
        <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5c2a8a"/>
          <stop offset="100%" stopColor="#3a1a60"/>
        </linearGradient>
        {/* cloth decoration */}
        <linearGradient id={`${id}-collar`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4a040"/>
          <stop offset="50%" stopColor="#f8d870"/>
          <stop offset="100%" stopColor="#d4a040"/>
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation="0.8"/>
        </filter>
      </defs>

      {/* ── BACKGROUND ── */}
      <circle cx="60" cy="60" r="57" fill={`url(#${id}-bg)`}/>

      {/* subtle warm glow from below */}
      <ellipse cx="60" cy="90" rx="45" ry="30" fill="#c08030" opacity="0.12"/>

      <g clipPath={`url(#${id}-clip)`}>

        {/* ── HAIR BACK LAYER (below face) ── */}
        {/* main hair mass flowing behind — long straight */}
        <path
          d="M12 52 Q14 28 28 20 Q38 14 60 13 Q82 14 92 20 Q106 28 108 52 Q112 80 110 120 L95 120 Q96 85 94 68 Q92 55 88 50 Q82 44 74 42 L60 41 L46 42 Q38 44 32 50 Q28 55 26 68 Q24 85 25 120 L10 120 Q8 80 12 52Z"
          fill={`url(#${id}-hair)`}
        />
        {/* hair shine on back */}
        <path
          d="M32 18 Q60 12 88 18 Q98 22 104 32 Q100 24 88 18 Q60 12 32 18Z"
          fill={`url(#${id}-hair-shine)`}
          opacity="0.7"
        />

        {/* ── NECK ── */}
        <rect x="51" y="77" width="18" height="22" rx="6" fill={`url(#${id}-skin)`}/>
        <rect x="53" y="77" width="14" height="12" rx="3" fill="#d4935a" opacity="0.15"/>

        {/* ── SHOULDERS / CLOTHING ── */}
        <path d="M10 120 Q18 95 35 88 Q47 84 60 83 Q73 84 85 88 Q102 95 110 120Z"
          fill={`url(#${id}-cloth)`}/>
        {/* collar gold trim */}
        <path d="M42 88 Q60 95 78 88 L74 84 Q60 90 46 84Z"
          fill={`url(#${id}-collar)`} opacity="0.85"/>
        {/* decorative brooch */}
        <circle cx="60" cy="90" r="4.5" fill="#c49a3c" opacity="0.9"/>
        <circle cx="60" cy="90" r="2.5" fill="#f8d870"/>
        <circle cx="60" cy="90" r="1" fill="#c49a3c"/>

        {/* ── FACE ── */}
        {/* face base */}
        <ellipse cx="60" cy="52" rx="25" ry="28" fill={`url(#${id}-skin)`}/>
        {/* subtle face shading */}
        <ellipse cx="60" cy="58" rx="25" ry="28" fill={`url(#${id}-skin-shadow)`}/>
        {/* jaw definition */}
        <path d="M37 62 Q38 78 44 82 Q52 87 60 87 Q68 87 76 82 Q82 78 83 62"
          fill="none" stroke="#d4935a" strokeWidth="0.5" opacity="0.3"/>

        {/* ── HAIR FRONT / TOP ── */}
        {/* scalp/top hair */}
        <path
          d="M35 36 Q36 22 60 20 Q84 22 85 36 Q82 28 60 27 Q38 28 35 36Z"
          fill={`url(#${id}-hair)`}
        />
        {/* side hair framing face — left */}
        <path
          d="M35 36 Q30 42 28 54 Q26 64 27 76 Q28 82 30 88 L26 88 Q22 80 22 70 Q21 55 24 44 Q28 32 35 28Z"
          fill={`url(#${id}-hair)`}
        />
        {/* side hair framing face — right */}
        <path
          d="M85 36 Q90 42 92 54 Q94 64 93 76 Q92 82 90 88 L94 88 Q98 80 98 70 Q99 55 96 44 Q92 32 85 28Z"
          fill={`url(#${id}-hair)`}
        />
        {/* hair shine on top */}
        <path
          d="M42 24 Q60 20 78 24 Q70 22 60 22 Q50 22 42 24Z"
          fill="#7a4528" opacity="0.5"
        />
        {/* hair middle part subtle */}
        <path d="M60 20 L60 33" stroke="#1c0a02" strokeWidth="0.8" opacity="0.4"/>

        {/* ── EAR ── */}
        <ellipse cx="35.5" cy="59" rx="3.5" ry="4.5" fill="#f0c898"/>
        <ellipse cx="84.5" cy="59" rx="3.5" ry="4.5" fill="#f0c898"/>
        {/* ear shadow */}
        <path d="M33 57 Q33.5 62 36 62" stroke="#d4935a" strokeWidth="0.8" fill="none" opacity="0.4"/>
        <path d="M87 57 Q86.5 62 84 62" stroke="#d4935a" strokeWidth="0.8" fill="none" opacity="0.4"/>

        {/* ── EYEBROWS ── */}
        {/* left brow — natural arch */}
        <path d="M43 40 Q48 37.5 53 39" stroke="#2a1206" strokeWidth="2.2"
          strokeLinecap="round" fill="none"/>
        <path d="M44 40.5 Q48 38 52 39.5" stroke="#3d1c0a" strokeWidth="1.2"
          strokeLinecap="round" fill="none" opacity="0.6"/>
        {/* right brow */}
        <path d="M67 39 Q72 37.5 77 40" stroke="#2a1206" strokeWidth="2.2"
          strokeLinecap="round" fill="none"/>
        <path d="M68 39.5 Q72 38 76 40.5" stroke="#3d1c0a" strokeWidth="1.2"
          strokeLinecap="round" fill="none" opacity="0.6"/>

        {/* ── EYES ── */}
        {/* eye socket shadow left */}
        <ellipse cx="48" cy="48" rx="7" ry="5.5" fill="#d4935a" opacity="0.12"/>
        {/* eye socket shadow right */}
        <ellipse cx="72" cy="48" rx="7" ry="5.5" fill="#d4935a" opacity="0.12"/>

        {/* left eye white */}
        <path d="M41 47.5 Q44 43.5 48 43.5 Q52 43.5 55 47.5 Q52 51 48 51 Q44 51 41 47.5Z"
          fill="white"/>
        {/* right eye white */}
        <path d="M65 47.5 Q68 43.5 72 43.5 Q76 43.5 79 47.5 Q76 51 72 51 Q68 51 65 47.5Z"
          fill="white"/>

        {/* left iris */}
        <circle cx="48" cy="47.5" r="4.2" fill={`url(#${id}-iris)`}/>
        {/* right iris */}
        <circle cx="72" cy="47.5" r="4.2" fill={`url(#${id}-iris)`}/>

        {/* pupils */}
        <circle cx="48.5" cy="47.5" r="2.4" fill="#0d0500"/>
        <circle cx="72.5" cy="47.5" r="2.4" fill="#0d0500"/>

        {/* catchlights */}
        <circle cx="50" cy="45.8" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="74" cy="45.8" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="47.2" cy="48.8" r="0.5" fill="white" opacity="0.5"/>
        <circle cx="71.2" cy="48.8" r="0.5" fill="white" opacity="0.5"/>

        {/* upper eyelid crease */}
        <path d="M41 47 Q44 42.5 48 42.8 Q52 43 55 47" stroke="#2a1206"
          strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M65 47 Q68 42.5 72 42.8 Q76 43 79 47" stroke="#2a1206"
          strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"/>

        {/* lower lash line */}
        <path d="M41.5 48.2 Q44 50.5 55 48.2" stroke="#2a1206"
          strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.4"/>
        <path d="M65.5 48.2 Q68 50.5 79 48.2" stroke="#2a1206"
          strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.4"/>

        {/* ── NOSE ── */}
        {/* nose bridge */}
        <path d="M56 50 Q57 56 55.5 60" stroke="#c4824a" strokeWidth="0.8"
          fill="none" opacity="0.35"/>
        <path d="M64 50 Q63 56 64.5 60" stroke="#c4824a" strokeWidth="0.8"
          fill="none" opacity="0.35"/>
        {/* nose tip shadow */}
        <path d="M54 62 Q57 64.5 60 64 Q63 64.5 66 62" stroke="#c4824a"
          strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45"/>
        {/* nostrils subtle */}
        <circle cx="55.5" cy="62.5" r="1.5" fill="#c4824a" opacity="0.2"/>
        <circle cx="64.5" cy="62.5" r="1.5" fill="#c4824a" opacity="0.2"/>

        {/* ── MOUTH ── */}
        {/* upper lip */}
        <path d="M50 68 Q54 65.5 57 66.8 Q59 65.8 60 66 Q61 65.8 63 66.8 Q66 65.5 70 68"
          stroke="#c07858" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        {/* upper lip fill */}
        <path d="M50 68 Q54 65.5 57 66.8 Q59 65.5 60 66 Q61 65.5 63 66.8 Q66 65.5 70 68 Q63 70 60 69.5 Q57 70 50 68Z"
          fill="#d4886a" opacity="0.6"/>
        {/* lower lip */}
        <path d="M50 68.5 Q55 74 60 74.5 Q65 74 70 68.5"
          stroke="#c07858" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        {/* lower lip fill */}
        <path d="M50 68.5 Q55 74 60 74.5 Q65 74 70 68.5 Q63 70 60 69.5 Q57 70 50 68.5Z"
          fill="#e09878" opacity="0.55"/>
        {/* lip highlight */}
        <path d="M56 71.5 Q60 73.2 64 71.5" stroke="white"
          strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.3"/>
        {/* smile line */}
        <path d="M50 68 Q49 71 51 73" stroke="#c4824a"
          strokeWidth="0.7" fill="none" opacity="0.3"/>
        <path d="M70 68 Q71 71 69 73" stroke="#c4824a"
          strokeWidth="0.7" fill="none" opacity="0.3"/>

        {/* ── BLUSH / GLOW ── */}
        <ellipse cx="40" cy="62" rx="7" ry="4" fill="#e88080" opacity="0.13"/>
        <ellipse cx="80" cy="62" rx="7" ry="4" fill="#e88080" opacity="0.13"/>

        {/* ── GOLDEN AMBIENT LIGHT ── */}
        <ellipse cx="60" cy="85" rx="40" ry="20" fill="#c08030" opacity="0.08"/>

      </g>

      {/* ── ORNATE FRAME ── */}
      <circle cx="60" cy="60" r="57" fill="none" stroke={`url(#${id}-rim)`} strokeWidth="2.5"/>
      {/* corner ornaments */}
      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(200,160,40,0.15)" strokeWidth="1"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   PERSONAGEM 2
   Pele mais escura, tranças longas com pontas mais claras
   Estilo: ilustração de jogo de aventura romântico
───────────────────────────────────────────────────────── */
function Char2Avatar({ size, className, style }: { size: number; className: string; style: React.CSSProperties }) {
  const id = "c2";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`${id}-clip`}><circle cx="60" cy="60" r="57"/></clipPath>
        {/* bg */}
        <radialGradient id={`${id}-bg`} cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor="#1a1408"/>
          <stop offset="100%" stopColor="#080606"/>
        </radialGradient>
        {/* skin — warm medium-dark */}
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b87840"/>
          <stop offset="55%" stopColor="#a06230"/>
          <stop offset="100%" stopColor="#7a4420"/>
        </linearGradient>
        {/* skin shadow */}
        <radialGradient id={`${id}-skin-shadow`} cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor="#7a4420" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#7a4420" stopOpacity="0"/>
        </radialGradient>
        {/* hair base — very dark brown */}
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#140802"/>
          <stop offset="50%" stopColor="#200d04"/>
          <stop offset="100%" stopColor="#3a1a08"/>
        </linearGradient>
        {/* braid color — mid brown */}
        <linearGradient id={`${id}-braid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1408"/>
          <stop offset="60%" stopColor="#4a2810"/>
          <stop offset="100%" stopColor="#8a5820"/>
        </linearGradient>
        {/* braid tips — caramel/golden */}
        <linearGradient id={`${id}-tips`} x1="0" y1="0.7" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5820"/>
          <stop offset="50%" stopColor="#c48030"/>
          <stop offset="100%" stopColor="#e0a840"/>
        </linearGradient>
        {/* eye iris */}
        <radialGradient id={`${id}-iris`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#5c3010"/>
          <stop offset="55%" stopColor="#2a1005"/>
          <stop offset="100%" stopColor="#0d0400"/>
        </radialGradient>
        {/* golden rim */}
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4a040"/>
          <stop offset="50%" stopColor="#f0c860"/>
          <stop offset="100%" stopColor="#a07820"/>
        </linearGradient>
        {/* cloth */}
        <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a2020"/>
          <stop offset="100%" stopColor="#4a0e0e"/>
        </linearGradient>
        {/* collar */}
        <linearGradient id={`${id}-collar`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4a040"/>
          <stop offset="50%" stopColor="#f8d870"/>
          <stop offset="100%" stopColor="#d4a040"/>
        </linearGradient>
      </defs>

      {/* ── BACKGROUND ── */}
      <circle cx="60" cy="60" r="57" fill={`url(#${id}-bg)`}/>
      <ellipse cx="60" cy="92" rx="44" ry="28" fill="#c07820" opacity="0.10"/>

      <g clipPath={`url(#${id}-clip)`}>

        {/* ── HAIR BACK — braids hanging behind ── */}
        {/* main mass */}
        <path
          d="M15 48 Q18 24 34 17 Q46 11 60 11 Q74 11 86 17 Q102 24 105 48 Q110 80 108 120 L94 120 Q96 84 94 65 Q92 52 86 46 Q78 40 68 39 L52 39 Q42 40 34 46 Q28 52 26 65 Q24 84 26 120 L12 120 Q10 80 15 48Z"
          fill={`url(#${id}-hair)`}
        />

        {/* braids hanging on both sides — with texture */}
        {/* LEFT braids group */}
        <path d="M26 60 Q22 75 24 92 Q25 102 24 115" stroke="#2a1408" strokeWidth="9" strokeLinecap="round" fill="none"/>
        <path d="M26 60 Q22 75 24 92 Q25 102 24 115" stroke="#3a1e0c" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray="5 3.5"/>
        {/* left tip highlight */}
        <path d="M24 100 Q24 108 24 115" stroke="#c48030" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.85"/>
        <path d="M24 106 Q24 111 24 115" stroke="#e8b048" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6"/>

        {/* second LEFT braid */}
        <path d="M32 62 Q28 78 30 96 Q31 106 30 118" stroke="#221205" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M32 62 Q28 78 30 96 Q31 106 30 118" stroke="#3a1e0c" strokeWidth="5" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>
        <path d="M30 104 Q30 112 30 118" stroke="#c48030" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85"/>
        <path d="M30 110 Q30 115 30 118" stroke="#e8b048" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6"/>

        {/* RIGHT braids group */}
        <path d="M94 60 Q98 75 96 92 Q95 102 96 115" stroke="#2a1408" strokeWidth="9" strokeLinecap="round" fill="none"/>
        <path d="M94 60 Q98 75 96 92 Q95 102 96 115" stroke="#3a1e0c" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray="5 3.5"/>
        <path d="M96 100 Q96 108 96 115" stroke="#c48030" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.85"/>
        <path d="M96 106 Q96 111 96 115" stroke="#e8b048" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6"/>

        {/* second RIGHT braid */}
        <path d="M88 62 Q92 78 90 96 Q89 106 90 118" stroke="#221205" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M88 62 Q92 78 90 96 Q89 106 90 118" stroke="#3a1e0c" strokeWidth="5" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>
        <path d="M90 104 Q90 112 90 118" stroke="#c48030" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85"/>
        <path d="M90 110 Q90 115 90 118" stroke="#e8b048" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6"/>

        {/* ── NECK ── */}
        <rect x="51" y="77" width="18" height="22" rx="6" fill={`url(#${id}-skin)`}/>
        <rect x="54" y="77" width="12" height="11" rx="3" fill="#7a4420" opacity="0.18"/>

        {/* ── SHOULDERS / CLOTHING ── */}
        <path d="M10 120 Q18 95 36 88 Q48 83 60 82 Q72 83 84 88 Q102 95 110 120Z"
          fill={`url(#${id}-cloth)`}/>
        <path d="M42 88 Q60 95 78 88 L74 83 Q60 90 46 83Z"
          fill={`url(#${id}-collar)`} opacity="0.85"/>
        {/* brooch */}
        <circle cx="60" cy="90" r="4.5" fill="#c49a3c" opacity="0.9"/>
        <circle cx="60" cy="90" r="2.5" fill="#f8d870"/>
        <circle cx="60" cy="90" r="1" fill="#c49a3c"/>

        {/* ── FACE ── */}
        <ellipse cx="60" cy="53" rx="25" ry="27" fill={`url(#${id}-skin)`}/>
        <ellipse cx="60" cy="60" rx="25" ry="27" fill={`url(#${id}-skin-shadow)`}/>
        {/* jaw */}
        <path d="M37 64 Q38 79 45 83 Q52 87 60 87 Q68 87 75 83 Q82 79 83 64"
          fill="none" stroke="#7a4420" strokeWidth="0.5" opacity="0.3"/>

        {/* ── HAIR FRONT/CROWN — natural texture ── */}
        <path
          d="M35 36 Q36 22 60 19 Q84 22 85 36 Q82 27 60 25 Q38 27 35 36Z"
          fill={`url(#${id}-hair)`}
        />
        {/* crown braids/coils pattern */}
        <path d="M42 26 Q50 22 60 21 Q70 22 78 26 Q74 24 60 23 Q46 24 42 26Z"
          fill="#3a1e0c" opacity="0.6"/>

        {/* left temple braid */}
        <path d="M36 38 Q31 44 30 54 Q29 62 30 72 Q30 77 29 84"
          stroke="#2a1408" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M36 38 Q31 44 30 54 Q29 62 30 72 Q30 77 29 84"
          stroke="#3a1e0c" strokeWidth="5" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>

        {/* right temple braid */}
        <path d="M84 38 Q89 44 90 54 Q91 62 90 72 Q90 77 91 84"
          stroke="#2a1408" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M84 38 Q89 44 90 54 Q91 62 90 72 Q90 77 91 84"
          stroke="#3a1e0c" strokeWidth="5" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>

        {/* braid tie ornaments — gold beads */}
        <circle cx="30" cy="56" r="3.5" fill="#c49a3c"/>
        <circle cx="30" cy="56" r="2" fill="#f0c850"/>
        <circle cx="30" cy="56" r="0.8" fill="#c49a3c"/>
        <circle cx="90" cy="56" r="3.5" fill="#c49a3c"/>
        <circle cx="90" cy="56" r="2" fill="#f0c850"/>
        <circle cx="90" cy="56" r="0.8" fill="#c49a3c"/>

        {/* ── EARS ── */}
        <ellipse cx="35.5" cy="60" rx="3.5" ry="4.5" fill="#a06230"/>
        <ellipse cx="84.5" cy="60" rx="3.5" ry="4.5" fill="#a06230"/>
        {/* ear detail */}
        <path d="M33.5 58 Q34 63 36 63" stroke="#7a4420" strokeWidth="0.8" fill="none" opacity="0.4"/>
        <path d="M86.5 58 Q86 63 84 63" stroke="#7a4420" strokeWidth="0.8" fill="none" opacity="0.4"/>
        {/* earring */}
        <circle cx="35.5" cy="65" r="2.5" fill="#c49a3c"/>
        <circle cx="35.5" cy="65" r="1.4" fill="#f0c850"/>
        <circle cx="84.5" cy="65" r="2.5" fill="#c49a3c"/>
        <circle cx="84.5" cy="65" r="1.4" fill="#f0c850"/>

        {/* ── EYEBROWS — bold natural arches ── */}
        <path d="M43 41 Q48 38 53 40" stroke="#160802" strokeWidth="2.6"
          strokeLinecap="round" fill="none"/>
        <path d="M44 41.5 Q48 38.5 52 40.5" stroke="#2a1208" strokeWidth="1.4"
          strokeLinecap="round" fill="none" opacity="0.55"/>
        <path d="M67 40 Q72 38 77 41" stroke="#160802" strokeWidth="2.6"
          strokeLinecap="round" fill="none"/>
        <path d="M68 40.5 Q72 38.5 76 41.5" stroke="#2a1208" strokeWidth="1.4"
          strokeLinecap="round" fill="none" opacity="0.55"/>

        {/* ── EYES ── */}
        {/* socket shadow */}
        <ellipse cx="48" cy="49" rx="7.5" ry="6" fill="#7a4420" opacity="0.18"/>
        <ellipse cx="72" cy="49" rx="7.5" ry="6" fill="#7a4420" opacity="0.18"/>

        {/* eye whites */}
        <path d="M41 48.5 Q44.5 44 48 44 Q51.5 44 55 48.5 Q51.5 52.5 48 52.5 Q44.5 52.5 41 48.5Z"
          fill="white"/>
        <path d="M65 48.5 Q68.5 44 72 44 Q75.5 44 79 48.5 Q75.5 52.5 72 52.5 Q68.5 52.5 65 48.5Z"
          fill="white"/>

        {/* irises */}
        <circle cx="48" cy="48.5" r="4.5" fill={`url(#${id}-iris)`}/>
        <circle cx="72" cy="48.5" r="4.5" fill={`url(#${id}-iris)`}/>

        {/* pupils */}
        <circle cx="48.5" cy="48.5" r="2.6" fill="#080300"/>
        <circle cx="72.5" cy="48.5" r="2.6" fill="#080300"/>

        {/* catchlights */}
        <circle cx="50" cy="46.8" r="1.2" fill="white" opacity="0.9"/>
        <circle cx="74" cy="46.8" r="1.2" fill="white" opacity="0.9"/>
        <circle cx="47.2" cy="49.8" r="0.5" fill="white" opacity="0.45"/>
        <circle cx="71.2" cy="49.8" r="0.5" fill="white" opacity="0.45"/>

        {/* lashes — upper */}
        <path d="M41 48 Q44.5 43 48 43.5 Q51.5 43 55 48" stroke="#100600"
          strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85"/>
        <path d="M65 48 Q68.5 43 72 43.5 Q75.5 43 79 48" stroke="#100600"
          strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85"/>
        {/* lash tips */}
        <path d="M41.5 46.5 L40 44.5 M43 45 L42 43 M55 47 L56.5 44.8" stroke="#100600" strokeWidth="0.8" fill="none" opacity="0.5"/>
        <path d="M65.5 46.5 L64 44.5 M67 45 L66 43 M79 47 L80.5 44.8" stroke="#100600" strokeWidth="0.8" fill="none" opacity="0.5"/>

        {/* lower lash */}
        <path d="M42 49.5 Q44.5 52 55 49.5" stroke="#100600"
          strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.35"/>
        <path d="M66 49.5 Q68.5 52 79 49.5" stroke="#100600"
          strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.35"/>

        {/* ── NOSE ── */}
        {/* bridge lines */}
        <path d="M56.5 52 Q57 57 56 61" stroke="#8a4820" strokeWidth="0.9"
          fill="none" opacity="0.4"/>
        <path d="M63.5 52 Q63 57 64 61" stroke="#8a4820" strokeWidth="0.9"
          fill="none" opacity="0.4"/>
        {/* nose base — wider, natural */}
        <path d="M52 63 Q55 66.5 60 66 Q65 66.5 68 63" stroke="#8a4820"
          strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55"/>
        {/* nostrils */}
        <ellipse cx="54" cy="63.5" rx="2.2" ry="1.5" fill="#8a4820" opacity="0.25"/>
        <ellipse cx="66" cy="63.5" rx="2.2" ry="1.5" fill="#8a4820" opacity="0.25"/>
        {/* nose tip highlight */}
        <ellipse cx="60" cy="62.5" rx="3" ry="2" fill="#c08040" opacity="0.18"/>

        {/* ── MOUTH ── */}
        {/* upper lip — fuller */}
        <path d="M49 69 Q54 65 58 67 Q59.5 65.8 60 66 Q60.5 65.8 62 67 Q66 65 71 69"
          stroke="#a05838" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        <path d="M49 69 Q54 65 58 67 Q60 65.5 62 67 Q66 65 71 69 Q64 71 60 70.5 Q56 71 49 69Z"
          fill="#c07858" opacity="0.65"/>
        {/* lower lip — full */}
        <path d="M49 69.5 Q54 76 60 76.5 Q66 76 71 69.5"
          stroke="#a05838" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M49 69.5 Q54 76 60 76.5 Q66 76 71 69.5 Q64 71 60 70.5 Q56 71 49 69.5Z"
          fill="#d88868" opacity="0.6"/>
        {/* lip highlight */}
        <path d="M55 73 Q60 75.2 65 73" stroke="white"
          strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.28"/>
        {/* cupid bow highlight */}
        <path d="M57 67.2 Q60 66 63 67.2" stroke="white"
          strokeWidth="0.5" fill="none" opacity="0.2"/>

        {/* ── BLUSH ── */}
        <ellipse cx="40" cy="64" rx="7" ry="4" fill="#c06040" opacity="0.14"/>
        <ellipse cx="80" cy="64" rx="7" ry="4" fill="#c06040" opacity="0.14"/>

        {/* ── GOLDEN WARM LIGHT ── */}
        <ellipse cx="60" cy="87" rx="40" ry="20" fill="#c07820" opacity="0.09"/>

      </g>

      {/* ── ORNATE FRAME ── */}
      <circle cx="60" cy="60" r="57" fill="none" stroke={`url(#${id}-rim)`} strokeWidth="2.5"/>
      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(200,160,40,0.15)" strokeWidth="1"/>
    </svg>
  );
}
