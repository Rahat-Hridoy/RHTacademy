'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CircleAlert, Trophy } from 'lucide-react';

type ExamMode = 'default' | 'exam' | 'result';
type AnswerKey = 'A' | 'B' | 'C' | 'D';

interface ExamQuestion {
  id: string;
  number: number;
  text: string;
  options: {
    id: AnswerKey;
    text: string;
  }[];
  correct: AnswerKey;
}

interface ExamHistoryItem {
  id: string;
  name: string;
  subject: string;
  date: string;
  score: string;
  percentage: string;
  result: 'Passed' | 'Failed';
}

const examHistory: ExamHistoryItem[] = [
  { id: 'exam-physics', name: 'Physics Ch 1-3 MCQ', subject: 'Physics', date: '15 Jan 2025', score: '16/20', percentage: '80%', result: 'Passed' },
  { id: 'exam-chemistry', name: 'Chemistry Basics', subject: 'Chemistry', date: '8 Jan 2025', score: '11/20', percentage: '55%', result: 'Passed' },
  { id: 'exam-math', name: 'Math Algebra Test', subject: 'Math', date: '2 Jan 2025', score: '7/20', percentage: '35%', result: 'Failed' }
];

const examQuestions: ExamQuestion[] = [
  {
    id: 'q1', number: 1, text: "Which statement best describes Newton's First Law of Motion?", correct: 'A',
    options: [
      { id: 'A', text: 'An object remains at rest or in uniform motion unless acted on by force.' },
      { id: 'B', text: 'Force equals mass multiplied by acceleration.' },
      { id: 'C', text: 'Every action has an equal and opposite reaction.' },
      { id: 'D', text: 'Energy can neither be created nor destroyed.' }
    ]
  },
  {
    id: 'q2', number: 2, text: 'What is the SI unit of force?', correct: 'B',
    options: [{ id: 'A', text: 'Joule' }, { id: 'B', text: 'Newton' }, { id: 'C', text: 'Watt' }, { id: 'D', text: 'Pascal' }]
  },
  {
    id: 'q3', number: 3, text: 'Acceleration is defined as the rate of change of what quantity?', correct: 'C',
    options: [{ id: 'A', text: 'Distance' }, { id: 'B', text: 'Displacement' }, { id: 'C', text: 'Velocity' }, { id: 'D', text: 'Mass' }]
  },
  {
    id: 'q4', number: 4, text: 'Which quantity is scalar?', correct: 'D',
    options: [{ id: 'A', text: 'Velocity' }, { id: 'B', text: 'Force' }, { id: 'C', text: 'Acceleration' }, { id: 'D', text: 'Speed' }]
  },
  {
    id: 'q5', number: 5, text: 'If mass doubles while acceleration is constant, force becomes what?', correct: 'A',
    options: [{ id: 'A', text: 'Double' }, { id: 'B', text: 'Half' }, { id: 'C', text: 'Unchanged' }, { id: 'D', text: 'Zero' }]
  },
  {
    id: 'q6', number: 6, text: 'Momentum is the product of mass and which quantity?', correct: 'B',
    options: [{ id: 'A', text: 'Acceleration' }, { id: 'B', text: 'Velocity' }, { id: 'C', text: 'Force' }, { id: 'D', text: 'Time' }]
  },
  {
    id: 'q7', number: 7, text: 'The slope of a velocity-time graph represents what?', correct: 'C',
    options: [{ id: 'A', text: 'Distance' }, { id: 'B', text: 'Speed' }, { id: 'C', text: 'Acceleration' }, { id: 'D', text: 'Momentum' }]
  },
  {
    id: 'q8', number: 8, text: 'Friction generally acts in which direction?', correct: 'D',
    options: [{ id: 'A', text: 'Along gravity only' }, { id: 'B', text: 'Toward motion' }, { id: 'C', text: 'Perpendicular to motion' }, { id: 'D', text: 'Opposite relative motion' }]
  },
  {
    id: 'q9', number: 9, text: 'Which is a vector quantity?', correct: 'A',
    options: [{ id: 'A', text: 'Displacement' }, { id: 'B', text: 'Time' }, { id: 'C', text: 'Mass' }, { id: 'D', text: 'Temperature' }]
  },
  {
    id: 'q10', number: 10, text: 'What does inertia depend mostly on?', correct: 'B',
    options: [{ id: 'A', text: 'Speed' }, { id: 'B', text: 'Mass' }, { id: 'C', text: 'Shape' }, { id: 'D', text: 'Color' }]
  },
  {
    id: 'q11', number: 11, text: 'A body moving with uniform velocity has what acceleration?', correct: 'C',
    options: [{ id: 'A', text: 'Positive' }, { id: 'B', text: 'Negative' }, { id: 'C', text: 'Zero' }, { id: 'D', text: 'Infinite' }]
  },
  {
    id: 'q12', number: 12, text: 'Which law explains recoil of a gun?', correct: 'D',
    options: [{ id: 'A', text: 'Law of gravitation' }, { id: 'B', text: 'First law' }, { id: 'C', text: 'Second law' }, { id: 'D', text: 'Third law' }]
  },
  {
    id: 'q13', number: 13, text: 'Which instrument measures force?', correct: 'A',
    options: [{ id: 'A', text: 'Spring balance' }, { id: 'B', text: 'Ammeter' }, { id: 'C', text: 'Barometer' }, { id: 'D', text: 'Thermometer' }]
  },
  {
    id: 'q14', number: 14, text: 'Work is done when force causes what?', correct: 'B',
    options: [{ id: 'A', text: 'Heat only' }, { id: 'B', text: 'Displacement' }, { id: 'C', text: 'Mass increase' }, { id: 'D', text: 'No movement' }]
  },
  {
    id: 'q15', number: 15, text: 'Power is the rate of doing what?', correct: 'C',
    options: [{ id: 'A', text: 'Momentum' }, { id: 'B', text: 'Acceleration' }, { id: 'C', text: 'Work' }, { id: 'D', text: 'Mass' }]
  },
  {
    id: 'q16', number: 16, text: 'Which has the unit kg m/s?', correct: 'D',
    options: [{ id: 'A', text: 'Force' }, { id: 'B', text: 'Work' }, { id: 'C', text: 'Power' }, { id: 'D', text: 'Momentum' }]
  },
  {
    id: 'q17', number: 17, text: 'A balanced force produces what net force?', correct: 'A',
    options: [{ id: 'A', text: 'Zero' }, { id: 'B', text: 'One newton' }, { id: 'C', text: 'Ten newtons' }, { id: 'D', text: 'Infinite force' }]
  },
  {
    id: 'q18', number: 18, text: 'Distance travelled per unit time is called what?', correct: 'B',
    options: [{ id: 'A', text: 'Velocity' }, { id: 'B', text: 'Speed' }, { id: 'C', text: 'Acceleration' }, { id: 'D', text: 'Impulse' }]
  },
  {
    id: 'q19', number: 19, text: 'Impulse equals force multiplied by what?', correct: 'C',
    options: [{ id: 'A', text: 'Mass' }, { id: 'B', text: 'Distance' }, { id: 'C', text: 'Time' }, { id: 'D', text: 'Speed' }]
  },
  {
    id: 'q20', number: 20, text: 'Which energy does a moving object have?', correct: 'D',
    options: [{ id: 'A', text: 'Chemical energy' }, { id: 'B', text: 'Thermal energy only' }, { id: 'C', text: 'Potential energy only' }, { id: 'D', text: 'Kinetic energy' }]
  }
];

