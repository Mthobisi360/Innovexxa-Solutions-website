import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';

export type PageRoute = 'home' | 'curriculum' | 'lab' | 'module';

interface NavbarProps {
  currentPage: PageRoute;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export function Navbar({ currentPage, theme, onToggleTheme, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = (active: boolean) =>
    `relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
      active
        ? 'text-[var(--accent-primary)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    }`;

  const handleLinkClick = (page: PageRoute, sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(page, sectionId);
  };

  return (
    <header
      className="sticky top-0 z-50 h-16 border-b border-[var(--border-hairline)] backdrop-blur-md transition-colors"
      style={{ backgroundColor: 'var(--bg-glass)' }}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0"
        >
          Innovexa Solutions
        </a>

        {/* Zone 2: Clean Single-Line Text Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className={navLinkClass(currentPage === 'home')}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('curriculum')}
            className={navLinkClass(currentPage === 'curriculum' || currentPage === 'module')}
          >
            CAPS Modules
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('lab')}
            className={navLinkClass(currentPage === 'lab')}
          >
            Interactive Lab
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'csi-calculator')}
            className={navLinkClass(false)}
          >
            CSI Model
          </button>
        </nav>

        {/* Zone 3: Theme Toggle + Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-sky-700" aria-hidden="true" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('curriculum')}
            className="hidden sm:inline-flex h-10 items-center rounded-lg bg-[var(--accent-primary)] px-4 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Browse Curriculum
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)] md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            <button
              type="button"
              onClick={() => handleLinkClick('home')}
              className="text-left py-2 text-sm font-medium text-[var(--text-primary)]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('curriculum')}
              className="text-left py-2 text-sm font-medium text-[var(--text-primary)]"
            >
              CAPS Modules
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('lab')}
              className="text-left py-2 text-sm font-medium text-[var(--text-primary)]"
            >
              Interactive Lab
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'csi-calculator')}
              className="text-left py-2 text-sm font-medium text-[var(--text-primary)]"
            >
              CSI Model
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
