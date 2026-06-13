import { useParams, useLocation } from "wouter";
import { CHAPTERS } from "@/data/chapters";
import { useState } from "react";

function PlaceholderImage({ caption }: { caption: string }) {
  return (
    <div
      className="relative w-full aspect-video rounded-lg overflow-hidden flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, rgba(30,20,8,0.9) 0%, rgba(50,35,12,0.9) 100%)",
        border: "1px solid rgba(200,140,40,0.25)",
      }}
    >
      <div className="text-center px-4">
        <div className="text-4xl mb-2 opacity-40">📷</div>
        <p className="text-xs" style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif" }}>
          {caption}
        </p>
      </div>
    </div>
  );
}

function PlaceholderVideo({ title }: { title: string }) {
  return (
    <div
      className="relative w-full aspect-video rounded-lg overflow-hidden flex items-center justify-center cursor-pointer group"
      style={{
        background: "linear-gradient(135deg, rgba(20,15,5,0.95) 0%, rgba(40,28,8,0.95) 100%)",
        border: "1px solid rgba(200,140,40,0.2)",
      }}
    >
      <div className="text-center px-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
          style={{ background: "rgba(200,140,40,0.15)", border: "2px solid rgba(200,140,40,0.4)" }}
        >
          <span className="text-2xl ml-1">▶</span>
        </div>
        <p className="text-sm font-medium" style={{ color: "rgba(220,180,80,0.8)", fontFamily: "Georgia, serif" }}>
          {title}
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(180,140,60,0.5)" }}>Adicione o vídeo aqui</p>
      </div>
    </div>
  );
}

