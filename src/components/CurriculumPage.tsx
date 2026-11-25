import { BookOpen, Headphones, Radio, Search, Video } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  ALL_GRADES_BY_PHASE,
  CURRICULUM_MODULES,
  CurriculumModule,
  LearningMode,
  PhaseId,
} from '../data/curriculumData';

interface CurriculumPageProps {
  selectedPhase: PhaseId | 'all';
  onPhaseChange: (phase: PhaseId | 'all') => void;
  onOpenModule: (moduleId: string, mode: LearningMode) => void;
}

const PHASE_SECTIONS: {
  id: PhaseId;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    id: 'foundation',
    title: '1. Foundation Phase (Grades R–3): Coding and Robotics',
    subtitle:
      '1 hour/week in Grades R–2 and 2 hours/week in Grade 3 across Pattern Recognition, Algorithms & Coding, Robotics Skills, Internet & E-Communications, and Application Skills.',
    image: '/src/assets/images/students_coding_robotics_1795425463117.jpg',
    imageAlt: 'Young South African learners building a wheeled robot chassis in Foundation and Intermediate Phase class',
  },
  {
    id: 'intermediate',
    title: '2. Intermediate Phase (Grades 4–6): Coding and Robotics',
    subtitle:
      '2 hours/week across Algorithms & Coding, Robotics Skills, Internet & E-Communications, and Application Skills, alongside Term 1–4 PAT builds and Tests/Exams.',
    image: '/src/assets/images/mentor_classroom_session_1795425463505.jpg',
    imageAlt: 'South African STEM mentor demonstrating microcontroller robotics and code on a tablet to learners',
  },
  {
    id: 'fet',
    title: '3. FET Phase (Grades 10–12): Physical Sciences',
    subtitle:
      '4 hours/week across Matter & Materials, Chemical Change, Chemical Systems, Mechanics, Waves, Sound & Light, Electricity & Magnetism, and Practical Investigation Skills.',
    image: '/src/assets/images/students_physics_lab_1795425464242.jpg',
    imageAlt: 'South African FET high school students performing circuit and optics investigations in Physical Sciences',
  },
];

