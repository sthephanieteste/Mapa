import { MAP_MARKERS } from "@/data/chapters";
import MapMarkerComponent from "@/components/MapMarker";
import GameHUD from "@/components/GameHUD";
import CloudLayer from "@/components/CloudLayer";
import UnlockCelebration from "@/components/UnlockCelebration";
import SecretEnding from "@/components/SecretEnding";
import { useMapControls, WORLD_W, WORLD_H } from "@/hooks/useMapControls";

export default function MapPage() {
  const { zoom, offset, dragging, dragMoved, containerRef, handlers, zoomIn, zoomOut, resetView, minZoom } =
    useMapControls();

  const atMin = zoom <= minZoom + 0.001;
  const atMax = zoom >= 3.0 - 0.001;

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#0a0704" }}
    >
      {/* ── MAP CANVAS (starts below 48px HUD) ── */}
      <div
        ref={containerRef}
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: "48px",
          overflow: "hidden",
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
          background: "#0a0704",
        }}
        {...handlers}
        onClickCapture={(e) => {
          if (dragMoved.current) {
            e.stopPropagation();
            dragMoved.current = false;
          }
        }}
      >
        {/* ── WORLD: fixed 1600×900 canvas that pans/zooms together ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${WORLD_W}px`,
            height: `${WORLD_H}px`,
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          {/* Map image — fills the fixed world exactly */}
          <img
            src={`${import.meta.env.BASE_URL}mapa-rpg-illustration.png`}
            alt="Mapa RPG"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "fill",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />

          {/* Cloud layer */}
          <CloudLayer />

          {/* Markers */}
          <div style={{ position: "absolute", inset: 0 }}>
            {MAP_MARKERS.map((marker) => (
              <MapMarkerComponent key={marker.id} marker={marker} />
            ))}
          </div>
        </div>
      </div>

      {/* ── ZOOM CONTROLS ── */}
      <div
        style={{
          position: "absolute",
          bottom: "56px",
          right: "16px",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {/* Reset view */}
        <button
          onClick={resetView}
          aria-label="Ver mapa completo"
          title="Ver mapa completo"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(8,5,2,0.9)",
            border: "1px solid rgba(200,140,40,0.55)",
            color: "#e8c060",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            boxShadow: "0 0 10px rgba(200,140,40,0.2)",
          }}
        >
          ⊡
        </button>

        {/* Zoom in */}
        <button
          onClick={zoomIn}
          disabled={atMax}
          aria-label="Aproximar"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(8,5,2,0.9)",
            border: "1px solid rgba(200,140,40,0.55)",
            color: atMax ? "rgba(200,160,60,0.3)" : "#e8c060",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: atMax ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            boxShadow: atMax ? "none" : "0 0 10px rgba(200,140,40,0.2)",
            transition: "color 0.2s",
            lineHeight: 1,
          }}
        >
          +
        </button>

        {/* Zoom out */}
        <button
          onClick={zoomOut}
          disabled={atMin}
          aria-label="Afastar"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(8,5,2,0.9)",
            border: "1px solid rgba(200,140,40,0.55)",
            color: atMin ? "rgba(200,160,60,0.3)" : "#e8c060",
            fontSize: "22px",
            fontWeight: "bold",
            cursor: atMin ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            boxShadow: atMin ? "none" : "0 0 10px rgba(200,140,40,0.2)",
            transition: "color 0.2s",
            lineHeight: 1,
          }}
        >
          −
        </button>
      </div>

      {/* ── UNLOCK CELEBRATION (fixed/full-screen, outside world) ── */}
      <UnlockCelebration />

      {/* ── GAME HUD ── */}
      <GameHUD />

      {/* ── SECRET ENDING ── */}
      <SecretEnding />

      {/* ── HINT LABEL ── */}
      <div
        className="absolute bottom-4 right-4 text-xs px-3 py-1.5 rounded-full select-none"
        style={{
          background: "rgba(10,5,2,0.82)",
          border: "1px solid rgba(200,140,40,0.35)",
          color: "rgba(210,170,80,0.8)",
          fontFamily: "Georgia, serif",
          backdropFilter: "blur(8px)",
          letterSpacing: "0.04em",
          zIndex: 40,
        }}
      >
        ✦ Clique nos locais para explorar ✦
      </div>
    </div>
  );
}
