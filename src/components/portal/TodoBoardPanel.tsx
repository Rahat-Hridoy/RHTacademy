'use client';

import React, { useState } from 'react';
import { CheckCircle2, GripVertical, X } from 'lucide-react';

type BoardColumnId = 'todo' | 'progress' | 'done';

interface TodoBoardTask {
  id: string;
  title: string;
  details: string;
  createdDate: string;
}

interface TodoBoardState {
  todo: TodoBoardTask[];
  progress: TodoBoardTask[];
  done: TodoBoardTask[];
}

interface BoardColumnMeta {
  id: BoardColumnId;
  title: string;
  headerClass: string;
  countClass: string;
  emptyText: string;
}

const boardColumns: BoardColumnMeta[] = [
  {
    id: 'todo',
    title: 'To Do',
    headerClass: 'bg-gray-100 text-gray-700',
    countClass: 'bg-white text-gray-500',
    emptyText: 'Nothing to do! Add a task above.'
  },
  {
    id: 'progress',
    title: 'In Progress',
    headerClass: 'bg-blue-50 text-blue-800',
    countClass: 'bg-white text-blue-700',
    emptyText: 'Drag tasks here when you start working.'
  },
  {
    id: 'done',
    title: 'Done',
    headerClass: 'bg-green-50 text-green-800',
    countClass: 'bg-white text-green-700',
    emptyText: 'Completed tasks will appear here.'
  }
];

// Students start with an empty board
const initialBoard: TodoBoardState = {
  todo: [],
  progress: [],
  done: []
};


export const TodoBoardPanel = () => {
  const [board, setBoard] = useState<TodoBoardState>(initialBoard);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<BoardColumnId | null>(null);
  const [addTodoOpen, setAddTodoOpen] = useState(false);
  const [todoName, setTodoName] = useState('');
  const [todoDetails, setTodoDetails] = useState('');

  const addTodo = () => {
    if (todoName.trim().length === 0) return;
    const task: TodoBoardTask = {
      id: `todo-${Date.now()}`,
      title: todoName.trim(),
      details: todoDetails.trim() || 'No details added yet.',
      createdDate: 'Today'
    };
    setBoard((current) => ({
      ...current,
      todo: [task, ...current.todo]
    }));
    setTodoName('');
    setTodoDetails('');
    setAddTodoOpen(false);
  };

  const moveTask = (targetColumn: BoardColumnId) => {
    if (!draggingTaskId) return;
    let movingTask: TodoBoardTask | undefined;
    let sourceColumn: BoardColumnId | undefined;

    boardColumns.forEach((column) => {
      const foundTask = board[column.id].find((task) => task.id === draggingTaskId);
      if (foundTask) {
        movingTask = foundTask;
        sourceColumn = column.id;
      }
    });

    if (!movingTask || !sourceColumn || sourceColumn === targetColumn) {
      setDraggingTaskId(null);
      setDragOverColumn(null);
      return;
    }

    setBoard((current) => ({
      todo: current.todo.filter((task) => task.id !== draggingTaskId),
      progress: current.progress.filter((task) => task.id !== draggingTaskId),
      done: current.done.filter((task) => task.id !== draggingTaskId),
      [targetColumn]: [...current[targetColumn], movingTask!]
    }));

    setDraggingTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="space-y-7">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">
            <span>Kanban workspace</span>
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            <span>My Todo Board</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            <span>Move tasks from intention to momentum, then close the loop when the work is finished.</span>
          </p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3" aria-label="Todo kanban board">
        {boardColumns.map((column) => (
          <article
            key={column.id}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOverColumn(column.id);
            }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(event) => {
              event.preventDefault();
              moveTask(column.id);
            }}
            className={`min-h-[420px] rounded-2xl border bg-white p-4 shadow-sm transition ${
              dragOverColumn === column.id ? 'border-blue-300 ring-4 ring-blue-100' : 'border-slate-200'
            }`}
          >
            <div className={`mb-4 flex items-center justify-between rounded-xl px-4 py-3 ${column.headerClass}`}>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  <span>{column.title}</span>
                </h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${column.countClass}`}>
                  <span>{board[column.id].length}</span>
                </span>
              </div>
              {column.id === 'todo' && (
                <button
                  type="button"
                  onClick={() => setAddTodoOpen(true)}
                  className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-800 shadow-sm hover:bg-blue-50"
                >
                  <span>+ Add</span>
                </button>
              )}
            </div>
            <div className="space-y-3">
              {board[column.id].length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
                  <span>{column.emptyText}</span>
                </p>
              )}
              {board[column.id].map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(event) => {
                    setDraggingTaskId(task.id);
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragEnd={() => {
                    setDraggingTaskId(null);
                    setDragOverColumn(null);
                  }}
                  className={`group rounded-xl border p-4 shadow-sm transition hover:-rotate-1 hover:shadow-lg ${
                    draggingTaskId === task.id ? 'rotate-1 opacity-60 shadow-xl' : ''
                  } ${
                    column.id === 'progress'
                      ? 'border-l-4 border-l-blue-600 bg-white'
                      : column.id === 'done'
                      ? 'border-green-100 bg-green-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <GripVertical
                      size={17}
                      className="mt-1 shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100"
                      aria-label="Drag task"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className={`font-semibold text-gray-900 ${column.id === 'done' ? 'line-through decoration-green-700/70' : ''}`}>
                          <span>{task.title}</span>
                        </h4>
                        {column.id === 'done' && (
                          <CheckCircle2 size={18} className="shrink-0 text-green-600" aria-label="Task complete" />
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
                        <span>{task.details}</span>
                      </p>
                      <time className="mt-4 block text-right text-xs font-medium text-gray-400">
                        <span>{task.createdDate}</span>
                      </time>
                    </div>
                  </div>
                </div>
              ))}
              {dragOverColumn === column.id && draggingTaskId && (
                <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-5 text-center text-xs font-bold uppercase tracking-wide text-blue-600">
                  <span>Drop here</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>

      {addTodoOpen && (
        <dialog
          open
          aria-labelledby="add-new-todo-title"
          className="fixed inset-0 z-50 m-auto w-[min(400px,calc(100%-32px))] rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/30"
        >
          <form
            className="space-y-4 p-6"
            onSubmit={(event) => {
              event.preventDefault();
              addTodo();
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 id="add-new-todo-title" className="text-xl font-semibold text-slate-950">
                <span>Add New Todo</span>
              </h2>
              <button
                type="button"
                onClick={() => setAddTodoOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close add new todo"
              >
                <X size={19} />
              </button>
            </div>
            <label className="block text-sm font-semibold text-slate-700">
              <span>Todo Name</span>
              <input
                required
                value={todoName}
                onChange={(event) => setTodoName(event.target.value)}
                placeholder="What do you need to do?"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              <span>Details</span>
              <textarea
                rows={3}
                value={todoDetails}
                onChange={(event) => setTodoDetails(event.target.value)}
                placeholder="Add any details or notes..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-800 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-900"
            >
              <span>Add Todo</span>
            </button>
            <button
              type="button"
              onClick={() => setAddTodoOpen(false)}
              className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200"
            >
              <span>Cancel</span>
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
};
