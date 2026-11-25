import {
  Atom,
  Check,
  Code2,
  Compass,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Terminal,
  Volume2,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CLASSROOM_TRACKS,
  CODING_LESSONS,
  LANGUAGE_LABELS,
  LanguageKey,
} from '../data/labData';

interface LabPageProps {
  theme: 'light' | 'dark';
  onOpenCurriculum: () => void;
}

type SimTab = 'ohms' | 'projectile' | 'bonding';

export function LabPage({ theme, onOpenCurriculum }: LabPageProps) {
  // =====================================================
  // MODULE A: CODING LAB & MULTILINGUAL INNOVABOT
  // =====================================================
  const [lessonIdx, setLessonIdx] = useState(0);
  const activeLesson = CODING_LESSONS[lessonIdx];
  const [codeText, setCodeText] = useState(activeLesson.starterCode);
  const [consoleLines, setConsoleLines] = useState<string[]>(() =>
    activeLesson.simulatedOutput(activeLesson.starterCode)
  );
  const [botLang, setBotLang] = useState<LanguageKey>('isizulu');

  const [part1, setPart1] = useState(activeLesson.sentenceStarter.subjectOptions[0]);
  const [part2, setPart2] = useState(activeLesson.sentenceStarter.conditionOptions[0]);
  const [part3, setPart3] = useState(activeLesson.sentenceStarter.actionOptions[0]);
  const [sentenceVerified, setSentenceVerified] = useState(false);

  const handleSelectLesson = (idx: number) => {
    const next = CODING_LESSONS[idx];
    setLessonIdx(idx);
    setCodeText(next.starterCode);
    setConsoleLines(next.simulatedOutput(next.starterCode));
    setPart1(next.sentenceStarter.subjectOptions[0]);
    setPart2(next.sentenceStarter.conditionOptions[0]);
    setPart3(next.sentenceStarter.actionOptions[0]);
    setSentenceVerified(false);
  };

  const handleRunCode = () => {
    setConsoleLines(activeLesson.simulatedOutput(codeText));
  };

  // =====================================================
  // MODULE B: OFFLINE CAPS STEM SIMULATIONS
  // =====================================================
  const [simTab, setSimTab] = useState<SimTab>('ohms');
  const simCanvasRef = useRef<HTMLCanvasElement>(null);

  // Ohm's Law state
  const [voltage, setVoltage] = useState(6.0);
  const [resistance, setResistance] = useState(40);
  const currentAmps = voltage / resistance;
  const powerWatts = voltage * currentAmps;
  const isHighCurrent = currentAmps >= 0.25;

  // Projectile state
  const [launchSpeed, setLaunchSpeed] = useState(26);
  const [launchAngle, setLaunchAngle] = useState(45);
  const [gravity, setGravity] = useState<9.8 | 1.62>(9.8);
  const [projPlaying, setProjPlaying] = useState(true);
  const projTimeRef = useRef(0);

  const angleRad = (launchAngle * Math.PI) / 180;
  const vx = launchSpeed * Math.cos(angleRad);
  const vy0 = launchSpeed * Math.sin(angleRad);
  const totalFlightTime = (2 * vy0) / gravity;
  const maxHeight = (vy0 * vy0) / (2 * gravity);
  const rangeMeters = vx * totalFlightTime;

  // Chemical Bonding state
  const [bondType, setBondType] = useState<'ionic' | 'covalent'>('ionic');
  const [bondProgress, setBondProgress] = useState(65);
  const [bondAutoPlay, setBondAutoPlay] = useState(false);

  useEffect(() => {
    if (simTab !== 'bonding' || !bondAutoPlay) return;
    const timer = window.setInterval(() => {
      setBondProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 60);
    return () => window.clearInterval(timer);
  }, [simTab, bondAutoPlay]);

  // Unified Animation Loop for Theme-Aware HTML5 Canvas Simulations
  useEffect(() => {
    const canvas = simCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let tick = 0;

    const renderFrame = () => {
      const w = canvas.width;
      const h = canvas.height;
      const isDark = theme === 'dark';

      const bg = isDark ? '#0b1120' : '#f8fafc';
      const grid = isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)';
      const ink = isDark ? '#f1f5f9' : '#0f172a';
      const muted = isDark ? '#94a3b8' : '#475569';
      const accent = isDark ? '#38bdf8' : '#0284c7';
      const amber = '#d97706';
      const emerald = '#059669';
      const coral = '#dc2626';

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = grid;
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (simTab === 'ohms') {
        const left = 110;
        const top = 64;
        const rw = w - 220;
        const rh = h - 128;

        // Wire path
        ctx.strokeStyle = muted;
        ctx.lineWidth = 3;
        ctx.strokeRect(left, top, rw, rh);

        // Battery on left edge
        ctx.fillStyle = bg;
        ctx.fillRect(left - 24, top + rh / 2 - 26, 48, 52);
        ctx.strokeStyle = amber;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(left - 18, top + rh / 2 - 10);
        ctx.lineTo(left + 18, top + rh / 2 - 10);
        ctx.moveTo(left - 10, top + rh / 2 + 10);
        ctx.lineTo(left + 10, top + rh / 2 + 10);
        ctx.stroke();
        ctx.fillStyle = ink;
        ctx.font = '600 13px "JetBrains Mono", monospace';
        ctx.fillText(`${voltage.toFixed(1)} V`, left - 76, top + rh / 2 + 5);

        // Resistor zigzag on right edge
        ctx.fillStyle = bg;
        ctx.fillRect(left + rw - 16, top + rh / 2 - 36, 32, 72);
        ctx.strokeStyle = isHighCurrent ? coral : accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(left + rw, top + rh / 2 - 36);
        for (let i = 0; i < 6; i++) {
          const zx = left + rw + (i % 2 === 0 ? 12 : -12);
          const zy = top + rh / 2 - 24 + i * 10;
          ctx.lineTo(zx, zy);
        }
        ctx.lineTo(left + rw, top + rh / 2 + 36);
        ctx.stroke();
        ctx.fillStyle = ink;
        ctx.fillText(`${resistance} Ω`, left + rw + 22, top + rh / 2 + 5);

        // Glowing load bulb on top wire
        const bulbX = left + rw / 2;
        const bulbY = top;
        const glowRadius = 18 + Math.min(28, currentAmps * 48);
        const grad = ctx.createRadialGradient(bulbX, bulbY, 4, bulbX, bulbY, glowRadius);
        grad.addColorStop(0, isHighCurrent ? 'rgba(245,158,11,0.95)' : 'rgba(56,189,248,0.85)');
        grad.addColorStop(1, 'rgba(56,189,248,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bulbX, bulbY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
        ctx.strokeStyle = isHighCurrent ? amber : accent;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(bulbX, bulbY, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Moving electrons proportional to currentAmps
        const perimeter = rw * 2 + rh * 2;
        const speed = 0.6 + currentAmps * 12;
        tick += speed;
        const particleCount = 14;
        for (let i = 0; i < particleCount; i++) {
          const dist = (tick + (i * perimeter) / particleCount) % perimeter;
          let px = left;
          let py = top;
          if (dist < rw) {
            px = left + dist;
            py = top;
          } else if (dist < rw + rh) {
            px = left + rw;
            py = top + (dist - rw);
          } else if (dist < rw * 2 + rh) {
            px = left + rw - (dist - rw - rh);
            py = top + rh;
          } else {
            px = left;
            py = top + rh - (dist - rw * 2 - rh);
          }
          ctx.fillStyle = isHighCurrent ? coral : emerald;
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = ink;
        ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(
          `I = ${currentAmps.toFixed(2)} A   |   P = ${powerWatts.toFixed(2)} W`,
          left,
          h - 20
        );
      } else if (simTab === 'projectile') {
        const originX = 64;
        const groundY = h - 46;
        const scale = Math.min((w - 120) / Math.max(rangeMeters, 20), (h - 90) / Math.max(maxHeight, 12), 5.5);

        // Ground line
        ctx.strokeStyle = muted;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(32, groundY);
        ctx.lineTo(w - 32, groundY);
        ctx.stroke();

        // Full parabolic trajectory dashed guide
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.45)' : 'rgba(2,132,199,0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const steps = 60;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * totalFlightTime;
          const sx = vx * t;
          const sy = vy0 * t - 0.5 * gravity * t * t;
          const cx = originX + sx * scale;
          const cy = groundY - sy * scale;
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.stroke();
        ctx.restore();

        // Advance time if playing
        if (projPlaying) {
          projTimeRef.current += 0.035;
          if (projTimeRef.current > totalFlightTime) {
            projTimeRef.current = 0;
          }
        }
        const tNow = Math.min(projTimeRef.current, totalFlightTime);
        const sxNow = vx * tNow;
        const syNow = Math.max(0, vy0 * tNow - 0.5 * gravity * tNow * tNow);
        const vyNow = vy0 - gravity * tNow;
        const bx = originX + sxNow * scale;
        const by = groundY - syNow * scale;

        // Draw vx and vy vector arrows
        const vecScale = 1.9;
        // vx arrow
        ctx.strokeStyle = emerald;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + vx * vecScale, by);
        ctx.stroke();

        // vy arrow
        ctx.strokeStyle = coral;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx, by - vyNow * vecScale);
        ctx.stroke();

        // Projectile sphere
        ctx.fillStyle = amber;
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, Math.PI * 2);
        ctx.fill();

        // Vector labels
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.fillStyle = emerald;
        ctx.fillText(`vx = ${vx.toFixed(1)} m/s`, bx + 12, by + 16);
        ctx.fillStyle = coral;
        ctx.fillText(`vy = ${vyNow.toFixed(1)} m/s`, bx + 12, by - 10);
      } else {
        // Covalent & Ionic Chemical Bonding
        const progress = bondProgress / 100;
        const cy = h / 2 + 8;

        if (bondType === 'ionic') {
          const leftX = w * 0.34 + progress * 24;
          const rightX = w * 0.66 - progress * 24;

          // Na nucleus & shells
          ctx.fillStyle = amber;
          ctx.beginPath();
          ctx.arc(leftX, cy, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(progress > 0.7 ? 'Na⁺' : 'Na', leftX - 10, cy + 4);

          ctx.strokeStyle = muted;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(leftX, cy, 48, 0, Math.PI * 2);
          ctx.stroke();

          // Cl nucleus & shells
          ctx.fillStyle = emerald;
          ctx.beginPath();
          ctx.arc(rightX, cy, 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.fillText(progress > 0.7 ? 'Cl⁻' : 'Cl', rightX - 10, cy + 4);

          ctx.strokeStyle = muted;
          ctx.beginPath();
          ctx.arc(rightX, cy, 56, 0, Math.PI * 2);
          ctx.stroke();

          // 7 existing valence electrons on Cl
          tick += 0.025;
          for (let i = 0; i < 7; i++) {
            const a = tick + (i * Math.PI * 2) / 8;
            ctx.fillStyle = accent;
            ctx.beginPath();
            ctx.arc(rightX + Math.cos(a) * 56, cy + Math.sin(a) * 56, 5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Transferred valence electron moving from Na outer shell to Cl outer shell slot
          const startEx = leftX + 48;
          const startEy = cy;
          const targetAngle = tick + (7 * Math.PI * 2) / 8;
          const endEx = rightX + Math.cos(targetAngle) * 56;
          const endEy = cy + Math.sin(targetAngle) * 56;
          const ex = startEx + (endEx - startEx) * progress;
          const ey = startEy + (endEy - startEy) * progress;

          ctx.fillStyle = coral;
          ctx.beginPath();
          ctx.arc(ex, ey, 6.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = ink;
          ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(
            progress > 0.7
              ? 'Ionic Lattice Formed: Electron transferred from Na to Cl'
              : 'Approaching Atoms: Na outer electron transfers toward Cl',
            44,
            36
          );
        } else {
          // Covalent H2O shared pairs
          const ox = w / 2;
          const sep = 104 - progress * 34;
          const h1x = ox - sep;
          const h2x = ox + sep;

          // Oxygen shell
          ctx.strokeStyle = accent;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ox, cy, 58, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = coral;
          ctx.beginPath();
          ctx.arc(ox, cy, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('O', ox - 5, cy + 4);

          // Two Hydrogen atoms
          [h1x, h2x].forEach((hx) => {
            ctx.strokeStyle = emerald;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(hx, cy, 34, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = amber;
            ctx.beginPath();
            ctx.arc(hx, cy, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.fillText('H', hx - 5, cy + 4);
          });

          // Shared electron pairs in overlap zones
          tick += 0.03;
          const overlapLeft = (ox + h1x) / 2;
          const overlapRight = (ox + h2x) / 2;
          [overlapLeft, overlapRight].forEach((cx) => {
            ctx.fillStyle = accent;
            ctx.beginPath();
            ctx.arc(cx, cy - 8 + Math.sin(tick) * 4, 5, 0, Math.PI * 2);
            ctx.arc(cx, cy + 8 - Math.sin(tick) * 4, 5, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.fillStyle = ink;
          ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(
            'Polar Covalent Bonding (H₂O): Shared valence electron pairs',
            44,
            36
          );
        }
      }

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, [
    simTab,
    theme,
    voltage,
    resistance,
    currentAmps,
    powerWatts,
    isHighCurrent,
    vx,
    vy0,
    gravity,
    totalFlightTime,
    maxHeight,
    rangeMeters,
    projPlaying,
    bondType,
    bondProgress,
  ]);

  // =====================================================
  // MODULE C: OFFLINE CLASSROOM MEDIA PLAYER (WEB AUDIO API)
  // =====================================================
  const [trackIdx, setTrackIdx] = useState(0);
  const activeTrack = CLASSROOM_TRACKS[trackIdx];
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.5);
  const [captionLang, setCaptionLang] = useState<Exclude<LanguageKey, 'english'>>('isizulu');

  const mediaCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const oscTimerRef = useRef<number | null>(null);

  const stopSynth = () => {
    if (oscTimerRef.current !== null) {
      window.clearInterval(oscTimerRef.current);
      oscTimerRef.current = null;
    }
  };

  const triggerSynthNote = (freq: number) => {
    const ctx = audioCtxRef.current;
    const gainNode = gainNodeRef.current;
    if (!ctx || !gainNode) return;
    try {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = activeTrack.waveform;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      env.gain.setValueAtTime(0.001, ctx.currentTime);
      env.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.08);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);
      osc.connect(env);
      env.connect(gainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Safe fallback if audio hardware unavailable
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    if (!isPlaying) {
      stopSynth();
      return;
    }

    if (!audioCtxRef.current && typeof window !== 'undefined' && window.AudioContext) {
      const ctx = new window.AudioContext();
      const gain = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      gain.gain.value = volume;
      gain.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainNodeRef.current = gain;
      analyserRef.current = analyser;
    }

    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    let step = 0;
    triggerSynthNote(activeTrack.baseFreqs[0]);
    const beatMs = Math.max(350, Math.round(750 / playbackRate));
    oscTimerRef.current = window.setInterval(() => {
      step = (step + 1) % activeTrack.baseFreqs.length;
      triggerSynthNote(activeTrack.baseFreqs[step]);
    }, beatMs);

    const progressTimer = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.25 * playbackRate;
        if (next >= activeTrack.durationSeconds) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 250);

    return () => {
      stopSynth();
      window.clearInterval(progressTimer);
    };
  }, [isPlaying, trackIdx, playbackRate]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      stopSynth();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Theme-aware frequency bar visualizer
  useEffect(() => {
    const canvas = mediaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let phase = 0;
    const freqData = new Uint8Array(32);

    const drawBars = () => {
      const w = canvas.width;
      const h = canvas.height;
      const isDark = theme === 'dark';

      ctx.fillStyle = isDark ? '#0b1120' : '#f1f5f9';
      ctx.fillRect(0, 0, w, h);

      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(freqData);
      }

      const count = 28;
      const gap = 5;
      const barW = (w - gap * (count + 1)) / count;

      for (let i = 0; i < count; i++) {
        const raw = isPlaying
          ? Math.max(freqData[i % freqData.length] / 255, 0.2 + 0.6 * Math.abs(Math.sin(phase * 0.08 + i * 0.4)))
          : 0.12 + 0.05 * Math.sin(i * 0.5);
        const barH = Math.max(8, raw * (h - 20));
        const x = gap + i * (barW + gap);
        const y = h - barH - 10;

        ctx.fillStyle = isPlaying
          ? isDark
            ? '#38bdf8'
            : '#0284c7'
          : isDark
            ? '#334155'
            : '#cbd5e1';
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 3);
        ctx.fill();
      }

      if (isPlaying) phase += 1;
      animId = requestAnimationFrame(drawBars);
    };

    animId = requestAnimationFrame(drawBars);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, theme]);

  const activeCaption = useMemo(() => {
    const sorted = [...activeTrack.captions].sort((a, b) => a.atSeconds - b.atSeconds);
    let current = sorted[0];
    for (const cap of sorted) {
      if (currentTime >= cap.atSeconds) current = cap;
    }
    return current;
  }, [activeTrack, currentTime]);

  const handleSelectTrack = (idx: number) => {
    setTrackIdx(idx);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:py-14 space-y-14">
      {/* Page Header & Quick Jump */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-hairline)] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--accent-primary)]">
            Offline STEM Workspace · Coding, Simulations &amp; Media Hub
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Interactive Lab &amp; Classroom Media Studio
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
            Run MicroPython scripts on a simulated ESP32, manipulate live CAPS Physics and Chemistry
            models, and stream offline synthesized audio lessons with bilingual captions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="#module-a"
            className="inline-flex h-10 items-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0"
          >
            01. Coding Lab
          </a>
          <a
            href="#module-b"
            className="inline-flex h-10 items-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0"
          >
            02. STEM Simulations
          </a>
          <a
            href="#module-c"
            className="inline-flex h-10 items-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0"
          >
            03. Media Player
          </a>
          <button
            type="button"
            onClick={onOpenCurriculum}
            className="inline-flex h-10 items-center rounded-lg bg-[var(--accent-primary)] px-4 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            54 CAPS Modules
          </button>
        </div>
      </div>

      {/* ======================================================
          MODULE A: CODING LAB & MULTILINGUAL INNOVABOT
          ====================================================== */}
      <section id="module-a" className="scroll-mt-24 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-medium text-[var(--accent-primary)]">
              Module A · MicroPython &amp; Code-Switching InnovaBot
            </p>
            <h2 className="font-display mt-1 text-2xl font-bold text-[var(--text-primary)]">
              ESP32 Coding Tutorial &amp; Bilingual Sentence Builder
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CODING_LESSONS.map((lesson, idx) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => handleSelectLesson(idx)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lessonIdx === idx
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Lesson 0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Code Editor + Console (dark editor surface preserved in both modes) */}
          <div className="flex flex-col justify-between rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">{activeLesson.gradeTag}</p>
                  <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
                    {activeLesson.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCodeText(activeLesson.starterCode)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-3 text-xs font-medium text-[var(--text-primary)] cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRunCode}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-4 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] cursor-pointer"
                  >
                    <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Run on ESP32</span>
                  </button>
                </div>
              </div>

              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                {activeLesson.description}
              </p>

              <label htmlFor="micropython-editor" className="sr-only">
                MicroPython Code Editor
              </label>
              <textarea
                id="micropython-editor"
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                rows={11}
                spellCheck={false}
                className="mt-4 w-full rounded-lg border border-slate-700 bg-[#0b1120] p-4 font-mono text-xs leading-relaxed text-sky-200 focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div className="mt-4 rounded-lg border border-slate-700 bg-[#070b14] p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                <span>Simulated ESP32 Serial Console</span>
              </div>
              <div className="mt-2 space-y-1 font-mono text-xs text-emerald-300">
                {consoleLines.map((line, i) => (
                  <p key={`${line}-${i}`}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Multilingual InnovaBot & English Scientific Sentence Builder */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5">
              <p className="text-xs font-medium text-[var(--accent-primary)]">
                InnovaBot Code-Switching Tutor
              </p>
              <h3 className="font-display mt-1 text-base font-bold text-[var(--text-primary)]">
                Understand Logic in Your Home Language
              </h3>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {(Object.keys(LANGUAGE_LABELS) as LanguageKey[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setBotLang(lang)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      botLang === lang
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {LANGUAGE_LABELS[lang]}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4">
                <p className="text-xs font-semibold text-[var(--accent-primary)]">
                  {LANGUAGE_LABELS[botLang]} Explanation
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                  {activeLesson.innovabotExplanations[botLang]}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5">
              <p className="text-xs font-medium text-[var(--accent-primary)]">
                English Scientific Sentence Builder
              </p>
              <h3 className="font-display mt-1 text-base font-bold text-[var(--text-primary)]">
                Translate Intuition to CAPS Exam English
              </h3>

              <div className="mt-4 space-y-3">
                <div>
                  <label
                    htmlFor="builder-p1"
                    className="block text-xs font-medium text-[var(--text-muted)]"
                  >
                    1. Trigger / Condition
                  </label>
                  <select
                    id="builder-p1"
                    value={part1}
                    onChange={(e) => {
                      setPart1(e.target.value);
                      setSentenceVerified(false);
                    }}
                    className="mt-1 h-10 w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 text-xs text-[var(--text-primary)]"
                  >
                    {activeLesson.sentenceStarter.subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="builder-p2"
                    className="block text-xs font-medium text-[var(--text-muted)]"
                  >
                    2. Physical / Code Mechanism
                  </label>
                  <select
                    id="builder-p2"
                    value={part2}
                    onChange={(e) => {
                      setPart2(e.target.value);
                      setSentenceVerified(false);
                    }}
                    className="mt-1 h-10 w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 text-xs text-[var(--text-primary)]"
                  >
                    {activeLesson.sentenceStarter.conditionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="builder-p3"
                    className="block text-xs font-medium text-[var(--text-muted)]"
                  >
                    3. Scientific Outcome
                  </label>
                  <select
                    id="builder-p3"
                    value={part3}
                    onChange={(e) => {
                      setPart3(e.target.value);
                      setSentenceVerified(false);
                    }}
                    className="mt-1 h-10 w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 text-xs text-[var(--text-primary)]"
                  >
                    {activeLesson.sentenceStarter.actionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-3.5">
                <p className="text-xs font-medium text-[var(--text-primary)]">
                  “{part1}, {part2}, {part3}”
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSentenceVerified(true)}
                className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] cursor-pointer"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>Verify Scientific Statement</span>
              </button>

              {sentenceVerified && (
                <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">
                  Verified: {activeLesson.sentenceStarter.targetFeedback}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          MODULE B: OFFLINE CAPS STEM SIMULATIONS
          ====================================================== */}
      <section
        id="module-b"
        className="scroll-mt-24 border-t border-[var(--border-hairline)] pt-12 space-y-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-medium text-[var(--accent-primary)]">
              Module B · Theme-Aware HTML5 Canvas Sandbox
            </p>
            <h2 className="font-display mt-1 text-2xl font-bold text-[var(--text-primary)]">
              Offline CAPS Physical Sciences &amp; Robotics Simulations
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5 rounded-lg bg-[var(--bg-subtle)] p-1">
            {(
              [
                { id: 'ohms', label: "Ohm's Law Circuit", icon: Zap },
                { id: 'projectile', label: 'Projectile Vectors', icon: Compass },
                { id: 'bonding', label: 'Chemical Bonding', icon: Atom },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = simTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSimTab(tab.id)}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[var(--bg-surface)] text-[var(--accent-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Zone Sandbox Layout (65% Stage Left, 35% Control Deck Right) */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 lg:col-span-8">
            <canvas
              ref={simCanvasRef}
              width={740}
              height={340}
              className="w-full rounded-lg border border-[var(--border-hairline)]"
              aria-label="Interactive CAPS STEM simulation canvas"
            />
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 lg:col-span-4">
            {simTab === 'ohms' && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-medium text-[var(--accent-primary)]">
                    Grade 10–12 Electricity
                  </p>
                  <h3 className="font-display mt-1 text-lg font-bold text-[var(--text-primary)]">
                    Ohm’s Law Circuit (V = I · R)
                  </h3>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-voltage" className="font-medium text-[var(--text-primary)]">
                      Supply Voltage (V)
                    </label>
                    <span className="font-mono font-semibold text-[var(--accent-primary)] tabular-nums">
                      {voltage.toFixed(1)} V
                    </span>
                  </div>
                  <input
                    id="sim-voltage"
                    type="range"
                    min={1.5}
                    max={12}
                    step={0.5}
                    value={voltage}
                    onChange={(e) => setVoltage(Number(e.target.value))}
                    className="mt-2 w-full cursor-pointer accent-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-res" className="font-medium text-[var(--text-primary)]">
                      Load Resistance (R)
                    </label>
                    <span className="font-mono font-semibold text-[var(--accent-primary)] tabular-nums">
                      {resistance} Ω
                    </span>
                  </div>
                  <input
                    id="sim-res"
                    type="range"
                    min={10}
                    max={200}
                    step={5}
                    value={resistance}
                    onChange={(e) => setResistance(Number(e.target.value))}
                    className="mt-2 w-full cursor-pointer accent-[var(--accent-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-[var(--border-hairline)] pt-4">
                  <div className="rounded-lg bg-[var(--bg-subtle)] p-3">
                    <p className="text-[11px] text-[var(--text-muted)]">Current (I)</p>
                    <p className="font-mono mt-0.5 text-lg font-bold text-[var(--text-primary)] tabular-nums">
                      {currentAmps.toFixed(2)} A
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--bg-subtle)] p-3">
                    <p className="text-[11px] text-[var(--text-muted)]">Power (P)</p>
                    <p className="font-mono mt-0.5 text-lg font-bold text-[var(--text-primary)] tabular-nums">
                      {powerWatts.toFixed(2)} W
                    </p>
                  </div>
                </div>

                <p
                  className={`font-mono text-xs font-semibold ${
                    isHighCurrent ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isHighCurrent ? '▲ HIGH CURRENT LOAD (> 0.25 A)' : '● NOMINAL CIRCUIT FLOW'}
                </p>
              </div>
            )}

            {simTab === 'projectile' && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-[var(--accent-primary)]">
                    Grade 12 Mechanics
                  </p>
                  <h3 className="font-display mt-1 text-lg font-bold text-[var(--text-primary)]">
                    2D Projectile Velocity Vectors
                  </h3>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-speed" className="font-medium text-[var(--text-primary)]">
                      Initial Speed (v₀)
                    </label>
                    <span className="font-mono font-semibold text-[var(--accent-primary)] tabular-nums">
                      {launchSpeed} m/s
                    </span>
                  </div>
                  <input
                    id="sim-speed"
                    type="range"
                    min={12}
                    max={40}
                    step={1}
                    value={launchSpeed}
                    onChange={(e) => {
                      setLaunchSpeed(Number(e.target.value));
                      projTimeRef.current = 0;
                    }}
                    className="mt-1.5 w-full cursor-pointer accent-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-angle" className="font-medium text-[var(--text-primary)]">
                      Launch Angle (θ)
                    </label>
                    <span className="font-mono font-semibold text-[var(--accent-primary)] tabular-nums">
                      {launchAngle}°
                    </span>
                  </div>
                  <input
                    id="sim-angle"
                    type="range"
                    min={15}
                    max={75}
                    step={1}
                    value={launchAngle}
                    onChange={(e) => {
                      setLaunchAngle(Number(e.target.value));
                      projTimeRef.current = 0;
                    }}
                    className="mt-1.5 w-full cursor-pointer accent-[var(--accent-primary)]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGravity(9.8);
                      projTimeRef.current = 0;
                    }}
                    className={`flex-1 rounded-lg py-2 text-xs font-medium cursor-pointer ${
                      gravity === 9.8
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Earth (9.8 m/s²)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGravity(1.62);
                      projTimeRef.current = 0;
                    }}
                    className={`flex-1 rounded-lg py-2 text-xs font-medium cursor-pointer ${
                      gravity === 1.62
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Moon (1.62 m/s²)
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-[var(--border-hairline)] pt-3 text-center">
                  <div className="rounded-lg bg-[var(--bg-subtle)] p-2">
                    <p className="text-[11px] text-[var(--text-muted)]">Max H</p>
                    <p className="font-mono text-xs font-bold text-[var(--text-primary)] tabular-nums">
                      {maxHeight.toFixed(1)} m
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--bg-subtle)] p-2">
                    <p className="text-[11px] text-[var(--text-muted)]">Range</p>
                    <p className="font-mono text-xs font-bold text-[var(--text-primary)] tabular-nums">
                      {rangeMeters.toFixed(1)} m
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--bg-subtle)] p-2">
                    <p className="text-[11px] text-[var(--text-muted)]">Time</p>
                    <p className="font-mono text-xs font-bold text-[var(--text-primary)] tabular-nums">
                      {totalFlightTime.toFixed(2)} s
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProjPlaying((p) => !p)}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-primary)] text-xs font-semibold text-white cursor-pointer"
                  >
                    {projPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    <span>{projPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      projTimeRef.current = 0;
                    }}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-3 text-xs font-medium text-[var(--text-primary)] cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {simTab === 'bonding' && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-medium text-[var(--accent-primary)]">
                    Grade 10–11 Chemistry
                  </p>
                  <h3 className="font-display mt-1 text-lg font-bold text-[var(--text-primary)]">
                    Ionic &amp; Covalent Chemical Bonding
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBondType('ionic')}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold cursor-pointer ${
                      bondType === 'ionic'
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Ionic (NaCl)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBondType('covalent')}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold cursor-pointer ${
                      bondType === 'covalent'
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Covalent (H₂O)
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-bond" className="font-medium text-[var(--text-primary)]">
                      Bond Formation Progress
                    </label>
                    <span className="font-mono font-semibold text-[var(--accent-primary)] tabular-nums">
                      {bondProgress}%
                    </span>
                  </div>
                  <input
                    id="sim-bond"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={bondProgress}
                    onChange={(e) => {
                      setBondAutoPlay(false);
                      setBondProgress(Number(e.target.value));
                    }}
                    className="mt-2 w-full cursor-pointer accent-[var(--accent-primary)]"
                  />
                </div>

                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                  {bondType === 'ionic'
                    ? 'Sodium (2,8,1) transfers its single 3s¹ valence electron to Chlorine (2,8,7), creating electrostatic attraction between Na⁺ and Cl⁻ ions.'
                    : 'Oxygen shares two electron pairs with two Hydrogen atoms so all three nuclei achieve stable noble-gas valence shells.'}
                </p>

                <button
                  type="button"
                  onClick={() => setBondAutoPlay((p) => !p)}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] text-xs font-semibold text-white cursor-pointer"
                >
                  {bondAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{bondAutoPlay ? 'Pause Reaction Step' : 'Animate Bond Formation'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          MODULE C: OFFLINE CLASSROOM MEDIA PLAYER (WEB AUDIO API)
          ====================================================== */}
      <section
        id="module-c"
        className="scroll-mt-24 border-t border-[var(--border-hairline)] pt-12 space-y-6"
      >
        <div>
          <p className="font-mono text-xs font-medium text-[var(--accent-primary)]">
            Module C · Custom Web Audio API Synthesizer &amp; Bilingual Captions
          </p>
          <h2 className="font-display mt-1 text-2xl font-bold text-[var(--text-primary)]">
            Offline Classroom Audio Player
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Player Controls & Visualizer */}
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 lg:col-span-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-[var(--text-muted)]">{activeTrack.gradeAndSubject}</p>
                <h3 className="font-display mt-1 text-lg font-bold text-[var(--text-primary)]">
                  {activeTrack.title}
                </h3>
              </div>
              <Headphones className="h-5 w-5 text-[var(--accent-primary)]" aria-hidden="true" />
            </div>

            <canvas
              ref={mediaCanvasRef}
              width={620}
              height={130}
              className="mt-5 w-full rounded-lg border border-[var(--border-hairline)]"
              aria-label="Synthesized classroom audio frequency spectrum"
            />

            {/* Scrubbing Bar */}
            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={activeTrack.durationSeconds}
                step={0.5}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                aria-label="Audio track progress"
                className="w-full cursor-pointer accent-[var(--accent-primary)]"
              />
              <div className="mt-1 flex justify-between font-mono text-xs text-[var(--text-muted)] tabular-nums">
                <span>{Math.floor(currentTime)}s</span>
                <span>{activeTrack.durationSeconds}s</span>
              </div>
            </div>

            {/* Playback & Speed & Volume */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" aria-hidden="true" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" aria-hidden="true" />
                      <span>Play Offline Audio</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  {[0.75, 1, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setPlaybackRate(spd)}
                      className={`rounded-md px-2 py-1 font-mono text-xs cursor-pointer ${
                        playbackRate === spd
                          ? 'bg-[var(--accent-primary)] text-white'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  aria-label="Audio volume"
                  className="w-24 cursor-pointer accent-[var(--accent-primary)]"
                />
              </div>
            </div>

            {/* Synchronized Bilingual Captions */}
            <div className="mt-6 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[var(--accent-primary)]">
                  Synchronized Bilingual Captions
                </p>
                <div className="flex flex-wrap gap-1">
                  {(['siswati', 'isizulu', 'sepedi', 'xitsonga'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setCaptionLang(lang)}
                      className={`rounded px-2 py-0.5 text-[11px] font-medium cursor-pointer ${
                        captionLang === lang
                          ? 'bg-[var(--accent-primary)] text-white'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {LANGUAGE_LABELS[lang]}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
                {activeCaption.english}
              </p>
              <p className="mt-1.5 text-sm text-[var(--accent-primary)]">
                {activeCaption.translations[captionLang]}
              </p>
            </div>
          </div>

          {/* 4-Track Classroom Playlist */}
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 lg:col-span-5">
            <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
              Classroom Audio Playlist (4 Tracks)
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Synthesized locally via Web Audio API—works without internet connectivity.
            </p>

            <div className="mt-4 space-y-2.5">
              {CLASSROOM_TRACKS.map((track, idx) => {
                const selected = idx === trackIdx;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => handleSelectTrack(idx)}
                    className={`w-full rounded-lg border p-3.5 text-left transition-colors cursor-pointer ${
                      selected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-subtle)] hover:border-[var(--accent-primary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--text-primary)]">
                        0{idx + 1}. {track.title}
                      </p>
                      <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                        {track.durationSeconds}s
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                      {track.gradeAndSubject}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
