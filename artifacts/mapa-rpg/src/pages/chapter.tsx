import { useParams, useLocation } from "wouter";
import { CHAPTERS } from "@/data/chapters";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import { useProgress } from "@/hooks/useProgress";
import { getQuiz } from "@/data/quizStorage";
import AvatarQuiz from "@/components/AvatarQuiz";
import AvatarQuizViagem from "@/components/AvatarQuizViagem";
import AvatarQuizUtfpr from "@/components/AvatarQuizUtfpr";
import BookExperienceDella from "@/components/BookExperienceDella";
import MissionCristo from "@/components/MissionCristo";
import MissionGuarapuava from "@/components/MissionGuarapuava";
import FutureChapter from "@/components/FutureChapter";

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

function LockedContent({ color }: { color: string }) {
  return (
    <div
      className="mt-4 flex flex-col items-center gap-3 py-8 rounded-xl"
      style={{
        background: "rgba(10,6,2,0.6)",
        border: `1px dashed ${color}30`,
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div style={{ fontSize: "28px", filter: "drop-shadow(0 0 8px rgba(200,140,40,0.3))" }}>🔒</div>
      <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(180,140,60,0.55)", textAlign: "center" }}>
        Responda o Desafio do Capítulo para desbloquear.
      </p>
    </div>
  );
}

export default function ChapterPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const { isCompleted, completeChapter, nextChapter } = useProgress();

  const chapter = CHAPTERS[params.id ?? ""];

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0704" }}>
        <div className="text-center">
          <p className="text-2xl mb-4" style={{ color: "rgba(200,160,80,0.7)" }}>Local não encontrado</p>
          <button
            onClick={() => navigate("/map")}
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
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #0d0905 0%, #110c06 100%)",
        animation: "fadeIn 0.4s ease",
      }}
    >

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
            onClick={() => navigate("/map")}
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
                animation: "float 3s ease-in-out infinite",
              }}
            >
              {chapter.icon}
            </div>

            <div className="flex-1">
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

          {/* ── Character avatars in chapter ── */}
          <div
            className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3"
            style={{
              background: "rgba(10,6,2,0.6)",
              border: `1px solid ${chapter.color}20`,
              backdropFilter: "blur(8px)",
              display: "inline-flex",
            }}
          >
            <div
              style={{
                borderRadius: "50%",
                padding: "2px",
                background: `linear-gradient(135deg, #c49a3c80, #c49a3c20)`,
                boxShadow: "0 0 10px rgba(196,154,60,0.35)",
              }}
            >
              <Avatar character={1} size={34} />
            </div>
            <div
              style={{
                borderRadius: "50%",
                padding: "2px",
                background: "linear-gradient(135deg, #e8404080, #e8404020)",
                boxShadow: "0 0 10px rgba(232,64,64,0.35)",
              }}
            >
              <Avatar character={2} size={34} />
            </div>
            <span
              className="text-xs"
              style={{ color: "rgba(220,180,100,0.7)", fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              ❤️ Neste capítulo juntos
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

        {/* ── GALERIA DE FOTOS ── */}
        <section>
          <SectionTitle icon="📷" label="Galeria de Fotos" color={chapter.color} />
          {!isCompleted(chapter.id) ? (
            <LockedContent color={chapter.color} />
          ) : hasPhotos ? (
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
        {hasVideos && (
          <section>
            <SectionTitle icon="🎬" label="Vídeos" color={chapter.color} />
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
          </section>
        )}

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
          {!isCompleted(chapter.id) ? (
            <LockedContent color={chapter.color} />
          ) : (
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
          )}
        </section>

        {/* ── QUIZ ── */}
        {chapter.id === "rio-de-janeiro" ? (
          <AvatarQuiz
            chapterId={chapter.id}
            chapterColor={chapter.color}
            isCompleted={isCompleted(chapter.id)}
            completeChapter={completeChapter}
            nextChapterId={nextChapter(chapter.id)}
            onNavigateNext={(id) => navigate(`/chapter/${id}`)}
            onNavigateMap={() => navigate("/map")}
          />
        ) : chapter.id === "a-viagem" ? (
          <AvatarQuizViagem
            chapterId={chapter.id}
            chapterColor={chapter.color}
            isCompleted={isCompleted(chapter.id)}
            completeChapter={completeChapter}
            nextChapterId={nextChapter(chapter.id)}
            onNavigateNext={(id) => navigate(`/chapter/${id}`)}
            onNavigateMap={() => navigate("/map")}
          />
        ) : chapter.id === "utfpr" ? (
          <AvatarQuizUtfpr
            chapterId={chapter.id}
            chapterColor={chapter.color}
            isCompleted={isCompleted(chapter.id)}
            completeChapter={completeChapter}
            nextChapterId={nextChapter(chapter.id)}
            onNavigateNext={(id) => navigate(`/chapter/${id}`)}
            onNavigateMap={() => navigate("/map")}
          />
        ) : chapter.id === "della-pazetti" ? (
          <BookExperienceDella
            chapterId={chapter.id}
            chapterColor={chapter.color}
            isCompleted={isCompleted(chapter.id)}
            completeChapter={completeChapter}
            nextChapterId={nextChapter(chapter.id)}
            onNavigateNext={(id) => navigate(`/chapter/${id}`)}
            onNavigateMap={() => navigate("/map")}
          />
        ) : chapter.id === "cristo-cornelio" ? (
          <MissionCristo
            chapterId={chapter.id}
            chapterColor={chapter.color}
            isCompleted={isCompleted(chapter.id)}
            completeChapter={completeChapter}
            nextChapterId={nextChapter(chapter.id)}
            onNavigateNext={(id) => navigate(`/chapter/${id}`)}
            onNavigateMap={() => navigate("/map")}
          />
        ) : chapter.id === "utfpr-guarapuava" ? (
          <MissionGuarapuava
            chapterId={chapter.id}
            chapterColor={chapter.color}
            isCompleted={isCompleted(chapter.id)}
            completeChapter={completeChapter}
            nextChapterId={nextChapter(chapter.id)}
            onNavigateNext={(id) => navigate(`/chapter/${id}`)}
            onNavigateMap={() => navigate("/map")}
          />
        ) : chapter.id === "o-futuro" ? (
          <FutureChapter
            chapterId={chapter.id}
            chapterColor={chapter.color}
            isCompleted={isCompleted(chapter.id)}
            completeChapter={completeChapter}
            nextChapterId={nextChapter(chapter.id)}
            onNavigateNext={(id) => navigate(`/chapter/${id}`)}
            onNavigateMap={() => navigate("/map")}
          />
        ) : (
          <QuizSection
            chapterId={chapter.id}
            chapterColor={chapter.color}
            isCompleted={isCompleted(chapter.id)}
            completeChapter={completeChapter}
            nextChapterId={nextChapter(chapter.id)}
            onNavigateNext={(id) => navigate(`/chapter/${id}`)}
            onNavigateMap={() => navigate("/map")}
          />
        )}

        {/* ── NAV BOTTOM ── */}
        <div className="flex justify-center pt-2 pb-8">
          <button
            onClick={() => navigate("/map")}
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

function QuizSection({
  chapterId,
  chapterColor,
  isCompleted,
  completeChapter,
  nextChapterId,
  onNavigateNext,
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
  const quiz = getQuiz(chapterId);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  if (!quiz) return null;

  function handleSelect(key: string) {
    if (answered && correct) return;
    setSelected(key);
    setAnswered(false);
    setCorrect(false);
  }

  function handleConfirm() {
    if (!selected) return;
    const isCorrect = selected === quiz.correctKey;
    setAnswered(true);
    setCorrect(isCorrect);
    if (isCorrect && !isCompleted) {
      completeChapter(chapterId);
    }
  }

  const showSuccess = isCompleted || (answered && correct);
  const showError = answered && !correct;

  return (
    <section>
      <SectionTitle icon="🗺️" label="Desafio do Capítulo" color={chapterColor} />

      <div
        className="mt-4 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(14,9,2,0.95) 0%, rgba(22,14,4,0.95) 100%)",
          border: `1px solid ${chapterColor}35`,
          boxShadow: `0 0 32px ${chapterColor}10`,
        }}
      >
        {/* ── Completed state ── */}
        {showSuccess ? (
          <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
            <div
              style={{
                fontSize: "40px",
                filter: "drop-shadow(0 0 16px rgba(80,220,80,0.6))",
                animation: "float 3s ease-in-out infinite",
              }}
            >
              ✅
            </div>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "16px",
                color: "#a8e6a0",
                textShadow: "0 0 20px rgba(80,220,80,0.4)",
                fontWeight: "bold",
              }}
            >
              {quiz.successMessage}
            </p>
            <div className="flex gap-3 mt-2 flex-wrap justify-center">
              {nextChapterId && (
                <button
                  onClick={() => onNavigateNext(nextChapterId)}
                  className="transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${chapterColor}30, ${chapterColor}15)`,
                    border: `1px solid ${chapterColor}60`,
                    borderRadius: "50px",
                    padding: "10px 28px",
                    color: "#f0d888",
                    fontFamily: "Georgia, serif",
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: `0 0 20px ${chapterColor}20`,
                  }}
                >
                  Próximo Capítulo →
                </button>
              )}
              <button
                onClick={onNavigateMap}
                className="transition-all hover:scale-105"
                style={{
                  background: "rgba(200,140,20,0.12)",
                  border: "1px solid rgba(200,140,40,0.3)",
                  borderRadius: "50px",
                  padding: "10px 28px",
                  color: "rgba(220,180,80,0.7)",
                  fontFamily: "Georgia, serif",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                ← Ver Mapa
              </button>
            </div>
          </div>
        ) : (
          /* ── Quiz state ── */
          <div className="px-6 py-6">
            {/* Question */}
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "15px",
                color: "rgba(240,220,160,0.92)",
                lineHeight: 1.65,
                fontStyle: "italic",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              "{quiz.question}"
            </p>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {quiz.options.map((opt) => {
                const isSelected = selected === opt.key;
                const isWrong = answered && !correct && isSelected;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelect(opt.key)}
                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-200 hover:scale-[1.01]"
                    style={{
                      background: isWrong
                        ? "rgba(200,40,40,0.18)"
                        : isSelected
                        ? `rgba(${chapterColor === "#2196f3" ? "33,150,243" : "200,140,40"},0.18)`
                        : "rgba(20,13,4,0.7)",
                      border: isWrong
                        ? "1px solid rgba(220,60,60,0.6)"
                        : isSelected
                        ? `1px solid ${chapterColor}70`
                        : "1px solid rgba(200,140,40,0.15)",
                      boxShadow: isSelected && !isWrong
                        ? `0 0 16px ${chapterColor}20`
                        : "none",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: isWrong
                          ? "rgba(240,100,100,0.9)"
                          : isSelected
                          ? chapterColor
                          : "rgba(200,160,80,0.6)",
                        minWidth: "20px",
                      }}
                    >
                      {opt.key})
                    </span>
                    <span
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "13px",
                        color: isWrong
                          ? "rgba(240,180,180,0.88)"
                          : isSelected
                          ? "rgba(240,220,160,0.95)"
                          : "rgba(220,190,130,0.75)",
                      }}
                    >
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Error feedback */}
            {showError && (
              <p
                className="text-center mt-3 text-sm"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "rgba(240,120,120,0.85)",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                {quiz.errorMessage}
              </p>
            )}

            {/* Confirm button */}
            <div className="flex justify-center mt-5">
              <button
                onClick={handleConfirm}
                disabled={!selected}
                className="transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: selected
                    ? `linear-gradient(135deg, ${chapterColor}35, ${chapterColor}18)`
                    : "rgba(40,25,8,0.6)",
                  border: `1px solid ${selected ? chapterColor + "60" : "rgba(200,140,40,0.2)"}`,
                  borderRadius: "50px",
                  padding: "10px 36px",
                  color: selected ? "#f0d888" : "rgba(200,160,80,0.35)",
                  fontFamily: "Georgia, serif",
                  fontSize: "13px",
                  cursor: selected ? "pointer" : "not-allowed",
                  boxShadow: selected ? `0 0 20px ${chapterColor}15` : "none",
                  letterSpacing: "0.06em",
                }}
              >
                ✦ Confirmar Resposta ✦
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
