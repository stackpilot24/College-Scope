'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, X, Send, RotateCcw, ChevronDown, Copy, Check, BookOpen, GraduationCap, DollarSign, Trophy } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SuggestedQuestion {
  text: string;
  icon: React.ReactNode;
}

const DEFAULT_SUGGESTIONS: SuggestedQuestion[] = [
  { text: 'Best engineering colleges for JEE rank 5000?', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { text: 'How to prepare for JEE Advanced in 3 months?', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { text: 'Which scholarships can I apply for in Class 12?', icon: <DollarSign className="w-3.5 h-3.5" /> },
  { text: 'Compare IIT Bombay CS vs IIT Delhi CS placements', icon: <Trophy className="w-3.5 h-3.5" /> },
];

const PAGE_SUGGESTIONS: Record<string, SuggestedQuestion[]> = {
  '/exams': [
    { text: 'Which engineering exam has the highest acceptance rate?', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { text: 'JEE Main vs BITSAT — which is better for me?', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { text: 'NEET 2025 expected cutoff for AIIMS Delhi?', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { text: 'What is the GATE exam pattern and syllabus?', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ],
  '/scholarships': [
    { text: 'Which scholarships are for OBC students?', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { text: 'How to apply for NSP scholarship?', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { text: 'Documents needed for post-matric SC scholarship?', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { text: 'Best private scholarships for girls in engineering?', icon: <DollarSign className="w-3.5 h-3.5" /> },
  ],
  '/colleges': [
    { text: 'Which college has the best placements in India?', icon: <Trophy className="w-3.5 h-3.5" /> },
    { text: 'Top 10 NITs for computer science?', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { text: 'Private vs government college — pros and cons?', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { text: 'Best MBA colleges other than IIMs?', icon: <Trophy className="w-3.5 h-3.5" /> },
  ],
  '/compare': [
    { text: 'What factors matter most when comparing colleges?', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { text: 'How important are placement stats?', icon: <Trophy className="w-3.5 h-3.5" /> },
  ],
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 bg-brand-secondary/60 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 ml-1 shrink-0">
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';

  const renderContent = (text: string) => {
    if (!text) return <TypingDots />;
    const lines = text.split('\n');
    return (
      <div className="space-y-0.5">
        {lines.map((line, i) => {
          if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={i} className="flex gap-1.5">
                <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                <span>{line.slice(2)}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) return <div key={i}>{line}</div>;
          if (!line.trim()) return <div key={i} className="h-1.5" />;
          const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
          return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} />;
        })}
      </div>
    );
  };

  return (
    <div className={cn('flex items-start gap-2 group', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shrink-0 mt-1">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-brand-secondary text-white rounded-tr-sm'
            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
        )}
      >
        {renderContent(msg.content)}
        {!isUser && msg.content && <CopyButton text={msg.content} />}
      </div>
    </div>
  );
}

export function YaraChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const pageKey = Object.keys(PAGE_SUGGESTIONS).find((k) => pathname.startsWith(k));
  const suggestions = pageKey ? PAGE_SUGGESTIONS[pageKey] : DEFAULT_SUGGESTIONS;

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [messages, open, minimized]);

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 96)}px`;
    }
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: Message = { role: 'user', content: text.trim() };
      const history = [...messages, userMsg];
      setMessages([...history, { role: 'assistant', content: '' }]);
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      setLoading(true);
      setMinimized(false);

      try {
        const res = await fetch('/api/yara', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, context: pathname }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error ?? 'Request failed');
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: accumulated },
          ]);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong.';
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: `Sorry, I ran into an issue: ${msg} Please try again.` },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, pathname]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const firstName = (session?.user?.name ?? '').split(' ')[0];

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 group w-14 h-14 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary shadow-lg shadow-brand-secondary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          aria-label="Open YARA assistant"
        >
          <Sparkles className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          <span className="absolute right-full mr-3 whitespace-nowrap bg-gray-900/90 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium hidden sm:block">
            Ask YARA ✨
          </span>
        </button>
      )}

      {/* Chat window — bottom sheet on mobile, floating on desktop */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 sm:hidden"
            onClick={() => setOpen(false)}
          />

          <div
            className={cn(
              // Base
              'fixed z-50 flex flex-col overflow-hidden border border-gray-100 bg-white shadow-2xl transition-all duration-200',
              // Mobile: full-width bottom sheet
              'bottom-0 left-0 right-0 rounded-t-2xl sm:bottom-5 sm:right-5 sm:left-auto sm:rounded-2xl sm:w-[390px]',
              // Height
              minimized
                ? 'h-auto'
                : 'h-[80svh] sm:h-[560px]'
            )}
          >
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setMinimized((m) => !m)}
                className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm tracking-wide">YARA</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                    <span className="text-white/75 text-xs truncate">Your Academic Research Assistant</span>
                  </div>
                </div>
                <ChevronDown
                  className={cn('w-4 h-4 text-white/60 ml-auto transition-transform hidden sm:block', minimized && 'rotate-180')}
                />
              </button>
              <div className="flex items-center gap-1 ml-3">
                {messages.length > 0 && !minimized && (
                  <button
                    onClick={() => setMessages([])}
                    title="Clear chat"
                    className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-gray-50/80 p-3 space-y-3 scroll-smooth overscroll-contain">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-2 py-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center mb-3 shadow-lg shadow-brand-secondary/30">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-gray-900 font-bold text-base">
                        Hi{firstName ? `, ${firstName}` : ''}! I&apos;m YARA 👋
                      </p>
                      <p className="text-gray-500 text-xs mt-1 mb-4 leading-relaxed max-w-[260px]">
                        Ask me anything — colleges, exams, scholarships, or career guidance.
                      </p>
                      <div className="w-full space-y-2">
                        {suggestions.map((s) => (
                          <button
                            key={s.text}
                            onClick={() => {
                              if (!session?.user) { router.push('/auth/signin'); return; }
                              sendMessage(s.text);
                            }}
                            className="w-full text-xs text-left px-3 py-2.5 rounded-xl border border-brand-secondary/20 bg-white text-brand-secondary hover:bg-brand-light hover:border-brand-secondary/40 transition-all flex items-center gap-2 active:scale-[0.98]"
                          >
                            <span className="opacity-60 shrink-0">{s.icon}</span>
                            <span className="line-clamp-1">{s.text}</span>
                          </button>
                        ))}
                      </div>

                      {!session?.user && (
                        <div className="mt-4 w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left">
                          <span className="font-semibold">Sign in</span> to start chatting with YARA.{' '}
                          <button onClick={() => router.push('/auth/signin')} className="underline font-semibold">
                            Sign in →
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, i) => (
                        <MessageBubble key={i} msg={msg} />
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input */}
                <div className="shrink-0 bg-white border-t border-gray-100 px-3 py-2.5 flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => { setInput(e.target.value); autoResize(); }}
                    onKeyDown={handleKeyDown}
                    placeholder={session?.user ? 'Ask anything… (Enter to send)' : 'Sign in to chat with YARA'}
                    rows={1}
                    disabled={loading || !session?.user}
                    className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary transition-colors disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed overflow-hidden"
                    style={{ minHeight: '38px' }}
                  />
                  {session?.user ? (
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || loading}
                      className="w-9 h-9 shrink-0 rounded-xl bg-brand-secondary text-white flex items-center justify-center disabled:opacity-40 hover:bg-brand-primary transition-colors active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push('/auth/signin')}
                      className="shrink-0 text-xs px-3 h-9 rounded-xl bg-brand-secondary text-white hover:bg-brand-primary transition-colors font-medium whitespace-nowrap"
                    >
                      Sign in
                    </button>
                  )}
                </div>

                <div className="shrink-0 bg-white px-3 pb-2.5 text-center">
                  <p className="text-[10px] text-gray-400">
                    YARA can make mistakes — verify important info at official sources.
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
