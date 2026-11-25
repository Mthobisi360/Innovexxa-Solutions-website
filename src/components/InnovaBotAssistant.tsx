import { Bot, Loader2, Send, Sparkles } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { LANGUAGE_LABELS, LanguageKey } from '../data/labData';

interface InnovaBotAssistantProps {
  contextTitle: string;
  grade: string;
  subject: string;
  codeSnippet?: string;
  defaultLanguage?: LanguageKey;
  onLanguageChange?: (lang: LanguageKey) => void;
  quickPrompts?: string[];
  compact?: boolean;
}

interface ChatTurn {
  role: 'learner' | 'innovabot';
  languageLabel: string;
  text: string;
}

export function InnovaBotAssistant({
  contextTitle,
  grade,
  subject,
  codeSnippet,
  defaultLanguage = 'isizulu',
  onLanguageChange,
  quickPrompts,
  compact = false,
}: InnovaBotAssistantProps) {
  const [selectedLang, setSelectedLang] = useState<LanguageKey>(defaultLanguage);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);

  const activeLang = onLanguageChange ? defaultLanguage : selectedLang;

  const handleLanguagePick = (lang: LanguageKey) => {
    setSelectedLang(lang);
    onLanguageChange?.(lang);
  };

  const askInnovaBot = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    setErrorMsg(null);
    setLoading(true);
    const langLabel = LANGUAGE_LABELS[activeLang];
    setTurns((prev) => [...prev, { role: 'learner', languageLabel: langLabel, text: trimmed }]);
    setInput('');

    try {
      const response = await fetch('/api/innovabot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          language: activeLang,
          contextTitle,
          grade,
          subject,
          codeSnippet,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          'Live AI tutoring requires the Innovexa Node server (available in the hosted app preview, not static GitHub Pages).'
        );
      }

      const data = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !data.answer) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      setTurns((prev) => [
        ...prev,
        { role: 'innovabot', languageLabel: langLabel, text: data.answer! },
      ]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Could not reach the InnovaBot server. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void askInnovaBot(input);
  };

  const starterPrompts = quickPrompts ?? [
    `Explain ${contextTitle} simply in ${LANGUAGE_LABELS[activeLang]}`,
    'Give me a CAPS exam tip and common mistake to avoid',
    'Ask me one practice question to test my understanding',
  ];

  return (
    <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent-primary)]">
            <Bot className="h-3.5 w-3.5" aria-hidden="true" />
            <span>InnovaBot AI Multilingual Tutor</span>
          </p>
          <h3 className="font-display mt-1 text-base font-bold text-[var(--text-primary)]">
            Ask Questions in Your Home Language
          </h3>
        </div>
      </div>

      {/* Language Selector */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(Object.keys(LANGUAGE_LABELS) as LanguageKey[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => handleLanguagePick(lang)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
              activeLang === lang
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {LANGUAGE_LABELS[lang]}
          </button>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {starterPrompts.map((qp) => (
          <button
            key={qp}
            type="button"
            disabled={loading}
            onClick={() => void askInnovaBot(qp)}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-2.5 py-1.5 text-left text-[11px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="h-3 w-3 shrink-0 text-[var(--accent-primary)]" aria-hidden="true" />
            <span>{qp}</span>
          </button>
        ))}
      </div>

      {/* Conversation History */}
      {turns.length > 0 && (
        <div
          className={`mt-4 space-y-2.5 overflow-y-auto rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-3 ${
            compact ? 'max-h-56' : 'max-h-72'
          }`}
        >
          {turns.map((turn, idx) => (
            <div
              key={`${turn.role}-${idx}`}
              className={`rounded-lg p-3 text-xs leading-relaxed ${
                turn.role === 'learner'
                  ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                  : 'border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
              }`}
            >
              <p className="mb-1 font-mono text-[11px] font-semibold text-[var(--accent-primary)]">
                {turn.role === 'learner'
                  ? `Learner (${turn.languageLabel})`
                  : `InnovaBot · ${turn.languageLabel} + CAPS English`}
              </p>
              <p className="whitespace-pre-line">{turn.text}</p>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 p-2 text-xs text-[var(--text-muted)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent-primary)]" />
              <span>InnovaBot is preparing your explanation in {LANGUAGE_LABELS[activeLang]}...</span>
            </div>
          )}
        </div>
      )}

      {turns.length === 0 && loading && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-3 text-xs text-[var(--text-muted)]">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent-primary)]" />
          <span>InnovaBot is preparing your explanation in {LANGUAGE_LABELS[activeLang]}...</span>
        </div>
      )}

      {errorMsg && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-300"
        >
          {errorMsg}
        </p>
      )}

      {/* Ask Form */}
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder={`Ask about ${contextTitle} in ${LANGUAGE_LABELS[activeLang]} or English...`}
          aria-label="Ask InnovaBot a question"
          className="h-10 flex-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send question to InnovaBot"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)] text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50 cursor-pointer"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
