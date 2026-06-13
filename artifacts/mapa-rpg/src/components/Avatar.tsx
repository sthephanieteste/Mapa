interface AvatarProps {
  character: 1 | 2;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const BASE = import.meta.env.BASE_URL;

export default function Avatar({ character, size = 48, className = "", style = {} }: AvatarProps) {
  const src = character === 1
    ? `${BASE}avatar-char1.png`
    : `${BASE}avatar-char2.png`;

  const accentColor = character === 1 ? "#c49a3c" : "#e84040";

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: `0 0 0 1.5px ${accentColor}60, 0 0 12px ${accentColor}30`,
        ...style,
      }}
    >
      <img
        src={src}
        alt={`Personagem ${character}`}
        width={size}
        height={size}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          display: "block",
        }}
      />
    </div>
  );
}
