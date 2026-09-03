**App Sidebar**

import { CheckSquare, ClipboardCheck, CreditCard, Folder, Home, LogOut, TrendingUp } from 'lucide-react';
interface SidebarLink {
  id: string;
  name: string;
  icon: typeof Home;
}
interface AppSidebarProps {
  userRole?: 'admin' | 'student';
  activeItem?: string;
  onNavigate?: (item: string) => void;
  onLogout?: () => void;
}
const studentLinks: SidebarLink[] = [{
  id: 'dashboard',
  name: 'Dashboard',
  icon: Home
}, {
  id: 'resources',
  name: 'Resources',
  icon: Folder
}, {
  id: 'payments',
  name: 'Payment',
  icon: CreditCard
}, {
  id: 'progress',
  name: 'Progress Track',
  icon: TrendingUp
}, {
  id: 'todo',
  name: 'Todo',
  icon: CheckSquare
}, {
  id: 'exam',
  name: 'Exam',
  icon: ClipboardCheck
}];
export const AppSidebar = ({
  activeItem = 'dashboard',
  onNavigate,
  onLogout
}: AppSidebarProps) => {
  return <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[220px] flex-col border-r border-slate-200 bg-white text-slate-700 shadow-sm md:flex">
      <section className="border-b border-slate-100 px-5 py-6" aria-label="Student account">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-blue-100" aria-label="Arif Hasan avatar">
            <svg viewBox="0 0 48 48" className="h-full w-full" role="img" aria-label="Male student avatar">
              <circle cx="24" cy="24" r="24" fill="#dbeafe" />
              <path d="M12 43c1.9-8.1 6.4-12 12-12s10.1 3.9 12 12" fill="#1E40AF" />
              <circle cx="24" cy="21" r="8" fill="#f4c7a1" />
              <path d="M16 20c.4-8.5 4.2-11.5 9.4-11.5 5.1 0 8.2 3.8 7.5 9.2-3.3-2.7-7.7-3.6-12.9-2.2z" fill="#334155" />
            </svg>
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-900">Arif Hasan</h2>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500">Class 11 · Science</p>
          </div>
        </div>
      </section>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Student portal navigation">
        {studentLinks.map(link => {
        const Icon = link.icon;
        const isActive = activeItem === link.id;
        return <button key={link.id} type="button" onClick={() => onNavigate?.(link.id)} className={`flex w-full items-center gap-3 rounded-xl border-l-4 px-3 py-3 text-left text-sm font-semibold transition-all duration-200 ${isActive ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`} aria-current={isActive ? 'page' : undefined}>
              <Icon size={19} className={isActive ? 'text-teal-700' : 'text-slate-400'} />
              <span>{link.name}</span>
            </button>;
      })}
      </nav>

      <section className="border-t border-slate-100 p-3" aria-label="Session actions">
        <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </section>
    </aside>;
};

