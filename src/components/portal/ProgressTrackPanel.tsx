'use client';

import React, { useState } from 'react';
import { Edit3, Plus, Trash2, X } from 'lucide-react';

type ProgressView = 'calendar' | 'graph';
type DotTone = 'teal' | 'green' | 'yellow';

interface CalendarTask {
  id: string;
  title: string;
  details: string;
  done: boolean;
}
interface CalendarTaskDay {
  dateKey: string;
  dot: DotTone;
  tasks: CalendarTask[];
}
interface MonthCell {
  id: string;
  day?: number;
  dateKey?: string;
}

const progressWeekdays = [
  { id: 'mon', label: 'Mon' }, { id: 'tue', label: 'Tue' }, { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' }, { id: 'fri', label: 'Fri' }, { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' }
];

const januaryCells: MonthCell[] = [
  { id: 'blank-mon' }, { id: 'blank-tue' },
  ...Array.from({ length: 31 }, (_, dayIndex) => {
    const day = dayIndex + 1;
    return {
      id: `jan-${day}`,
      day,
      dateKey: `2025-01-${String(day).padStart(2, '0')}`
    };
  })
];

// Students start with no pre-seeded tasks
const initialCalendarTasks: CalendarTaskDay[] = [];


const weeklyPoints = [
  { day: 'Mon', value: 40, x: 70, y: 146 },
  { day: 'Tue', value: 60, x: 155, y: 114 },
  { day: 'Wed', value: 55, x: 240, y: 122 },
  { day: 'Thu', value: 80, x: 325, y: 82 },
  { day: 'Fri', value: 70, x: 410, y: 98 },
  { day: 'Sat', value: 90, x: 495, y: 66 },
  { day: 'Sun', value: 68, x: 580, y: 101 }
];

