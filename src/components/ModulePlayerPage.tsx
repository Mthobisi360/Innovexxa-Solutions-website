import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Hand,
  Headphones,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Send,
  Video,
} from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { APP_IMAGES } from '../data/assets';
import { CURRICULUM_MODULES, CurriculumModule, LearningMode } from '../data/curriculumData';
import { LANGUAGE_LABELS, LanguageKey } from '../data/labData';
import { InnovaBotAssistant } from './InnovaBotAssistant';
import { PageRoute } from './Navbar';

interface ModulePlayerPageProps {
  module: CurriculumModule;
  initialMode: LearningMode;
  theme: 'light' | 'dark';
  onModeChange: (mode: LearningMode) => void;
  onBackToCurriculum: () => void;
  onNavigate: (page: PageRoute) => void;
  onSelectAdjacentModule: (moduleId: string) => void;
}

export function ModulePlayerPage({
  module,
  initialMode,
  theme,
  onModeChange,
  onBackToCurriculum,
  onNavigate,
  onSelectAdjacentModule,
}: ModulePlayerPageProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [vocabLang, setVocabLang] = useState<LanguageKey>('isizulu');

  // Listen Mode state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioRate, setAudioRate] = useState(1);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const audioWaveRef = useRef<HTMLCanvasElement>(null);

  // Pre-Recorded Video Mode state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const videoDuration = 45;
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);

  // Live Video Mode state
  const [handRaised, setHandRaised] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [liveFeed, setLiveFeed] = useState([
    {
      sender: 'Lerato M. (Grade Learner)',
      text: `Could you show one more example for ${module.strand}?`,
      time: 'Just now',
    },
    {
      sender: module.liveSession.facilitator,
      text: `Welcome everyone! Today we are walking through ${module.grade} — ${module.strand}. Post your questions below.`,
      time: '2 min ago',
    },
  ]);

  // Reset interactive state when switching module
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAudioPlaying(false);
    setIsVideoPlaying(false);
    setVideoTime(0);
    setActiveChapterIdx(0);
    setHandRaised(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [module.id]);

  // Stop speech synthesis on unmount or mode leave
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Listen mode speech + animated waveform canvas
  useEffect(() => {
    if (initialMode !== 'listen') return;
    const canvas = audioWaveRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let t = 0;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const bg = theme === 'dark' ? '#0f172a' : '#f1f5f9';
      const barColor = theme === 'dark' ? '#38bdf8' : '#0284c7';
      const mutedColor = theme === 'dark' ? '#334155' : '#cbd5e1';

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const barCount = 36;
      const gap = 4;
      const barW = (w - gap * (barCount + 1)) / barCount;

      for (let i = 0; i < barCount; i++) {
        const amp = isAudioPlaying
          ? 0.25 + 0.65 * Math.abs(Math.sin(t * 0.08 * audioRate + i * 0.35))
          : 0.14 + 0.08 * Math.sin(i * 0.6);
        const barH = Math.max(8, amp * (h - 24));
        const x = gap + i * (barW + gap);
        const y = (h - barH) / 2;
        ctx.fillStyle = isAudioPlaying ? barColor : mutedColor;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 3);
        ctx.fill();
      }

      if (isAudioPlaying) t += 1;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [initialMode, isAudioPlaying, audioRate, theme]);

  const toggleAudioWalkthrough = () => {
    if (isAudioPlaying) {
      setIsAudioPlaying(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    setIsAudioPlaying(true);
    const chapter = module.videoChapters[activeChapterIdx] ?? module.videoChapters[0];
    if ('speechSynthesis' in window && chapter) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `${module.grade} ${module.strand}. ${chapter.title}. ${chapter.narration}`
      );
      utterance.rate = audioRate;
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Pre-recorded video playback timer
  useEffect(() => {
    if (initialMode !== 'prerecorded' || !isVideoPlaying) return;
    const interval = window.setInterval(() => {
      setVideoTime((prev) => {
        if (prev + 0.2 >= videoDuration) {
          setIsVideoPlaying(false);
          return videoDuration;
        }
        return prev + 0.2;
      });
    }, 200);
    return () => window.clearInterval(interval);
  }, [initialMode, isVideoPlaying]);

  // Pre-recorded video interactive HTML5 Canvas demonstration
  useEffect(() => {
    if (initialMode !== 'prerecorded') return;
    const canvas = videoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const isDark = theme === 'dark';

    ctx.fillStyle = isDark ? '#0b1120' : '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Subtle grid
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const accent = isDark ? '#38bdf8' : '#0284c7';
    const amber = '#d97706';
    const emerald = '#059669';
    const ink = isDark ? '#f1f5f9' : '#0f172a';
    const progressPhase = videoTime * 1.4;

    if (module.visualKind === 'circuit') {
      // Animated circuit loop with moving charges
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3;
      ctx.strokeRect(110, 60, w - 220, h - 120);

      // Battery symbol left
      ctx.fillStyle = isDark ? '#0b1120' : '#f8fafc';
      ctx.fillRect(96, h / 2 - 22, 28, 44);
      ctx.strokeStyle = amber;
      ctx.beginPath();
      ctx.moveTo(95, h / 2 - 10);
      ctx.lineTo(125, h / 2 - 10);
      ctx.moveTo(102, h / 2 + 10);
      ctx.lineTo(118, h / 2 + 10);
      ctx.stroke();

      // Electron dots moving around loop
      for (let i = 0; i < 8; i++) {
        const p = ((progressPhase * 28 + i * 110) % ((w - 220) * 2 + (h - 120) * 2));
        let cx = 110;
        let cy = 60;
        const bw = w - 220;
        const bh = h - 120;
        if (p < bw) {
          cx = 110 + p;
          cy = 60;
        } else if (p < bw + bh) {
          cx = 110 + bw;
          cy = 60 + (p - bw);
        } else if (p < bw * 2 + bh) {
          cx = 110 + bw - (p - bw - bh);
          cy = 60 + bh;
        } else {
          cx = 110;
          cy = 60 + bh - (p - bw * 2 - bh);
        }
        ctx.fillStyle = emerald;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = ink;
      ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Animated Circuit Walkthrough · ${module.grade}`, 130, 42);
    } else if (module.visualKind === 'waves') {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 40; x < w - 40; x += 4) {
        const y = h / 2 + Math.sin((x - 40) * 0.03 - progressPhase) * 58;
        if (x === 40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = ink;
      ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Wave Propagation Model (v = fλ) · ${module.grade}`, 40, 38);
    } else if (module.visualKind === 'mechanics') {
      // Parabolic trajectory demo
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = 60; px <= w - 80; px += 6) {
        const norm = (px - 60) / (w - 140);
        const py = h - 50 - Math.sin(norm * Math.PI) * 140;
        if (px === 60) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      const ballNorm = (progressPhase * 0.14) % 1;
      const bx = 60 + ballNorm * (w - 140);
      const by = h - 50 - Math.sin(ballNorm * Math.PI) * 140;
      ctx.fillStyle = amber;
      ctx.beginPath();
      ctx.arc(bx, by, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = ink;
      ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Kinematics & Projectile Motion · ${module.grade}`, 40, 38);
    } else if (module.visualKind === 'chemistry') {
      // Bohr shell electrons orbiting
      const cx = w / 2;
      const cy = h / 2 + 8;
      ctx.fillStyle = amber;
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.fill();
      [56, 94].forEach((r, shellIdx) => {
        ctx.strokeStyle = isDark ? '#334155' : '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        const electrons = shellIdx === 0 ? 2 : 6;
        for (let i = 0; i < electrons; i++) {
          const ang = progressPhase * (shellIdx === 0 ? 0.6 : -0.4) + (i * Math.PI * 2) / electrons;
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.fillStyle = ink;
      ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Atomic & Molecular Structure Demo · ${module.grade}`, 40, 38);
    } else {
      // Coding / Robotics / Pattern grid demonstration
      const cols = 6;
      const cellSize = 44;
      const startX = w / 2 - (cols * cellSize) / 2;
      const startY = 66;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
          ctx.strokeRect(startX + c * cellSize, startY + r * cellSize, cellSize, cellSize);
        }
      }
      const step = Math.floor(progressPhase) % 12;
      const robotCol = step < 6 ? step : 11 - step;
      const robotRow = step < 6 ? 0 : 2;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.roundRect(
        startX + robotCol * cellSize + 8,
        startY + robotRow * cellSize + 8,
        cellSize - 16,
        cellSize - 16,
        6
      );
      ctx.fill();
      ctx.fillStyle = ink;
      ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Step-by-Step Robotics & Coding Demo · ${module.grade}`, 40, 38);
    }
  }, [initialMode, videoTime, module.visualKind, module.grade, theme]);

  const activeChapter =
    videoTime < 15
      ? module.videoChapters[0]
      : videoTime < 30
        ? module.videoChapters[1]
        : module.videoChapters[2];

  const handlePostQuestion = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = questionInput.trim();
    if (!trimmed) return;
    setLiveFeed((prev) => [
      { sender: 'You (Classroom Learner)', text: trimmed, time: 'Just now' },
      ...prev,
    ]);
    setQuestionInput('');
  };

  // Next/prev module navigation
  const currentIdx = CURRICULUM_MODULES.findIndex((m) => m.id === module.id);
  const nextModule =
    currentIdx >= 0 && currentIdx < CURRICULUM_MODULES.length - 1
      ? CURRICULUM_MODULES[currentIdx + 1]
      : null;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:py-12">
      {/* Top Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToCurriculum}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to CAPS Catalogue</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('lab')}
            className="text-xs font-medium text-[var(--accent-primary)] hover:underline cursor-pointer"
          >
            Open Interactive STEM Lab
          </button>
          {nextModule && (
            <button
              type="button"
              onClick={() => onSelectAdjacentModule(nextModule.id)}
              className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] cursor-pointer"
            >
              Next: {nextModule.grade} · {nextModule.strand}
            </button>
          )}
        </div>
      </div>

      {/* Module Title & Metadata */}
      <div className="mt-6 border-b border-[var(--border-hairline)] pb-6">
        <p className="text-xs font-medium text-[var(--accent-primary)]">
          {module.phaseLabel} · {module.grade} · {module.subject} · {module.weeklyHours}
        </p>
        <h1 className="font-display mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          {module.grade} — {module.strand}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-secondary)]">{module.summary}</p>
      </div>

      {/* 4-Mode Segmented Switcher */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div
          className="flex flex-wrap gap-1.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-1.5"
          role="tablist"
          aria-label="Learning delivery mode"
        >
          {(
            [
              { id: 'read', label: 'Read', icon: BookOpen },
              { id: 'listen', label: 'Listen', icon: Headphones },
              { id: 'prerecorded', label: 'Pre-Recorded Video', icon: Video },
              { id: 'live', label: 'Live Video', icon: Radio },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = initialMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onModeChange(tab.id)}
                className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODE 1: READ */}
      {initialMode === 'read' && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6">
              <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                01. CAPS Syllabus Topics &amp; Definitions
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                {module.topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-primary)]"
                      aria-hidden="true"
                    />
                    <span>{topic.charAt(0).toUpperCase() + topic.slice(1)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid gap-4 border-t border-[var(--border-hairline)] pt-5 sm:grid-cols-3">
                {module.definitions.map((def) => (
                  <div
                    key={def.term}
                    className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4"
                  >
                    <p className="text-xs font-semibold text-[var(--accent-primary)]">{def.term}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                      {def.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6">
              <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                02. {module.workedExample.title}
              </h2>
              {module.workedExample.codeOrFormula && (
                <pre className="mt-4 overflow-x-auto rounded-lg bg-[#0b1120] p-4 font-mono text-xs text-sky-300">
                  {module.workedExample.codeOrFormula}
                </pre>
              )}
              <ol className="mt-4 space-y-2.5 text-sm text-[var(--text-secondary)]">
                {module.workedExample.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6">
              <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                03. Practical Assessment Task Criteria
              </h2>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">{module.practicalTask}</p>
            </section>
          </div>

          {/* Right Check Quiz Column */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6">
              <p className="text-xs font-medium text-[var(--accent-primary)]">
                Quick Concept Check
              </p>
              <h3 className="font-display mt-2 text-base font-bold text-[var(--text-primary)]">
                {module.checkQuestion.question}
              </h3>

              <div className="mt-4 space-y-2.5">
                {module.checkQuestion.options.map((option, idx) => {
                  const chosen = selectedAnswer === idx;
                  const isCorrect = idx === module.checkQuestion.correctIndex;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full rounded-lg border p-3 text-left text-xs font-medium transition-colors cursor-pointer ${
                        chosen
                          ? isCorrect
                            ? 'border-emerald-500 bg-emerald-500/10 text-[var(--text-primary)]'
                            : 'border-rose-500 bg-rose-500/10 text-[var(--text-primary)]'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <p className="mt-4 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {selectedAnswer === module.checkQuestion.correctIndex
                    ? 'Correct: '
                    : 'Review note: '}
                  {module.checkQuestion.explanation}
                </p>
              )}
            </div>

            <InnovaBotAssistant
              contextTitle={`${module.grade} — ${module.strand}`}
              grade={module.grade}
              subject={module.subject}
              codeSnippet={module.workedExample.codeOrFormula ?? module.summary}
              quickPrompts={[
                `Explain ${module.strand} simply with an everyday example`,
                'Walk me through the worked example step by step',
                'Give me a quick CAPS practice question',
              ]}
              compact
            />
          </aside>
        </div>
      )}

      {/* MODE 2: LISTEN */}
      {initialMode === 'listen' && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 lg:col-span-7">
            <p className="text-xs font-medium text-[var(--accent-primary)]">
              Audio Walkthrough · Offline Speech &amp; Classroom Guide
            </p>
            <h2 className="font-display mt-1 text-xl font-bold text-[var(--text-primary)]">
              {module.grade}: {module.strand}
            </h2>

            <canvas
              ref={audioWaveRef}
              width={640}
              height={130}
              className="mt-5 w-full rounded-lg border border-[var(--border-hairline)]"
              aria-label="Audio walkthrough frequency visualization"
            />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleAudioWalkthrough}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] cursor-pointer"
                >
                  {isAudioPlaying ? (
                    <>
                      <Pause className="h-4 w-4" aria-hidden="true" />
                      <span>Pause Narration</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" aria-hidden="true" />
                      <span>Play Audio Walkthrough</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[var(--text-muted)] mr-1">Speed:</span>
                {[0.85, 1, 1.25].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAudioRate(r)}
                    className={`rounded-md px-2.5 py-1 font-mono text-xs cursor-pointer ${
                      audioRate === r
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-[var(--border-hairline)] pt-5">
              <p className="text-xs font-semibold text-[var(--text-primary)]">Audio Chapters</p>
              {module.videoChapters.map((chap, idx) => (
                <button
                  key={chap.title}
                  type="button"
                  onClick={() => {
                    setActiveChapterIdx(idx);
                    setIsAudioPlaying(false);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  }}
                  className={`w-full rounded-lg border p-3.5 text-left transition-colors cursor-pointer ${
                    activeChapterIdx === idx
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)]'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)]'
                  }`}
                >
                  <p className="font-mono text-xs text-[var(--accent-primary)]">
                    {chap.time} · {chap.title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">{chap.narration}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Multilingual Vocabulary Panel */}
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 lg:col-span-5">
            <p className="text-xs font-medium text-[var(--accent-primary)]">
              Multilingual Glossary
            </p>
            <h3 className="font-display mt-1 text-lg font-bold text-[var(--text-primary)]">
              Listen &amp; Bridge Home Language Terms
            </h3>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {(['isizulu', 'siswati', 'sepedi', 'xitsonga'] as LanguageKey[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setVocabLang(lang)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer ${
                    vocabLang === lang
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  {LANGUAGE_LABELS[lang]}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {module.vocabulary.map((item) => (
                <div
                  key={item.term}
                  className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4"
                >
                  <p className="text-sm font-bold text-[var(--text-primary)]">{item.term}</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">{item.english}</p>
                  <p className="mt-2 border-t border-[var(--border-hairline)] pt-2 text-xs font-medium text-[var(--accent-primary)]">
                    {LANGUAGE_LABELS[vocabLang]}: {item[vocabLang as Exclude<LanguageKey, 'english'>]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: PRE-RECORDED VIDEO */}
      {initialMode === 'prerecorded' && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 lg:col-span-8">
            <canvas
              ref={videoCanvasRef}
              width={760}
              height={320}
              className="w-full rounded-lg border border-[var(--border-hairline)]"
              aria-label="Pre-recorded lesson demonstration player"
            />

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsVideoPlaying((p) => !p)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] cursor-pointer"
                >
                  {isVideoPlaying ? (
                    <>
                      <Pause className="h-4 w-4" aria-hidden="true" />
                      <span>Pause Lesson</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" aria-hidden="true" />
                      <span>Play Pre-Recorded Demo</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsVideoPlaying(false);
                    setVideoTime(0);
                  }}
                  aria-label="Restart lesson video"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)] cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                  {Math.floor(videoTime)}s / {videoDuration}s
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={videoDuration}
                step={0.5}
                value={videoTime}
                onChange={(e) => setVideoTime(Number(e.target.value))}
                aria-label="Scrub pre-recorded lesson timeline"
                className="w-full cursor-pointer accent-[var(--accent-primary)]"
              />

              {activeChapter && (
                <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4">
                  <p className="font-mono text-xs text-[var(--accent-primary)]">
                    {activeChapter.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-primary)]">
                    {activeChapter.narration}
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 lg:col-span-4">
            <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
              Video Chapters
            </h3>
            <div className="mt-4 space-y-2.5">
              {module.videoChapters.map((chap, idx) => (
                <button
                  key={chap.title}
                  type="button"
                  onClick={() => {
                    setVideoTime(idx * 15);
                    setIsVideoPlaying(true);
                  }}
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-3 text-left transition-colors hover:border-[var(--accent-primary)] cursor-pointer"
                >
                  <p className="font-mono text-xs font-semibold text-[var(--accent-primary)]">
                    {chap.time} · Jump to chapter
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[var(--text-primary)]">
                    {chap.title}
                  </p>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* MODE 4: LIVE VIDEO */}
      {initialMode === 'live' && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <div className="relative overflow-hidden rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
              <img
                src={APP_IMAGES.mentorClassroomSession}
                alt="Live South African STEM classroom mentor broadcast"
                referrerPolicy="no-referrer"
                className="aspect-video w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/25 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-rose-600 px-2.5 py-1 font-mono text-xs font-semibold text-white">
                    LIVE CLASSROOM STREAM · {module.liveSession.roomCode}
                  </span>
                  <span className="font-mono text-xs text-slate-200">
                    {module.liveSession.schedule}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-sky-300">
                    Facilitator: {module.liveSession.facilitator}
                  </p>
                  <h2 className="font-display mt-1 text-xl font-bold text-white">
                    {module.liveSession.focusTopic}
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
              <p className="text-xs text-[var(--text-secondary)]">
                Interactive Pod Session: Raise your hand or submit a classroom question for real-time
                guidance.
              </p>
              <button
                type="button"
                onClick={() => setHandRaised((prev) => !prev)}
                className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-xs font-semibold transition-colors cursor-pointer ${
                  handRaised
                    ? 'bg-amber-500 text-slate-950'
                    : 'border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                }`}
              >
                <Hand className="h-4 w-4" aria-hidden="true" />
                <span>{handRaised ? 'Hand Raised in Queue' : 'Raise Hand'}</span>
              </button>
            </div>
          </div>

          <aside className="flex flex-col justify-between rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 lg:col-span-4">
            <div>
              <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
                Live Session Q&amp;A Feed
              </h3>
              <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                {liveFeed.map((msg, idx) => (
                  <div
                    key={`${msg.sender}-${idx}`}
                    className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--accent-primary)]">
                        {msg.sender}
                      </p>
                      <span className="text-[11px] text-[var(--text-muted)]">{msg.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handlePostQuestion} className="mt-4 flex gap-2 border-t border-[var(--border-hairline)] pt-4">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask the facilitator..."
                aria-label="Submit live session question"
                className="h-10 flex-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send question"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