export function CurriculumPage({
  selectedPhase,
  onPhaseChange,
  onOpenModule,
}: CurriculumPageProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const availableGrades = useMemo(() => {
    if (selectedPhase === 'all') {
      return [
        ...ALL_GRADES_BY_PHASE.foundation,
        ...ALL_GRADES_BY_PHASE.intermediate,
        ...ALL_GRADES_BY_PHASE.fet,
      ];
    }
    return ALL_GRADES_BY_PHASE[selectedPhase];
  }, [selectedPhase]);

  const handlePhaseSelect = (phase: PhaseId | 'all') => {
    onPhaseChange(phase);
    setSelectedGrade('all');
  };

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CURRICULUM_MODULES.filter((mod) => {
      if (selectedPhase !== 'all' && mod.phase !== selectedPhase) return false;
      if (selectedGrade !== 'all' && mod.grade !== selectedGrade) return false;
      if (!q) return true;
      return (
        mod.grade.toLowerCase().includes(q) ||
        mod.strand.toLowerCase().includes(q) ||
        mod.subject.toLowerCase().includes(q) ||
        mod.summary.toLowerCase().includes(q) ||
        mod.topics.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [selectedPhase, selectedGrade, searchQuery]);

  const visiblePhases = PHASE_SECTIONS.filter((sec) =>
    filteredModules.some((m) => m.phase === sec.id)
  );

  const groupByGrade = (modules: CurriculumModule[]) => {
    const map = new Map<string, CurriculumModule[]>();
    modules.forEach((m) => {
      const list = map.get(m.grade) ?? [];
      list.push(m);
      map.set(m.grade, list);
    });
    return Array.from(map.entries());
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:py-14">
      {/* Header */}
      <div className="max-w-3xl">
        <p className="text-xs font-medium text-[var(--accent-primary)]">
          Department of Basic Education CAPS Catalogue
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Curriculum Modules by Phase, Grade &amp; Learning Mode
        </h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Select any module below to open its dedicated learning workspace in{' '}
          <strong className="font-semibold text-[var(--text-primary)]">Read</strong>,{' '}
          <strong className="font-semibold text-[var(--text-primary)]">Listen</strong>,{' '}
          <strong className="font-semibold text-[var(--text-primary)]">Pre-Recorded Video</strong>,
          or <strong className="font-semibold text-[var(--text-primary)]">Live Video</strong> mode.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="mt-8 space-y-4 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Phase Segmented Control */}
          <div
            className="flex flex-wrap gap-1.5 rounded-lg bg-[var(--bg-subtle)] p-1"
            role="tablist"
            aria-label="Filter by phase"
          >
            {(
              [
                { id: 'all', label: 'All Phases (54)' },
                { id: 'foundation', label: 'Foundation R–3 (20)' },
                { id: 'intermediate', label: 'Intermediate 4–6 (15)' },
                { id: 'fet', label: 'FET Sciences 10–12 (19)' },
              ] as const
            ).map((tab) => {
              const active = selectedPhase === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handlePhaseSelect(tab.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[var(--bg-surface)] text-[var(--accent-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search strand, topic, or grade..."
              aria-label="Search curriculum modules"
              className="h-10 w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Grade Filter Row */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--border-hairline)] pt-3">
          <span className="mr-2 text-xs font-medium text-[var(--text-muted)]">Grade:</span>
          <button
            type="button"
            onClick={() => setSelectedGrade('all')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedGrade === 'all'
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All
          </button>
          {availableGrades.map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => setSelectedGrade(grade)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedGrade === grade
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredModules.length === 0 ? (
        <div className="mt-10 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-10 text-center">
          <p className="font-display text-lg font-semibold text-[var(--text-primary)]">
            No matching CAPS modules found
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Try clearing your search term or switching back to All Phases.
          </p>
          <button
            type="button"
            onClick={() => {
              onPhaseChange('all');
              setSelectedGrade('all');
              setSearchQuery('');
            }}
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-[var(--accent-primary)] px-4 text-xs font-semibold text-white cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-12 space-y-16">
          {visiblePhases.map((section) => {
            const phaseModules = filteredModules.filter((m) => m.phase === section.id);
            const groupedGrades = groupByGrade(phaseModules);

            return (
              <section key={section.id} className="space-y-8">
                {/* Phase Banner */}
                <div className="grid items-stretch gap-6 overflow-hidden rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] lg:grid-cols-12">
                  <div className="flex flex-col justify-center p-6 lg:col-span-7">
                    <p className="font-mono text-xs font-medium text-[var(--accent-primary)]">
                      {phaseModules.length} Modules Available
                    </p>
                    <h2 className="font-display mt-2 text-2xl font-bold text-[var(--text-primary)]">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm text-[var(--text-secondary)]">{section.subtitle}</p>
                  </div>
                  <div className="lg:col-span-5">
                    <img
                      src={section.image}
                      alt={section.imageAlt}
                      referrerPolicy="no-referrer"
                      className="h-52 w-full object-cover lg:h-full"
                    />
                  </div>
                </div>

                {/* Grades within Phase */}
                {groupedGrades.map(([grade, modules]) => (
                  <div key={grade} className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-[var(--border-hairline)] pb-2">
                      <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                        {grade} Modules
                      </h3>
                      <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                        {modules[0]?.subject} · {modules[0]?.weeklyHours}
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {modules.map((mod) => (
                        <article
                          key={mod.id}
                          className="flex flex-col justify-between rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 transition-colors hover:border-[var(--accent-primary)]"
                        >
                          <div>
                            <p className="text-xs text-[var(--text-muted)]">
                              {mod.grade} · {mod.subject} · {mod.weeklyHours}
                            </p>
                            <h4 className="font-display mt-1.5 text-base font-bold text-[var(--text-primary)]">
                              <button
                                type="button"
                                onClick={() => onOpenModule(mod.id, 'read')}
                                className="text-left hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                              >
                                {mod.strand}
                              </button>
                            </h4>
                            <p className="mt-2 text-sm text-[var(--text-secondary)]">
                              {mod.summary}
                            </p>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--border-hairline)] pt-4">
                            <button
                              type="button"
                              onClick={() => onOpenModule(mod.id, 'read')}
                              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-3 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Read</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenModule(mod.id, 'listen')}
                              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-3 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Headphones className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Listen</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenModule(mod.id, 'prerecorded')}
                              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-3 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Video className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Pre-Recorded Video</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenModule(mod.id, 'live')}
                              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-3 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Radio className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Live Video</span>
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
