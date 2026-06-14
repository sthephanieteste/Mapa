import { useState, useEffect } from "react";

const ELEMENTS = [
  {
    key: "casa",
    icon: "🏠",
    name: "Nossa Casa",
    text: `Eu não sei como ela será.

Não sei se será grande ou pequena.

Não sei quantas mudanças vamos fazer até chegar nela.

Mas sei que, enquanto você estiver lá, ela será meu lar.`,
  },
  {
    key: "filhos",
    icon: "👶",
    name: "Filhos",
    text: `Confesso que às vezes penso nisso.

Em pequenos pedaços de nós duas correndo pela casa.

Dando trabalho.

Quebrando coisas.

Fazendo perguntas impossíveis de responder.

E transformando dias comuns em aventuras.`,
  },
  {
    key: "casamento",
    icon: "💍",
    name: "Casamento",
    text: `Por muito tempo eu achei que algumas histórias eram bonitas apenas nos filmes.

Mas hoje penso que talvez a nossa possa ser uma delas.

Sem perfeição.

Sem roteiro.

Só duas pessoas escolhendo uma à outra todos os dias. 😭❤️`,
  },
  {
    key: "vida",
    icon: "🌎",
    name: "Vida a Dois",
    text: `Eu não sei exatamente o que o futuro guarda.

Talvez existam dificuldades.

Talvez existam mudanças.

Talvez existam desafios que ainda nem conseguimos imaginar.

Mas pela primeira vez isso não me assusta tanto.

Porque não estou imaginando esse futuro sozinha.`,
  },
  {
    key: "paciencia",
    icon: "⏳",
    name: "Paciência",
    text: `Dizem que a paciência é uma virtude.

E talvez seja mesmo.

Porque algumas coisas levam tempo.

Sonhos levam tempo.

Planos levam tempo.

Construir uma vida leva tempo.

Mas se existe uma coisa que aprendi com nós duas...

É que algumas esperas valem a pena. ❤️`,
  },
];

const FINAL_TEXT = `Eu não posso prometer que tudo será fácil.

Não posso prometer que nunca vamos errar.

Não posso prometer que sempre saberemos o que fazer.

Mas posso prometer uma coisa.

Enquanto você quiser continuar esta aventura...

Eu também vou querer.

E se um dia você cogitar em não querer prosseguir, estarei disposta a fazer você se apaixonar por mim novamente quantas vezes forem necessário.

Amo-te demasiadamente.`;

