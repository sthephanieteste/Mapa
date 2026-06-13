import { useState } from "react";
import { useLocation } from "wouter";
import type { MapMarker } from "@/data/chapters";

interface Props {
  marker: MapMarker;
}

export default function MapMarkerComponent({ marker }: Props) {
  const [hovered, setHovered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [, navigate] = useLocation();

  const handleClick = () => {
    if (transitioning) return;
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
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "18px",
            background: "rgba(4,2,1,0)",
            animation: fadeOut
              ? "travelFadeOut 0.5s ease forwards"
              : "travelFadeIn 0.55s ease forwards",
            pointerEvents: "all",
          }}
        >
          {/* Vignette rings */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 20%, rgba(4,2,1,0.85) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Icon */}
          <div
            style={{
              fontSize: "56px",
              filter: `drop-shadow(0 0 28px ${marker.color}90)`,
              animation: "travelIconFloat 0.6s ease 0.3s both",
              zIndex: 1,
            }}
          >
            {marker.icon}
          </div>

          {/* Location name */}
          <div
            style={{
              zIndex: 1,
              textAlign: "center",
              animation: "travelTextRise 0.6s ease 0.35s both",
            }}
          >
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(22px, 3vw, 34px)",
                fontWeight: "bold",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: marker.color,
                textShadow: `0 0 30px ${marker.color}80, 0 0 60px ${marker.color}40`,
                marginBottom: "8px",
              }}
            >
              {marker.label}
            </p>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(11px, 1.2vw, 14px)",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(230,190,110,0.55)",
              }}
            >
              ✦ viajando ✦
            </p>
          </div>

          {/* Horizontal divider line */}
          <div
            style={{
              position: "absolute",
              bottom: "30%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "0",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${marker.color}60, transparent)`,
              animation: "travelLineExpand 0.5s ease 0.5s forwards",
              zIndex: 1,
            }}
          />
        </div>
      )}

      {/* ── Marker ── */}
      <div
        className="absolute"
        style={{
          top: marker.top,
          left: marker.left,
          transform: "translate(-50%, -50%)",
          zIndex: hovered ? 30 : 20,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && !transitioning && (
          <div
            className="absolute bottom-full left-1/2 mb-3 pointer-events-none"
            style={{
              transform: "translateX(-50%)",
              width: "180px",
              animation: "fadeInUp 0.15s ease",
            }}
          >
            <div
              className="rounded-xl px-3 py-2.5 text-center"
              style={{
                background: "rgba(10, 6, 2, 0.92)",
                border: `1px solid ${marker.color}60`,
                boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 12px ${marker.color}30`,
                backdropFilter: "blur(8px)",
              }}
            >
              <p
                className="text-xs font-bold mb-0.5 leading-tight"
                style={{ color: marker.color, fontFamily: "Georgia, serif" }}
              >
                {marker.label}
              </p>
              <p
                className="text-xs leading-snug"
                style={{ color: "rgba(230,210,160,0.8)", fontFamily: "Georgia, serif" }}
              >
                {marker.shortDesc}
              </p>
            </div>
            <div
              className="mx-auto w-0 h-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: `6px solid ${marker.color}60`,
              }}
            />
          </div>
        )}

        <button
          onClick={handleClick}
          className="relative flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none"
          style={{
            width: hovered ? "52px" : "44px",
            height: hovered ? "52px" : "44px",
            background: hovered
              ? `radial-gradient(circle, ${marker.color}30 0%, ${marker.color}15 100%)`
              : `radial-gradient(circle, ${marker.color}20 0%, transparent 100%)`,
            border: `2px solid ${hovered ? marker.color : marker.color + "80"}`,
            boxShadow: hovered
              ? `0 0 0 4px ${marker.color}25, 0 0 20px ${marker.color}40, inset 0 0 12px ${marker.color}10`
              : `0 0 8px ${marker.color}30`,
            cursor: "pointer",
          }}
          aria-label={marker.label}
        >
          <span style={{ fontSize: hovered ? "22px" : "18px", transition: "font-size 0.2s ease" }}>
            {marker.icon}
          </span>

          <span
            className="absolute inset-0 rounded-full"
            style={{
              animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
              background: `${marker.color}20`,
              border: `1px solid ${marker.color}40`,
            }}
          />
        </button>
      </div>
    </>
  );
}