**Attendance Gauge**

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
  const percentage = Math.min(Math.round(completed / total * 100), 100);
  const strokeWidth = 13;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - percentage / 100 * circumference;
  return <div className="flex w-full flex-col items-center justify-center">
      <p className="mb-5 text-xs font-bold uppercase tracking-[.16em] text-slate-500">{label}</p>
      <div className="relative" style={{
      width: size,
      height: size
    }}>
        <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${completed} of ${total} classes completed`}>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-100" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="text-blue-800 transition-all duration-700 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <strong className="text-4xl font-semibold tracking-tight text-slate-900">{completed}/{total}</strong>
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
    </div>;
};

**Portal section**
import { useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, CircleAlert, Edit3, GripVertical, Plus, Trash2, Trophy, X } from 'lucide-react';
type ProgressView = 'calendar' | 'graph';
type DotTone = 'teal' | 'green' | 'yellow';
type BoardColumnId = 'todo' | 'progress' | 'done';
type ExamMode = 'default' | 'exam' | 'result';
type AnswerKey = 'A' | 'B' | 'C' | 'D';
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
const progressWeekdays = [{
  id: 'mon',
  label: 'Mon'
}, {
  id: 'tue',
  label: 'Tue'
}, {
  id: 'wed',
  label: 'Wed'
}, {
  id: 'thu',
  label: 'Thu'
}, {
  id: 'fri',
  label: 'Fri'
}, {
  id: 'sat',
  label: 'Sat'
}, {
  id: 'sun',
  label: 'Sun'
}];
const januaryCells: MonthCell[] = [{
  id: 'blank-mon'
}, {
  id: 'blank-tue'
}, ...Array.from({
  length: 31
}, (_, dayIndex) => {
  const day = dayIndex + 1;
  return {
    id: `jan-${day}`,
    day,
    dateKey: `2025-01-${String(day).padStart(2, '0')}`
  };
})];
const initialCalendarTasks: CalendarTaskDay[] = [{
  dateKey: '2025-01-10',
  dot: 'teal',
  tasks: [{
    id: 'jan-10-physics',
    title: 'Review force diagrams',
    details: 'Two short examples from class notes',
    done: true
  }, {
    id: 'jan-10-chemistry',
    title: 'Read bonding notes',
    details: 'Highlight formulas to memorize',
    done: false
  }]
}, {
  dateKey: '2025-01-14',
  dot: 'green',
  tasks: [{
    id: 'jan-14-math',
    title: 'Finish algebra worksheet',
    details: 'Submit after class',
    done: true
  }, {
    id: 'jan-14-biology',
    title: 'Label cell diagram',
    details: 'Nucleus, mitochondria and membrane',
    done: true
  }, {
    id: 'jan-14-ict',
    title: 'Practice database terms',
    details: 'Ten definitions',
    done: true
  }]
}, {
  dateKey: '2025-01-15',
  dot: 'teal',
  tasks: [{
    id: 'jan-15-read',
    title: 'Read Chapter 5',
    details: "Focus on Newton's Laws section",
    done: false
  }, {
    id: 'jan-15-solve',
    title: 'Solve 10 problems',
    details: 'From exercise set B',
    done: true
  }]
}, {
  dateKey: '2025-01-18',
  dot: 'yellow',
  tasks: [{
    id: 'jan-18-a',
    title: 'Revise vectors',
    details: 'Magnitude and direction',
    done: true
  }, {
    id: 'jan-18-b',
    title: 'Chemistry flashcards',
    details: 'Organic reaction names',
    done: true
  }, {
    id: 'jan-18-c',
    title: 'Math problem set',
    details: 'Trigonometry identities',
    done: false
  }, {
    id: 'jan-18-d',
    title: 'ICT reading',
    details: 'Normalization overview',
    done: false
  }]
}];
const weeklyPoints = [{
  day: 'Mon',
  value: 40,
  x: 70,
  y: 146
}, {
  day: 'Tue',
  value: 60,
  x: 155,
  y: 114
}, {
  day: 'Wed',
  value: 55,
  x: 240,
  y: 122
}, {
  day: 'Thu',
  value: 80,
  x: 325,
  y: 82
}, {
  day: 'Fri',
  value: 70,
  x: 410,
  y: 98
}, {
  day: 'Sat',
  value: 90,
  x: 495,
  y: 66
}, {
  day: 'Sun',
  value: 68,
  x: 580,
  y: 101
}];
const boardColumns: BoardColumnMeta[] = [{
  id: 'todo',
  title: 'To Do',
  headerClass: 'bg-gray-100 text-gray-700',
  countClass: 'bg-white text-gray-500',
  emptyText: 'Nothing to do! Add a task above.'
}, {
  id: 'progress',
  title: 'In Progress',
  headerClass: 'bg-blue-50 text-blue-800',
  countClass: 'bg-white text-blue-700',
  emptyText: 'Drag tasks here when you start working.'
}, {
  id: 'done',
  title: 'Done',
  headerClass: 'bg-green-50 text-green-800',
  countClass: 'bg-white text-green-700',
  emptyText: 'Completed tasks will appear here.'
}];
const initialBoard: TodoBoardState = {
  todo: [{
    id: 'todo-physics-assignment',
    title: 'Complete Physics assignment',
    details: 'Chapter 6 exercise problems',
    createdDate: '04 Feb'
  }, {
    id: 'todo-hsc-syllabus',
    title: 'Read HSC syllabus',
    details: 'Mark the chapters included in this cycle',
    createdDate: '04 Feb'
  }],
  progress: [{
    id: 'progress-motion-notes',
    title: 'Chapter 6 — Motion notes',
    details: 'Summarize velocity, acceleration and graph rules',
    createdDate: '03 Feb'
  }],
  done: [{
    id: 'done-chapter-revision',
    title: 'Revise Chapter 1-3',
    details: 'Formula review and five quick MCQs',
    createdDate: '02 Feb'
  }]
};
const examHistory: ExamHistoryItem[] = [{
  id: 'exam-physics',
  name: 'Physics Ch 1-3 MCQ',
  subject: 'Physics',
  date: '15 Jan 2025',
  score: '16/20',
  percentage: '80%',
  result: 'Passed'
}, {
  id: 'exam-chemistry',
  name: 'Chemistry Basics',
  subject: 'Chemistry',
  date: '8 Jan 2025',
  score: '11/20',
  percentage: '55%',
  result: 'Passed'
}, {
  id: 'exam-math',
  name: 'Math Algebra Test',
  subject: 'Math',
  date: '2 Jan 2025',
  score: '7/20',
  percentage: '35%',
  result: 'Failed'
}];
const examQuestions: ExamQuestion[] = [{
  id: 'q1',
  number: 1,
  text: "Which statement best describes Newton's First Law of Motion?",
  correct: 'A',
  options: [{
    id: 'A',
    text: 'An object remains at rest or in uniform motion unless acted on by force.'
  }, {
    id: 'B',
    text: 'Force equals mass multiplied by acceleration.'
  }, {
    id: 'C',
    text: 'Every action has an equal and opposite reaction.'
  }, {
    id: 'D',
    text: 'Energy can neither be created nor destroyed.'
  }]
}, {
  id: 'q2',
  number: 2,
  text: 'What is the SI unit of force?',
  correct: 'B',
  options: [{
    id: 'A',
    text: 'Joule'
  }, {
    id: 'B',
    text: 'Newton'
  }, {
    id: 'C',
    text: 'Watt'
  }, {
    id: 'D',
    text: 'Pascal'
  }]
}, {
  id: 'q3',
  number: 3,
  text: 'Acceleration is defined as the rate of change of what quantity?',
  correct: 'C',
  options: [{
    id: 'A',
    text: 'Distance'
  }, {
    id: 'B',
    text: 'Displacement'
  }, {
    id: 'C',
    text: 'Velocity'
  }, {
    id: 'D',
    text: 'Mass'
  }]
}, {
  id: 'q4',
  number: 4,
  text: 'Which quantity is scalar?',
  correct: 'D',
  options: [{
    id: 'A',
    text: 'Velocity'
  }, {
    id: 'B',
    text: 'Force'
  }, {
    id: 'C',
    text: 'Acceleration'
  }, {
    id: 'D',
    text: 'Speed'
  }]
}, {
  id: 'q5',
  number: 5,
  text: 'If mass doubles while acceleration is constant, force becomes what?',
  correct: 'A',
  options: [{
    id: 'A',
    text: 'Double'
  }, {
    id: 'B',
    text: 'Half'
  }, {
    id: 'C',
    text: 'Unchanged'
  }, {
    id: 'D',
    text: 'Zero'
  }]
}, {
  id: 'q6',
  number: 6,
  text: 'Momentum is the product of mass and which quantity?',
  correct: 'B',
  options: [{
    id: 'A',
    text: 'Acceleration'
  }, {
    id: 'B',
    text: 'Velocity'
  }, {
    id: 'C',
    text: 'Force'
  }, {
    id: 'D',
    text: 'Time'
  }]
}, {
  id: 'q7',
  number: 7,
  text: 'The slope of a velocity-time graph represents what?',
  correct: 'C',
  options: [{
    id: 'A',
    text: 'Distance'
  }, {
    id: 'B',
    text: 'Speed'
  }, {
    id: 'C',
    text: 'Acceleration'
  }, {
    id: 'D',
    text: 'Momentum'
  }]
}, {
  id: 'q8',
  number: 8,
  text: 'Friction generally acts in which direction?',
  correct: 'D',
  options: [{
    id: 'A',
    text: 'Along gravity only'
  }, {
    id: 'B',
    text: 'Toward motion'
  }, {
    id: 'C',
    text: 'Perpendicular to motion'
  }, {
    id: 'D',
    text: 'Opposite relative motion'
  }]
}, {
  id: 'q9',
  number: 9,
  text: 'Which is a vector quantity?',
  correct: 'A',
  options: [{
    id: 'A',
    text: 'Displacement'
  }, {
    id: 'B',
    text: 'Time'
  }, {
    id: 'C',
    text: 'Mass'
  }, {
    id: 'D',
    text: 'Temperature'
  }]
}, {
  id: 'q10',
  number: 10,
  text: 'What does inertia depend mostly on?',
  correct: 'B',
  options: [{
    id: 'A',
    text: 'Speed'
  }, {
    id: 'B',
    text: 'Mass'
  }, {
    id: 'C',
    text: 'Shape'
  }, {
    id: 'D',
    text: 'Color'
  }]
}, {
  id: 'q11',
  number: 11,
  text: 'A body moving with uniform velocity has what acceleration?',
  correct: 'C',
  options: [{
    id: 'A',
    text: 'Positive'
  }, {
    id: 'B',
    text: 'Negative'
  }, {
    id: 'C',
    text: 'Zero'
  }, {
    id: 'D',
    text: 'Infinite'
  }]
}, {
  id: 'q12',
  number: 12,
  text: 'Which law explains recoil of a gun?',
  correct: 'D',
  options: [{
    id: 'A',
    text: 'Law of gravitation'
  }, {
    id: 'B',
    text: 'First law'
  }, {
    id: 'C',
    text: 'Second law'
  }, {
    id: 'D',
    text: 'Third law'
  }]
}, {
  id: 'q13',
  number: 13,
  text: 'Which instrument measures force?',
  correct: 'A',
  options: [{
    id: 'A',
    text: 'Spring balance'
  }, {
    id: 'B',
    text: 'Ammeter'
  }, {
    id: 'C',
    text: 'Barometer'
  }, {
    id: 'D',
    text: 'Thermometer'
  }]
}, {
  id: 'q14',
  number: 14,
  text: 'Work is done when force causes what?',
  correct: 'B',
  options: [{
    id: 'A',
    text: 'Heat only'
  }, {
    id: 'B',
    text: 'Displacement'
  }, {
    id: 'C',
    text: 'Mass increase'
  }, {
    id: 'D',
    text: 'No movement'
  }]
}, {
  id: 'q15',
  number: 15,
  text: 'Power is the rate of doing what?',
  correct: 'C',
  options: [{
    id: 'A',
    text: 'Momentum'
  }, {
    id: 'B',
    text: 'Acceleration'
  }, {
    id: 'C',
    text: 'Work'
  }, {
    id: 'D',
    text: 'Mass'
  }]
}, {
  id: 'q16',
  number: 16,
  text: 'Which has the unit kg m/s?',
  correct: 'D',
  options: [{
    id: 'A',
    text: 'Force'
  }, {
    id: 'B',
    text: 'Work'
  }, {
    id: 'C',
    text: 'Power'
  }, {
    id: 'D',
    text: 'Momentum'
  }]
}, {
  id: 'q17',
  number: 17,
  text: 'A balanced force produces what net force?',
  correct: 'A',
  options: [{
    id: 'A',
    text: 'Zero'
  }, {
    id: 'B',
    text: 'One newton'
  }, {
    id: 'C',
    text: 'Ten newtons'
  }, {
    id: 'D',
    text: 'Infinite force'
  }]
}, {
  id: 'q18',
  number: 18,
  text: 'Distance travelled per unit time is called what?',
  correct: 'B',
  options: [{
    id: 'A',
    text: 'Velocity'
  }, {
    id: 'B',
    text: 'Speed'
  }, {
    id: 'C',
    text: 'Acceleration'
  }, {
    id: 'D',
    text: 'Impulse'
  }]
}, {
  id: 'q19',
  number: 19,
  text: 'Impulse equals force multiplied by what?',
  correct: 'C',
  options: [{
    id: 'A',
    text: 'Mass'
  }, {
    id: 'B',
    text: 'Distance'
  }, {
    id: 'C',
    text: 'Time'
  }, {
    id: 'D',
    text: 'Speed'
  }]
}, {
  id: 'q20',
  number: 20,
  text: 'Which energy does a moving object have?',
  correct: 'D',
  options: [{
    id: 'A',
    text: 'Chemical energy'
  }, {
    id: 'B',
    text: 'Thermal energy only'
  }, {
    id: 'C',
    text: 'Potential energy only'
  }, {
    id: 'D',
    text: 'Kinetic energy'
  }]
}];
const seededAnswers: Record<string, AnswerKey> = {
  q1: 'A',
  q2: 'B',
  q3: 'C',
  q4: 'D',
  q5: 'A',
  q6: 'A',
  q7: 'C',
  q8: 'D',
  q9: 'B',
  q10: 'B',
  q11: 'C',
  q12: 'A',
  q13: 'A',
  q14: 'B',
  q15: 'C',
  q16: 'D'
};
const formatDateTitle = (dateKey: string) => {
  const date = new Date(`${dateKey}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};
