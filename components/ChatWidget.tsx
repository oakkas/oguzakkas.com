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

const BUSY_MESSAGE = `The assistant is busy right now. Please try again in a minute, or email ${profile.email}.`;
const ERROR_MESSAGE = `Sorry, something went wrong. Please try again, or email ${profile.email}.`;

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, isLoading, error]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || isLoading) return;

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
      if (res.ok && data?.reply) {
        setMessages([...history, { role: 'assistant', content: data.reply }]);
      } else {
        setError(data?.error ?? (res.status === 429 ? BUSY_MESSAGE : ERROR_MESSAGE));
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
                        className="rounded-full bg-sky-400/10 px-3 py-1 text-left text-xs font-medium text-sky-600 transition-colors hover:bg-sky-400/20 dark:text-sky-300"
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
                  disabled={isLoading || !input.trim()}
                  className="rounded-md bg-sky-600 px-3 text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send question"
                >
                  <SendIcon />
                </button>
              </div>
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
