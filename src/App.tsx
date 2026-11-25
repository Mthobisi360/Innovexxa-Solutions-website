import { useCallback, useEffect, useState } from 'react';
import { CurriculumPage } from './components/CurriculumPage';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { LabPage } from './components/LabPage';
import { ModulePlayerPage } from './components/ModulePlayerPage';
import { Navbar, PageRoute } from './components/Navbar';
import { CURRICULUM_MODULES, LearningMode, PhaseId } from './data/curriculumData';

const THEME_STORAGE_KEY = 'innovexa-theme';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark';
}

function parseHashState(): {
  page: PageRoute;
  moduleId: string;
  mode: LearningMode;
} {
  if (typeof window === 'undefined') {
    return { page: 'home', moduleId: CURRICULUM_MODULES[0].id, mode: 'read' };
  }
  const raw = window.location.hash.replace(/^#/, '');
  if (raw === 'lab') {
    return { page: 'lab', moduleId: CURRICULUM_MODULES[0].id, mode: 'read' };
  }
  if (raw === 'curriculum') {
    return { page: 'curriculum', moduleId: CURRICULUM_MODULES[0].id, mode: 'read' };
  }
  if (raw.startsWith('module/')) {
    const [, modId, modMode] = raw.split('/');
    const matched = CURRICULUM_MODULES.find((m) => m.id === modId);
    const validMode: LearningMode =
      modMode === 'read' || modMode === 'listen' || modMode === 'prerecorded' || modMode === 'live'
        ? modMode
        : 'read';
    if (matched) {
      return { page: 'module', moduleId: matched.id, mode: validMode };
    }
  }
  return { page: 'home', moduleId: CURRICULUM_MODULES[0].id, mode: 'read' };
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const initialRoute = parseHashState();
  const [currentPage, setCurrentPage] = useState<PageRoute>(initialRoute.page);
  const [selectedPhase, setSelectedPhase] = useState<PhaseId | 'all'>('all');
  const [activeModuleId, setActiveModuleId] = useState<string>(initialRoute.moduleId);
  const [activeMode, setActiveMode] = useState<LearningMode>(initialRoute.mode);

  // Sync theme to <html> class & localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Listen to browser back/forward hash changes
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHashState();
      setCurrentPage(parsed.page);
      setActiveModuleId(parsed.moduleId);
      setActiveMode(parsed.mode);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleNavigate = useCallback((page: PageRoute, sectionId?: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      window.location.hash = sectionId ? sectionId : 'home';
      if (sectionId) {
        window.setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (page === 'curriculum') {
      window.location.hash = 'curriculum';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'lab') {
      window.location.hash = 'lab';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleOpenModule = useCallback((moduleId: string, mode: LearningMode) => {
    setActiveModuleId(moduleId);
    setActiveMode(mode);
    setCurrentPage('module');
    window.location.hash = `module/${moduleId}/${mode}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleModeChange = useCallback(
    (mode: LearningMode) => {
      setActiveMode(mode);
      window.location.hash = `module/${activeModuleId}/${mode}`;
    },
    [activeModuleId]
  );

  const activeModule =
    CURRICULUM_MODULES.find((m) => m.id === activeModuleId) ?? CURRICULUM_MODULES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <Navbar
        currentPage={currentPage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectPhaseFilter={(phase) => setSelectedPhase(phase)}
          />
        )}

        {currentPage === 'curriculum' && (
          <CurriculumPage
            selectedPhase={selectedPhase}
            onPhaseChange={setSelectedPhase}
            onOpenModule={handleOpenModule}
          />
        )}

        {currentPage === 'module' && (
          <ModulePlayerPage
            module={activeModule}
            initialMode={activeMode}
            theme={theme}
            onModeChange={handleModeChange}
            onBackToCurriculum={() => handleNavigate('curriculum')}
            onNavigate={handleNavigate}
            onSelectAdjacentModule={(nextId) => handleOpenModule(nextId, activeMode)}
          />
        )}

        {currentPage === 'lab' && (
          <LabPage theme={theme} onOpenCurriculum={() => handleNavigate('curriculum')} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