const formatCountdown = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds % 86400 / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const remainingSeconds = seconds % 60;
  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
};
const formatExamTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
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
  const selectedTasks = calendarData.find(day => day.dateKey === selectedDate)?.tasks ?? [];
  const selectedTitle = `Tasks for ${formatDateTitle(selectedDate)}`;
  const openDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    setDateModalOpen(true);
    setAddingTask(false);
    setEditingTaskId(null);
  };
  const updateTask = (taskId: string, taskUpdate: Partial<CalendarTask>) => {
    setCalendarData(current => current.map(day => day.dateKey === selectedDate ? {
      ...day,
      tasks: day.tasks.map(task => task.id === taskId ? {
        ...task,
        ...taskUpdate
      } : task)
    } : day));
  };
  const deleteTask = (taskId: string) => {
    setCalendarData(current => current.map(day => day.dateKey === selectedDate ? {
      ...day,
      tasks: day.tasks.filter(task => task.id !== taskId)
    } : day));
  };
  const saveNewTask = () => {
    if (newTaskTitle.trim().length === 0) return;
    const task: CalendarTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      details: newTaskDetails.trim() || 'Personal study task',
      done: false
    };
    setCalendarData(current => {
      const existingDay = current.find(day => day.dateKey === selectedDate);
      if (existingDay) {
        return current.map(day => day.dateKey === selectedDate ? {
          ...day,
          dot: 'teal',
          tasks: [...day.tasks, task]
        } : day);
      }
      return [...current, {
        dateKey: selectedDate,
        dot: 'teal',
        tasks: [task]
      }];
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
  return <div className="space-y-7">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700"><span>Progress workspace</span></p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950"><span>Progress Track</span></h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500"><span>Plan daily study tasks from a monthly view, then switch to the graph when you want a quick read on rhythm.</span></p>
        </div>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm" aria-label="Progress view toggle">
          <button type="button" onClick={() => setView('calendar')} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${view === 'calendar' ? 'bg-blue-800 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><span>📅 Calendar View</span></button>
          <button type="button" onClick={() => setView('graph')} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${view === 'graph' ? 'bg-blue-800 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><span>📈 Graph View</span></button>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[1.2fr_.8fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-7">
          {view === 'calendar' && <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700"><span>January 2025</span></p>
                <h3 className="mt-1 text-xl font-semibold text-slate-950"><span>Monthly Calendar</span></h3>
              </div>
              <div className="hidden items-center gap-4 text-xs font-semibold text-slate-500 sm:flex">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-teal-500" /><span>Has tasks</span></span>
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /><span>Done</span></span>
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /><span>Partial</span></span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
              {progressWeekdays.map(day => <span key={day.id} className="py-2"><span>{day.label}</span></span>)}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2">
              {januaryCells.map(cell => {
              const taskDay = calendarData.find(day => day.dateKey === cell.dateKey);
              const isCurrentDate = cell.dateKey === '2025-01-15';
              return <button key={cell.id} type="button" disabled={!cell.dateKey} onClick={() => cell.dateKey && openDate(cell.dateKey)} className={`min-h-[86px] rounded-2xl border p-2 text-left transition ${cell.dateKey ? 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30' : 'border-transparent bg-transparent'} ${isCurrentDate ? 'ring-2 ring-blue-100' : ''}`} aria-label={cell.dateKey ? `Open tasks for January ${cell.day}, 2025` : 'Blank calendar day'}>
                  {cell.day && <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${isCurrentDate ? 'bg-blue-800 text-white' : 'text-slate-800'}`}><span>{cell.day}</span></span>}
                  {taskDay && <span className={`mt-2 block h-2 w-2 rounded-full ${taskDay.dot === 'green' ? 'bg-green-500' : taskDay.dot === 'yellow' ? 'bg-yellow-400' : 'bg-teal-500'}`} aria-label="Task indicator" />}
                </button>;
            })}
            </div>
          </div>}

          {view === 'graph' && <div>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700"><span>Learning rhythm</span></p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-950"><span>Progress Overview</span></h3>
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700"><span>% of daily tasks completed</span></span>
            </div>
            <svg viewBox="0 0 640 260" className="h-[270px] w-full" role="img" aria-label="Weekly progress line graph">
              <line x1="70" y1="50" x2="70" y2="210" stroke="#E2E8F0" strokeWidth="1" />
              <line x1="70" y1="210" x2="590" y2="210" stroke="#E2E8F0" strokeWidth="1" />
              <text x="28" y="55" className="fill-slate-400 text-[12px] font-semibold">100%</text>
              <text x="38" y="135" className="fill-slate-400 text-[12px] font-semibold">50%</text>
              <text x="46" y="214" className="fill-slate-400 text-[12px] font-semibold">0%</text>
              <path d="M70 146 C105 130 120 116 155 114 C190 112 205 132 240 122 C275 112 290 82 325 82 C360 82 375 104 410 98 C445 92 460 64 495 66 C530 68 545 94 580 101 L580 210 L70 210 Z" fill="#0D9488" opacity="0.2" />
              <path d="M70 146 C105 130 120 116 155 114 C190 112 205 132 240 122 C275 112 290 82 325 82 C360 82 375 104 410 98 C445 92 460 64 495 66 C530 68 545 94 580 101" fill="none" stroke="#0D9488" strokeWidth="4" strokeLinecap="round" />
              {weeklyPoints.map(point => <g key={point.day}>
                <circle cx={point.x} cy={point.y} r="7" fill="#FFFFFF" stroke="#0D9488" strokeWidth="4">
                  <title>{point.day}: {point.value}% completed</title>
                </circle>
                <text x={point.x - 11} y="238" className="fill-slate-500 text-[12px] font-semibold">{point.day}</text>
              </g>)}
            </svg>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400"><span>Tasks Set</span></p><p className="mt-1 text-2xl font-semibold text-slate-950"><span>24</span></p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400"><span>Completed</span></p><p className="mt-1 text-2xl font-semibold text-teal-700"><span>18</span></p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400"><span>Completion Rate</span></p><p className="mt-1 text-2xl font-semibold text-blue-800"><span>75%</span></p></div>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500"><span>Switch to Calendar View to manage tasks</span></p>
          </div>}
        </article>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7" aria-label="Progress summary">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700"><span>This month</span></p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950"><span>Task pulse</span></h3>
          <div className="mt-7 space-y-4">
            <div className="rounded-2xl bg-blue-50 p-5"><p className="text-sm font-semibold text-blue-800"><span>Current focus date</span></p><p className="mt-2 text-3xl font-semibold text-blue-950"><span>{formatDateTitle(selectedDate)}</span></p></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400"><span>Tasks</span></p><p className="mt-1 text-2xl font-semibold text-slate-900"><span>{selectedTasks.length}</span></p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400"><span>Done</span></p><p className="mt-1 text-2xl font-semibold text-green-700"><span>{selectedTasks.filter(task => task.done).length}</span></p></div>
            </div>
            <button type="button" onClick={() => setDateModalOpen(true)} className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-700"><span>Open selected date</span></button>
          </div>
        </aside>
      </section>

      {dateModalOpen && <dialog open aria-labelledby="date-task-title" className="fixed inset-0 z-50 m-auto max-h-[calc(100vh-32px)] w-[min(620px,calc(100%-32px))] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/30">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700"><span>Daily task list</span></p>
            <h2 id="date-task-title" className="mt-1 text-xl font-semibold text-slate-950"><span>{selectedTitle}</span></h2>
          </div>
          <button type="button" onClick={() => setDateModalOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close date tasks"><X size={19} /></button>
        </div>
        <div className="space-y-4 p-6">
          {selectedTasks.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="font-semibold text-slate-700"><span>No tasks for this day.</span></p>
            <button type="button" onClick={() => setAddingTask(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} /><span>Add Task</span></button>
          </div>}
          {selectedTasks.map(task => <article key={task.id} className={`rounded-2xl border p-4 transition ${task.done ? 'border-green-100 bg-green-50/70' : 'border-slate-200 bg-white'}`}>
            {editingTaskId === task.id ? <div className="space-y-3">
              <input value={editingTitle} onChange={event => setEditingTitle(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-blue-700" aria-label="Edit task title" />
              <textarea value={editingDetails} onChange={event => setEditingDetails(event.target.value)} rows={2} className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-700" aria-label="Edit task details" />
              <div className="flex justify-end gap-2"><button type="button" onClick={() => saveEdit(task.id)} className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-bold text-white"><span>Save</span></button><button type="button" onClick={() => setEditingTaskId(null)} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600"><span>Cancel</span></button></div>
            </div> : <div className="flex items-start gap-3">
              <input type="checkbox" checked={task.done} onChange={() => updateTask(task.id, {
              done: !task.done
            })} className="mt-1 h-5 w-5 rounded border-slate-300 accent-green-600" aria-label={`Mark ${task.title} complete`} />
              <div className="min-w-0 flex-1">
                <h3 className={`font-bold text-slate-900 ${task.done ? 'line-through decoration-green-700/70' : ''}`}><span>{task.title}</span></h3>
                <p className="mt-1 text-sm leading-5 text-slate-500"><span>{task.details}</span></p>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => {
                setEditingTaskId(task.id);
                setEditingTitle(task.title);
                setEditingDetails(task.details);
              }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label={`Edit ${task.title}`}><Edit3 size={16} /></button>
                <button type="button" onClick={() => deleteTask(task.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label={`Delete ${task.title}`}><Trash2 size={16} /></button>
              </div>
            </div>}
          </article>)}
          {addingTask && <form className="space-y-3 rounded-2xl border border-teal-100 bg-teal-50/40 p-4" onSubmit={event => {
          event.preventDefault();
          saveNewTask();
        }}>
            <input value={newTaskTitle} onChange={event => setNewTaskTitle(event.target.value)} placeholder="Task title" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600" aria-label="Task title" />
            <textarea value={newTaskDetails} onChange={event => setNewTaskDetails(event.target.value)} rows={2} placeholder="Details (optional)" className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600" aria-label="Task details" />
            <div className="flex gap-2"><button type="submit" className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-bold text-white"><span>Save Task</span></button><button type="button" onClick={() => setAddingTask(false)} className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600"><span>Cancel</span></button></div>
          </form>}
          {selectedTasks.length > 0 && !addingTask && <button type="button" onClick={() => setAddingTask(true)} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} /><span>Add Task</span></button>}
        </div>
        <div className="flex justify-end border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={() => setDateModalOpen(false)} className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600"><span>Close</span></button>
        </div>
      </dialog>}
    </div>;
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
    setBoard(current => ({
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
    boardColumns.forEach(column => {
      const foundTask = board[column.id].find(task => task.id === draggingTaskId);
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
    setBoard(current => ({
      todo: current.todo.filter(task => task.id !== draggingTaskId),
      progress: current.progress.filter(task => task.id !== draggingTaskId),
      done: current.done.filter(task => task.id !== draggingTaskId),
      [targetColumn]: [...current[targetColumn], movingTask]
    }));
    setDraggingTaskId(null);
    setDragOverColumn(null);
  };
  return <div className="space-y-7">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700"><span>Kanban workspace</span></p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950"><span>My Todo Board</span></h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500"><span>Move tasks from intention to momentum, then close the loop when the work is finished.</span></p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3" aria-label="Todo kanban board">
        {boardColumns.map(column => <article key={column.id} onDragOver={event => {
        event.preventDefault();
        setDragOverColumn(column.id);
      }} onDragLeave={() => setDragOverColumn(null)} onDrop={event => {
        event.preventDefault();
        moveTask(column.id);
      }} className={`min-h-[420px] rounded-2xl border bg-white p-4 shadow-sm transition ${dragOverColumn === column.id ? 'border-blue-300 ring-4 ring-blue-100' : 'border-slate-200'}`}>
          <div className={`mb-4 flex items-center justify-between rounded-xl px-4 py-3 ${column.headerClass}`}>
            <div className="flex items-center gap-2"><h3 className="font-semibold"><span>{column.title}</span></h3><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${column.countClass}`}><span>{board[column.id].length}</span></span></div>
            {column.id === 'todo' && <button type="button" onClick={() => setAddTodoOpen(true)} className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-800 shadow-sm hover:bg-blue-50"><span>+ Add</span></button>}
          </div>
          <div className="space-y-3">
            {board[column.id].length === 0 && <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500"><span>{column.emptyText}</span></p>}
            {board[column.id].map(task => <div key={task.id} draggable onDragStart={event => {
            setDraggingTaskId(task.id);
            event.dataTransfer.effectAllowed = 'move';
          }} onDragEnd={() => {
            setDraggingTaskId(null);
            setDragOverColumn(null);
          }} className={`group rounded-xl border p-4 shadow-sm transition hover:-rotate-1 hover:shadow-lg ${draggingTaskId === task.id ? 'rotate-1 opacity-60 shadow-xl' : ''} ${column.id === 'progress' ? 'border-l-4 border-l-blue-600 bg-white' : column.id === 'done' ? 'border-green-100 bg-green-50' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-start gap-3">
                <GripVertical size={17} className="mt-1 shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100" aria-label="Drag task" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className={`font-semibold text-gray-900 ${column.id === 'done' ? 'line-through decoration-green-700/70' : ''}`}><span>{task.title}</span></h4>
                    {column.id === 'done' && <CheckCircle2 size={18} className="shrink-0 text-green-600" aria-label="Task complete" />}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500"><span>{task.details}</span></p>
                  <time className="mt-4 block text-right text-xs font-medium text-gray-400"><span>{task.createdDate}</span></time>
                </div>
              </div>
            </div>)}
            {dragOverColumn === column.id && draggingTaskId && <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-5 text-center text-xs font-bold uppercase tracking-wide text-blue-600"><span>Drop here</span></div>}
          </div>
        </article>)}
      </section>

      {addTodoOpen && <dialog open aria-labelledby="add-new-todo-title" className="fixed inset-0 z-50 m-auto w-[min(400px,calc(100%-32px))] rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/30">
        <form className="space-y-4 p-6" onSubmit={event => {
        event.preventDefault();
        addTodo();
      }}>
          <div className="flex items-center justify-between gap-4">
            <h2 id="add-new-todo-title" className="text-xl font-semibold text-slate-950"><span>Add New Todo</span></h2>
            <button type="button" onClick={() => setAddTodoOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close add new todo"><X size={19} /></button>
          </div>
          <label className="block text-sm font-semibold text-slate-700"><span>Todo Name</span><input required value={todoName} onChange={event => setTodoName(event.target.value)} placeholder="What do you need to do?" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100" /></label>
          <label className="block text-sm font-semibold text-slate-700"><span>Details</span><textarea rows={3} value={todoDetails} onChange={event => setTodoDetails(event.target.value)} placeholder="Add any details or notes..." className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100" /></label>
          <button type="submit" className="w-full rounded-xl bg-blue-800 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-900"><span>Add Todo</span></button>
          <button type="button" onClick={() => setAddTodoOpen(false)} className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200"><span>Cancel</span></button>
        </form>
      </dialog>}
    </div>;
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
  const progressPercent = Math.round(answeredCount / examQuestions.length * 100);
  const score = useMemo(() => examQuestions.reduce((total, question) => answers[question.id] === question.correct ? total + 1 : total, 0), [answers]);
  const skipped = examQuestions.length - answeredCount;
  const wrong = answeredCount - score;
  useEffect(() => {
    const interval = window.setInterval(() => {
      setUpcomingSeconds(current => Math.max(current - 1, 0));
      setExamSeconds(current => mode === 'exam' ? Math.max(current - 1, 0) : current);
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
  return <div className="space-y-7">
      {mode === 'default' && <div className="space-y-7">
        <section className="grid gap-5 xl:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 border-l-4 border-l-blue-800 bg-white p-6 shadow-sm">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-wide text-blue-800"><span>UPCOMING</span></span>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950"><span>Physics Chapter 1-3 MCQ Test</span></h2>
                <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-slate-600"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Physics</span><span>20 Questions</span><span>15 min time limit</span></div>
              </div>
              <div className="text-left xl:text-right">
                <p className="text-sm font-semibold text-slate-500"><span>Starts in</span></p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-red-600"><span>{formatCountdown(upcomingSeconds)}</span></p>
                <button type="button" disabled className="mt-4 rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-500"><span>Join Exam</span></button>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 border-l-4 border-l-green-500 bg-white p-6 shadow-sm ring-1 ring-green-100">
            <span className="inline-flex animate-pulse rounded-full bg-green-100 px-3 py-1 text-xs font-bold tracking-wide text-green-700"><span>LIVE NOW</span></span>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950"><span>Physics Chapter 1-3 MCQ Test</span></h2>
                <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-slate-600"><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">Physics</span><span>20 Questions</span><span>15 min time limit</span></div>
              </div>
              <button type="button" onClick={() => setMode('exam')} className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-700"><span>Start Exam</span></button>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-950"><span>Exam History</span></h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-400"><tr><th className="py-3"><span>Exam Name</span></th><th><span>Subject</span></th><th><span>Date</span></th><th><span>Score</span></th><th><span>%</span></th><th><span>Result</span></th></tr></thead>
              <tbody className="divide-y divide-slate-100">{examHistory.map(item => <tr key={item.id}><td className="py-4 font-semibold text-slate-900"><span>{item.name}</span></td><td><span>{item.subject}</span></td><td><span>{item.date}</span></td><td><span>{item.score}</span></td><td><span>{item.percentage}</span></td><td><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.result === 'Passed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}><span>{item.result}</span></span></td></tr>)}</tbody>
            </table>
          </div>
          <div className="mt-5 flex items-center justify-between text-sm font-medium text-slate-500"><span>Page 1 of 2</span><div className="flex gap-2"><button className="rounded-lg border border-slate-200 px-3 py-2 text-slate-400"><span>Prev</span></button><button className="rounded-lg border border-slate-200 px-3 py-2 text-blue-800"><span>Next</span></button></div></div>
        </section>
      </div>}

      {mode === 'exam' && <div className="space-y-6 pb-24">
        <header className="sticky top-[76px] z-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-slate-950"><span>Physics Chapter 1-3 MCQ Test</span></h2>
            <p className="text-sm font-bold text-slate-500"><span>Question {currentQuestion} of 20</span></p>
            <p className="rounded-xl bg-red-50 px-4 py-2 text-2xl font-semibold text-red-600"><span>{formatExamTimer(examSeconds)}</span></p>
          </div>
          <div className="h-1.5 bg-slate-100"><div className="h-full bg-teal-600 transition-all" style={{
            width: `${progressPercent}%`
          }} /></div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div className="space-y-8">
            {examQuestions.map(question => {
            const selectedAnswer = answers[question.id];
            return <article key={question.id} onMouseEnter={() => setCurrentQuestion(question.number)} className={`border-b border-slate-100 pb-8 last:border-b-0 last:pb-0 ${selectedAnswer ? '' : 'border-l-4 border-l-yellow-300 pl-4'}`}>
                <div className="flex items-start gap-4">
                  <span className="rounded-full bg-blue-800 px-3 py-1 text-sm font-bold text-white"><span>Q{question.number}</span></span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium leading-7 text-gray-900"><span>{question.text}</span></h3>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {question.options.map(option => {
                      const isSelected = selectedAnswer === option.id;
                      return <label key={`${question.id}-${option.id}`} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${isSelected ? 'border-blue-700 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200'}`}>
                          <input type="radio" name={question.id} checked={isSelected} onChange={() => setAnswers(current => ({
                          ...current,
                          [question.id]: option.id
                        }))} className="sr-only" />
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isSelected ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'}`}><span>{option.id}</span></span>
                          <span className="text-sm font-medium leading-5 text-slate-700">{option.text}</span>
                        </label>;
                    })}
                    </div>
                  </div>
                </div>
              </article>;
          })}
          </div>
        </section>

        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 px-5 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur md:left-[220px]">
          <div className="mx-auto flex max-w-[1450px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm font-medium text-gray-500"><span>{answeredCount} of 20 answered</span></p>
            <div className="flex flex-wrap justify-center gap-2">{examQuestions.map(question => <button key={`jump-${question.id}`} type="button" onClick={() => setCurrentQuestion(question.number)} className={`h-3 w-3 rounded-full border ${currentQuestion === question.number ? 'border-blue-800 bg-white' : answers[question.id] ? 'border-blue-800 bg-blue-800' : 'border-slate-300 bg-slate-300'}`} aria-label={`Jump to question ${question.number}`} />)}</div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {submitWarning && <div className="flex flex-wrap items-center gap-2 rounded-xl bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-800"><CircleAlert size={16} /><span>You have {unansweredCount} unanswered questions. Submit anyway?</span><button type="button" onClick={() => setMode('result')} className="rounded-lg bg-yellow-500 px-3 py-1 text-xs font-bold text-white"><span>Confirm</span></button><button type="button" onClick={() => setSubmitWarning(false)} className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-yellow-800"><span>Cancel</span></button></div>}
              <button type="button" onClick={submitExam} className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-700"><span>Submit Exam</span></button>
            </div>
          </div>
        </div>
      </div>}

      {mode === 'result' && <div className="space-y-7">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Trophy className="mx-auto text-amber-500" size={58} aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-semibold text-slate-950"><span>Physics Chapter 1-3 MCQ Test</span></h2>
          <p className="mt-4 text-6xl font-bold tracking-tight text-blue-800"><span>16 / 20</span></p>
          <div className="mt-4 flex justify-center gap-2"><span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700"><span>80%</span></span><span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700"><span>Passed</span></span></div>
          <p className="mt-3 text-sm font-medium text-slate-500"><span>Completed in 11m 42s</span></p>
        </section>
        <section className="grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-blue-50 p-5 text-center"><p className="text-xs font-bold uppercase tracking-wide text-blue-700"><span>Obtained</span></p><p className="mt-1 text-3xl font-semibold text-blue-800"><span>16</span></p></div>
          <div className="rounded-2xl bg-green-50 p-5 text-center"><p className="text-xs font-bold uppercase tracking-wide text-green-700"><span>Correct</span></p><p className="mt-1 text-3xl font-semibold text-green-700"><span>{score}</span></p></div>
          <div className="rounded-2xl bg-red-50 p-5 text-center"><p className="text-xs font-bold uppercase tracking-wide text-red-700"><span>Wrong</span></p><p className="mt-1 text-3xl font-semibold text-red-700"><span>{wrong}</span></p></div>
          <div className="rounded-2xl bg-slate-50 p-5 text-center"><p className="text-xs font-bold uppercase tracking-wide text-slate-500"><span>Skipped</span></p><p className="mt-1 text-3xl font-semibold text-slate-700"><span>{skipped}</span></p></div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold text-slate-950"><span>Review Answers</span></h2><button type="button" onClick={() => setReviewOpen(!reviewOpen)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-blue-800"><span>{reviewOpen ? 'Hide' : 'Show'}</span></button></div>
          {reviewOpen && <div className="mt-5 space-y-4">{examQuestions.map(question => {
            const selectedAnswer = answers[question.id];
            const isCorrect = selectedAnswer === question.correct;
            const selectedText = question.options.find(option => option.id === selectedAnswer)?.text;
            const correctText = question.options.find(option => option.id === question.correct)?.text;
            return <article key={`review-${question.id}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start gap-3"><span className="text-xl" aria-hidden="true">{!selectedAnswer ? '⬜' : isCorrect ? '✅' : '❌'}</span><div className="min-w-0 flex-1"><h3 className="font-semibold text-slate-900"><span>Q{question.number}. {question.text}</span></h3>{selectedAnswer ? <p className={`mt-3 rounded-xl px-3 py-2 text-sm font-semibold ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}><span>Your answer: {selectedAnswer}. {selectedText}</span></p> : <p className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-500"><span>Skipped</span></p>}{selectedAnswer && !isCorrect && <p className="mt-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-700"><span>Correct answer: {question.correct}. {correctText}</span></p>}</div></div>
            </article>;
          })}</div>}
        </section>
        <div className="flex justify-center"><button type="button" onClick={() => {
          setMode('default');
          setSubmitWarning(false);
        }} className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-800 shadow-sm hover:bg-blue-50"><span>Back to Exams</span></button></div>
      </div>}
    </div>;
};


**Student portal**
import { useState } from 'react';
import { ArrowRight, Bell, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, ClipboardCheck, Clock, CreditCard, Edit3, FileText, Flame, Folder, GripVertical, Grid2X2, Landmark, List, LockKeyhole, Mail, Menu, MoreHorizontal, Phone, Plus, Search, ShieldCheck, Smartphone, Star, Trash2, Trophy, Upload, X } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { AttendanceGauge } from './AttendanceGauge';
import { ExamPanel, ProgressTrackPanel, TodoBoardPanel } from './PortalSections';
type PortalTab = 'dashboard' | 'resources' | 'payments' | 'progress' | 'todo' | 'exam';
type ScheduleOption = 'Today' | 'This Week' | 'This Month';
interface CalendarDay {
  day: number;
  kind: 'onsite' | 'online' | '';
}
interface NoticeItem {
  title: string;
  date: string;
  text: string;
}
interface ResourceItem {
  name: string;
  count: string;
  color: string;
  detail: string;
}
interface PaymentClassDate {
  id: string;
  label: string;
}
type StudentPaymentStatus = 'Completed' | 'Due' | 'In Progress';
interface StudentPaymentCycle {
  id: string;
  title: string;
  status: StudentPaymentStatus;
  dates: PaymentClassDate[];
  completedCount: number;
  totalCount: number;
  paidOn?: string;
  cycleLabel: string;
}
interface BankPaymentField {
  id: string;
  label: string;
  value: string;
}
interface MfsPaymentMethod {
  id: string;
  name: string;
  number: string;
  tone: string;
  iconTone: string;
}
interface NavItem {
  id: PortalTab;
  label: string;
}
interface StatCard {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: string;
}
interface TodayTask {
  id: string;
  title: string;
  subject: string;
  duration: string;
  completed: boolean;
  pill: string;
}
interface WeeklyPoint {
  day: string;
  value: number;
  x: number;
  y: number;
}
interface HistoryTask {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  progress: string;
}
interface BoardTask {
  id: string;
  title: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  progress?: number;
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
const calendarDays: CalendarDay[] = [{
  day: 1,
  kind: 'onsite'
}, {
  day: 2,
  kind: 'online'
}, {
  day: 3,
  kind: ''
}, {
  day: 4,
  kind: ''
}, {
  day: 5,
  kind: 'onsite'
}, {
  day: 6,
  kind: ''
}, {
  day: 7,
  kind: ''
}, {
  day: 8,
  kind: 'online'
}, {
  day: 9,
  kind: 'onsite'
}, {
  day: 10,
  kind: ''
}, {
  day: 11,
  kind: ''
}, {
  day: 12,
  kind: 'onsite'
}, {
  day: 13,
  kind: ''
}, {
  day: 14,
  kind: ''
}, {
  day: 15,
  kind: 'online'
}, {
  day: 16,
  kind: ''
}, {
  day: 17,
  kind: 'onsite'
}, {
  day: 18,
  kind: ''
}, {
  day: 19,
  kind: ''
}, {
  day: 20,
  kind: 'onsite'
}, {
  day: 21,
  kind: ''
}, {
  day: 22,
  kind: 'online'
}, {
  day: 23,
  kind: ''
}, {
  day: 24,
  kind: ''
}, {
  day: 25,
  kind: 'onsite'
}, {
  day: 26,
  kind: ''
}, {
  day: 27,
  kind: ''
}, {
  day: 28,
  kind: ''
}, {
  day: 29,
  kind: 'onsite'
}, {
  day: 30,
  kind: ''
}, {
  day: 31,
  kind: ''
}];
const weekDays = [{
  id: 'sun',
  label: 'Sun'
}, {
  id: 'mon',
  label: 'Mon'
}, {
  id: 'tue',
  label: 'Tue'
}, {
  id: 'wed',
  label: 'Wed'
}, {
  id: 'thu',
  label: 'Thu'
}, {
  id: 'fri',
  label: 'Fri'
}, {
  id: 'sat',
  label: 'Sat'
}];
const notices: NoticeItem[] = [{
  title: 'Mid-cycle assessment schedule',
  date: '28 Jan 2025',
  text: 'Your upcoming assessment will be held during the regular class slot. Please bring your calculator.'
}, {
  title: 'New ICT resources available',
  date: '26 Jan 2025',
  text: 'Chapter 04 notes and practice materials are now available in the Resources section.'
}, {
  title: 'Campus closed on 21 February',
  date: '23 Jan 2025',
  text: 'All onsite classes will move online for Language Martyrs’ Day. Your link will be shared soon.'
}, {
  title: 'Payment reminder for Cycle #1',
  date: '20 Jan 2025',
  text: 'A gentle reminder to clear your pending cycle payment to keep your enrollment active.'
}, {
  title: 'Welcome to the January cycle',
  date: '15 Jan 2025',
  text: 'We are excited to learn with you. Check your dashboard regularly for updates and notices.'
}];
const resources: ResourceItem[] = [{
  name: 'Physics',
  count: '18 files',
  color: 'bg-blue-50 text-blue-700',
  detail: 'Mechanics, waves & optics'
}, {
  name: 'Chemistry',
  count: '24 files',
  color: 'bg-teal-50 text-teal-700',
  detail: 'Organic & physical chemistry'
}, {
  name: 'ICT',
  count: '12 files',
  color: 'bg-indigo-50 text-indigo-700',
  detail: 'Programming & databases'
}, {
  name: 'Biology',
  count: '15 files',
  color: 'bg-emerald-50 text-emerald-700',
  detail: 'Cell biology & genetics'
}, {
  name: 'Math',
  count: '21 files',
  color: 'bg-amber-50 text-amber-700',
  detail: 'Algebra, trigonometry & calculus'
}, {
  name: 'Model Tests',
  count: '9 files',
  color: 'bg-rose-50 text-rose-700',
  detail: 'Timed practice sets'
}];
const studentPaymentCycles: StudentPaymentCycle[] = [{
  id: 'cycle-1-due',
  title: '1st Month',
  status: 'Due',
  dates: [{
    id: 'jan-01',
    label: '1 Jan'
  }, {
    id: 'jan-04',
    label: '4 Jan'
  }, {
    id: 'jan-08',
    label: '8 Jan'
  }, {
    id: 'jan-12',
    label: '12 Jan'
  }, {
    id: 'jan-16',
    label: '16 Jan'
  }, {
    id: 'jan-17',
    label: '17 Jan'
  }, {
    id: 'jan-18',
    label: '18 Jan'
  }, {
    id: 'jan-19',
    label: '19 Jan'
  }],
  completedCount: 8,
  totalCount: 8,
  cycleLabel: 'Cycle 1'
}, {
  id: 'cycle-2-progress',
  title: '2nd Month',
  status: 'In Progress',
  dates: [{
    id: 'jan-21',
    label: '21 Jan'
  }, {
    id: 'jan-23',
    label: '23 Jan'
  }, {
    id: 'jan-25',
    label: '25 Jan'
  }, {
    id: 'jan-26',
    label: '26 Jan'
  }, {
    id: 'jan-28',
    label: '28 Jan'
  }, {
    id: 'jan-30',
    label: '30 Jan'
  }],
  completedCount: 6,
  totalCount: 8,
  cycleLabel: 'Cycle 2'
}, {
  id: 'cycle-0-completed',
  title: '1st Month',
  status: 'Completed',
  dates: [{
    id: 'dec-03',
    label: '3 Dec'
  }, {
    id: 'dec-05',
    label: '5 Dec'
  }, {
    id: 'dec-08',
    label: '8 Dec'
  }, {
    id: 'dec-10',
    label: '10 Dec'
  }, {
    id: 'dec-14',
    label: '14 Dec'
  }, {
    id: 'dec-17',
    label: '17 Dec'
  }, {
    id: 'dec-20',
    label: '20 Dec'
  }, {
    id: 'dec-22',
    label: '22 Dec'
  }],
  completedCount: 8,
  totalCount: 8,
  paidOn: '28 Dec 2024',
  cycleLabel: 'Cycle 0'
}];
const bankPaymentFields: BankPaymentField[] = [{
  id: 'account-name',
  label: 'Account Name',
  value: 'Md. Rashedul Hasan'
}, {
  id: 'bank-name',
  label: 'Bank Name',
  value: 'Dutch-Bangla Bank Ltd.'
}, {
  id: 'account-number',
  label: 'Account Number',
  value: '1234 5678 9012'
}, {
  id: 'branch',
  label: 'Branch',
  value: 'Mirpur Branch'
}, {
  id: 'swift-code',
  label: 'Swift Code',
  value: 'DBBLBDDH'
}, {
  id: 'routing',
  label: 'Routing',
  value: '090261234'
}];
const mfsPaymentMethods: MfsPaymentMethod[] = [{
  id: 'bkash',
  name: 'bKash',
  number: '+880 1XXX-XXXXXX',
  tone: 'border-pink-100 bg-pink-50/50',
  iconTone: 'bg-pink-500 text-white'
}, {
  id: 'nagad',
  name: 'Nagad',
  number: '+880 1XXX-XXXXXX',
  tone: 'border-orange-100 bg-orange-50/50',
  iconTone: 'bg-orange-500 text-white'
}, {
  id: 'rocket',
  name: 'Rocket',
  number: '+880 1XXX-XXXXXX',
  tone: 'border-purple-100 bg-purple-50/50',
  iconTone: 'bg-purple-600 text-white'
}, {
  id: 'taptap',
  name: 'Taptap',
  number: '+880 1XXX-XXXXXX',
  tone: 'border-blue-100 bg-blue-50/50',
  iconTone: 'bg-blue-600 text-white'
}];
const navItems: NavItem[] = [{
  id: 'dashboard',
  label: 'Dashboard'
}, {
  id: 'resources',
  label: 'Resources'
}, {
  id: 'payments',
  label: 'Payment'
}, {
  id: 'progress',
  label: 'Progress Track'
}, {
  id: 'todo',
  label: 'Todo'
}, {
  id: 'exam',
  label: 'Exam'
}];
const overviewStats: StatCard[] = [{
  id: 'today',
  label: "Today's Tasks",
  value: '3/5',
  detail: 'completed',
  tone: 'bg-blue-50 text-blue-800'
}, {
  id: 'weekly',
  label: 'Weekly Progress',
  value: '68%',
  detail: 'task completion',
  tone: 'bg-teal-50 text-teal-800'
}, {
  id: 'streak',
  label: 'Current Streak',
  value: '4 days',
  detail: 'keep going',
  tone: 'bg-orange-50 text-orange-700'
}, {
  id: 'completed',
  label: 'Total Completed',
  value: '47',
  detail: 'tasks finished',
  tone: 'bg-emerald-50 text-emerald-800'
}];
const todayTasks: TodayTask[] = [{
  id: 'read-physics',
  title: 'Read Chapter 5',
  subject: 'Physics',
  duration: '30 min',
  completed: true,
  pill: 'bg-blue-50 text-blue-700'
}, {
  id: 'math-problems',
  title: 'Solve 10 math problems',
  subject: 'Math',
  duration: '45 min',
  completed: true,
  pill: 'bg-indigo-50 text-indigo-700'
}, {
  id: 'chemistry-lecture',
  title: 'Watch chemistry lecture',
  subject: 'Chemistry',
  duration: '1 hr',
  completed: false,
  pill: 'bg-teal-50 text-teal-700'
}, {
  id: 'biology-notes',
  title: 'Revise biology notes',
  subject: 'Biology',
  duration: '20 min',
  completed: false,
  pill: 'bg-emerald-50 text-emerald-700'
}, {
  id: 'ict-exercises',
  title: 'Practice ICT exercises',
  subject: 'ICT',
  duration: '30 min',
  completed: false,
  pill: 'bg-sky-50 text-sky-700'
}];
const weeklyPoints: WeeklyPoint[] = [{
  day: 'Mon',
  value: 40,
  x: 70,
  y: 146
}, {
  day: 'Tue',
  value: 60,
  x: 155,
  y: 114
}, {
  day: 'Wed',
  value: 55,
  x: 240,
  y: 122
}, {
  day: 'Thu',
  value: 80,
  x: 325,
  y: 82
}, {
  day: 'Fri',
  value: 70,
  x: 410,
  y: 98
}, {
  day: 'Sat',
  value: 90,
  x: 495,
  y: 66
}, {
  day: 'Sun',
  value: 68,
  x: 580,
  y: 101
}];
const historyTasks: HistoryTask[] = [{
  id: 'h-physics',
  title: 'Complete vector practice',
  subject: 'Physics',
  dueDate: '04 Feb',
  status: 'Completed',
  progress: '100%'
}, {
  id: 'h-chemistry',
  title: 'Organic reaction worksheet',
  subject: 'Chemistry',
  dueDate: '05 Feb',
  status: 'In Progress',
  progress: '72%'
}, {
  id: 'h-math',
  title: 'Algebra revision set',
  subject: 'Math',
  dueDate: '06 Feb',
  status: 'In Progress',
  progress: '48%'
}, {
  id: 'h-biology',
  title: 'Cell diagram labeling',
  subject: 'Biology',
  dueDate: '07 Feb',
  status: 'Upcoming',
  progress: '0%'
}, {
  id: 'h-ict',
  title: 'Database normalization notes',
  subject: 'ICT',
  dueDate: '08 Feb',
  status: 'Upcoming',
  progress: '0%'
}];
const todoTasks: BoardTask[] = [{
  id: 'todo-physics',
  title: 'Complete Physics assignment',
  subject: 'Physics',
  priority: 'High',
  dueDate: 'Today'
}, {
  id: 'todo-syllabus',
  title: 'Read HSC syllabus',
  subject: 'General',
  priority: 'Low',
  dueDate: '06 Feb'
}, {
  id: 'todo-chemistry',
  title: 'Make chemistry flashcards',
  subject: 'Chemistry',
  priority: 'Medium',
  dueDate: '07 Feb'
}];
const inProgressTasks: BoardTask[] = [{
  id: 'progress-motion',
  title: 'Chapter 6 — Motion notes',
  subject: 'Physics',
  priority: 'High',
  dueDate: 'Tomorrow',
  progress: 62
}, {
  id: 'progress-mcq',
  title: 'Practice MCQ set #3',
  subject: 'Math',
  priority: 'Medium',
  dueDate: '08 Feb',
  progress: 38
}];
const doneTasks: BoardTask[] = [{
  id: 'done-revise',
  title: 'Revise Chapter 1-3',
  subject: 'Physics',
  priority: 'Low',
  dueDate: 'Done'
}, {
  id: 'done-biology',
  title: 'Watch biology video',
  subject: 'Biology',
  priority: 'Medium',
  dueDate: 'Done'
}];
const examHistory: ExamHistoryItem[] = [{
  id: 'exam-physics',
  name: 'Physics Ch 1-3 MCQ',
  subject: 'Physics',
  date: '15 Jan 2025',
  score: '16/20',
  percentage: '80%',
  result: 'Passed'
}, {
  id: 'exam-chemistry',
  name: 'Chemistry Basics',
  subject: 'Chemistry',
  date: '8 Jan 2025',
  score: '11/20',
  percentage: '55%',
  result: 'Passed'
}, {
  id: 'exam-math',
  name: 'Math Algebra Test',
  subject: 'Math',
  date: '2 Jan 2025',
  score: '7/20',
  percentage: '35%',
  result: 'Failed'
}];
const questionDots = [{
  id: 'q1',
  state: 'done'
}, {
  id: 'q2',
  state: 'done'
}, {
  id: 'q3',
  state: 'done'
}, {
  id: 'q4',
  state: 'done'
}, {
  id: 'q5',
  state: 'current'
}, {
  id: 'q6',
  state: 'next'
}, {
  id: 'q7',
  state: 'next'
}, {
  id: 'q8',
  state: 'next'
}, {
  id: 'q9',
  state: 'next'
}, {
  id: 'q10',
  state: 'next'
}, {
  id: 'q11',
  state: 'next'
}, {
  id: 'q12',
  state: 'next'
}, {
  id: 'q13',
  state: 'next'
}, {
  id: 'q14',
  state: 'next'
}, {
  id: 'q15',
  state: 'next'
}, {
  id: 'q16',
  state: 'next'
}, {
  id: 'q17',
  state: 'next'
}, {
  id: 'q18',
  state: 'next'
}, {
  id: 'q19',
  state: 'next'
}, {
  id: 'q20',
  state: 'next'
}];
const priorityStyles = {
  High: 'bg-red-500',
  Medium: 'bg-amber-400',
  Low: 'bg-emerald-500'
};
const MaleAvatar = ({
  size = 'h-10 w-10'
}: {
  size?: string;
}) => <span className={`${size} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-700`} aria-label="Student profile avatar">
    <svg viewBox="0 0 48 48" className="h-full w-full" role="img" aria-label="Male student avatar">
      <circle cx="24" cy="24" r="24" fill="#dbeafe" /><path d="M12 43c1.9-8.1 6.4-12 12-12s10.1 3.9 12 12" fill="#1e40af" /><circle cx="24" cy="21" r="8" fill="#f4c7a1" /><path d="M16 20c.4-8.5 4.2-11.5 9.4-11.5 5.1 0 8.2 3.8 7.5 9.2-3.3-2.7-7.7-3.6-12.9-2.2z" fill="#334155" /><path d="M21 24.5c2 1.4 4 1.4 6 0" fill="none" stroke="#9a5d43" strokeWidth="1.2" strokeLinecap="round" /></svg>
  </span>;
export const StudentPortal = () => {
  const [tab, setTab] = useState<PortalTab>('exam');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(true);
  const [addTodoOpen, setAddTodoOpen] = useState(true);
  const [schedule, setSchedule] = useState<ScheduleOption>('This Week');
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  return <div className="student-shell min-h-screen bg-[#F9FAFB] text-slate-900">
      <AppSidebar userRole="student" activeItem={tab} onNavigate={item => {
      if (item === 'dashboard' || item === 'resources' || item === 'payments' || item === 'progress' || item === 'todo' || item === 'exam') setTab(item);
    }} />
      <div className="min-h-screen md:pl-[220px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 shadow-sm backdrop-blur md:px-9">
          <div className="flex items-center gap-3"><button className="rounded-lg p-2 text-slate-500 md:hidden" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={21} /></button><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-700">RHTacademy</p><h1 className="text-xl font-bold tracking-tight text-slate-900">Student Portal</h1></div></div>
          <div className="flex items-center gap-5"><div className="relative"><button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-800" aria-label="Notifications"><Bell size={20} /><span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">2</span></button>{notificationsOpen && <div className="absolute right-0 top-12 w-[310px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold">Notifications</h2><button className="text-xs font-semibold text-blue-700 hover:underline">Mark all read</button></div><div className="space-y-1"><div className="flex gap-3 rounded-xl p-3 hover:bg-slate-50"><span className="rounded-lg bg-red-50 p-2 text-red-600"><CircleAlert size={16} /></span><div><p className="text-xs font-semibold">Payment due reminder</p><p className="mt-1 text-xs leading-4 text-slate-500">Cycle #1 payment is waiting.</p><time className="mt-1 block text-[11px] text-slate-400">2 hours ago</time></div></div><div className="flex gap-3 rounded-xl p-3 hover:bg-slate-50"><span className="rounded-lg bg-blue-50 p-2 text-blue-700"><FileText size={16} /></span><div><p className="text-xs font-semibold">New resource uploaded</p><p className="mt-1 text-xs leading-4 text-slate-500">ICT Chapter 04 is ready to view.</p><time className="mt-1 block text-[11px] text-slate-400">Yesterday</time></div></div></div></div>}</div><button onClick={() => setProfileOpen(true)} className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2" aria-label="Open profile"><MaleAvatar /><span className="hidden text-left md:block"><strong className="block text-sm">Arif Hasan</strong><span className="block text-[11px] text-slate-500">Class 11 · Science</span></span></button></div>
        </header>
        {mobileNav && <div className="fixed inset-0 z-30 bg-slate-900/20 md:hidden"><div className="h-full w-72 bg-white p-5 shadow-xl"><button onClick={() => setMobileNav(false)} aria-label="Close navigation" className="mb-5 rounded p-2"><X size={20} /></button><p className="font-bold">Navigation</p><nav className="mt-5 space-y-2">{navItems.map(item => <button key={item.id} onClick={() => {
              setTab(item.id);
              setMobileNav(false);
            }} className={`block w-full rounded-lg p-3 text-left font-semibold ${tab === item.id ? 'bg-teal-50 text-teal-800' : 'text-slate-600'}`}>{item.label}</button>)}</nav></div></div>}

        <main className="mx-auto max-w-[1450px] px-5 py-7 md:px-9 lg:px-12">
          <section className="mb-8 flex flex-wrap items-end justify-between gap-5" aria-label="Page overview">
            <div>
              <p className="mb-2 text-sm font-semibold text-teal-700">Tuesday, 04 February 2025</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Good morning, Arif.</h2>
              <p className="mt-2 text-sm text-slate-500">Here’s your learning snapshot for today.</p>
            </div>
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {navItems.map(item => <button key={item.id} onClick={() => setTab(item.id)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === item.id ? 'bg-blue-800 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>{item.label}</button>)}
            </div>
          </section>

          {tab === 'dashboard' && <div className="space-y-7"><section className="flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="rounded-full bg-white p-2.5 text-red-600 shadow-sm"><CircleAlert size={21} /></span><div><h3 className="font-semibold text-red-900">Pending payment due</h3><p className="text-sm text-red-700">You have a pending payment due. Please complete your payment.</p></div></div><button onClick={() => setTab('payments')} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700">View Payment</button></section><section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]"><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-7"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Class track</p><h3 className="mt-1 text-xl font-semibold">January 2025</h3></div><button className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" aria-label="Search calendar"><Search size={17} /></button></div><div className="mb-4 grid grid-cols-7 text-center text-xs font-bold uppercase text-slate-400">{weekDays.map(day => <span key={day.id}>{day.label}</span>)}</div><div className="grid grid-cols-7 gap-y-3 text-center">{calendarDays.map(item => <span key={item.day} className="mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50"><span>{item.day}</span><span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${item.kind === 'onsite' ? 'bg-emerald-500' : item.kind === 'online' ? 'bg-sky-400' : 'bg-transparent'}`} /></span>)}</div><div className="mt-7 flex flex-wrap gap-5 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-600"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Onsite</span><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-sky-400" />Online</span></div></article><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-7"><AttendanceGauge completed={5} total={8} label="Classes Completed" size={190} /><div className="mt-6 flex w-full items-center justify-between border-t border-slate-100 pt-4"><div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current cycle</p><p className="mt-1 text-sm font-semibold text-slate-700">Jan 2025 – Feb 2025</p></div><span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">DUE</span></div></article></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-7"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Stay informed</p><h3 className="mt-1 text-xl font-semibold">Notice Board</h3></div><button className="text-sm font-semibold text-blue-800 hover:underline">View all</button></div><div className="grid gap-3">{notices.map(notice => <article key={notice.title} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-white hover:shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-semibold text-slate-800">{notice.title}</h4><time className="text-xs font-medium text-slate-400">{notice.date}</time></div><p className="mt-1 max-w-3xl text-sm leading-5 text-slate-500">{notice.text}</p><button className="mt-3 text-xs font-bold text-blue-800 hover:underline">Read More <span aria-hidden="true">→</span></button></article>)}</div><div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-xs font-semibold text-slate-500">Page 1 of 3</span><div className="flex gap-2"><button className="rounded-lg border border-slate-200 p-2 text-slate-400" aria-label="Previous page"><ChevronLeft size={16} /></button><button className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50" aria-label="Next page"><ChevronRight size={16} /></button></div></div></section></div>}

          {tab === 'resources' && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"><div className="mb-7 flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Your materials</p><h2 className="mt-1 text-2xl font-semibold">Resources</h2><p className="mt-1 text-sm text-slate-500">Everything you need for your current cycle, arranged like a calm study drive.</p></div><div className="flex rounded-lg border border-slate-200 p-1"><button className="rounded bg-blue-50 p-2 text-blue-800 shadow-sm" aria-label="Grid view"><Grid2X2 size={17} /></button><button className="rounded p-2 text-slate-400" aria-label="List view"><List size={17} /></button></div></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{resources.map(resource => <article key={resource.name} className="rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className={`mb-7 inline-flex rounded-xl p-3 ${resource.color}`}><Folder size={25} /></div><h3 className="text-lg font-semibold">{resource.name}</h3><p className="mt-1 text-sm text-slate-500">{resource.detail}</p><div className="mt-6 flex items-center justify-between"><span className="text-xs font-semibold text-slate-400">{resource.count}</span><button className="rounded-lg bg-blue-800 px-4 py-2 text-xs font-bold text-white hover:bg-blue-900">Open folder</button></div></article>)}</div><div className="mt-7 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center"><Folder className="mx-auto text-slate-300" size={34} /><h3 className="mt-3 font-semibold text-slate-800">No shared exam packs yet</h3><p className="mt-1 text-sm text-slate-500">Your teacher’s next upload will appear here with a clear subject label.</p></div></section>}

          {tab === 'payments' && <div className="space-y-8"><section aria-labelledby="payment-overview-title" className="space-y-5"><div><h2 id="payment-overview-title" className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl"><span>Payment Overview</span></h2><p className="mt-1 text-sm font-medium text-gray-500"><span>Your class payment cycles based on attendance</span></p></div>{studentPaymentCycles.length === 0 ? <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm"><CalendarDays className="mx-auto text-gray-300" size={58} aria-hidden="true" /><h3 className="mt-5 text-lg font-semibold text-gray-900"><span>No payment cycles yet</span></h3><p className="mx-auto mt-2 max-w-md text-sm text-gray-500"><span>Your payment cycles will appear here once your attendance is recorded.</span></p></div> : <div className="space-y-4">{studentPaymentCycles.map(cycle => <article key={cycle.id} className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${cycle.status === 'Completed' ? 'border-l-[4px] border-l-[#16A34A]' : cycle.status === 'Due' ? 'border-l-[4px] border-l-[#DC2626]' : 'border-l-[4px] border-l-[#94A3B8]'}`}><div className="flex items-start justify-between gap-4"><h3 className="text-base font-semibold text-gray-900"><span>{cycle.title}</span></h3><span className={`rounded-full px-3 py-1 text-xs font-semibold ${cycle.status === 'Completed' ? 'bg-green-100 text-green-700' : cycle.status === 'Due' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}><span>{cycle.status}</span></span></div><div className="mt-5"><p className="text-xs font-semibold uppercase tracking-wide text-gray-400"><span>Taken Classes</span></p><div className="mt-3 flex flex-wrap gap-2">{cycle.dates.map(date => <span key={`${cycle.id}-${date.id}`} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"><span>{date.label}</span></span>)}</div><p className="mt-3 text-sm text-gray-500"><span>{cycle.completedCount} of {cycle.totalCount} classes completed</span></p></div><div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between"><div>{cycle.status === 'Completed' && <p className="inline-flex items-center gap-2 text-sm font-medium text-green-600"><Check size={16} aria-hidden="true" /><span>Paid on: {cycle.paidOn}</span></p>}{cycle.status === 'Due' && <p className="inline-flex items-center gap-2 text-sm font-medium text-red-500"><CircleAlert size={16} aria-hidden="true" /><span>Payment due. Please contact admin.</span></p>}{cycle.status === 'In Progress' && <p className="text-sm font-medium text-gray-400"><span>Cycle in progress…</span></p>}</div><span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"><span>{cycle.cycleLabel}</span></span></div></article>)}</div>}</section><section aria-labelledby="payment-details-title" className="space-y-5"><div className="border-b border-slate-200 pb-4"><h2 id="payment-details-title" className="text-xl font-semibold text-slate-900"><span>Payment Details</span></h2><p className="mt-1 text-sm text-slate-500"><span>Make your payment using the following methods</span></p></div><article className="rounded-xl border border-slate-200 border-l-[4px] border-l-blue-600 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700"><Landmark size={21} aria-hidden="true" /></span><h3 className="text-base font-semibold text-slate-900"><span>Bank Transfer</span></h3></div><dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{bankPaymentFields.map(field => <div key={field.id} className="space-y-1"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400"><span>{field.label}</span></dt><dd className="text-sm font-semibold text-slate-900"><span>{field.value}</span></dd></div>)}</dl></article><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{mfsPaymentMethods.map(method => <article key={method.id} className={`rounded-xl border p-4 shadow-sm ${method.tone}`}><div className="flex items-center gap-3"><span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${method.iconTone}`}><Smartphone size={18} aria-hidden="true" /></span><div><h3 className="font-semibold text-slate-900"><span>{method.name}</span></h3><p className="mt-0.5 text-sm font-medium text-slate-500"><span>{method.number}</span></p></div></div></article>)}</div></section></div>}

          {tab === 'progress' && <ProgressTrackPanel />}

          {tab === 'todo' && <TodoBoardPanel />}

          {tab === 'exam' && <ExamPanel />}
        </main>
      </div>

      {profileOpen && <dialog open aria-labelledby="profile-title" className="fixed inset-0 z-40 m-auto max-h-[calc(100vh-32px)] w-[min(680px,calc(100%-32px))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/30"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Account settings</p><h2 id="profile-title" className="mt-1 text-xl font-bold">My profile</h2></div><button onClick={() => setProfileOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close profile"><X size={19} /></button></div><form className="space-y-5 p-6" onSubmit={event => event.preventDefault()}><div className="flex items-center gap-4"><div className="relative"><MaleAvatar size="h-20 w-20" /><button className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-blue-800 p-1.5 text-white" aria-label="Upload avatar"><Upload size={13} /></button></div><div><h3 className="font-bold">Profile photo</h3><p className="mt-1 text-xs text-slate-500">JPG or PNG, max 2MB.</p></div></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Name<input defaultValue="Arif Hasan" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100" /></label><label className="text-sm font-semibold">Class<select defaultValue="Class 11 — Science" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700"><option>Class 11 — Science</option><option>Class 12 — Science</option></select></label><label className="text-sm font-semibold">Institute<input defaultValue="RHT Academy" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700" /></label><label className="text-sm font-semibold">Phone<div className="relative mt-2"><Phone size={15} className="absolute left-3 top-3 text-slate-400" /><input defaultValue="+880 1712 345678" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-normal outline-none focus:border-blue-700" /></div></label></div><label className="block text-sm font-semibold">Email<div className="mt-2 flex gap-2"><div className="relative flex-1"><Mail size={15} className="absolute left-3 top-3 text-slate-400" /><input defaultValue="arif.hasan@email.com" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-normal outline-none focus:border-blue-700" /></div><button type="button" onClick={() => setOtpSent(true)} className="whitespace-nowrap rounded-lg border border-blue-200 px-3 text-xs font-bold text-blue-800 hover:bg-blue-50">Send OTP to change</button></div></label><div className="border-t border-slate-100 pt-5"><div className="mb-3 flex items-center gap-2"><LockKeyhole size={17} className="text-blue-800" /><h3 className="font-bold">Change password</h3></div><div className="grid gap-3 sm:grid-cols-2"><input type="password" placeholder="Current password" aria-label="Current password" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-700" /><input type="password" placeholder="New password" aria-label="New password" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-700" /></div>{otpSent && <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-xs font-medium text-blue-800"><ShieldCheck size={16} /><span>OTP sent. Enter the 6-digit code from your email to verify sensitive changes.</span><input maxLength={6} aria-label="OTP verification code" placeholder="000000" className="ml-auto w-20 rounded border border-blue-200 bg-white px-2 py-1.5 text-center" /></div>}</div><div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={() => setProfileOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button><button type="submit" onClick={() => setProfileOpen(false)} className="rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-900">Save changes</button></div></form></dialog>}
    </div>;
};