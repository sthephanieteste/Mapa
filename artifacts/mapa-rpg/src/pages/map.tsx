import { MAP_MARKERS } from "@/data/chapters";
import MapMarkerComponent from "@/components/MapMarker";
import GameHUD from "@/components/GameHUD";
import CloudLayer from "@/components/CloudLayer";
import UnlockCelebration from "@/components/UnlockCelebration";
import SecretEnding from "@/components/SecretEnding";
import { useMapControls, MIN_ZOOM, MAX_ZOOM } from "@/hooks/useMapControls";

export default function MapPage() {
  const { zoom, offset, dragging, dragMoved, containerRef, handlers, zoomIn, zoomOut } =
    useMapControls();

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
        }}
        {...handlers}
        onClickCapture={(e) => {
          if (dragMoved.current) {
            e.stopPropagation();
            dragMoved.current = false;
          }
        }}
      >
        {/* ── WORLD: everything that pans/zooms together ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          {/* Map image */}
          <img
            src={`${import.meta.env.BASE_URL}mapa-rpg-illustration.png`}
            alt="Mapa RPG"
            className="absolute inset-0 w-full h-full object-cover select-none"
            draggable={false}
          />

          {/* Cloud layer */}
          <CloudLayer />

          {/* Markers */}
          <div className="absolute inset-0">
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
        <button
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Aproximar"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(8,5,2,0.9)",
            border: "1px solid rgba(200,140,40,0.55)",
            color: zoom >= MAX_ZOOM ? "rgba(200,160,60,0.3)" : "#e8c060",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: zoom >= MAX_ZOOM ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            boxShadow: zoom >= MAX_ZOOM ? "none" : "0 0 10px rgba(200,140,40,0.2)",
            transition: "color 0.2s, box-shadow 0.2s",
            lineHeight: 1,
          }}
        >
          +
        </button>
        <button
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Afastar"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(8,5,2,0.9)",
            border: "1px solid rgba(200,140,40,0.55)",
            color: zoom <= MIN_ZOOM ? "rgba(200,160,60,0.3)" : "#e8c060",
            fontSize: "22px",
            fontWeight: "bold",
            cursor: zoom <= MIN_ZOOM ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            boxShadow: zoom <= MIN_ZOOM ? "none" : "0 0 10px rgba(200,140,40,0.2)",
            transition: "color 0.2s, box-shadow 0.2s",
            lineHeight: 1,
          }}
        >
          −
        </button>
      </div>

      {/* ── UNLOCK CELEBRATION (fixed/full-screen, not part of world) ── */}
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
        }}
      >
        ✦ Clique nos locais para explorar ✦
      </div>
    </div>
  );
}
