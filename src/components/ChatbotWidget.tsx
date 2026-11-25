import { Bot, Loader2, MessageSquare, Send, Trash2, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { CurriculumModule } from '../data/curriculumData';
import { LANGUAGE_LABELS, LanguageKey } from '../data/labData';
import { PageRoute } from './Navbar';

interface ChatbotWidgetProps {
  currentPage: PageRoute;
  activeModule: CurriculumModule;
}

interface ChatMessage {
  role: 'learner' | 'innovabot';
  languageLabel: string;
  text: string;
}

export function ChatbotWidget({ currentPage, activeModule }: ChatbotWidgetProps) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<LanguageKey>('english');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const contextMeta = (() => {
    if (currentPage === 'module') {
      return {
        contextTitle: `${activeModule.grade} — ${activeModule.strand}`,
        grade: activeModule.grade,
        subject: activeModule.subject,
        codeSnippet: activeModule.summary,
        suggestions: [
          `Explain ${activeModule.strand} simply`,
          'Give me a quick practice question',
        ],
      };
    }
    if (currentPage === 'curriculum') {
      return {
        contextTitle: 'CAPS Curriculum Catalogue (54 Modules)',
        grade: 'Grades R–6 & 10–12',
        subject: 'Coding, Robotics & Physical Sciences',
        codeSnippet: '',
        suggestions: [
          'Which coding modules fit Grade 4–6?',
          'What does Grade 12 Physical Sciences cover?',
        ],
      };
    }
    if (currentPage === 'lab') {
      return {
        contextTitle: 'Interactive Lab, Simulations & Media Studio',
        grade: 'Grades 4–12',
        subject: 'ESP32 MicroPython & Physics Simulations',
        codeSnippet: '',
        suggestions: [
          'How does the ESP32 Traffic Light code work?',
          "Explain Ohm's Law in isiZulu",
        ],
      };
    }
    return {
      contextTitle: 'Innovexa Solutions Overview & CSI Model',
      grade: 'Grades R–12',
      subject: 'Mobile STEM Labs & B-BBEE SED Hybrid Model',
      codeSnippet: '',
      suggestions: [
        'How does the Month 3+ CSI cross-subsidy work?',
        'What is inside a 6-member mobile STEM pod?',
      ],
    };
  })();

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setErrorMsg(null);
    setLoading(true);
    const label = LANGUAGE_LABELS[lang];
    const nextHistory = [...messages, { role: 'learner' as const, languageLabel: label, text: trimmed }];
    setMessages(nextHistory);
    setInput('');

    try {
      const response = await fetch('/api/innovabot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          language: lang,
          contextTitle: contextMeta.contextTitle,
          grade: contextMeta.grade,
          subject: contextMeta.subject,
          codeSnippet: contextMeta.codeSnippet,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          'Live InnovaBot chat requires the Innovexa Node server (available in the hosted app preview, not static GitHub Pages).'
        );
      }

      const data = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !data.answer) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      setMessages((prev) => [
        ...prev,
        { role: 'innovabot', languageLabel: label, text: data.answer! },
      ]);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to reach InnovaBot right now.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <section
          aria-label="InnovaBot AI Chatbot"
          className="flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-4 py-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-display text-sm font-bold text-[var(--text-primary)]">
                <Bot className="h-4 w-4 shrink-0 text-[var(--accent-primary)]" aria-hidden="true" />
                <span className="truncate">InnovaBot Chat</span>
              </p>
              <p className="truncate text-[11px] text-[var(--text-muted)]">
                {contextMeta.contextTitle}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setMessages([]);
                    setErrorMsg(null);
                  }}
                  aria-label="Clear conversation"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close InnovaBot chat"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Language Bar */}
          <div className="flex flex-wrap gap-1 border-b border-[var(--border-hairline)] px-3 py-2">
            {(Object.keys(LANGUAGE_LABELS) as LanguageKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setLang(key)}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                  lang === key
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {LANGUAGE_LABELS[key]}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex max-h-72 min-h-[190px] flex-col gap-2.5 overflow-y-auto p-3.5"
          >
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                  Ask me about any CAPS topic, MicroPython code, physics formula, or Innovexa’s
                  mobile STEM model in{' '}
                  <strong className="text-[var(--text-primary)]">{LANGUAGE_LABELS[lang]}</strong>.
                </p>
                <div className="flex flex-col gap-1.5">
                  {contextMeta.suggestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void sendMessage(q)}
                      className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-3 py-2 text-left text-xs text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={`${msg.role}-${idx}`}
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    msg.role === 'learner'
                      ? 'self-end bg-[var(--accent-primary)] text-white'
                      : 'self-start border border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              ))
            )}

            {loading && (
              <div className="flex items-center gap-2 self-start rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-3 py-2 text-xs text-[var(--text-muted)]">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent-primary)]" />
                <span>Thinking in {LANGUAGE_LABELS[lang]}...</span>
              </div>
            )}

            {errorMsg && (
              <p
                role="alert"
                className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-600 dark:text-rose-300"
              >
                {errorMsg}
              </p>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-[var(--border-hairline)] p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder={`Message InnovaBot (${LANGUAGE_LABELS[lang]})...`}
              aria-label="Message InnovaBot chatbot"
              className="h-10 flex-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send chat message"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Minimize InnovaBot chat' : 'Open InnovaBot AI chatbot'}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--accent-primary)] px-4 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-[var(--accent-hover)] whitespace-nowrap shrink-0 cursor-pointer"
      >
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        <span>{open ? 'Close Chat' : 'Ask InnovaBot'}</span>
      </button>
    </div>
  );
}
