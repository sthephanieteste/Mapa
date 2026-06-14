import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { CHAPTER_ORDER } from "@/data/progression";

const CHAPTER_META: Record<string, { num: number; name: string; icon: string }> = {
  "rio-de-janeiro":   { num: 1, name: "Rio de Janeiro",      icon: "🌊" },
  "a-viagem":         { num: 2, name: "A Viagem",             icon: "🚌" },
  "utfpr":            { num: 3, name: "UTFPR Cornélio",       icon: "🎓" },
  "della-pazetti":    { num: 4, name: "Della Pazetti",        icon: "🍕" },
  "cristo-cornelio":  { num: 5, name: "Cristo de Cornélio",   icon: "✝️" },
  "utfpr-guarapuava": { num: 6, name: "UTFPR Guarapuava",     icon: "🏔️" },
  "o-futuro":         { num: 7, name: "O Futuro",             icon: "✨" },
};

type ConfirmTarget = { kind: "chapter"; id: string } | { kind: "all" };

export default function SettingsSidebar() {
  const [open, setOpen]             = useState(false);
  const [confirm, setConfirm]       = useState<ConfirmTarget | null>(null);
  const [resetDone, setResetDone]   = useState<string | null>(null);

  const { resetChapter, resetAll, isUnlocked, isCompleted } = useProgress();

  function handleResetChapter(id: string) {
    resetChapter(id);
    setConfirm(null);
    setResetDone(id);
    setTimeout(() => setResetDone(null), 2000);
  }

  function handleResetAll() {
    setConfirm(null);
    resetAll(); // reloads page internally
  }

  const gold = "rgba(200,140,40,";

  return (
    <>
      {/* ── Gear trigger button — bottom left ── */}
      <button
        onClick={() => setOpen(true)}
        title="Configurações de Progresso"
        style={{
          position: "fixed",
          bottom: "18px",
          left: "18px",
          zIndex: 110,
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          background: "rgba(14,9,2,0.82)",
          border: `1px solid ${gold}0.28)`,
          color: "rgba(200,155,60,0.75)",
          fontSize: "17px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          transition: "all 0.25s ease",
          boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,140,20,0.18)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = `${gold}0.55)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(14,9,2,0.82)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = `${gold}0.28)`;
        }}
      >
        ⚙️
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(3px)",
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* ── Sidebar panel ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 130,
          width: "300px",
          background: "linear-gradient(180deg, rgba(10,6,2,0.99) 0%, rgba(16,10,3,0.99) 100%)",
          borderRight: `1px solid ${gold}0.30)`,
          boxShadow: "4px 0 40px rgba(0,0,0,0.7)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: `1px solid ${gold}0.18)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "10px", letterSpacing: "0.16em", color: `${gold}0.5)`, textTransform: "uppercase", marginBottom: "3px" }}>
              ⚙️ Configurações
            </p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#f0d888", fontWeight: "bold" }}>
              Progresso da Aventura
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              color: `${gold}0.55)`,
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Chapter resets */}
        <div style={{ padding: "16px 16px 8px", flexShrink: 0 }}>
          <p style={{
            fontFamily: "Georgia, serif", fontSize: "10px", letterSpacing: "0.14em",
            color: `${gold}0.4)`, textTransform: "uppercase", marginBottom: "12px",
          }}>
            ✦ Refazer Capítulo
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {CHAPTER_ORDER.map((id) => {
              const meta    = CHAPTER_META[id];
              const unlocked  = isUnlocked(id);
              const completed = isCompleted(id);
              const justReset = resetDone === id;

              return (
                <button
                  key={id}
                  onClick={() => unlocked && setConfirm({ kind: "chapter", id })}
                  disabled={!unlocked}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: justReset
                      ? "1px solid rgba(100,200,100,0.45)"
                      : completed
                      ? `1px solid ${gold}0.35)`
                      : `1px solid ${gold}0.15)`,
                    background: justReset
                      ? "rgba(40,100,40,0.18)"
                      : completed
                      ? `${gold}0.10)`
                      : "rgba(20,14,4,0.6)",
                    cursor: unlocked ? "pointer" : "default",
                    opacity: unlocked ? 1 : 0.4,
                    transition: "all 0.2s ease",
                    width: "100%",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!unlocked) return;
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,80,40,0.14)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,80,40,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    if (!unlocked) return;
                    (e.currentTarget as HTMLButtonElement).style.background = justReset
                      ? "rgba(40,100,40,0.18)"
                      : completed ? `${gold}0.10)` : "rgba(20,14,4,0.6)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = justReset
                      ? "rgba(100,200,100,0.45)"
                      : completed ? `${gold}0.35)` : `${gold}0.15)`;
                  }}
                >
                  <span style={{ fontSize: "16px", flexShrink: 0 }}>{meta.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "Georgia, serif", fontSize: "11px",
                      color: `${gold}0.45)`, letterSpacing: "0.06em", marginBottom: "1px",
                    }}>
                      Capítulo {meta.num}
                    </p>
                    <p style={{
                      fontFamily: "Georgia, serif", fontSize: "13px",
                      color: justReset ? "rgba(140,220,140,0.9)" : "rgba(220,190,130,0.85)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {justReset ? "✓ Resetado!" : meta.name}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {!unlocked && (
                      <span style={{ fontSize: "12px", color: `${gold}0.3)` }}>🔒</span>
                    )}
                    {unlocked && completed && !justReset && (
                      <span style={{ fontSize: "10px", color: `${gold}0.6)` }}>✓</span>
                    )}
                    {unlocked && !completed && !justReset && (
                      <span style={{ fontSize: "10px", color: `${gold}0.3)` }}>↺</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: `${gold}0.15)`, margin: "8px 16px" }} />

        {/* Reset all */}
        <div style={{ padding: "8px 16px 24px", flexShrink: 0 }}>
          <p style={{
            fontFamily: "Georgia, serif", fontSize: "10px", letterSpacing: "0.14em",
            color: "rgba(200,60,60,0.45)", textTransform: "uppercase", marginBottom: "12px",
          }}>
            ⚠️ Zona de Perigo
          </p>
          <button
            onClick={() => setConfirm({ kind: "all" })}
            style={{
              width: "100%",
              padding: "13px 16px",
              borderRadius: "14px",
              border: "1.5px solid rgba(200,50,50,0.5)",
              background: "linear-gradient(135deg, rgba(60,10,10,0.9), rgba(40,8,8,0.9))",
              color: "rgba(240,140,140,0.95)",
              fontFamily: "Georgia, serif",
              fontSize: "13px",
              fontWeight: "bold",
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 0 20px rgba(200,40,40,0.10)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg, rgba(100,15,15,0.95), rgba(70,10,10,0.95))";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,80,80,0.75)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(200,40,40,0.20)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg, rgba(60,10,10,0.9), rgba(40,8,8,0.9))";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,50,50,0.5)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(200,40,40,0.10)";
            }}
          >
            🔄 REINICIAR TODA A AVENTURA
          </button>
          <p style={{
            fontFamily: "Georgia, serif", fontSize: "10px",
            color: "rgba(180,80,80,0.5)", textAlign: "center", marginTop: "8px",
            lineHeight: 1.5,
          }}>
            Apaga todo o progresso e volta ao início.
          </p>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {confirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            animation: "fadeIn 0.18s ease",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setConfirm(null)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)" }}
          />

          {/* Modal box */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              background: "linear-gradient(135deg, rgba(14,8,2,0.99) 0%, rgba(20,12,3,0.99) 100%)",
              border: confirm.kind === "all"
                ? "1.5px solid rgba(200,60,60,0.55)"
                : `1.5px solid ${gold}0.45)`,
              borderRadius: "20px",
              padding: "28px 28px 24px",
              maxWidth: "340px",
              width: "100%",
              boxShadow: confirm.kind === "all"
                ? "0 0 60px rgba(200,40,40,0.20)"
                : `0 0 60px rgba(200,140,20,0.15)`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>
              {confirm.kind === "all" ? "⚠️" : "↺"}
            </div>

            <h3 style={{
              fontFamily: "Georgia, serif",
              fontSize: "17px",
              fontWeight: "bold",
              color: confirm.kind === "all" ? "rgba(240,140,140,0.95)" : "#f0d888",
              marginBottom: "10px",
            }}>
              {confirm.kind === "all"
                ? "Reiniciar tudo?"
                : `Refazer Capítulo ${CHAPTER_META[confirm.id].num}?`}
            </h3>

            <p style={{
              fontFamily: "Georgia, serif",
              fontSize: "13px",
              color: "rgba(210,175,120,0.8)",
              lineHeight: 1.7,
              marginBottom: "22px",
            }}>
              {confirm.kind === "all"
                ? "Tem certeza? Todo o progresso será perdido, amor! ❤️\n\nEsta ação não pode ser desfeita."
                : `O progresso do capítulo "${CHAPTER_META[confirm.id].name}" e de todos os capítulos seguintes será apagado.`}
            </p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setConfirm(null)}
                style={{
                  padding: "10px 22px",
                  borderRadius: "50px",
                  border: `1px solid ${gold}0.30)`,
                  background: "rgba(20,14,4,0.8)",
                  color: `${gold}0.75)`,
                  fontFamily: "Georgia, serif",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (confirm.kind === "all") {
                    handleResetAll();
                  } else {
                    handleResetChapter(confirm.id);
                  }
                }}
                style={{
                  padding: "10px 22px",
                  borderRadius: "50px",
                  border: confirm.kind === "all"
                    ? "1px solid rgba(220,80,80,0.6)"
                    : `1px solid ${gold}0.5)`,
                  background: confirm.kind === "all"
                    ? "linear-gradient(135deg, rgba(180,30,30,0.7), rgba(140,20,20,0.7))"
                    : `linear-gradient(135deg, ${gold}0.25), ${gold}0.12))`,
                  color: confirm.kind === "all"
                    ? "rgba(255,180,180,0.95)"
                    : "#f0d888",
                  fontFamily: "Georgia, serif",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {confirm.kind === "all" ? "Sim, reiniciar!" : "Sim, refazer!"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
