import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BookOpen, Cpu, FlaskConical, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { APP_IMAGES } from '../data/assets';
import { PhaseId } from '../data/curriculumData';
import { PageRoute } from './Navbar';

gsap.registerPlugin(ScrollTrigger);

interface HomePageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  onSelectPhaseFilter: (phase: PhaseId) => void;
}

const CORE_OBJECTIVES = [
  {
    index: '01.',
    title: 'Offline-First Mobile STEM Pods',
    detail:
      'Self-contained mobile classroom kits equipped with pre-loaded ESP32 microcontrollers, solar-ready laptops, and local HTML5 simulation servers that operate reliably without school Wi-Fi.',
    metric: '0 MB external data required per lesson',
  },
  {
    index: '02.',
    title: 'CAPS-Aligned Coding & Physical Sciences',
    detail:
      'Complete coverage of Department of Basic Education CAPS modules across Foundation Phase (Grades R–3), Intermediate Phase (Grades 4–6), and FET Physical Sciences (Grades 10–12).',
    metric: '54 structured modules · Read, Listen & Video',
  },
  {
    index: '03.',
    title: 'Multilingual Code-Switching Pedagogy',
    detail:
      'InnovaBot bridges home languages—siSwati, isiZulu, Sepedi, and Xitsonga—with precise English scientific and programming syntax so learners grasp logic before memorising jargon.',
    metric: '5 South African languages integrated',
  },
  {
    index: '04.',
    title: 'Sustainable Hybrid Cross-Subsidy',
    detail:
      'Commercial school subscriptions and corporate B-BBEE Socio-Economic Development (SED) partnerships cross-subsidize full laboratory access for Quintile 1–3 no-fee public schools.',
    metric: 'Month 3+ self-sustaining pod unit economics',
  },
];

const ROADMAP_PHASES = [
  {
    phase: 'Phase 1 · Months 1–3',
    title: 'CIPC & B-BBEE Compliance and 6-Member Pods',
    summary:
      'Formalize CIPC registration, B-BBEE SED compliance documentation, and recruit agile 6-member deployment pods (curriculum lead, hardware engineer, and 4 youth facilitators) alongside full DBE CAPS syllabus mapping.',
    deliverables: [
      'CIPC & B-BBEE SED governance pack',
      '6-member regional facilitator pods trained',
      'Grades R–6 & 10–12 CAPS module blueprint',
    ],
  },
  {
    phase: 'Phase 2 · Months 4–6',
    title: 'MVP Mobile Lab Assembly & No-Fee School Pilots',
    summary:
      'Assemble ruggedised ESP32 breadboard kits, sensor packs, and mobile storage cases, then launch live classroom pilots across partner no-fee and fee-paying anchor schools.',
    deliverables: [
      'ESP32 MicroPython & sensor hardware kits',
      'Month 3+ hybrid cross-subsidy trigger active',
      'Baseline diagnostic assessments completed',
    ],
  },
  {
    phase: 'Phase 3 · Months 7–9',
    title: 'Offline Visualization & Multilingual AI Rollout',
    summary:
      'Deploy offline HTML5 Canvas STEM simulations (Ohm’s Law, Mechanics Vectors, Chemical Bonding), Web Audio classroom media tracks, and code-switching InnovaBot lessons across 5 languages.',
    deliverables: [
      'Offline CAPS simulation suite live',
      'siSwati, isiZulu, Sepedi & Xitsonga packs',
      'PAT practical assessment portfolios digitised',
    ],
  },
  {
    phase: 'Phase 4 · Months 10–12',
    title: 'District Scaling & CSI Impact Audits',
    summary:
      'Expand mobile pod rotations across neighbouring education districts, publish audited B-BBEE SED impact reports for corporate sponsors, and onboard accredited teacher CPD cohorts.',
    deliverables: [
      'Multi-district mobile pod scheduling',
      'Verified B-BBEE SED expenditure certificates',
      'Teacher CPD accreditation & provincial scale',
    ],
  },
];