export default function FutureChapter({
  chapterId,
  chapterColor,
  isCompleted,
  completeChapter,
  onNavigateMap,
}: {
  chapterId: string;
  chapterColor: string;
  isCompleted: boolean;
  completeChapter: (id: string) => void;
  nextChapterId: string | null;
  onNavigateNext: (id: string) => void;
  onNavigateMap: () => void;
}) {
  const [visited, setVisited] = useState<Set<string>>(
    isCompleted ? new Set(ELEMENTS.map((e) => e.key)) : new Set()
  );
  const [active, setActive] = useState<string | null>(null);
  const [showFinal, setShowFinal] = useState(isCompleted);
  const [showEnding, setShowEnding] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (isCompleted) {
      setVisited(new Set(ELEMENTS.map((e) => e.key)));
      setShowFinal(true);
    }
  }, [isCompleted]);

  const allVisited = ELEMENTS.every((e) => visited.has(e.key));

  function handleClick(key: string, e: React.MouseEvent) {
    setActive(active === key ? null : key);
    if (!visited.has(key)) {
      const newVisited = new Set([...visited, key]);
      setVisited(newVisited);
      // Spawn sparkle particles at click position
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const id = Date.now();
      setParticles((p) => [...p, { id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }]);
      setTimeout(() => setParticles((p) => p.filter((pt) => pt.id !== id)), 1200);
      // Trigger final reveal
      if (newVisited.size === ELEMENTS.length) {
        setTimeout(() => setShowFinal(true), 600);
      }
    }
  }

  function handleComplete() {
    if (!isCompleted) completeChapter(chapterId);
    setShowEnding(true);
  }

  const activeEl = ELEMENTS.find((e) => e.key === active);

  return (
    <section style={{ position: "relative" }}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `${chapterColor}25`, border: `1.5px solid ${chapterColor}50`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
        }}>
          ✨
        </div>
        <h2 style={{
          fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.14em",
          textTransform: "uppercase", color: `${chapterColor}cc`,
        }}>
          O Que Ainda Está por Vir
        </h2>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${chapterColor}40, transparent)` }} />
      </div>

      {/* Intro card */}
      <div style={{
        borderRadius: "16px", padding: "20px 24px", marginBottom: "24px",
        background: `linear-gradient(135deg, ${chapterColor}10, rgba(10,6,2,0.8))`,
        border: `1px solid ${chapterColor}25`,
        textAlign: "center",
        animation: "fadeIn 0.5s ease",
      }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: `${chapterColor}70`, marginBottom: "6px" }}>
          📍 O Futuro — Região Desconhecida
        </p>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(220,190,130,0.7)", lineHeight: 1.6, fontStyle: "italic" }}>
          Nenhuma memória encontrada.
          <br />
          Porque esta parte da história ainda está sendo escrita. ❤️
        </p>
        <div style={{ marginTop: "12px", fontFamily: "Georgia, serif", fontSize: "11px", color: `${chapterColor}60` }}>
          Objetivo: Imaginar os próximos capítulos. ✦ Clique em cada elemento para explorar ✦
        </div>
      </div>

      {/* Elements grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px",
        marginBottom: "20px",
      }}>
        {ELEMENTS.slice(0, 3).map((el) => <ElementCard key={el.key} el={el} active={active} visited={visited} color={chapterColor} onClick={handleClick} />)}
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
        marginBottom: "20px",
      }}>
        {ELEMENTS.slice(3).map((el) => <ElementCard key={el.key} el={el} active={active} visited={visited} color={chapterColor} onClick={handleClick} />)}
      </div>

      {/* Active element text */}
      {activeEl && (
        <div
          key={activeEl.key}
          style={{
            borderRadius: "16px", padding: "22px 24px", marginBottom: "24px",
            background: "linear-gradient(135deg, rgba(14,9,2,0.98), rgba(22,14,4,0.98))",
            border: `1px solid ${chapterColor}30`,
            boxShadow: `0 0 30px ${chapterColor}08`,
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "22px" }}>{activeEl.icon}</span>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: "bold", color: chapterColor }}>
              {activeEl.name}
            </p>
          </div>
          {activeEl.text.split("\n\n").map((p, i) => (
            <p key={i} style={{
              fontFamily: "Georgia, serif", fontSize: "14px", lineHeight: 1.85,
              color: "rgba(225,195,140,0.9)", fontStyle: "italic", marginBottom: "12px",
            }}>
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Progress */}
      {!allVisited && (
        <p style={{
          textAlign: "center", fontFamily: "Georgia, serif", fontSize: "11px",
          color: "rgba(180,140,60,0.4)", letterSpacing: "0.06em", marginBottom: "16px",
        }}>
          {visited.size} / {ELEMENTS.length} capítulos imaginados
        </p>
      )}

      {/* Final reveal */}
      {showFinal && !showEnding && (
        <div style={{ animation: "fadeIn 0.8s ease" }}>
          <div style={{
            borderRadius: "20px", overflow: "hidden",
            background: "linear-gradient(135deg, rgba(14,9,2,0.99), rgba(22,14,4,0.99))",
            border: `1px solid ${chapterColor}50`,
            boxShadow: `0 0 60px ${chapterColor}18`,
            marginBottom: "8px",
          }}>
            <div style={{
              padding: "18px 28px 12px", textAlign: "center",
              borderBottom: `1px solid ${chapterColor}20`,
              background: `linear-gradient(135deg, ${chapterColor}18, transparent)`,
            }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", fontWeight: "bold", color: "#f0d888" }}>
                ✨ Futuro Desbloqueado
              </p>
            </div>
            <div style={{ padding: "24px 28px 20px" }}>
              {FINAL_TEXT.split("\n\n").map((p, i) => (
                <p key={i} style={{
                  fontFamily: "Georgia, serif", fontSize: "14px", lineHeight: 1.9,
                  color: "rgba(225,200,145,0.95)", fontStyle: "italic", marginBottom: "14px",
                  ...(i === FINAL_TEXT.split("\n\n").length - 1
                    ? { color: "#f0d060", fontStyle: "normal", fontWeight: "bold", fontSize: "15px" }
                    : {}),
                }}>
                  {p}
                </p>
              ))}
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <button
                  onClick={handleComplete}
                  className="hover:scale-105 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${chapterColor}35, ${chapterColor}18)`,
                    border: `1px solid ${chapterColor}70`, borderRadius: "50px",
                    padding: "14px 40px", color: "#f0d888",
                    fontFamily: "Georgia, serif", fontSize: "15px",
                    cursor: "pointer", letterSpacing: "0.07em",
                    boxShadow: `0 0 30px ${chapterColor}20`,
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  ❤️ Continuar Escrevendo Esta História
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ending overlay */}
      {showEnding && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(6,3,1,0.97)",
          animation: "fadeIn 0.6s ease",
        }}>
          <div style={{ maxWidth: "440px", padding: "40px 32px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px", filter: "drop-shadow(0 0 16px #ffd700)", animation: "float 3s ease-in-out infinite" }}>
              🏆
            </div>
            <p style={{
              fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: "bold",
              color: "#f0d888", marginBottom: "8px", letterSpacing: "0.05em",
            }}>
              Aventura Concluída
            </p>
            <div style={{
              width: "60px", height: "1px", background: `linear-gradient(90deg, transparent, ${chapterColor}, transparent)`,
              margin: "16px auto",
            }} />
            <p style={{
              fontFamily: "Georgia, serif", fontSize: "15px", fontStyle: "italic",
              color: "rgba(220,190,130,0.9)", lineHeight: 1.8, marginBottom: "8px",
            }}>
              Fim?
            </p>
            <p style={{
              fontFamily: "Georgia, serif", fontSize: "15px", fontStyle: "italic",
              color: "rgba(220,190,130,0.9)", lineHeight: 1.8, marginBottom: "28px",
            }}>
              Não.
              <br />
              Apenas o início dos próximos capítulos.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={onNavigateMap}
                className="hover:scale-105 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${chapterColor}30, ${chapterColor}15)`,
                  border: `1px solid ${chapterColor}60`, borderRadius: "50px",
                  padding: "12px 32px", color: "#f0d888",
                  fontFamily: "Georgia, serif", fontSize: "14px", cursor: "pointer",
                  letterSpacing: "0.06em",
                }}
              >
                ← Ver o Mapa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sparkle particles */}
      {particles.map((pt) => (
        <div
          key={pt.id}
          style={{
            position: "fixed", left: pt.x, top: pt.y,
            pointerEvents: "none", zIndex: 90,
            fontSize: "20px",
            animation: "sparkleUp 1.1s ease forwards",
          }}
        >
          ✨
        </div>
      ))}

      <style>{`
        @keyframes sparkleUp {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
          50%  { opacity: 1; transform: translate(-50%, -120%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -200%) scale(0.8); }
        }
      `}</style>
    </section>
  );
}

