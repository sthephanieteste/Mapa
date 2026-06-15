import { useState } from "react";
import Avatar from "./Avatar";
import AchievementsPanel from "./AchievementsPanel";
import { useProgress } from "@/hooks/useProgress";
import { CHAPTERS } from "@/data/chapters";

type ConfirmAction =
  | "resetAll"
  | { type: "resetChapter"; id: string };

export default function GameHUD() {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const { completedCount, totalCount, completedChapters, resetAll, resetChapter } = useProgress();
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  function closeMenu() {
    setShowProgress(false);
    setShowChapterList(false);
  }

  return (
    <>
      {/* ── Solid header bar (48px) — only this intercepts pointer events ── */}
      <div
        className="absolute top-0 left-0 right-0 z-40 flex items-center gap-3 px-4"
        style={{
          height: "48px",
          background: "rgba(6,3,1,0.96)",
          borderBottom: "1px solid rgba(200,140,40,0.22)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Characters */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div style={{ borderRadius: "50%", padding: "2px", background: "linear-gradient(135deg,rgba(196,154,60,0.75),rgba(196,154,60,0.15))", boxShadow: "0 0 10px rgba(196,154,60,0.3)" }}>
            <Avatar character={1} size={30} />
          </div>
          <span style={{ fontSize: "9px", filter: "drop-shadow(0 0 4px rgba(232,64,64,0.7))", animation: "pulse-heart 1.8s ease-in-out infinite", lineHeight: 1 }}>❤️</span>
          <div style={{ borderRadius: "50%", padding: "2px", background: "linear-gradient(135deg,rgba(232,64,64,0.75),rgba(232,64,64,0.15))", boxShadow: "0 0 10px rgba(232,64,64,0.25)" }}>
            <Avatar character={2} size={30} />
          </div>
        </div>

        <div className="hidden sm:block w-px self-stretch" style={{ background: "rgba(200,140,40,0.18)", marginTop: 8, marginBottom: 8 }} />

        {/* Center: title + progress */}
        <div className="flex-1 flex items-center gap-3 min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span style={{ color: "rgba(200,140,40,0.45)", fontSize: "8px" }}>✦</span>
            <h1 className="text-xs font-bold uppercase select-none whitespace-nowrap" style={{ color: "#f0d888", fontFamily: "Georgia, serif", textShadow: "0 0 16px rgba(200,160,40,0.4)", letterSpacing: "0.18em" }}>
              Nossa História
            </h1>
            <span style={{ color: "rgba(200,140,40,0.45)", fontSize: "8px" }}>✦</span>
          </div>

          {/* Progress bar — hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-[220px]">
            <span className="flex-shrink-0 text-xs" style={{ color: "#e8c060", fontFamily: "Georgia, serif", fontSize: "10px" }}>{completedCount}/{totalCount}</span>
            <div className="flex-1 relative rounded-full overflow-hidden" style={{ height: "5px", background: "rgba(10,6,2,0.8)", border: "1px solid rgba(200,140,40,0.2)" }}>
              <div style={{ position: "absolute", inset: "0 auto 0 0", borderRadius: "9999px", width: `${progressPercent}%`, background: "linear-gradient(90deg,#c49a3c 0%,#f0d060 50%,#c49a3c 100%)", boxShadow: "0 0 5px rgba(200,160,40,0.6)", transition: "width 0.8s ease", minWidth: completedCount > 0 ? "8px" : "0" }} />
            </div>
          </div>
        </div>

        {/* Progresso button — top right */}
        <button
          onClick={() => { setShowProgress((v) => !v); setShowChapterList(false); }}
          className="flex-shrink-0 flex items-center gap-1.5 transition-all hover:scale-105"
          style={{ background: "rgba(200,140,20,0.14)", border: "1px solid rgba(200,140,40,0.32)", borderRadius: "8px", padding: "4px 10px", color: "#e8c060", fontSize: "10px", fontFamily: "Georgia, serif", letterSpacing: "0.05em", cursor: "pointer" }}
        >
          ⚙️ <span className="hidden sm:inline">Progresso</span>
        </button>
      </div>

      {/* ── Gradient fade below header (pointer-events:none) ── */}
      <div
        className="absolute left-0 right-0 z-30"
        style={{ top: "48px", height: "40px", background: "linear-gradient(180deg, rgba(6,3,1,0.55) 0%, transparent 100%)", pointerEvents: "none" }}
      />

      {/* ── Progress dropdown menu ── */}
      {showProgress && (
        <div className="fixed inset-0 z-50" onClick={closeMenu}>
          <div
            className="absolute right-3 rounded-xl p-4 w-60"
            style={{ top: "54px", background: "rgba(10,6,2,0.97)", border: "1px solid rgba(200,140,40,0.32)", boxShadow: "0 8px 32px rgba(0,0,0,0.65)", backdropFilter: "blur(16px)", animation: "fadeIn 0.15s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#f0d888", fontFamily: "Georgia, serif", letterSpacing: "0.14em" }}>PROGRESSO</p>

            {/* Ver Conquistas */}
            <button
              onClick={() => { closeMenu(); setShowAchievements(true); }}
              className="w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all hover:bg-white/5"
              style={{ color: "rgba(220,185,110,0.9)", fontFamily: "Georgia, serif", fontSize: "13px" }}
            >
              🏆 Ver Conquistas
            </button>

            <div style={{ height: "1px", background: "rgba(200,140,40,0.14)", margin: "6px 0" }} />

            {/* Reiniciar Capítulo */}
            <button
              onClick={() => setShowChapterList((v) => !v)}
              className="w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all hover:bg-white/5 flex items-center justify-between"
              style={{ color: "rgba(220,185,110,0.9)", fontFamily: "Georgia, serif", fontSize: "13px" }}
            >
              <span>📖 Reiniciar Capítulo</span>
              <span style={{ fontSize: "10px", opacity: 0.5 }}>{showChapterList ? "▲" : "▼"}</span>
            </button>

            {showChapterList && (
              <div className="ml-2 mb-1 space-y-0.5 max-h-48 overflow-y-auto">
                {completedChapters.length === 0 ? (
                  <p className="px-3 py-1 text-xs" style={{ color: "rgba(160,120,60,0.5)", fontFamily: "Georgia, serif" }}>
                    Nenhum capítulo concluído ainda.
                  </p>
                ) : (
                  completedChapters.map((id) => {
                    const ch = Object.values(CHAPTERS).find((c) => c.id === id);
                    if (!ch) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => { setConfirmAction({ type: "resetChapter", id }); closeMenu(); }}
                        className="w-full text-left px-3 py-1.5 rounded-lg transition-all hover:bg-white/5"
                        style={{ color: "rgba(200,160,80,0.75)", fontFamily: "Georgia, serif", fontSize: "11px" }}
                      >
                        {ch.icon} {ch.title}
                      </button>
                    );
                  })
                )}
              </div>
            )}

            <div style={{ height: "1px", background: "rgba(200,140,40,0.14)", margin: "6px 0" }} />

            {/* Reiniciar Tudo */}
            <button
              onClick={() => { setConfirmAction("resetAll"); closeMenu(); }}
              className="w-full text-left px-3 py-2.5 rounded-lg transition-all hover:bg-red-900/20"
              style={{ color: "rgba(240,110,80,0.78)", fontFamily: "Georgia, serif", fontSize: "13px" }}
            >
              🔄 Reiniciar História Completa
            </button>
          </div>
        </div>
      )}

      {/* ── Confirmation modal ── */}
      {confirmAction && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          style={{ background: "rgba(4,2,1,0.88)", backdropFilter: "blur(5px)" }}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-sm"
            style={{ background: "rgba(14,8,2,0.98)", border: "1px solid rgba(220,80,40,0.32)", boxShadow: "0 20px 60px rgba(0,0,0,0.75)", animation: "fadeIn 0.18s ease" }}
          >
            <div className="text-center mb-5">
              <div style={{ fontSize: "38px", marginBottom: "14px" }}>⚠️</div>
              <p className="font-bold text-base mb-2" style={{ color: "#f0d888", fontFamily: "Georgia, serif" }}>
                {confirmAction === "resetAll"
                  ? "Reiniciar toda a história?"
                  : `Reiniciar "${Object.values(CHAPTERS).find((c) => c.id === (confirmAction as { type: string; id: string }).id)?.title}"?`}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(200,160,80,0.65)", fontFamily: "Georgia, serif" }}>
                {confirmAction === "resetAll"
                  ? "Todo o progresso será apagado e você voltará ao Capítulo I. Esta ação não poderá ser desfeita."
                  : "O progresso deste capítulo e todos os posteriores serão apagados. Esta ação não poderá ser desfeita."}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (confirmAction === "resetAll") {
                    resetAll();
                  } else {
                    resetChapter((confirmAction as { type: string; id: string }).id);
                  }
                  setConfirmAction(null);
                }}
                className="flex-1 py-2.5 rounded-full text-sm transition-all hover:scale-105"
                style={{ background: "rgba(200,70,30,0.28)", border: "1px solid rgba(220,80,40,0.48)", color: "rgba(240,160,100,0.92)", fontFamily: "Georgia, serif" }}
              >
                ↺ Confirmar
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2.5 rounded-full text-sm transition-all hover:scale-105"
                style={{ background: "rgba(15,10,3,0.8)", border: "1px solid rgba(160,120,50,0.22)", color: "rgba(180,140,70,0.7)", fontFamily: "Georgia, serif" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showAchievements && (
        <AchievementsPanel onClose={() => setShowAchievements(false)} />
      )}
    </>
  );
}
