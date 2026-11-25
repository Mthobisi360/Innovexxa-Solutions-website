import { PageRoute } from './Navbar';

interface FooterProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-base font-bold text-[var(--text-primary)]">
              Innovexa Solutions
            </p>
            <p className="mt-3 max-w-md text-sm text-[var(--text-muted)]">
              Offline-first mobile STEM laboratories, ESP32 hardware kits, and CAPS-aligned
              multilingual learning modules serving South African Foundation, Intermediate, and FET
              schools.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--text-primary)]">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                >
                  Vision &amp; Roadmap
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('curriculum')}
                  className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                >
                  CAPS Curriculum Catalogue
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('lab')}
                  className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                >
                  Coding Lab &amp; Simulations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', 'csi-calculator')}
                  className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                >
                  CSI Cross-Subsidy Calculator
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--text-primary)]">CAPS Phases</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('curriculum')}
                  className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                >
                  Foundation Coding &amp; Robotics (R–3)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('curriculum')}
                  className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                >
                  Intermediate Coding &amp; Robotics (4–6)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('curriculum')}
                  className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                >
                  FET Physical Sciences (10–12)
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border-hairline)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>Innovexa Solutions · Department of Basic Education CAPS Alignment</p>
          <p>B-BBEE Socio-Economic Development (SED) Hybrid Education Initiative</p>
        </div>
      </div>
    </footer>
  );
}
