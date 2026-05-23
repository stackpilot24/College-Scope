'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessageCircle, User, Trash2, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QUser { id: string; name: string | null; image: string | null }
interface Answer { id: string; body: string; createdAt: string; user: QUser }
interface Question { id: string; title: string; body: string; createdAt: string; user: QUser; answers: Answer[] }

interface QATabProps {
  collegeId: string;
  initialQuestions: Question[];
}

function Avatar({ user, size = 8 }: { user: QUser; size?: number }) {
  return user.image ? (
    <Image src={user.image} alt={user.name ?? ''} width={size * 4} height={size * 4} className="rounded-full shrink-0" />
  ) : (
    <div className={`w-${size} h-${size} rounded-full bg-brand-light flex items-center justify-center shrink-0`}>
      <User className="w-4 h-4 text-brand-secondary" />
    </div>
  );
}

function AnswerBlock({ answer, currentUserId, questionId, onDelete }: {
  answer: Answer; currentUserId?: string; questionId: string;
  onDelete: (questionId: string, answerId: string) => void;
}) {
  return (
    <div className="flex gap-3 pl-4 border-l-2 border-brand-light">
      <Avatar user={answer.user} size={7} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-gray-800">{answer.user.name ?? 'Anonymous'}</span>
          <span className="text-xs text-gray-400">{new Date(answer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{answer.body}</p>
        {currentUserId === answer.user.id && (
          <button onClick={() => onDelete(questionId, answer.id)} className="mt-1 text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

function QuestionCard({ question, currentUserId, onDeleteQuestion, onDeleteAnswer, onAnswer }: {
  question: Question; currentUserId?: string;
  onDeleteQuestion: (id: string) => void;
  onDeleteAnswer: (questionId: string, answerId: string) => void;
  onAnswer: (questionId: string, body: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleAnswer = async () => {
    if (!answerText.trim()) return;
    setSubmitting(true);
    await onAnswer(question.id, answerText);
    setAnswerText('');
    setShowAnswerBox(false);
    setExpanded(true);
    setSubmitting(false);
  };

  return (
    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Avatar user={question.user} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{question.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {question.user.name ?? 'Anonymous'} · {new Date(question.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            {currentUserId === question.user.id && (
              <button onClick={() => onDeleteQuestion(question.id)} className="text-gray-300 hover:text-red-500 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{question.body}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 text-gray-500 hover:text-brand-secondary transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {question.answers.length} {question.answers.length === 1 ? 'answer' : 'answers'}
          {question.answers.length > 0 && (expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
        </button>
        {session?.user && (
          <button
            onClick={() => setShowAnswerBox((s) => !s)}
            className="text-brand-secondary hover:underline"
          >
            {showAnswerBox ? 'Cancel' : 'Answer'}
          </button>
        )}
      </div>

      {expanded && question.answers.length > 0 && (
        <div className="space-y-3 pt-1">
          {question.answers.map((a) => (
            <AnswerBlock key={a.id} answer={a} currentUserId={currentUserId} questionId={question.id} onDelete={onDeleteAnswer} />
          ))}
        </div>
      )}

      {showAnswerBox && (
        <div className="flex gap-2 pt-1">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={2}
            placeholder="Write your answer…"
            className="input-base resize-none flex-1 text-sm"
          />
          <button
            onClick={handleAnswer}
            disabled={submitting || !answerText.trim()}
            className="self-end btn-primary text-sm px-3 py-2 disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function QATab({ collegeId, initialQuestions }: QATabProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const currentUserId = (session?.user as { id?: string })?.id;
  const [questions, setQuestions] = useState(initialQuestions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeId, ...form }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (res.ok) {
      setQuestions((prev) => [data, ...prev]);
      setForm({ title: '', body: '' });
      setShowForm(false);
    } else {
      setError(data.error ?? 'Failed to submit.');
    }
  };

  const handleAnswer = async (questionId: string, body: string) => {
    const res = await fetch(`/api/questions/${questionId}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    if (res.ok) {
      const answer = await res.json();
      setQuestions((prev) =>
        prev.map((q) => q.id === questionId ? { ...q, answers: [...q.answers, answer] } : q)
      );
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Delete this question and all its answers?')) return;
    const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
    if (res.ok) setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleDeleteAnswer = async (questionId: string, answerId: string) => {
    if (!confirm('Delete this answer?')) return;
    const res = await fetch(`/api/questions/${questionId}/answers`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answerId }),
    });
    if (res.ok) {
      setQuestions((prev) =>
        prev.map((q) => q.id === questionId ? { ...q, answers: q.answers.filter((a) => a.id !== answerId) } : q)
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Student Q&amp;A</h2>
        {session?.user ? (
          <button onClick={() => setShowForm((s) => !s)} className="btn-outline text-sm">
            {showForm ? 'Cancel' : '+ Ask a Question'}
          </button>
        ) : (
          <button onClick={() => router.push('/auth/signin')} className="btn-outline text-sm">
            Sign in to Ask
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleAskQuestion} className="card p-4 space-y-3 border-brand-secondary/20 border">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Question *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. What is the hostel fee at this college?"
              className="input-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={3}
              placeholder="Add context to help others give a better answer…"
              className="input-base resize-none"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-60">
            {submitting ? 'Posting…' : 'Post Question'}
          </button>
        </form>
      )}

      {questions.length === 0 ? (
        <div className="py-12 text-center text-gray-500 text-sm">
          No questions yet. Be the first to ask!
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              currentUserId={currentUserId}
              onDeleteQuestion={handleDeleteQuestion}
              onDeleteAnswer={handleDeleteAnswer}
              onAnswer={handleAnswer}
            />
          ))}
        </div>
      )}
    </div>
  );
}
