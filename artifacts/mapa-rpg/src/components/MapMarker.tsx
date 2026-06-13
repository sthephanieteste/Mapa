import { useState } from "react";
import { useLocation } from "wouter";
import type { MapMarker } from "@/data/chapters";

interface Props {
  marker: MapMarker;
}

export default function MapMarkerComponent({ marker }: Props) {
  const [hovered, setHovered] = useState(false);
  const [, navigate] = useLocation();

  const handleClick = () => {
    navigate(`/chapter/${marker.id}`);
  };

  return (
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
      {hovered && (
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
  );
}
