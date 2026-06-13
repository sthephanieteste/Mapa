import { useState } from "react";
import Avatar from "./Avatar";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  date?: string;
  xp: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "primeiro-encontro",
    title: "Primeiro Encontro",
    description: "Os caminhos se cruzaram pela primeira vez nos corredores da UTFPR.",
    icon: "👀",
    color: "#7c3aed",
    unlocked: true,
    date: "2024",
    xp: 300,
  },
  {
    id: "primeira-conversa",
    title: "Primeira Conversa",
    description: "As palavras que abriram uma porta que nunca mais fechou.",
    icon: "💬",
    color: "#2196f3",
    unlocked: true,
    date: "2024",
    xp: 400,
  },
  {
    id: "primeira-saida",
    title: "Primeira Saída",
    description: "A aventura além do campus — o início de algo muito maior.",
    icon: "🍕",
    color: "#e53935",
    unlocked: true,
    date: "2024",
    xp: 500,
  },
  {
    id: "o-pedido",
    title: "O Pedido",
    description: "Embaixo do Cristo de Cornélio, com o coração acelerado e um sim que mudou tudo.",
    icon: "💍",
    color: "#f59e0b",
    unlocked: true,
    date: "2025",
    xp: 1000,
  },
  {
    id: "jornada-guarapuava",
    title: "Jornada para Guarapuava",
    description: "Novos horizontes, nova cidade, mas a mesma parceria de sempre.",
    icon: "🏔️",
    color: "#10b981",
    unlocked: true,
    date: "2025",
    xp: 600,
  },
  {
    id: "nossa-historia-continua",
    title: "Nossa História Continua",
    description: "A aventura está longe de acabar. Cada dia é um novo capítulo sendo escrito.",
    icon: "✨",
    color: "#f59e0b",
    unlocked: true,
    date: "2026",
    xp: 999,
  },
];

const TOTAL_XP = ACHIEVEMENTS.filter((a) => a.unlocked).reduce((s, a) => s + a.xp, 0);

interface Props {
  onClose: () => void;
}