const REVENUE_STREAMS = [
  {
    index: '01.',
    name: 'B-BBEE SED Corporate Grants',
    description:
      'Tax-deductible Socio-Economic Development contributions directly funding mobile lab pods in Quintile 1–3 no-fee schools.',
  },
  {
    index: '02.',
    name: 'Fee-Paying School Subscriptions',
    description:
      'Annual per-learner licensing for private and Quintile 4–5 schools accessing the full Coding, Robotics, and FET Physics suite.',
  },
  {
    index: '03.',
    name: 'Corporate Hardware Sponsorships',
    description:
      'Branded ESP32 microcontroller kits, solar charging carts, and multimeters co-funded by engineering and telecom partners.',
  },
  {
    index: '04.',
    name: 'Teacher CPD Workshops',
    description:
      'Accredited practical training sessions equipping educators to teach MicroPython, block coding, and CAPS PAT projects confidently.',
  },
  {
    index: '05.',
    name: 'Provincial EdTech Licensing',
    description:
      'Offline-capable district server deployments giving entire circuits unified access to pre-recorded lessons and simulations.',
  },
];

export function HomePage({ onNavigate, onSelectPhaseFilter }: HomePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [csiBudget, setCsiBudget] = useState<number>(450000);

  // CSI Cross-Subsidy Calculations
  const costPerPod = 150000;
  const podsDeployed = Math.max(1, Math.floor(csiBudget / costPerPod));
  const schoolsFunded = podsDeployed * 3; // Each mobile pod rotates across 3 nearby no-fee schools
  const learnersReached = schoolsFunded * 180; // ~180 STEM learners reached per school annually
  const facilitatorsTrained = podsDeployed * 6;
  const sedTier =
    csiBudget >= 1500000
      ? 'Full District SED Partner (Max B-BBEE SED Points)'
      : csiBudget >= 600000
        ? 'Regional Cluster SED Partner'
        : 'Starter School Pod SED Partner';

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      });

      gsap.utils.toArray<HTMLElement>('.objective-card').forEach((card) => {
        gsap.from(card, {
          y: 28,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 84%',
            once: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.roadmap-step').forEach((step) => {
        gsap.from(step, {
          y: 32,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 86%',
            once: true,
          },
        });
      });

      gsap.from('.revenue-item', {
        y: 20,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.revenue-grid',
          start: 'top 82%',
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const formatRand = (value: number) =>
    `R ${value.toLocaleString('en-ZA')}`;

  return (
    <div ref={rootRef} className="pb-20">
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-[1200px] px-4 pt-10 pb-14 sm:px-6 lg:pt-16">
        <div className="grid items-stretch gap-10 lg:grid-cols-12">
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="hero-stagger text-xs font-medium text-[var(--accent-primary)]">
                Department of Basic Education CAPS · Grades R–12 · Offline-Ready
              </p>
              <h1
                className="hero-stagger font-display mt-3 font-bold tracking-tight text-[var(--text-primary)]"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.6rem)', lineHeight: 1.08 }}
              >
                Practical Coding, Robotics, and Physical Sciences for Every Classroom
              </h1>
              <p className="hero-stagger mt-5 max-w-xl text-base text-[var(--text-secondary)]">
                Innovexa Solutions pairs portable ESP32 hardware labs with offline CAPS-aligned
                simulations and multilingual code-switching lessons so learners master STEM in their
                own voices.
              </p>
            </div>

            <div className="hero-stagger mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('curriculum')}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                <span>Explore 54 CAPS Modules</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('lab')}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden="true" />
                <span>Open Interactive Lab</span>
              </button>
            </div>
          </div>

          <div className="hero-stagger lg:col-span-6">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
              <img
                src={APP_IMAGES.heroMobileStemLab}
                alt="South African high school students collaborating around an ESP32 mobile STEM lab bench with laptops and breadboard circuits"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5">
                <p className="text-xs font-medium text-sky-200">
                  Mobile STEM Pod · ESP32 &amp; MicroPython Lab
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  Hands-on circuit assembly and live telemetry in sunlit South African classrooms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column KPI Strip */}
        <div className="mt-10 grid grid-cols-2 gap-4 border-y border-[var(--border-hairline)] py-6 lg:grid-cols-4">
          <div className="px-2">
            <p className="font-mono text-2xl font-bold text-[var(--text-primary)] tabular-nums">
              54
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              CAPS Modules across Grades R–6 &amp; 10–12
            </p>
          </div>
          <div className="px-2">
            <p className="font-mono text-2xl font-bold text-[var(--text-primary)] tabular-nums">
              4 Modes
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Read · Listen · Pre-Recorded · Live Video
            </p>
          </div>
          <div className="px-2">
            <p className="font-mono text-2xl font-bold text-[var(--text-primary)] tabular-nums">
              5 Languages
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              English · siSwati · isiZulu · Sepedi · Xitsonga
            </p>
          </div>
          <div className="px-2">
            <p className="font-mono text-2xl font-bold text-[var(--text-primary)] tabular-nums">
              Month 3+
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Commercial revenue cross-subsidy threshold
            </p>
          </div>
        </div>
      </section>

      {/* 2. STICKY SPLIT-SCREEN ECOSYSTEM & CORE OBJECTIVES */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          {/* Left Sticky Column */}
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <p className="text-xs font-medium text-[var(--accent-primary)]">
              Integrated Mobile Ecosystem
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Built for Real Schools, Not Ideal Lab Assumptions
            </h2>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Many rural and township classrooms lack dedicated science labs or stable broadband.
              Innovexa combines physical microcontroller hardware, offline visual simulations, and
              human mentorship in one unified system.
            </p>

            <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
              <img
                src={APP_IMAGES.mentorClassroomSession}
                alt="South African STEM mentor guiding learners on a tablet and breadboard inside a mobile learning pod"
                referrerPolicy="no-referrer"
                className="aspect-video w-full object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-[var(--text-muted)]">
                  Facilitator-led pod sessions · 6-member deployment teams
                </p>
              </div>
            </div>
          </div>

          {/* Right Scrolling Objectives Column */}
          <div className="space-y-6 lg:col-span-7">
            {CORE_OBJECTIVES.map((obj) => (
              <article
                key={obj.index}
                className="objective-card rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 transition-colors"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                    <span className="font-mono text-[var(--accent-primary)] mr-2">{obj.index}</span>
                    {obj.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">{obj.detail}</p>
                <p className="mt-4 font-mono text-xs text-[var(--text-muted)]">{obj.metric}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STICKY STACKED 12-MONTH ROADMAP */}
      <section className="border-y border-[var(--border-hairline)] bg-[var(--bg-subtle)] py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:sticky lg:top-24 lg:col-span-4">
              <p className="text-xs font-medium text-[var(--accent-primary)]">
                12-Month Implementation Plan
              </p>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                From Governance to District Scale
              </h2>
              <p className="mt-4 text-sm text-[var(--text-secondary)]">
                Four sequential rollout quarters lock in compliance, validate ESP32 hardware in
                live classrooms, launch offline simulations, and scale across districts.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('lab')}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
              >
                <span>Test the Phase 3 Offline Lab</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-6 lg:col-span-8">
              {ROADMAP_PHASES.map((item, idx) => (
                <div
                  key={item.phase}
                  className="roadmap-step lg:sticky rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 shadow-sm"
                  style={{ top: `${96 + idx * 20}px` }}
                >
                  <p className="font-mono text-xs font-medium text-[var(--accent-primary)]">
                    {item.phase}
                  </p>
                  <h3 className="font-display mt-2 text-xl font-bold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">{item.summary}</p>
                  <ul className="mt-4 grid gap-2 border-t border-[var(--border-hairline)] pt-4 text-xs text-[var(--text-muted)] sm:grid-cols-3">
                    {item.deliverables.map((deliv) => (
                      <li key={deliv} className="leading-relaxed">
                        · {deliv}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. HYBRID REVENUE MODEL & INTERACTIVE CSI CALCULATOR */}
      <section id="csi-calculator" className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[var(--accent-primary)]">
            Hybrid Revenue &amp; Social Impact Model
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Five Revenue Streams &amp; Month 3+ Cross-Subsidy
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            From Month 3 onward, fee-paying private school subscriptions and B-BBEE corporate SED
            grants generate recurring surplus that directly funds no-fee Quintile 1–3 public school
            deployments.
          </p>
        </div>

        <div className="revenue-grid mt-8 grid gap-4 md:grid-cols-5">
          {REVENUE_STREAMS.map((stream) => (
            <div
              key={stream.index}
              className="revenue-item rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5"
            >
              <p className="font-mono text-xs font-semibold text-[var(--accent-primary)]">
                {stream.index}
              </p>
              <h3 className="font-display mt-2 text-sm font-semibold text-[var(--text-primary)]">
                {stream.name}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                {stream.description}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive CSI Calculator */}
        <div className="mt-10 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="text-xs font-medium text-[var(--accent-primary)]">
                Interactive CSI Cross-Subsidy Calculator
              </p>
              <h3 className="font-display mt-2 text-2xl font-bold text-[var(--text-primary)]">
                Model Your B-BBEE SED Classroom Impact
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Adjust annual CSI investment to calculate mobile STEM pods deployed, no-fee schools
                equipped, and learners reached over a 12-month cycle.
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <label
                    htmlFor="csi-budget-slider"
                    className="font-medium text-[var(--text-primary)]"
                  >
                    Annual B-BBEE SED Contribution
                  </label>
                  <span className="font-mono text-lg font-bold text-[var(--accent-primary)] tabular-nums">
                    {formatRand(csiBudget)}
                  </span>
                </div>
                <input
                  id="csi-budget-slider"
                  type="range"
                  min={150000}
                  max={2400000}
                  step={150000}
                  value={csiBudget}
                  onChange={(e) => setCsiBudget(Number(e.target.value))}
                  className="mt-3 h-2 w-full cursor-pointer accent-[var(--accent-primary)]"
                />
                <div className="mt-2 flex justify-between font-mono text-xs text-[var(--text-muted)] tabular-nums">
                  <span>R 150,000</span>
                  <span>R 1,200,000</span>
                  <span>R 2,400,000</span>
                </div>
              </div>

              <p className="mt-5 text-xs text-[var(--text-muted)]">
                Recognition Profile:{' '}
                <span className="font-semibold text-[var(--text-primary)]">{sedTier}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:col-span-6">
              <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4">
                <p className="text-xs text-[var(--text-muted)]">No-Fee Schools Funded</p>
                <p className="font-mono mt-1 text-3xl font-bold text-[var(--text-primary)] tabular-nums">
                  {schoolsFunded}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">Quintile 1–3 public schools</p>
              </div>
              <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4">
                <p className="text-xs text-[var(--text-muted)]">Learners Reached</p>
                <p className="font-mono mt-1 text-3xl font-bold text-[var(--accent-primary)] tabular-nums">
                  {learnersReached.toLocaleString('en-ZA')}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">Annual STEM participation</p>
              </div>
              <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4">
                <p className="text-xs text-[var(--text-muted)]">Mobile STEM Pods</p>
                <p className="font-mono mt-1 text-3xl font-bold text-[var(--text-primary)] tabular-nums">
                  {podsDeployed}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">ESP32 + offline lab kits</p>
              </div>
              <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-4">
                <p className="text-xs text-[var(--text-muted)]">Youth Pod Mentors</p>
                <p className="font-mono mt-1 text-3xl font-bold text-[var(--text-primary)] tabular-nums">
                  {facilitatorsTrained}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">6-member pod staffing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STUDENT PHASE SHOWCASE -> DIRECT ENTRY TO CAPS CURRICULUM */}
      <section className="mx-auto max-w-[1200px] px-4 pt-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--accent-primary)]">
              Explore by CAPS Phase
            </p>
            <h2 className="font-display mt-1 text-2xl font-bold text-[var(--text-primary)]">
              Every Grade Module in Four Learning Modes
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('curriculum')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-primary)] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>View all 54 modules</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="overflow-hidden rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
            <img
              src={APP_IMAGES.studentsCodingRobotics}
              alt="Young South African primary school learners building a wheeled robot chassis together in class"
              referrerPolicy="no-referrer"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="p-6">
              <p className="text-xs text-[var(--text-muted)]">
                Foundation (R–3) &amp; Intermediate (4–6) · 35 Modules
              </p>
              <h3 className="font-display mt-1 text-xl font-bold text-[var(--text-primary)]">
                Coding and Robotics
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Pattern recognition, algorithms, microcontroller robotics, internet safety, CAD,
                spreadsheets, and term-by-term PAT builds.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSelectPhaseFilter('foundation');
                    onNavigate('curriculum');
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Cpu className="h-4 w-4" aria-hidden="true" />
                  <span>Foundation (R–3)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPhaseFilter('intermediate');
                    onNavigate('curriculum');
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Intermediate (4–6)</span>
                </button>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
            <img
              src={APP_IMAGES.studentsPhysicsLab}
              alt="South African high school students conducting Physical Sciences circuit and optics experiments"
              referrerPolicy="no-referrer"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="p-6">
              <p className="text-xs text-[var(--text-muted)]">
                FET Phase (Grades 10–12) · 19 Modules · 4 hrs/week
              </p>
              <h3 className="font-display mt-1 text-xl font-bold text-[var(--text-primary)]">
                Physical Sciences
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Matter &amp; Materials, Chemical Change, Chemical Systems, Mechanics, Waves &amp;
                Optics, Electricity &amp; Magnetism, and Practical Investigations.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSelectPhaseFilter('fet');
                    onNavigate('curriculum');
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  <span>Explore Grades 10–12</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('lab')}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Open Physics Simulators</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
