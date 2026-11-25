import 'dotenv/config';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const LANGUAGE_NAMES: Record<string, string> = {
  english: 'English',
  siswati: 'siSwati',
  isizulu: 'isiZulu',
  sepedi: 'Sepedi (Northern Sotho)',
  xitsonga: 'Xitsonga',
};

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('MISSING_API_KEY');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/innovabot/ask', async (req: Request, res: Response) => {
    try {
      const body = req.body as {
        prompt?: unknown;
        language?: unknown;
        contextTitle?: unknown;
        grade?: unknown;
        subject?: unknown;
        codeSnippet?: unknown;
        history?: unknown;
      };

      const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
      if (!prompt) {
        res.status(400).json({ error: 'Please enter a question for InnovaBot.' });
        return;
      }
      if (prompt.length > 1500) {
        res.status(400).json({ error: 'Question must be 1,500 characters or fewer.' });
        return;
      }

      const langKey = typeof body.language === 'string' ? body.language.toLowerCase() : 'english';
      const targetLanguage = LANGUAGE_NAMES[langKey] ?? 'English';
      const contextTitle =
        typeof body.contextTitle === 'string' ? body.contextTitle.slice(0, 200) : 'CAPS STEM Lab';
      const grade = typeof body.grade === 'string' ? body.grade.slice(0, 40) : 'Grades R–12';
      const subject =
        typeof body.subject === 'string'
          ? body.subject.slice(0, 80)
          : 'Coding, Robotics & Physical Sciences';
      const codeSnippet =
        typeof body.codeSnippet === 'string' ? body.codeSnippet.slice(0, 3000) : '';

      const recentHistory = Array.isArray(body.history)
        ? body.history
            .slice(-6)
            .filter(
              (item): item is { role: string; text: string } =>
                typeof item === 'object' &&
                item !== null &&
                typeof (item as { role?: unknown }).role === 'string' &&
                typeof (item as { text?: unknown }).text === 'string'
            )
            .map((item) => `${item.role === 'learner' ? 'Learner' : 'InnovaBot'}: ${item.text.slice(0, 500)}`)
            .join('\n')
        : '';

      const ai = getGeminiClient();

      const systemInstruction = [
        'You are InnovaBot, the AI assistant and South African DBE CAPS STEM tutor for Innovexa Solutions (Grades R–6 Coding & Robotics, Grades 10–12 Physical Sciences, mobile ESP32 pods, and the hybrid B-BBEE SED cross-subsidy model).',
        `Respond primarily in ${targetLanguage} using clear, natural code-switching: explain concepts in ${targetLanguage}, while preserving exact English CAPS scientific terms, formulas, and MicroPython keywords in parentheses or inline so the learner succeeds in English exams and coding consoles.`,
        'Keep your answer concise, helpful, and classroom-ready (around 80 to 150 words without heavy markdown clutter).',
      ].join(' ');

      const userContents = [
        `Active Page / Module: ${contextTitle}`,
        `Grade & Subject: ${grade} · ${subject}`,
        codeSnippet ? `Context:\n${codeSnippet}` : '',
        recentHistory ? `Recent Conversation:\n${recentHistory}` : '',
        `Learner Question: ${prompt}`,
      ]
        .filter(Boolean)
        .join('\n\n');

      let response;
      let lastError: unknown;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: userContents,
            config: {
              systemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          });
          break;
        } catch (err: unknown) {
          lastError = err;
          const msg = err instanceof Error ? err.message : '';
          const isTransient = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429');
          if (!isTransient || attempt === 2) {
            throw err;
          }
          await new Promise((resolve) => setTimeout(resolve, 600 * Math.pow(2, attempt)));
        }
      }

      if (!response) {
        throw lastError ?? new Error('No response from Gemini API.');
      }

      const answer = response.text?.trim();
      if (!answer) {
        res.status(502).json({
          error: 'InnovaBot received an empty response. Please try rephrasing your question.',
        });
        return;
      }

      res.json({
        answer,
        language: targetLanguage,
        model: 'gemini-4-hydrogen',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected server error.';
      if (message === 'MISSING_API_KEY') {
        res.status(503).json({
          error:
            'Gemini API key is not configured. Please add GEMINI_API_KEY in the Settings > Secrets panel.',
        });
        return;
      }
      if (message.includes('PERMISSION_DENIED') || message.includes('403')) {
        res.status(403).json({
          error: 'Gemini API access denied. Please verify your GEMINI_API_KEY in Settings > Secrets.',
        });
        return;
      }
      if (message.includes('RESOURCE_EXHAUSTED') || message.includes('429')) {
        res.status(429).json({
          error: 'AI tutor rate limit reached. Please wait a moment and try again.',
        });
        return;
      }
      res.status(500).json({
        error: `InnovaBot could not complete this request: ${message}`,
      });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Innovexa Solutions server running on http://localhost:${PORT}`);
  });
}

startServer();
