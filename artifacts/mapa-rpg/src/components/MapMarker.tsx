import { useState } from "react";
import { useLocation } from "wouter";
import type { MapMarker } from "@/data/chapters";
import { useProgress } from "@/hooks/useProgress";

interface Props {
  marker: MapMarker;
}

export default function MapMarkerComponent({ marker }: Props) {
  const [hovered, setHovered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [, navigate] = useLocation();
  const { isUnlocked, isCompleted } = useProgress();

  const unlocked = isUnlocked(marker.id);
  const completed = isCompleted(marker.id);
  const featured = marker.featured === true;

  const baseSize = featured ? 60 : 44;
  const hoverSize = featured ? 72 : 52;
  const currentSize = hovered && unlocked ? hoverSize : baseSize;
  const iconSize = featured ? (hovered && unlocked ? 32 : 26) : (hovered && unlocked ? 22 : 18);

  const handleClick = () => {
    if (!unlocked || transitioning) return;
    setTransitioning(true);
    setFadeOut(false);
    setTimeout(() => setFadeOut(true), 900);
    setTimeout(() => navigate(`/chapter/${marker.id}`), 1400);
  };

  return (
    <>
      {/* ── Cinematic travel overlay ── */}
      {transitioning && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "18px",
            background: "rgba(4,2,1,0)",
            animation: fadeOut ? "travelFadeOut 0.5s ease forwards" : "travelFadeIn 0.55s ease forwards",
            pointerEvents: "all",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 20%, rgba(4,2,1,0.85) 100%)", pointerEvents: "none" }} />
          <div style={{ fontSize: "56px", filter: `drop-shadow(0 0 28px ${marker.color}90)`, animation: "travelIconFloat 0.6s ease 0.3s both", zIndex: 1 }}>
            {marker.icon}
          </div>
          <div style={{ zIndex: 1, textAlign: "center", animation: "travelTextRise 0.6s ease 0.35s both" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: "bold", letterSpacing: "0.2em", textTransform: "uppercase", color: marker.color, textShadow: `0 0 30px ${marker.color}80, 0 0 60px ${marker.color}40`, marginBottom: "8px" }}>
              {marker.label}
            </p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(11px, 1.2vw, 14px)", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(230,190,110,0.55)" }}>
              ✦ viajando ✦
            </p>
          </div>
          <div style={{ position: "absolute", bottom: "30%", left: "50%", transform: "translateX(-50%)", width: "0", height: "1px", background: `linear-gradient(90deg, transparent, ${marker.color}60, transparent)`, animation: "travelLineExpand 0.5s ease 0.5s forwards", zIndex: 1 }} />
        </div>
      )}

      {/* ── Marker wrapper ── */}
      <div
        className="absolute"
        style={{
          top: marker.top,
          left: marker.left,
          transform: "translate(-50%, -50%)",
          zIndex: hovered ? 30 : (featured ? 25 : 20),
          width: `${hoverSize}px`,
          height: `${hoverSize}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Ambient glow rays (featured, before completion) ── */}
        {featured && unlocked && !completed && (
          <>
            <div style={{
              position: "absolute",
              width: `${baseSize}px`, height: `${baseSize}px`,
              borderRadius: "50%",
              transform: "scale(2.8)",
              background: `radial-gradient(circle, ${marker.color}18 0%, transparent 70%)`,
              animation: "ping 3s cubic-bezier(0,0,0.2,1) infinite",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute",
              width: `${baseSize}px`, height: `${baseSize}px`,
              borderRadius: "50%",
              transform: "scale(2.0)",
              background: `radial-gradient(circle, ${marker.color}22 0%, transparent 65%)`,
              animation: "ping 3s cubic-bezier(0,0,0.2,1) 0.8s infinite",
              pointerEvents: "none",
            }} />
          </>
        )}

        {/* ── Ping ring (unlocked — outside button so it's never clipped) ── */}
        {unlocked && (
          <div
            style={{
              position: "absolute",
              width: `${currentSize}px`,
              height: `${currentSize}px`,
              borderRadius: "50%",
              animation: `ping ${featured ? "2.5s" : "2s"} cubic-bezier(0,0,0.2,1) infinite`,
              background: `${marker.color}${featured ? "25" : "20"}`,
              border: `1px solid ${marker.color}${featured ? "50" : "40"}`,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* ── Featured: second slower ping ring ── */}
        {featured && unlocked && (
          <div
            style={{
              position: "absolute",
              width: `${currentSize}px`,
              height: `${currentSize}px`,
              borderRadius: "50%",
              animation: "ping 2.5s cubic-bezier(0,0,0.2,1) 1.2s infinite",
              background: `${marker.color}15`,
              border: `1px solid ${marker.color}35`,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* ── Tooltip ── */}
        {hovered && !transitioning && (
          <div
            className="absolute bottom-full left-1/2 mb-3 pointer-events-none"
            style={{ transform: "translateX(-50%)", width: featured ? "220px" : "190px", animation: "fadeInUp 0.15s ease", zIndex: 40 }}
          >
            <div
              className="rounded-xl px-3 py-2.5 text-center"
              style={{
                background: "rgba(10, 6, 2, 0.95)",
                border: `1px solid ${unlocked ? marker.color + "70" : "rgba(120,90,30,0.4)"}`,
                boxShadow: featured && unlocked ? `0 4px 28px ${marker.color}30` : "0 4px 24px rgba(0,0,0,0.6)",
                backdropFilter: "blur(10px)",
              }}
            >
              {unlocked ? (
                <>
                  <p className="text-xs font-bold mb-0.5 leading-tight" style={{ color: marker.color, fontFamily: "Georgia, serif", fontSize: featured ? "13px" : "11px" }}>
                    {completed && <span style={{ marginRight: 4 }}>✅</span>}
                    {marker.label}
                  </p>
                  <p className="text-xs leading-snug" style={{ color: "rgba(230,210,160,0.8)", fontFamily: "Georgia, serif" }}>
                    {marker.shortDesc}
                  </p>
                  {featured && (
                    <p className="text-xs mt-1" style={{ color: `${marker.color}90`, fontFamily: "Georgia, serif", fontSize: "10px", letterSpacing: "0.06em" }}>
                      ✦ O momento mais especial ✦
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xs font-bold mb-0.5" style={{ color: "rgba(160,120,50,0.7)", fontFamily: "Georgia, serif" }}>
                    🔒 Bloqueado
                  </p>
                  <p className="text-xs" style={{ color: "rgba(160,120,50,0.5)", fontFamily: "Georgia, serif" }}>
                    Conclua o capítulo anterior para desbloquear.
                  </p>
                </>
              )}
            </div>
            <div className="mx-auto w-0 h-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `6px solid ${unlocked ? marker.color + "70" : "rgba(120,90,30,0.4)"}` }} />
          </div>
        )}

        {/* ── Featured label — always visible below marker ── */}
        {featured && unlocked && (
          <div
            className="absolute top-full left-1/2 mt-1.5 pointer-events-none"
            style={{ transform: "translateX(-50%)", whiteSpace: "nowrap", zIndex: 2 }}
          >
            <p style={{
              fontFamily: "Georgia, serif",
              fontSize: "9px",
              fontWeight: "bold",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: completed ? "rgba(80,200,80,0.85)" : `${marker.color}CC`,
              textShadow: `0 0 8px ${marker.color}60`,
            }}>
              {completed ? "✅ Cristo de Cornélio" : "✝ Cristo de Cornélio"}
            </p>
          </div>
        )}

        {/* ── Button ── */}
        <button
          onClick={handleClick}
          disabled={!unlocked}
          className="relative flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none"
          style={{
            width: `${currentSize}px`,
            height: `${currentSize}px`,
            zIndex: 2,
            background: unlocked
              ? hovered
                ? `radial-gradient(circle, ${marker.color}35 0%, ${marker.color}18 100%)`
                : featured
                  ? `radial-gradient(circle, ${marker.color}28 0%, ${marker.color}10 100%)`
                  : `radial-gradient(circle, ${marker.color}20 0%, transparent 100%)`
              : "radial-gradient(circle, rgba(40,30,10,0.6) 0%, rgba(20,15,5,0.3) 100%)",
            border: unlocked
              ? featured
                ? `2px solid ${hovered ? marker.color : marker.color + "90"}`
                : `2px solid ${hovered ? marker.color : marker.color + "80"}`
              : "2px solid rgba(100,75,25,0.4)",
            boxShadow: unlocked
              ? featured
                ? hovered
                  ? `0 0 0 5px ${marker.color}30, 0 0 32px ${marker.color}50, 0 0 60px ${marker.color}20`
                  : `0 0 0 3px ${marker.color}20, 0 0 20px ${marker.color}40`
                : hovered
                  ? `0 0 0 4px ${marker.color}25, 0 0 20px ${marker.color}40`
                  : `0 0 8px ${marker.color}30`
              : "none",
            cursor: unlocked ? "pointer" : "not-allowed",
            filter: unlocked ? "none" : "grayscale(0.8) brightness(0.5)",
            opacity: unlocked ? 1 : 0.55,
            transition: "width 0.2s ease, height 0.2s ease, box-shadow 0.3s ease",
          }}
          aria-label={marker.label}
        >
          <span style={{ fontSize: `${iconSize}px`, transition: "font-size 0.2s ease", lineHeight: 1 }}>
            {unlocked ? marker.icon : "🔒"}
          </span>

          {/* Completed badge */}
          {completed && (
            <span style={{ position: "absolute", top: featured ? "-6px" : "-4px", right: featured ? "-6px" : "-4px", fontSize: featured ? "15px" : "12px", lineHeight: 1, filter: "drop-shadow(0 0 4px rgba(80,200,80,0.8))" }}>
              ✅
            </span>
          )}
        </button>
      </div>
    </>
  );
}
