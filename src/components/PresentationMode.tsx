import React, { useState, useEffect, useRef } from 'react';
import { ACADEMY_PRESENTATION_SLIDES } from '../data/academyData';
import { AttackFlowDiagram } from './AttackFlowDiagram';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Presentation,
  MessageSquare,
  CheckCircle2,
  FlaskConical
} from 'lucide-react';

interface PresentationModeProps {
  onOpenLab?: (lab: 'reflected' | 'stored' | 'dom') => void;
  onOpenSimulator?: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  onOpenLab,
  onOpenSimulator
}) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const deckRef = useRef<HTMLDivElement>(null);

  const totalSlides = ACADEMY_PRESENTATION_SLIDES.length;
  const slide = ACADEMY_PRESENTATION_SLIDES[currentSlideIdx];

  const handlePrev = () => {
    setCurrentSlideIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentSlideIdx((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        setCurrentSlideIdx((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIdx((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [totalSlides]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!deckRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await deckRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  return (
    <div
      ref={deckRef}
      className={`bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none p-6 md:p-10 overflow-y-auto' : 'p-5 md:p-8'
      }`}
    >
      {/* Top Presentation Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Presentation className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <div className="text-xs text-cyan-400 font-mono">
              University Presentation Mode · Muhammad Masood (Roll No: 2670)
            </div>
            <div className="text-sm font-semibold text-slate-200">{slide.title}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSpeakerNotes((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            {showSpeakerNotes ? 'Hide Presenter Notes' : 'Show Presenter Notes'}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                Exit Full Screen
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                Full-Screen Presentation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Slide Selector Strip */}
      <div className="flex flex-wrap items-center gap-1.5 pt-4">
        {ACADEMY_PRESENTATION_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentSlideIdx(idx)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
              idx === currentSlideIdx
                ? 'bg-cyan-500 text-slate-950 font-semibold'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {s.category}
          </button>
        ))}
      </div>

      {/* Main Slide Canvas */}
      <div className="my-6 bg-slate-950 border border-slate-800 rounded-xl p-6 md:p-10 space-y-6 min-h-[26rem] flex flex-col justify-between">
        <div className="space-y-4">
          <div className="text-xs font-mono text-cyan-400">{slide.category}</div>
          <h2 className="text-2xl md:text-4xl font-bold text-slate-100 tracking-tight">
            {slide.title}
          </h2>
          <p className="text-sm md:text-base text-slate-300 max-w-3xl">{slide.subtitle}</p>

          {/* Key Bullet Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3">
            {slide.bullets.map((point, i) => (
              <div
                key={i}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-slate-200 leading-relaxed">{point}</span>
              </div>
            ))}
          </div>

          {/* Optional Embedded Interactive Diagram */}
          {slide.diagramVariant && (
            <div className="pt-2">
              <AttackFlowDiagram variant={slide.diagramVariant} compact />
            </div>
          )}

          {/* Optional Code Comparison */}
          {slide.codeComparison && (
            <div className="pt-2 space-y-2">
              <div className="text-xs font-mono text-slate-400">{slide.codeComparison.title}</div>
              {slide.codeComparison.single ? (
                <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto">
                  {slide.codeComparison.single}
                </pre>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-900 border border-rose-500/30 rounded-xl">
                    <div className="text-[11px] font-mono text-rose-400 mb-1">UNSAFE CODE:</div>
                    <pre className="text-xs font-mono text-slate-200 overflow-x-auto">
                      {slide.codeComparison.unsafe}
                    </pre>
                  </div>
                  <div className="p-3.5 bg-slate-900 border border-emerald-500/30 rounded-xl">
                    <div className="text-[11px] font-mono text-emerald-400 mb-1">SAFE CODE:</div>
                    <pre className="text-xs font-mono text-slate-200 overflow-x-auto">
                      {slide.codeComparison.safe}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Slide Key Takeaway Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs md:text-sm text-emerald-300 font-medium">
            {slide.keyTakeaway}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenSimulator && (slide.id === 9 || slide.id === 10) && (
              <button
                type="button"
                onClick={onOpenSimulator}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 text-slate-950 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                Open Live Attack Simulator
              </button>
            )}
            {onOpenLab && (slide.id === 5 || slide.id === 6 || slide.id === 7) && (
              <button
                type="button"
                onClick={() => {
                  if (slide.id === 6) onOpenLab('stored');
                  else if (slide.id === 7) onOpenLab('dom');
                  else onOpenLab('reflected');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                Open Practical Lab for This XSS Type
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Presenter Speaker Notes */}
      {showSpeakerNotes && (
        <div className="mb-5 p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="text-xs font-mono text-amber-400 mb-1">
            PRESENTER NOTES — {slide.title}:
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{slide.speakerNotes}</p>
        </div>
      )}

      {/* Bottom Slide Navigation Controls */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentSlideIdx === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="text-xs font-mono text-slate-400 text-center">
          {slide.title} (Use ← / → Arrow Keys)
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentSlideIdx === totalSlides - 1}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
