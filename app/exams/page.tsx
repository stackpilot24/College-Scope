'use client';

import { useState, useMemo } from 'react';
import { BookOpen, Clock, Users, Trophy, ExternalLink, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { exams, streamColors, difficultyColors } from '@/lib/examData';
import type { ExamStream } from '@/lib/examData';
import { cn } from '@/lib/utils';

const ALL_STREAMS: ExamStream[] = ['Engineering', 'Medical', 'Management', 'Law', 'Design', 'Science', 'Agriculture', 'PG Engineering'];

function ExamCard({ exam }: { exam: typeof exams[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', streamColors[exam.stream])}>
                {exam.stream}
              </span>
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', difficultyColors[exam.difficulty])}>
                {exam.difficulty}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-gray-900">{exam.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{exam.fullName}</p>
          </div>
          <a
            href={exam.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs flex items-center gap-1 text-brand-secondary hover:underline"
          >
            Official Site <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-2">{exam.description}</p>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-xs text-gray-500">Conducting Body</p>
            <p className="text-xs font-medium text-gray-800 mt-0.5 leading-snug">{exam.conductingBody}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-xs text-gray-500">Exam Period</p>
            <p className="text-xs font-medium text-gray-800 mt-0.5">{exam.examPeriod}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-xs text-gray-500">Exam Fee</p>
            <p className="text-xs font-medium text-gray-800 mt-0.5">{exam.examFee}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {exam.duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> {exam.totalQuestions} Qs · {exam.totalMarks} Marks
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {exam.appearingStudents} students
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">More Details</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Eligibility</p>
                <p className="text-sm text-gray-700 leading-relaxed">{exam.eligibility}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mode & Duration</p>
                <p className="text-sm text-gray-700">{exam.mode}</p>
                <p className="text-sm text-gray-700 mt-1">{exam.duration}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Application Period</p>
                <p className="text-sm text-gray-700">{exam.applicationPeriod}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Result Period</p>
                <p className="text-sm text-gray-700">{exam.resultPeriod}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                <Trophy className="w-3.5 h-3.5 inline mr-1" />
                Top Colleges Accepting this Exam
              </p>
              <div className="flex flex-wrap gap-2">
                {exam.topColleges.map((college) => (
                  <span key={college} className="text-xs bg-brand-light text-brand-secondary px-2.5 py-1 rounded-full">
                    {college}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExamsPage() {
  const [search, setSearch] = useState('');
  const [activeStream, setActiveStream] = useState<ExamStream | 'All'>('All');
  const [difficulty, setDifficulty] = useState<string>('All');

  const filtered = useMemo(() => {
    return exams.filter((exam) => {
      const matchStream = activeStream === 'All' || exam.stream === activeStream;
      const matchDiff = difficulty === 'All' || exam.difficulty === difficulty;
      const matchSearch =
        !search ||
        exam.name.toLowerCase().includes(search.toLowerCase()) ||
        exam.fullName.toLowerCase().includes(search.toLowerCase()) ||
        exam.conductingBody.toLowerCase().includes(search.toLowerCase());
      return matchStream && matchDiff && matchSearch;
    });
  }, [search, activeStream, difficulty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Entrance Exam Tracker</h1>
        <p className="mt-2 text-gray-600">
          Everything you need to know about major Indian entrance exams — dates, eligibility, fees, and top colleges.
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exams…"
              className="input-base pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="input-base text-sm"
            >
              <option value="All">All Difficulties</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>
        </div>

        {/* Stream pills */}
        <div className="flex gap-2 flex-wrap">
          {(['All', ...ALL_STREAMS] as const).map((stream) => (
            <button
              key={stream}
              onClick={() => setActiveStream(stream)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                activeStream === stream
                  ? 'bg-brand-secondary text-white border-brand-secondary'
                  : 'border-gray-200 text-gray-600 hover:border-brand-secondary hover:text-brand-secondary'
              )}
            >
              {stream}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500 mb-4">
        Showing <span className="font-semibold text-gray-800">{filtered.length}</span> exam{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          No exams found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
