import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatIcon, CloseIcon, SendIcon } from './Icons';
import { profile } from '../data/profile';

type Message = { role: 'user' | 'assistant'; content: string };

const firstName = profile.name.split(' ')[0];

const suggestions = [
  `What is ${firstName} working on now?`,
  `What LLM experience does ${firstName} have?`,
  `Where did ${firstName} study?`,
];

const ERROR_MESSAGE = `Sorry, something went wrong. Please try again, or email ${profile.email}.`;

// Mirrors config.rateLimit in netlify/functions/chat.ts
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60_000;

const formatWait = (seconds: number) => (seconds < 90 ? `${seconds}s` : `${Math.ceil(seconds / 60)} min`);

// "visitor": this visitor's per-minute limit. "busy": Gemini's free quota for the whole site.
type Block = { until: number; reason: 'visitor' | 'busy' };

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentAt, setSentAt] = useState<number[]>([]);
  const [block, setBlock] = useState<Block | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Ticks while the panel is open so the countdown and "questions left" stay current
  useEffect(() => {
    if (!isOpen) return;
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, isLoading, error]);

  // The server limit is per IP, so this local count is an estimate; a 429 from the server always wins.
  const recentSends = sentAt.filter(time => now - time < RATE_WINDOW_MS);
  const questionsLeft = Math.max(0, RATE_LIMIT - recentSends.length);
  const localUntil = questionsLeft === 0 ? recentSends[0] + RATE_WINDOW_MS : 0;
  const serverUntil = block && block.until > now ? block.until : 0;
  const secondsLeft = Math.ceil((Math.max(localUntil, serverUntil) - now) / 1000);
  const isLimited = secondsLeft > 0;
  const limitReason = serverUntil > localUntil && block ? block.reason : 'visitor';

  let limitNotice = '';
  if (isLimited) {
    limitNotice = limitReason === 'busy'
      ? 'The assistant has reached its free usage limit for now.'
      : `You've reached the limit of ${RATE_LIMIT} questions a minute.`;
  } else if (recentSends.length > 0 && questionsLeft <= 2) {
    limitNotice = `${questionsLeft} ${questionsLeft === 1 ? 'question' : 'questions'} left this minute.`;
  }

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || isLoading || isLimited) return;

    const sentTime = Date.now();
    setSentAt(times => [...times.filter(time => sentTime - time < RATE_WINDOW_MS), sentTime]);
    const history: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(history);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 429) {
        // Netlify's own limit answers with an empty body; the function's Gemini-quota answer says how long to wait
        const isBusy = typeof data?.retryAfter === 'number';
        const retryAfter = Number(res.headers.get('Retry-After')) || (isBusy ? data.retryAfter : RATE_WINDOW_MS / 1000);
        setBlock({ until: Date.now() + retryAfter * 1000, reason: isBusy ? 'busy' : 'visitor' });
        setNow(Date.now());
        // Put the question back so it can be sent again once the wait is over
        setMessages(messages);
        setInput(question);
      } else if (res.ok && data?.reply) {
        setMessages([...history, { role: 'assistant', content: data.reply }]);
      } else {
        setError(data?.error ?? ERROR_MESSAGE);
      }
    } catch {
      setError(ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-label={`Ask about ${firstName}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex h-[32rem] max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:w-96 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Ask about {firstName}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI answers based on this site</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                aria-label="Close chat"
              >
                <CloseIcon />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm" aria-live="polite">
              {messages.length === 0 && (
                <div>
                  <p className="mb-3 text-slate-600 dark:text-slate-300">
                    Hi! Ask me anything about {firstName}'s experience, skills, or projects.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => send(suggestion)}
                        disabled={isLoading || isLimited}
                        className="rounded-full bg-sky-400/10 px-3 py-1 text-left text-xs font-medium text-sky-600 transition-colors hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-sky-300"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <p
                    className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              ))}
              {isLoading && <p className="text-slate-500 dark:text-slate-400">Thinking…</p>}
              {error && <p className="text-red-600 dark:text-red-400" role="alert">{error}</p>}
            </div>

            <form
              onSubmit={event => {
                event.preventDefault();
                send(input);
              }}
              className="border-t border-slate-200 p-3 dark:border-slate-700"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  maxLength={500}
                  placeholder="Ask a question…"
                  aria-label="Your question"
                  className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-hidden focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isLoading || isLimited || !input.trim()}
                  className="flex min-w-11 items-center justify-center rounded-md bg-sky-600 px-3 text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={isLimited ? `Send question (available in ${formatWait(secondsLeft)})` : 'Send question'}
                >
                  {isLimited ? <span className="text-xs font-medium tabular-nums">{formatWait(secondsLeft)}</span> : <SendIcon />}
                </button>
              </div>
              <p className={`text-xs font-medium ${isLimited ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'} ${limitNotice ? 'mt-2' : ''}`} role="status">
                {limitNotice}
                {isLimited && (
                  <span aria-hidden="true">
                    {' '}You can ask again in {formatWait(secondsLeft)}{limitReason === 'busy' ? `, or email ${profile.email}` : ''}.
                  </span>
                )}
              </p>
              <p className="mt-2 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
                Answers are generated by Google Gemini from this site's content and may be inaccurate. Your questions are sent to Google.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(open => !open)}
        className="flex items-center gap-2 rounded-full bg-sky-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
        aria-expanded={isOpen}
        aria-controls="chat-panel"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
        <span>{isOpen ? 'Close' : `Ask about ${firstName}`}</span>
      </button>
    </div>
  );
};

export default ChatWidget;
