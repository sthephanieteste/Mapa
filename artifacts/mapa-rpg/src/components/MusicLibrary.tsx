import { useMusicPlayer, PLAYLIST } from "@/hooks/useMusicPlayer";

interface Props {
  onClose: () => void;
}

export default function MusicLibrary({ onClose }: Props) {
  const { playing, currentIdx, playTrack, toggle } = useMusicPlayer();

  return (
    <div
      className="fixed inset-0 z-[55] flex items-start justify-center pt-16 px-4"
      style={{ background: "rgba(4,2,1,0.82)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: "rgba(12,7,2,0.98)",
          border: "1px solid rgba(200,140,40,0.3)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
          animation: "fadeIn 0.18s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(200,140,40,0.15)" }}
        >
          <div>
            <p className="font-bold text-sm tracking-widest uppercase" style={{ color: "#f0d888", fontFamily: "Georgia, serif", letterSpacing: "0.14em" }}>
              🎵 Biblioteca de Músicas
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(200,160,70,0.5)", fontFamily: "Georgia, serif" }}>
              {PLAYLIST.length} faixas disponíveis
            </p>
          </div>
          <button
            onClick={onClose}
            className="transition-opacity hover:opacity-60"
            style={{ color: "rgba(200,160,60,0.7)", fontSize: "18px", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Now playing bar */}
        <div
          className="px-5 py-3 flex items-center gap-3"
          style={{ background: "rgba(200,140,20,0.08)", borderBottom: "1px solid rgba(200,140,40,0.12)" }}
        >
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(200,140,20,0.2)", border: "1px solid rgba(200,140,40,0.4)" }}
          >
            <span style={{ fontSize: "13px" }}>{playing ? "🔊" : "🔇"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "#e8c060", fontFamily: "Georgia, serif" }}>
              {PLAYLIST[currentIdx].name}
            </p>
            <p className="text-xs truncate" style={{ color: "rgba(200,160,70,0.55)", fontFamily: "Georgia, serif" }}>
              {PLAYLIST[currentIdx].artist}
            </p>
          </div>
          <button
            onClick={toggle}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: playing ? "rgba(200,140,20,0.25)" : "rgba(40,25,5,0.6)", border: `1px solid ${playing ? "rgba(200,140,40,0.5)" : "rgba(200,140,40,0.2)"}` }}
          >
            <span style={{ fontSize: "14px" }}>{playing ? "⏸" : "▶"}</span>
          </button>
        </div>

        {/* Track list */}
        <div className="py-2 max-h-72 overflow-y-auto">
          {PLAYLIST.map((track, idx) => {
            const isActive = idx === currentIdx;
            return (
              <button
                key={idx}
                onClick={() => { playTrack(idx); }}
                className="w-full flex items-center gap-3 px-5 py-3 transition-all hover:bg-white/5"
                style={{ textAlign: "left" }}
              >
                {/* Track number / playing indicator */}
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: isActive ? "rgba(200,140,20,0.25)" : "rgba(30,18,5,0.5)",
                    border: `1px solid ${isActive ? "rgba(200,140,40,0.5)" : "rgba(200,140,40,0.15)"}`,
                    color: isActive ? "#e8c060" : "rgba(200,160,70,0.4)",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {isActive && playing ? "♪" : idx + 1}
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm truncate"
                    style={{
                      fontFamily: "Georgia, serif",
                      color: isActive ? "#f0d888" : "rgba(220,185,110,0.85)",
                      fontWeight: isActive ? "bold" : "normal",
                    }}
                  >
                    {track.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: "rgba(180,140,60,0.5)", fontFamily: "Georgia, serif" }}>
                    {track.artist}
                  </p>
                </div>

                {/* Active glow dot */}
                {isActive && (
                  <div
                    className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
                    style={{ background: "#e8c060", boxShadow: "0 0 6px rgba(200,160,40,0.8)", animation: playing ? "pulse-heart 1.5s ease-in-out infinite" : "none" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 flex items-center justify-center gap-2"
          style={{ borderTop: "1px solid rgba(200,140,40,0.1)" }}
        >
          <span style={{ fontSize: "9px", color: "rgba(200,160,40,0.35)", fontFamily: "Georgia, serif", letterSpacing: "0.1em" }}>
            ✦ a música continua ao navegar ✦
          </span>
        </div>
      </div>
    </div>
  );
}