export default function ChapterPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const chapter = CHAPTERS[params.id ?? ""];

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0704" }}>
        <div className="text-center">
          <p className="text-2xl mb-4" style={{ color: "rgba(200,160,80,0.7)" }}>Local não encontrado</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-full text-sm"
            style={{ background: "rgba(200,130,20,0.3)", border: "1px solid rgba(200,140,40,0.5)", color: "#e8c060" }}
          >
            ← Voltar ao Mapa
          </button>
        </div>
      </div>
    );
  }

  const hasPhotos = chapter.photos.length > 0;
  const hasVideos = chapter.videos.length > 0;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0d0905 0%, #110c06 100%)" }}>

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${chapter.color}18 0%, rgba(10,6,2,0.95) 60%)`,
          borderBottom: `1px solid ${chapter.color}30`,
          minHeight: "280px",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${chapter.color} 0%, transparent 60%)`,
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 pt-8 pb-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
            style={{ color: "rgba(200,160,80,0.7)", fontFamily: "Georgia, serif" }}
          >
            <span>←</span>
            <span>Voltar ao Mapa</span>
          </button>

          <div className="flex items-start gap-5">
            <div
              className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{
                background: `linear-gradient(135deg, ${chapter.color}25, ${chapter.color}10)`,
                border: `1.5px solid ${chapter.color}50`,
                boxShadow: `0 0 24px ${chapter.color}25`,
              }}
            >
              {chapter.icon}
            </div>

            <div>
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: `${chapter.color}90`, fontFamily: "Georgia, serif" }}
              >
                {chapter.subtitle}
              </p>
              <h1
                className="text-3xl md:text-4xl font-bold leading-tight"
                style={{
                  color: "#f0dfa0",
                  fontFamily: "Georgia, serif",
                  textShadow: `0 0 40px ${chapter.color}30`,
                }}
              >
                {chapter.title}
              </h1>
              <p
                className="mt-3 text-base leading-relaxed max-w-2xl"
                style={{ color: "rgba(220,195,140,0.85)", fontFamily: "Georgia, serif" }}
              >
                {chapter.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

        {/* ── GALERIA DE FOTOS ── */}
        <section>
          <SectionTitle icon="📷" label="Galeria de Fotos" color={chapter.color} />
          {hasPhotos ? (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {chapter.photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  className="relative group overflow-hidden rounded-lg aspect-video focus:outline-none"
                  onClick={() => setLightboxIdx(idx)}
                  style={{ border: `1px solid ${chapter.color}20` }}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.querySelector(".placeholder")!.removeAttribute("hidden");
                    }}
                  />
                  <div
                    className="placeholder absolute inset-0 flex flex-col items-center justify-center"
                    style={{ background: "rgba(20,13,4,0.9)" }}
                    hidden
                  >
                    <span className="text-3xl opacity-30 mb-1">📷</span>
                    <p className="text-xs text-center px-2" style={{ color: "rgba(200,160,80,0.4)", fontFamily: "Georgia, serif" }}>
                      {photo.caption}
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}
                  >
                    <p className="text-xs px-3 py-2 text-white" style={{ fontFamily: "Georgia, serif" }}>
                      {photo.caption}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState icon="📷" text="As fotos deste capítulo ainda serão adicionadas." color={chapter.color} />
          )}
        </section>

        {/* ── VÍDEOS ── */}
        <section>
          <SectionTitle icon="🎬" label="Vídeos" color={chapter.color} />
          {hasVideos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {chapter.videos.map((video) =>
                video.src ? (
                  <div key={video.id} className="rounded-lg overflow-hidden" style={{ border: `1px solid ${chapter.color}20` }}>
                    <video controls className="w-full aspect-video" src={video.src} />
                    <p className="text-xs px-3 py-2" style={{ color: "rgba(200,160,80,0.6)", fontFamily: "Georgia, serif" }}>
                      {video.title}
                    </p>
                  </div>
                ) : (
                  <PlaceholderVideo key={video.id} title={video.title} />
                )
              )}
            </div>
          ) : (
            <EmptyState icon="🎬" text="Os vídeos deste capítulo ainda serão adicionados." color={chapter.color} />
          )}
        </section>

        {/* ── HISTÓRIA ── */}
        <section>
          <SectionTitle icon="📖" label="A História" color={chapter.color} />
          <div className="mt-4 space-y-6">
            {chapter.story.map((block) => (
              <div
                key={block.id}
                className="rounded-xl p-6"
                style={{
                  background: `linear-gradient(135deg, rgba(20,13,4,0.8) 0%, rgba(30,20,6,0.8) 100%)`,
                  border: `1px solid ${chapter.color}20`,
                  borderLeft: `3px solid ${chapter.color}60`,
                }}
              >
                {block.heading && (
                  <h3
                    className="text-base font-bold mb-3"
                    style={{ color: chapter.color, fontFamily: "Georgia, serif" }}
                  >
                    {block.heading}
                  </h3>
                )}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(225,195,140,0.88)", fontFamily: "Georgia, serif" }}
                >
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── MENSAGENS ── */}
        <section>
          <SectionTitle icon="💌" label="Mensagens" color={chapter.color} />
          <div className="mt-4 space-y-4">
            {chapter.messages.map((msg) => (
              <div
                key={msg.id}
                className="flex gap-4 rounded-xl p-5"
                style={{
                  background: `linear-gradient(135deg, rgba(18,11,3,0.9) 0%, rgba(28,18,5,0.9) 100%)`,
                  border: `1px solid ${chapter.color}25`,
                  boxShadow: `0 2px 16px rgba(0,0,0,0.3)`,
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{
                    background: `${chapter.color}20`,
                    border: `1.5px solid ${chapter.color}40`,
                  }}
                >
                  {msg.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold" style={{ color: chapter.color, fontFamily: "Georgia, serif" }}>
                      {msg.author}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(160,120,60,0.5)" }}>
                      {msg.date}
                    </span>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(220,190,130,0.88)", fontFamily: "Georgia, serif", fontStyle: "italic" }}
                  >
                    "{msg.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── NAV BOTTOM ── */}
        <div className="flex justify-center pt-4 pb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${chapter.color}25, ${chapter.color}10)`,
              border: `1px solid ${chapter.color}50`,
              color: "#e8c060",
              fontFamily: "Georgia, serif",
              boxShadow: `0 0 20px ${chapter.color}15`,
            }}
          >
            ← Voltar ao Mapa
          </button>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setLightboxIdx(null)}
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
        >
          <button
            className="absolute top-4 right-4 text-2xl transition-opacity hover:opacity-60"
            style={{ color: "rgba(200,160,60,0.8)" }}
            onClick={() => setLightboxIdx(null)}
          >
            ✕
          </button>
          {lightboxIdx > 0 && (
            <button
              className="absolute left-4 text-3xl transition-opacity hover:opacity-60"
              style={{ color: "rgba(200,160,60,0.8)" }}
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}
            >
              ‹
            </button>
          )}
          {lightboxIdx < chapter.photos.length - 1 && (
            <button
              className="absolute right-4 text-3xl transition-opacity hover:opacity-60"
              style={{ color: "rgba(200,160,60,0.8)" }}
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}
            >
              ›
            </button>
          )}
          <div className="max-w-3xl max-h-screen p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={chapter.photos[lightboxIdx].src}
              alt={chapter.photos[lightboxIdx].caption}
              className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto block"
            />
            <p
              className="text-center mt-3 text-sm"
              style={{ color: "rgba(220,180,80,0.8)", fontFamily: "Georgia, serif" }}
            >
              {chapter.photos[lightboxIdx].caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <h2
        className="text-lg font-bold"
        style={{ color: "#e8c060", fontFamily: "Georgia, serif" }}
      >
        {label}
      </h2>
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }}
      />
    </div>
  );
}

function EmptyState({ icon, text, color }: { icon: string; text: string; color: string }) {
  return (
    <div
      className="mt-4 rounded-xl p-8 flex flex-col items-center gap-2"
      style={{
        background: "rgba(15,10,3,0.6)",
        border: `1px dashed ${color}25`,
      }}
    >
      <span className="text-3xl opacity-30">{icon}</span>
      <p className="text-sm text-center" style={{ color: "rgba(180,140,60,0.5)", fontFamily: "Georgia, serif" }}>
        {text}
      </p>
    </div>
  );
}