// No pre-seeded answers — students start fresh
const seededAnswers: Record<string, AnswerKey> = {};

const formatCountdown = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
};

const formatExamTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const ExamPanel = () => {
  const [mode, setMode] = useState<ExamMode>('default');
  const [upcomingSeconds, setUpcomingSeconds] = useState(225130);
  const [examSeconds, setExamSeconds] = useState(754);
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>(seededAnswers);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [submitWarning, setSubmitWarning] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(true);

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = examQuestions.length - answeredCount;
  const progressPercent = Math.round((answeredCount / examQuestions.length) * 100);

  const score = useMemo(() => examQuestions.reduce((total, question) => answers[question.id] === question.correct ? total + 1 : total, 0), [answers]);
  const skipped = examQuestions.length - answeredCount;
  const wrong = answeredCount - score;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setUpcomingSeconds((current) => Math.max(current - 1, 0));
      setExamSeconds((current) => (mode === 'exam' ? Math.max(current - 1, 0) : current));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [mode]);

  const submitExam = () => {
    if (unansweredCount > 0) {
      setSubmitWarning(true);
      return;
    }
    setMode('result');
  };

  return (
    <div className="space-y-7">
      {mode === 'default' && (
        <div className="space-y-7">
          <section className="grid gap-5 xl:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 border-l-4 border-l-blue-800 bg-white p-6 shadow-sm">
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-wide text-blue-800">
                <span>UPCOMING</span>
              </span>
              <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    <span>Physics Chapter 1-3 MCQ Test</span>
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Physics</span>
                    <span>20 Questions</span>
                    <span>15 min time limit</span>
                  </div>
                </div>
                <div className="text-left xl:text-right">
                  <p className="text-sm font-semibold text-slate-500">
                    <span>Starts in</span>
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-red-600">
                    <span>{formatCountdown(upcomingSeconds)}</span>
                  </p>
                  <button type="button" disabled className="mt-4 rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-500">
                    <span>Join Exam</span>
                  </button>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 border-l-4 border-l-green-500 bg-white p-6 shadow-sm ring-1 ring-green-100">
              <span className="inline-flex animate-pulse rounded-full bg-green-100 px-3 py-1 text-xs font-bold tracking-wide text-green-700">
                <span>LIVE NOW</span>
              </span>
              <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    <span>Physics Chapter 1-3 MCQ Test</span>
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">Physics</span>
                    <span>20 Questions</span>
                    <span>15 min time limit</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMode('exam')}
                  className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-700"
                >
                  <span>Start Exam</span>
                </button>
              </div>
            </article>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-950">
              <span>Exam History</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3"><span>Exam Name</span></th>
                    <th><span>Subject</span></th>
                    <th><span>Date</span></th>
                    <th><span>Score</span></th>
                    <th><span>%</span></th>
                    <th><span>Result</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 font-semibold text-slate-900">
                        <span>{item.name}</span>
                      </td>
                      <td><span>{item.subject}</span></td>
                      <td><span>{item.date}</span></td>
                      <td><span>{item.score}</span></td>
                      <td><span>{item.percentage}</span></td>
                      <td>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.result === 'Passed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          <span>{item.result}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm font-medium text-slate-500">
              <span>Page 1 of 2</span>
              <div className="flex gap-2">
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-slate-400"><span>Prev</span></button>
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-blue-800"><span>Next</span></button>
              </div>
            </div>
          </section>
        </div>
      )}

      {mode === 'exam' && (
        <div className="space-y-6 pb-24">
          <header className="sticky top-[76px] z-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-slate-950">
                <span>Physics Chapter 1-3 MCQ Test</span>
              </h2>
              <p className="text-sm font-bold text-slate-500">
                <span>Question {currentQuestion} of 20</span>
              </p>
              <p className="rounded-xl bg-red-50 px-4 py-2 text-2xl font-semibold text-red-600">
                <span>{formatExamTimer(examSeconds)}</span>
              </p>
            </div>
            <div className="h-1.5 bg-slate-100">
              <div className="h-full bg-teal-600 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </header>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            <div className="space-y-8">
              {examQuestions.map((question) => {
                const selectedAnswer = answers[question.id];
                return (
                  <article
                    key={question.id}
                    onMouseEnter={() => setCurrentQuestion(question.number)}
                    className={`border-b border-slate-100 pb-8 last:border-b-0 last:pb-0 ${selectedAnswer ? '' : 'border-l-4 border-l-yellow-300 pl-4'}`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="rounded-full bg-blue-800 px-3 py-1 text-sm font-bold text-white">
                        <span>Q{question.number}</span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-medium leading-7 text-gray-900">
                          <span>{question.text}</span>
                        </h3>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {question.options.map((option) => {
                            const isSelected = selectedAnswer === option.id;
                            return (
                              <label
                                key={`${question.id}-${option.id}`}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                                  isSelected ? 'border-blue-700 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={question.id}
                                  checked={isSelected}
                                  onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                                  className="sr-only"
                                />
                                <span
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                    isSelected ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  <span>{option.id}</span>
                                </span>
                                <span className="text-sm font-medium leading-5 text-slate-700">{option.text}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 px-5 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur md:left-[220px]">
            <div className="mx-auto flex max-w-[1450px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-medium text-gray-500">
                <span>{answeredCount} of 20 answered</span>
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {examQuestions.map((question) => (
                  <button
                    key={`jump-${question.id}`}
                    type="button"
                    onClick={() => setCurrentQuestion(question.number)}
                    className={`h-3 w-3 rounded-full border ${
                      currentQuestion === question.number
                        ? 'border-blue-800 bg-white'
                        : answers[question.id]
                        ? 'border-blue-800 bg-blue-800'
                        : 'border-slate-300 bg-slate-300'
                    }`}
                    aria-label={`Jump to question ${question.number}`}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {submitWarning && (
                  <div className="flex flex-wrap items-center gap-2 rounded-xl bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-800">
                    <CircleAlert size={16} />
                    <span>You have {unansweredCount} unanswered questions. Submit anyway?</span>
                    <button
                      type="button"
                      onClick={() => setMode('result')}
                      className="rounded-lg bg-yellow-500 px-3 py-1 text-xs font-bold text-white"
                    >
                      <span>Confirm</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmitWarning(false)}
                      className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-yellow-800"
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={submitExam}
                  className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-700"
                >
                  <span>Submit Exam</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'result' && (
        <div className="space-y-7">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Trophy className="mx-auto text-amber-500" size={58} aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">
              <span>Physics Chapter 1-3 MCQ Test</span>
            </h2>
            <p className="mt-4 text-6xl font-bold tracking-tight text-blue-800">
              <span>16 / 20</span>
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
                <span>80%</span>
              </span>
              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
                <span>Passed</span>
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-500">
              <span>Completed in 11m 42s</span>
            </p>
          </section>
          <section className="grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-blue-50 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                <span>Obtained</span>
              </p>
              <p className="mt-1 text-3xl font-semibold text-blue-800">
                <span>16</span>
              </p>
            </div>
            <div className="rounded-2xl bg-green-50 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                <span>Correct</span>
              </p>
              <p className="mt-1 text-3xl font-semibold text-green-700">
                <span>{score}</span>
              </p>
            </div>
            <div className="rounded-2xl bg-red-50 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                <span>Wrong</span>
              </p>
              <p className="mt-1 text-3xl font-semibold text-red-700">
                <span>{wrong}</span>
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                <span>Skipped</span>
              </p>
              <p className="mt-1 text-3xl font-semibold text-slate-700">
                <span>{skipped}</span>
              </p>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-950">
                <span>Review Answers</span>
              </h2>
              <button
                type="button"
                onClick={() => setReviewOpen(!reviewOpen)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-blue-800"
              >
                <span>{reviewOpen ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            {reviewOpen && (
              <div className="mt-5 space-y-4">
                {examQuestions.map((question) => {
                  const selectedAnswer = answers[question.id];
                  const isCorrect = selectedAnswer === question.correct;
                  const selectedText = question.options.find((option) => option.id === selectedAnswer)?.text;
                  const correctText = question.options.find((option) => option.id === question.correct)?.text;
                  return (
                    <article key={`review-${question.id}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-xl" aria-hidden="true">
                          {!selectedAnswer ? '⬜' : isCorrect ? '✅' : '❌'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900">
                            <span>Q{question.number}. {question.text}</span>
                          </h3>
                          {selectedAnswer ? (
                            <p
                              className={`mt-3 rounded-xl px-3 py-2 text-sm font-semibold ${
                                isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                              }`}
                            >
                              <span>Your answer: {selectedAnswer}. {selectedText}</span>
                            </p>
                          ) : (
                            <p className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-500">
                              <span>Skipped</span>
                            </p>
                          )}
                          {selectedAnswer && !isCorrect && (
                            <p className="mt-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                              <span>Correct answer: {question.correct}. {correctText}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setMode('default');
                setSubmitWarning(false);
              }}
              className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-800 shadow-sm hover:bg-blue-50"
            >
              <span>Back to Exams</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
