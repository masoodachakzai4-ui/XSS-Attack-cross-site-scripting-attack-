import React, { useState, useEffect } from 'react';
import { EXAM_QUESTIONS } from '../data/academyData';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Check,
  Clock,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List
} from 'lucide-react';

export const STORAGE_KEY_EXAM = 'xss_academy_exam_state_v1';

interface QuizSectionProps {
  onScoreUpdate?: (scorePct: number, completed: boolean) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onScoreUpdate }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXAM);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.answers === 'object') return parsed.answers;
      }
    } catch {
      // ignore
    }
    return {};
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXAM);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed?.submitted);
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const totalQuestions = EXAM_QUESTIONS.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const correctCount = EXAM_QUESTIONS.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_EXAM,
        JSON.stringify({
          answers: selectedAnswers,
          submitted: isSubmitted,
          scorePercentage: isSubmitted ? scorePercentage : 0
        })
      );
    } catch {
      // ignore
    }
    if (onScoreUpdate) {
      onScoreUpdate(isSubmitted ? scorePercentage : 0, isSubmitted);
    }
  }, [selectedAnswers, isSubmitted, scorePercentage, onScoreUpdate]);

  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const categories = ['All', ...Array.from(new Set(EXAM_QUESTIONS.map((q) => q.category)))];

  const getGradeEvaluation = (pct: number) => {
    if (pct >= 90) {
      return {
        grade: 'Distinction (A+)',
        message:
          'Outstanding command of Cross-Site Scripting fundamentals, browser security, DOM sinks, and defense-in-depth!'
      };
    }
    if (pct >= 75) {
      return {
        grade: 'Merit (B+)',
        message: 'Strong proficiency in XSS attack vectors, detection techniques, and secure coding.'
      };
    }
    if (pct >= 60) {
      return {
        grade: 'Pass (C)',
        message: 'Solid foundation! Review the explanations below for any missed questions.'
      };
    }
    return {
      grade: 'Review Recommended',
      message: 'Review the XSS Theory and Prevention Center modules, then retake the examination.'
    };
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setViewMode('all');
    setCategoryFilter('All');
  };

  const handleRetakeExam = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setElapsedSeconds(0);
    try {
      localStorage.removeItem(STORAGE_KEY_EXAM);
    } catch {
      // ignore
    }
  };

  const evaluation = getGradeEvaluation(scorePercentage);
  const activeQuestion = EXAM_QUESTIONS[currentQuestionIndex];

  const filteredQuestions =
    categoryFilter === 'All'
      ? EXAM_QUESTIONS
      : EXAM_QUESTIONS.filter((q) => q.category === categoryFilter);

  const renderQuestionCard = (q: typeof EXAM_QUESTIONS[0]) => {
    const userChoice = selectedAnswers[q.id];
    const isAnswered = userChoice !== undefined;
    const isCorrect = userChoice === q.correctIndex;
    const optionLetters = ['A', 'B', 'C', 'D'];

    return (
      <div
        key={q.id}
        className={`bg-slate-900 border rounded-xl p-6 space-y-5 ${
          isSubmitted
            ? isCorrect
              ? 'border-emerald-500/40'
              : 'border-rose-500/40'
            : 'border-slate-800'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-cyan-400">
              Category: {q.category} · Difficulty: {q.difficulty}
            </div>
            <h3 className="text-base md:text-lg font-bold text-slate-100">{q.question}</h3>
          </div>

          {isSubmitted && (
            <div className="shrink-0">
              {isCorrect ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Correct
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                  <XCircle className="w-4 h-4" />
                  {isAnswered ? 'Incorrect' : 'Unanswered'}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {q.options.map((opt, idx) => {
            const isSelected = userChoice === idx;
            const isOptionCorrect = idx === q.correctIndex;

            let btnClass = 'border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-700';

            if (!isSubmitted && isSelected) {
              btnClass = 'border-cyan-400 bg-cyan-950/30 text-cyan-200';
            } else if (isSubmitted) {
              if (isOptionCorrect) {
                btnClass = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200';
              } else if (isSelected && !isOptionCorrect) {
                btnClass = 'border-rose-500/60 bg-rose-950/30 text-rose-200';
              } else {
                btnClass = 'border-slate-800/60 bg-slate-950/40 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isSubmitted}
                onClick={() => handleSelectOption(q.id, idx)}
                className={`w-full text-left p-4 rounded-lg border text-xs md:text-sm transition-colors flex items-start gap-3 ${btnClass}`}
              >
                <span className="font-mono font-bold text-cyan-400 shrink-0 mt-0.5">
                  {optionLetters[idx]}.
                </span>
                <span className="leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs md:text-sm text-slate-300 leading-relaxed">
            <strong className="text-cyan-400 font-semibold">Explanation: </strong>
            {q.explanation}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Examination Header & Live Telemetry Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400">
              Cybersecurity Certification Examination · {totalQuestions} Multiple-Choice Questions
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mt-1">
              Interactive Cybersecurity Examination
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Comprehensive evaluation covering XSS fundamentals, Reflected, Stored, and DOM-Based
              XSS, browser security, JavaScript sinks, vulnerability detection, and secure coding.
            </p>
          </div>

          {/* Timer, Progress & Mode Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono tabular-nums text-slate-200">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Timer: {formatTimer(elapsedSeconds)}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono tabular-nums">
              <span className="text-slate-400">Answered: </span>
              <span className="text-cyan-300 font-semibold">
                {answeredCount} / {totalQuestions}
              </span>
            </div>

            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === 'single'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Step-by-Step
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                All Questions
              </button>
            </div>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitExam}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Check className="w-4 h-4" />
                Submit Examination
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRetakeExam}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Examination
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation Grid */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-medium">
            Question Navigator (Click any question box to jump directly):
          </div>
          <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
            {EXAM_QUESTIONS.map((q, idx) => {
              const answered = selectedAnswers[q.id] !== undefined;
              const isCurrent = viewMode === 'single' && currentQuestionIndex === idx;
              const isCorrect = selectedAnswers[q.id] === q.correctIndex;

              let cellStyle = 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700';
              if (isSubmitted) {
                cellStyle = isCorrect
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/50 border-rose-500/50 text-rose-300';
              } else if (isCurrent) {
                cellStyle = 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold';
              } else if (answered) {
                cellStyle = 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setViewMode('single');
                  }}
                  className={`h-8 rounded border text-xs font-mono tabular-nums transition-colors ${cellStyle}`}
                  title={q.question}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Summary Banner when Submitted */}
      {isSubmitted && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
              <Award className="w-4 h-4" />
              <span>OFFICIAL EXAMINATION RESULT</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              Final Score:{' '}
              <span className="text-cyan-400 tabular-nums">
                {correctCount} / {totalQuestions}
              </span>{' '}
              ({scorePercentage}%) — {evaluation.grade}
            </h2>
            <p className="text-sm text-slate-300">{evaluation.message}</p>
          </div>

          <button
            type="button"
            onClick={handleRetakeExam}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Examination
          </button>
        </div>
      )}

      {/* Single-Question Step-by-Step View */}
      {viewMode === 'single' ? (
        <div className="space-y-4">
          {renderQuestionCard(activeQuestion)}

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Question
            </button>

            <span className="text-xs font-mono text-slate-400">
              {activeQuestion.category} · {activeQuestion.difficulty}
            </span>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                }
                className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors"
              >
                Next Question
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitExam}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                Submit Examination
              </button>
            )}
          </div>
        </div>
      ) : (
        /* All Questions List View with Category Filter */
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-slate-800 p-3 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q) => renderQuestionCard(q))}
          </div>
        </div>
      )}
    </div>
  );
};
