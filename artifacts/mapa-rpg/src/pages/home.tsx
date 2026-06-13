import { useState } from "react";

interface Hotspot {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  details: string;
}

const hotspots: Hotspot[] = [
  {
    id: "cristo-praia",
    label: "Cristo Redentor & Praia",
    description: "A costa do Rio de Janeiro",
    x: 8,
    y: 55,
    width: 18,
    height: 28,
    icon: "✝️",
    details:
      "A majestosa costa carioca se estende entre praias de areia branca e o Cristo Redentor no alto do Corcovado. Ponto de partida da grande jornada — onde o oceano encontra a montanha e a aventura começa.",
  },
  {
    id: "onibus-rio",
    label: "Ônibus de Rio de Janeiro",
    description: "O início da jornada",
    x: 22,
    y: 45,
    width: 14,
    height: 16,
    icon: "🚌",
    details:
      "O ônibus parte da cidade maravilhosa carregando aventureiros rumo ao interior. Cruzando montanhas, rios e pontes, a estrada revela paisagens inesquecíveis entre florestas e colinas do sul do Brasil.",
  },
];

interface ModalProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

function Modal({ hotspot, onClose }: ModalProps) {
  if (!hotspot) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 max-w-md w-full mx-4 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          background:
            "linear-gradient(135deg, rgba(20,10,5,0.97) 0%, rgba(40,20,8,0.97) 100%)",
          border: "1px solid rgba(200,140,40,0.5)",
          boxShadow:
            "0 0 40px rgba(200,120,20,0.3), inset 0 0 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(220,160,40,0.8), transparent)",
          }}
        />

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{hotspot.icon}</span>
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{
                    color: "#e8c060",
                    fontFamily: "Georgia, serif",
                    textShadow: "0 0 20px rgba(220,160,40,0.5)",
                  }}
                >
                  {hotspot.label}
                </h2>
                <p className="text-sm" style={{ color: "rgba(200,160,80,0.7)" }}>
                  {hotspot.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-2xl leading-none transition-opacity hover:opacity-60"
              style={{ color: "rgba(200,140,40,0.8)" }}
            >
              ×
            </button>
          </div>

          <div
            className="h-px w-full my-4"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(200,140,40,0.4), transparent)",
            }}
          />

          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(230,200,140,0.9)", fontFamily: "Georgia, serif" }}
          >
            {hotspot.details}
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, rgba(200,130,20,0.6), rgba(160,90,10,0.4))",
                border: "1px solid rgba(220,160,40,0.5)",
                color: "#e8c060",
                boxShadow: "0 0 20px rgba(200,120,20,0.2)",
              }}
            >
              Continuar Jornada
            </button>
          </div>
        </div>

        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(220,160,40,0.4), transparent)",
          }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#0a0704" }}
    >
      <img
        src={`${import.meta.env.BASE_URL}mapa-rpg-illustration.png?v=2`}
        alt="Mapa RPG"
        className="w-full h-full object-cover"
        style={{ display: "block" }}
      />

      <div className="absolute inset-0">
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            className="absolute transition-all duration-200"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: `${spot.width}%`,
              height: `${spot.height}%`,
              background:
                hoveredId === spot.id
                  ? "rgba(220,160,40,0.15)"
                  : "transparent",
              border:
                hoveredId === spot.id
                  ? "2px solid rgba(220,160,40,0.6)"
                  : "2px solid transparent",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow:
                hoveredId === spot.id
                  ? "0 0 20px rgba(220,140,20,0.3), inset 0 0 20px rgba(220,140,20,0.1)"
                  : "none",
            }}
            onMouseEnter={() => setHoveredId(spot.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setActiveHotspot(spot)}
            aria-label={spot.label}
          >
            {hoveredId === spot.id && (
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap pointer-events-none"
                style={{
                  background: "rgba(15,8,2,0.95)",
                  border: "1px solid rgba(220,160,40,0.5)",
                  color: "#e8c060",
                  fontFamily: "Georgia, serif",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
                }}
              >
                {spot.label}
              </div>
            )}
          </button>
        ))}
      </div>

      <div
        className="absolute bottom-4 right-4 text-xs px-3 py-1.5 rounded-full"
        style={{
          background: "rgba(10,5,2,0.8)",
          border: "1px solid rgba(200,140,40,0.3)",
          color: "rgba(200,160,80,0.7)",
          fontFamily: "Georgia, serif",
          backdropFilter: "blur(8px)",
        }}
      >
        ✦ Clique nos locais para explorar ✦
      </div>

      <Modal hotspot={activeHotspot} onClose={() => setActiveHotspot(null)} />
    </div>
  );
}
