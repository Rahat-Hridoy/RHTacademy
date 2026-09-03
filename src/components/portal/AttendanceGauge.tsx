import React from 'react';

interface AttendanceGaugeProps {
  completed: number;
  total: number;
  label?: string;
  size?: number;
}

export const AttendanceGauge = ({
  completed,
  total,
  label = 'Classes Completed',
  size = 190
}: AttendanceGaugeProps) => {
  const percentage = Math.min(Math.round((completed / total) * 100), 100);
  const strokeWidth = 13;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <p className="mb-5 text-xs font-bold uppercase tracking-[.16em] text-slate-500">{label}</p>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="h-full w-full -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`${completed} of ${total} classes completed`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-blue-800 transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <strong className="text-4xl font-semibold tracking-tight text-slate-900">
            {completed}/{total}
          </strong>
          <span className="mt-1 text-sm font-medium text-slate-500">{percentage}% complete</span>
        </div>
      </div>
      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed</p>
          <p className="mt-1 text-lg font-semibold text-blue-800">{completed}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Remaining</p>
          <p className="mt-1 text-lg font-semibold text-teal-700">{total - completed}</p>
        </div>
      </div>
    </div>
  );
};