export default function AchievementsPanel({ onClose }: Props) {
  const [selected, setSelected] = useState<Achievement | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(12px)",
        animation: "fadeIn 0.25s ease",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0d0905 0%, #110c06 100%)",
          border: "1px solid rgba(200,140,40,0.35)",
          boxShadow: "0 0 60px rgba(200,140,20,0.15), 0 20px 60px rgba(0,0,0,0.8)",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{
            background: "linear-gradient(180deg, rgba(13,9,5,0.98) 0%, rgba(13,9,5,0.92) 100%)",
            borderBottom: "1px solid rgba(200,140,40,0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: "#f0d888", fontFamily: "Georgia, serif" }}
              >
                Conquistas
              </h2>
              <p className="text-xs" style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif" }}>
                {ACHIEVEMENTS.filter((a) => a.unlocked).length}/{ACHIEVEMENTS.length} desbloqueadas
                &nbsp;·&nbsp;{TOTAL_XP.toLocaleString()} XP total
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
            style={{
              background: "rgba(200,140,20,0.15)",
              border: "1px solid rgba(200,140,40,0.3)",
              color: "rgba(200,160,80,0.7)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Characters ── */}
        <div className="flex items-center justify-center gap-6 py-4 px-6">
          <div className="flex flex-col items-center gap-1">
            <div
              style={{
                borderRadius: "50%",
                padding: "3px",
                background: "linear-gradient(135deg, #c49a3c80, #c49a3c20)",
                boxShadow: "0 0 16px rgba(196,154,60,0.4)",
              }}
            >
              <Avatar character={1} size={52} />
            </div>
            <span className="text-xs" style={{ color: "#c49a3c", fontFamily: "Georgia, serif" }}>Você</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span
              className="text-2xl"
              style={{
                filter: "drop-shadow(0 0 8px rgba(230,80,80,0.6))",
                animation: "pulse-heart 1.5s ease-in-out infinite",
              }}
            >
              ❤️
            </span>
            <span
              className="text-xs tracking-widest"
              style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif", fontSize: "9px" }}
            >
              JUNTOS
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div
              style={{
                borderRadius: "50%",
                padding: "3px",
                background: "linear-gradient(135deg, #e8404080, #e8404020)",
                boxShadow: "0 0 16px rgba(232,64,64,0.4)",
              }}
            >
              <Avatar character={2} size={52} />
            </div>
            <span className="text-xs" style={{ color: "#e84040", fontFamily: "Georgia, serif" }}>Ela</span>
          </div>
        </div>

        <div
          className="mx-6 mb-4 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(200,140,40,0.3), transparent)" }}
        />

        {/* ── Achievements Grid ── */}
        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((ach) => (
            <AchievementCard
              key={ach.id}
              ach={ach}
              selected={selected?.id === ach.id}
              onClick={() => setSelected(selected?.id === ach.id ? null : ach)}
            />
          ))}
        </div>

        {/* ── Detail panel ── */}
        {selected && (
          <div
            className="mx-6 mb-6 rounded-xl p-5"
            style={{
              background: `linear-gradient(135deg, ${selected.color}12, rgba(10,6,2,0.8))`,
              border: `1px solid ${selected.color}40`,
              borderLeft: `3px solid ${selected.color}80`,
              animation: "fadeIn 0.2s ease",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{selected.icon}</span>
              <div>
                <h3
                  className="text-base font-bold"
                  style={{ color: selected.color, fontFamily: "Georgia, serif" }}
                >
                  {selected.title}
                </h3>
                {selected.date && (
                  <p className="text-xs" style={{ color: "rgba(180,140,60,0.5)", fontFamily: "Georgia, serif" }}>
                    {selected.date} · +{selected.xp} XP
                  </p>
                )}
              </div>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(230,200,140,0.88)", fontFamily: "Georgia, serif" }}
            >
              {selected.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AchievementCard({
  ach,
  selected,
  onClick,
}: {
  ach: Achievement;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl p-4 transition-all duration-200 focus:outline-none group"
      style={{
        background: selected
          ? `linear-gradient(135deg, ${ach.color}20, rgba(10,6,2,0.9))`
          : `linear-gradient(135deg, rgba(20,13,4,0.7), rgba(15,9,2,0.9))`,
        border: `1px solid ${selected ? ach.color + "60" : "rgba(200,140,40,0.15)"}`,
        boxShadow: selected ? `0 0 20px ${ach.color}20` : "none",
        cursor: "pointer",
        transform: selected ? "scale(1.01)" : "scale(1)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
          style={{
            background: ach.unlocked
              ? `linear-gradient(135deg, ${ach.color}25, ${ach.color}10)`
              : "rgba(30,20,8,0.6)",
            border: `1.5px solid ${ach.unlocked ? ach.color + "50" : "rgba(100,80,40,0.2)"}`,
            boxShadow: ach.unlocked ? `0 0 12px ${ach.color}25` : "none",
            filter: ach.unlocked ? "none" : "grayscale(1) opacity(0.4)",
          }}
        >
          {ach.unlocked ? ach.icon : "🔒"}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-bold leading-tight"
            style={{
              color: ach.unlocked ? "#e8c060" : "rgba(180,140,60,0.3)",
              fontFamily: "Georgia, serif",
            }}
          >
            {ach.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {ach.unlocked && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: `${ach.color}20`,
                  color: ach.color,
                  fontSize: "9px",
                  fontFamily: "Georgia, serif",
                }}
              >
                +{ach.xp} XP
              </span>
            )}
            {ach.date && ach.unlocked && (
              <span
                className="text-xs"
                style={{ color: "rgba(180,140,60,0.4)", fontSize: "9px", fontFamily: "Georgia, serif" }}
              >
                {ach.date}
              </span>
            )}
          </div>
        </div>

        {ach.unlocked && (
          <div
            className="flex-shrink-0 w-2 h-2 rounded-full"
            style={{
              background: ach.color,
              boxShadow: `0 0 6px ${ach.color}`,
            }}
          />
        )}
      </div>
    </button>
  );
}