function ElementCard({
  el, active, visited, color, onClick,
}: {
  el: typeof ELEMENTS[0];
  active: string | null;
  visited: Set<string>;
  color: string;
  onClick: (key: string, e: React.MouseEvent) => void;
}) {
  const isActive = active === el.key;
  const isVisited = visited.has(el.key);

  return (
    <button
      onClick={(e) => onClick(el.key, e)}
      className={isVisited ? "" : "hover:scale-105"}
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${color}25, ${color}10)`
          : isVisited
          ? "rgba(20,14,4,0.85)"
          : "rgba(14,9,2,0.95)",
        border: isActive
          ? `1.5px solid ${color}70`
          : isVisited
          ? `1px solid ${color}35`
          : `1px dashed rgba(200,160,60,0.25)`,
        borderRadius: "16px", padding: "18px 10px",
        cursor: "pointer", textAlign: "center",
        transition: "all 0.25s",
        boxShadow: isActive ? `0 0 24px ${color}18` : "none",
        position: "relative",
      }}
    >
      <div style={{
        fontSize: "28px", marginBottom: "8px",
        filter: isVisited ? `drop-shadow(0 0 8px ${color}60)` : "none",
        animation: isActive ? "float 3s ease-in-out infinite" : "none",
        transition: "filter 0.3s",
      }}>
        {el.icon}
      </div>
      <p style={{
        fontFamily: "Georgia, serif", fontSize: "12px", fontWeight: "bold",
        color: isVisited ? color : "rgba(200,170,100,0.65)",
        letterSpacing: "0.04em",
        transition: "color 0.3s",
      }}>
        {el.name}
      </p>
      {!isVisited && (
        <div style={{
          position: "absolute", top: "8px", right: "10px",
          fontSize: "9px", color: "rgba(180,140,60,0.3)",
        }}>
          ✦
        </div>
      )}
      {isVisited && (
        <div style={{ marginTop: "5px", fontSize: "10px", color: `${color}99` }}>
          ✓
        </div>
      )}
    </button>
  );
}