const formatDateTitle = (dateKey: string) => {
  const date = new Date(`${dateKey}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export const ProgressTrackPanel = () => {
  const [view, setView] = useState<ProgressView>('calendar');
  const [calendarData, setCalendarData] = useState<CalendarTaskDay[]>(initialCalendarTasks);
  const [dateModalOpen, setDateModalOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2025-01-15');
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDetails, setEditingDetails] = useState('');

  const selectedTasks = calendarData.find((day) => day.dateKey === selectedDate)?.tasks ?? [];
  const selectedTitle = `Tasks for ${formatDateTitle(selectedDate)}`;

  const openDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    setDateModalOpen(true);
    setAddingTask(false);
    setEditingTaskId(null);
  };

  const updateTask = (taskId: string, taskUpdate: Partial<CalendarTask>) => {
    setCalendarData((current) =>
      current.map((day) =>
        day.dateKey === selectedDate
          ? {
              ...day,
              tasks: day.tasks.map((task) => (task.id === taskId ? { ...task, ...taskUpdate } : task))
            }
          : day
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setCalendarData((current) =>
      current.map((day) =>
        day.dateKey === selectedDate
          ? {
              ...day,
              tasks: day.tasks.filter((task) => task.id !== taskId)
            }
          : day
      )
    );
  };

  const saveNewTask = () => {
    if (newTaskTitle.trim().length === 0) return;
    const task: CalendarTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      details: newTaskDetails.trim() || 'Personal study task',
      done: false
    };
    setCalendarData((current) => {
      const existingDay = current.find((day) => day.dateKey === selectedDate);
      if (existingDay) {
        return current.map((day) =>
          day.dateKey === selectedDate
            ? {
                ...day,
                dot: 'teal',
                tasks: [...day.tasks, task]
              }
            : day
        );
      }
      return [
        ...current,
        {
          dateKey: selectedDate,
          dot: 'teal',
          tasks: [task]
        }
      ];
    });
    setNewTaskTitle('');
    setNewTaskDetails('');
    setAddingTask(false);
  };

  const saveEdit = (taskId: string) => {
    updateTask(taskId, {
      title: editingTitle.trim() || 'Untitled task',
      details: editingDetails.trim() || 'No details added'
    });
    setEditingTaskId(null);
  };

  return (
    <div className="space-y-7">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">
            <span>Progress workspace</span>
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            <span>Progress Track</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            <span>Plan daily study tasks from a monthly view, then switch to the graph when you want a quick read on rhythm.</span>
          </p>
        </div>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm" aria-label="Progress view toggle">
          <button
            type="button"
            onClick={() => setView('calendar')}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              view === 'calendar' ? 'bg-blue-800 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>📅 Calendar View</span>
          </button>
          <button
            type="button"
            onClick={() => setView('graph')}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              view === 'graph' ? 'bg-blue-800 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>📈 Graph View</span>
          </button>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[1.2fr_.8fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-7">
          {view === 'calendar' && (
            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">
                    <span>January 2025</span>
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-950">
                    <span>Monthly Calendar</span>
                  </h3>
                </div>
                <div className="hidden items-center gap-4 text-xs font-semibold text-slate-500 sm:flex">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                    <span>Has tasks</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    <span>Done</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span>Partial</span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
                {progressWeekdays.map((day) => (
                  <span key={day.id} className="py-2">
                    <span>{day.label}</span>
                  </span>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-2">
                {januaryCells.map((cell) => {
                  const taskDay = calendarData.find((day) => day.dateKey === cell.dateKey);
                  const isCurrentDate = cell.dateKey === '2025-01-15';
                  return (
                    <button
                      key={cell.id}
                      type="button"
                      disabled={!cell.dateKey}
                      onClick={() => cell.dateKey && openDate(cell.dateKey)}
                      className={`min-h-[86px] rounded-2xl border p-2 text-left transition ${
                        cell.dateKey ? 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30' : 'border-transparent bg-transparent'
                      } ${isCurrentDate ? 'ring-2 ring-blue-100' : ''}`}
                      aria-label={cell.dateKey ? `Open tasks for January ${cell.day}, 2025` : 'Blank calendar day'}
                    >
                      {cell.day && (
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${isCurrentDate ? 'bg-blue-800 text-white' : 'text-slate-800'}`}>
                          <span>{cell.day}</span>
                        </span>
                      )}
                      {taskDay && (
                        <span
                          className={`mt-2 block h-2 w-2 rounded-full ${
                            taskDay.dot === 'green' ? 'bg-green-500' : taskDay.dot === 'yellow' ? 'bg-yellow-400' : 'bg-teal-500'
                          }`}
                          aria-label="Task indicator"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'graph' && (
            <div>
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">
                    <span>Learning rhythm</span>
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-950">
                    <span>Progress Overview</span>
                  </h3>
                </div>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                  <span>% of daily tasks completed</span>
                </span>
              </div>
              <svg viewBox="0 0 640 260" className="h-[270px] w-full" role="img" aria-label="Weekly progress line graph">
                <line x1="70" y1="50" x2="70" y2="210" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="70" y1="210" x2="590" y2="210" stroke="#E2E8F0" strokeWidth="1" />
                <text x="28" y="55" className="fill-slate-400 text-[12px] font-semibold">100%</text>
                <text x="38" y="135" className="fill-slate-400 text-[12px] font-semibold">50%</text>
                <text x="46" y="214" className="fill-slate-400 text-[12px] font-semibold">0%</text>
                <path d="M70 146 C105 130 120 116 155 114 C190 112 205 132 240 122 C275 112 290 82 325 82 C360 82 375 104 410 98 C445 92 460 64 495 66 C530 68 545 94 580 101 L580 210 L70 210 Z" fill="#0D9488" opacity="0.2" />
                <path d="M70 146 C105 130 120 116 155 114 C190 112 205 132 240 122 C275 112 290 82 325 82 C360 82 375 104 410 98 C445 92 460 64 495 66 C530 68 545 94 580 101" fill="none" stroke="#0D9488" strokeWidth="4" strokeLinecap="round" />
                {weeklyPoints.map((point) => (
                  <g key={point.day}>
                    <circle cx={point.x} cy={point.y} r="7" fill="#FFFFFF" stroke="#0D9488" strokeWidth="4">
                      <title>{point.day}: {point.value}% completed</title>
                    </circle>
                    <text x={point.x - 11} y="238" className="fill-slate-500 text-[12px] font-semibold">{point.day}</text>
                  </g>
                ))}
              </svg>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400"><span>Tasks Set</span></p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950"><span>24</span></p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400"><span>Completed</span></p>
                  <p className="mt-1 text-2xl font-semibold text-teal-700"><span>18</span></p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400"><span>Completion Rate</span></p>
                  <p className="mt-1 text-2xl font-semibold text-blue-800"><span>75%</span></p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500"><span>Switch to Calendar View to manage tasks</span></p>
            </div>
          )}
        </article>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7" aria-label="Progress summary">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700"><span>This month</span></p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950"><span>Task pulse</span></h3>
          <div className="mt-7 space-y-4">
            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-800"><span>Current focus date</span></p>
              <p className="mt-2 text-3xl font-semibold text-blue-950"><span>{formatDateTitle(selectedDate)}</span></p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400"><span>Tasks</span></p>
                <p className="mt-1 text-2xl font-semibold text-slate-900"><span>{selectedTasks.length}</span></p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400"><span>Done</span></p>
                <p className="mt-1 text-2xl font-semibold text-green-700"><span>{selectedTasks.filter((task) => task.done).length}</span></p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDateModalOpen(true)}
              className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-700"
            >
              <span>Open selected date</span>
            </button>
          </div>
        </aside>
      </section>

      {dateModalOpen && (
        <dialog
          open
          aria-labelledby="date-task-title"
          className="fixed inset-0 z-50 m-auto max-h-[calc(100vh-32px)] w-[min(620px,calc(100%-32px))] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/30"
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">
                <span>Daily task list</span>
              </p>
              <h2 id="date-task-title" className="mt-1 text-xl font-semibold text-slate-950">
                <span>{selectedTitle}</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setDateModalOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              aria-label="Close date tasks"
            >
              <X size={19} />
            </button>
          </div>
          <div className="space-y-4 p-6">
            {selectedTasks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="font-semibold text-slate-700">
                  <span>No tasks for this day.</span>
                </p>
                <button
                  type="button"
                  onClick={() => setAddingTask(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white"
                >
                  <Plus size={16} />
                  <span>Add Task</span>
                </button>
              </div>
            )}
            {selectedTasks.map((task) => (
              <article
                key={task.id}
                className={`rounded-2xl border p-4 transition ${task.done ? 'border-green-100 bg-green-50/70' : 'border-slate-200 bg-white'}`}
              >
                {editingTaskId === task.id ? (
                  <div className="space-y-3">
                    <input
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-blue-700"
                      aria-label="Edit task title"
                    />
                    <textarea
                      value={editingDetails}
                      onChange={(event) => setEditingDetails(event.target.value)}
                      rows={2}
                      className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-700"
                      aria-label="Edit task details"
                    />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => saveEdit(task.id)} className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-bold text-white">
                        <span>Save</span>
                      </button>
                      <button type="button" onClick={() => setEditingTaskId(null)} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => updateTask(task.id, { done: !task.done })}
                      className="mt-1 h-5 w-5 rounded border-slate-300 accent-green-600"
                      aria-label={`Mark ${task.title} complete`}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-bold text-slate-900 ${task.done ? 'line-through decoration-green-700/70' : ''}`}>
                        <span>{task.title}</span>
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        <span>{task.details}</span>
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setEditingTitle(task.title);
                          setEditingDetails(task.details);
                        }}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                        aria-label={`Edit ${task.title}`}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        aria-label={`Delete ${task.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
            {addingTask && (
              <form
                className="space-y-3 rounded-2xl border border-teal-100 bg-teal-50/40 p-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  saveNewTask();
                }}
              >
                <input
                  value={newTaskTitle}
                  onChange={(event) => setNewTaskTitle(event.target.value)}
                  placeholder="Task title"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                  aria-label="Task title"
                />
                <textarea
                  value={newTaskDetails}
                  onChange={(event) => setNewTaskDetails(event.target.value)}
                  rows={2}
                  placeholder="Details (optional)"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                  aria-label="Task details"
                />
                <div className="flex gap-2">
                  <button type="submit" className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-bold text-white">
                    <span>Save Task</span>
                  </button>
                  <button type="button" onClick={() => setAddingTask(false)} className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600">
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            )}
            {selectedTasks.length > 0 && !addingTask && (
              <button
                type="button"
                onClick={() => setAddingTask(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                <Plus size={16} />
                <span>Add Task</span>
              </button>
            )}
          </div>
          <div className="flex justify-end border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={() => setDateModalOpen(false)}
              className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600"
            >
              <span>Close</span>
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
};
