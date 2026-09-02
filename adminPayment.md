import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, Bell, Building2, Check, ChevronLeft, ChevronRight, Edit3, Eye, FilePlus, FileText, Folder, FolderOpen, FolderPlus, Globe2, Grid3X3, Image as ImageIcon, Inbox, Landmark, Link2, List, Mail, Pause, Phone, Plus, Search, Share2, Trash2, Upload, UserRound, Users, X } from 'lucide-react';
import { AppSidebar, type AdminSection } from './AppSidebar';
type RequestFilter = 'All' | 'Registration' | 'Booking' | 'Contact';
type ViewMode = 'list' | 'grid';
type StudentTab = 'Profile' | 'Attendance' | 'Resource Share' | 'Sent Notice' | 'Payment' | 'Action';
type LandingTab = 'About Me' | 'Service Card' | 'Booking Schedule';
type PaymentCycleSize = '8 Classes' | '12 Classes';
type ClassMark = 'Onsite' | 'Online' | 'Not Taken';
type CycleStatus = 'Due' | 'Completed' | 'In Progress';
type Student = {
  id: string;
  initials: string;
  name: string;
  className: string;
  institute: string;
  email: string;
  phone: string;
  gender: string;
  createdAt: string;
  status: 'Active' | 'Paused';
  tone: string;
};
type RequestRow = {
  id: string;
  type: 'Registration' | 'Booking' | 'Contact';
  name: string;
  email: string;
  phone: string;
  date: string;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'Refused' | 'Contacted';
  detail: string;
};
type Notice = {
  id: string;
  title: string;
  date: string;
  description: string;
};
type PaymentCycle = {
  id: string;
  title: string;
  dates: CompletedAttendanceDate[];
  status: CycleStatus;
  paidDate: string;
  limit: number;
  isComplete: boolean;
};
type CompletedAttendanceDate = {
  id: string;
  label: string;
};
type AttendanceRecord = {
  id: string;
  date: string;
  type: 'Onsite' | 'Online';
};
type ResourceFolder = {
  id: string;
  name: string;
  createdDate: string;
};
type SharedResource = {
  id: string;
  title: string;
  subject: string;
  link: string;
  note: string;
  thumbnailUrl: string;
  folderId: string | null;
  createdDate: string;
};
type ResourceFormState = {
  title: string;
  subject: string;
  folderId: string;
  driveLink: string;
  thumbnailUrl: string;
  note: string;
};
type LandingNavItem = {
  id: LandingTab;
  label: string;
};
type ServiceCard = {
  id: string;
  title: string;
  badge: string;
  badgeTone: string;
  description: string;
  subjects: ServiceSubject[];
};
type ServiceSubject = {
  id: string;
  name: string;
};
type BookingTimeSlot = {
  id: string;
  day: string;
  time: string;
};
const requestFilters: RequestFilter[] = ['All', 'Registration', 'Booking', 'Contact'];
const studentTabs: StudentTab[] = ['Profile', 'Attendance', 'Resource Share', 'Sent Notice', 'Payment', 'Action'];
const landingTabs: LandingNavItem[] = [{
  id: 'About Me',
  label: 'About Me'
}, {
  id: 'Service Card',
  label: 'Service Card'
}, {
  id: 'Booking Schedule',
  label: 'Booking Schedule'
}];
const weekdays = [{
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
const students: Student[] = [{
  id: 's1',
  initials: 'AR',
  name: 'Amelia Rodriguez',
  className: 'HSC Physics',
  institute: 'Northbridge Academy',
  email: 'amelia.rodriguez@mail.com',
  phone: '+880 1712 442 019',
  gender: 'Female',
  createdAt: '12 Mar 2024',
  status: 'Active',
  tone: 'bg-blue-100 text-blue-800'
}, {
  id: 's2',
  initials: 'JW',
  name: 'James Wilson',
  className: 'SSC Mathematics',
  institute: 'Westfield College',
  email: 'james.wilson@mail.com',
  phone: '+880 1811 786 230',
  gender: 'Male',
  createdAt: '19 Mar 2024',
  status: 'Active',
  tone: 'bg-teal-100 text-teal-800'
}, {
  id: 's3',
  initials: 'SK',
  name: 'Sofia Kim',
  className: 'HSC Chemistry',
  institute: 'Riverside Institute',
  email: 'sofia.kim@mail.com',
  phone: '+880 1618 092 553',
  gender: 'Female',
  createdAt: '02 Apr 2024',
  status: 'Paused',
  tone: 'bg-violet-100 text-violet-800'
}, {
  id: 's4',
  initials: 'DM',
  name: 'Daniel Martins',
  className: 'SSC Biology',
  institute: 'Oakmont University',
  email: 'daniel.martins@mail.com',
  phone: '+880 1913 505 880',
  gender: 'Male',
  createdAt: '17 Apr 2024',
  status: 'Active',
  tone: 'bg-amber-100 text-amber-800'
}, {
  id: 's5',
  initials: 'MP',
  name: 'Mia Patel',
  className: 'HSC Mathematics',
  institute: 'Central Scholars',
  email: 'mia.patel@mail.com',
  phone: '+880 1533 711 621',
  gender: 'Female',
  createdAt: '28 Apr 2024',
  status: 'Active',
  tone: 'bg-rose-100 text-rose-800'
}];
const latestRequests: RequestRow[] = [{
  id: 'r1',
  type: 'Registration',
  name: 'Liam Thompson',
  email: 'liam.t@example.com',
  phone: '+880 1710 555 182',
  date: 'Jun 18, 2024',
  timestamp: '12 minutes ago',
  status: 'Pending',
  detail: 'Interested in HSC Physics batch'
}, {
  id: 'r2',
  type: 'Booking',
  name: 'Grace Okafor',
  email: 'grace.o@example.com',
  phone: '+880 1812 555 430',
  date: 'Jun 18, 2024',
  timestamp: '38 minutes ago',
  status: 'Pending',
  detail: 'Subject: Chemistry · Slot: Tue 4:30 PM'
}, {
  id: 'r3',
  type: 'Contact',
  name: 'Henry Davis',
  email: 'henry.d@example.com',
  phone: '+880 1617 555 812',
  date: 'Jun 18, 2024',
  timestamp: '1 hour ago',
  status: 'Pending',
  detail: 'Could you share details about available evening classes and admission requirements?'
}];
const historyRows: RequestRow[] = [{
  id: 'h1',
  type: 'Registration',
  name: 'Olivia Chen',
  email: 'olivia.c@example.com',
  phone: '+880 1711 551 300',
  date: 'Jun 17, 2024',
  timestamp: 'Yesterday',
  status: 'Approved',
  detail: 'HSC Biology'
}, {
  id: 'h2',
  type: 'Booking',
  name: 'Noah Williams',
  email: 'noah.w@example.com',
  phone: '+880 1813 222 734',
  date: 'Jun 16, 2024',
  timestamp: '2 days ago',
  status: 'Contacted',
  detail: 'SSC math consultation'
}, {
  id: 'h3',
  type: 'Contact',
  name: 'Ava Rahman',
  email: 'ava.r@example.com',
  phone: '+880 1516 819 022',
  date: 'Jun 15, 2024',
  timestamp: '3 days ago',
  status: 'Pending',
  detail: 'Schedule query'
}, {
  id: 'h4',
  type: 'Registration',
  name: 'Ethan Brooks',
  email: 'ethan.b@example.com',
  phone: '+880 1917 620 410',
  date: 'Jun 14, 2024',
  timestamp: '4 days ago',
  status: 'Refused',
  detail: 'Batch full'
}, {
  id: 'h5',
  type: 'Booking',
  name: 'Nora Islam',
  email: 'nora.i@example.com',
  phone: '+880 1522 908 114',
  date: 'Jun 12, 2024',
  timestamp: '6 days ago',
  status: 'Contacted',
  detail: 'HSC admission call'
}];
const attendanceRecords: AttendanceRecord[] = [{
  id: 'a1',
  date: '03 Jun 2024',
  type: 'Onsite'
}, {
  id: 'a2',
  date: '05 Jun 2024',
  type: 'Online'
}, {
  id: 'a3',
  date: '10 Jun 2024',
  type: 'Onsite'
}, {
  id: 'a4',
  date: '12 Jun 2024',
  type: 'Online'
}];
const completedAttendanceDates: CompletedAttendanceDate[] = [{
  id: 'att-jan-01',
  label: '1 Jan'
}, {
  id: 'att-jan-04',
  label: '4 Jan'
}, {
  id: 'att-jan-08',
  label: '8 Jan'
}, {
  id: 'att-jan-12',
  label: '12 Jan'
}, {
  id: 'att-jan-16',
  label: '16 Jan'
}, {
  id: 'att-jan-17',
  label: '17 Jan'
}, {
  id: 'att-jan-18',
  label: '18 Jan'
}, {
  id: 'att-jan-19',
  label: '19 Jan'
}, {
  id: 'att-jan-21',
  label: '21 Jan'
}, {
  id: 'att-jan-23',
  label: '23 Jan'
}, {
  id: 'att-jan-25',
  label: '25 Jan'
}, {
  id: 'att-jan-26',
  label: '26 Jan'
}, {
  id: 'att-jan-28',
  label: '28 Jan'
}, {
  id: 'att-jan-30',
  label: '30 Jan'
}];
const ordinalMonthTitle = (value: number) => {
  const modTen = value % 10;
  const modHundred = value % 100;
  const suffix = modTen === 1 && modHundred !== 11 ? 'st' : modTen === 2 && modHundred !== 12 ? 'nd' : modTen === 3 && modHundred !== 13 ? 'rd' : 'th';
  return `${value}${suffix} Month`;
};
const formatPaidDate = (value: string) => {
  if (!value) {
    return '';
  }
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};
const paymentCycleTone = (status: CycleStatus) => {
  if (status === 'Completed') {
    return {
      border: 'border-l-4 border-l-emerald-500',
      badge: 'bg-emerald-600 text-white ring-emerald-600',
      action: 'border-red-200 text-red-700 hover:bg-red-50'
    };
  }
  if (status === 'Due') {
    return {
      border: 'border-l-4 border-l-red-500',
      badge: 'bg-red-600 text-white ring-red-600',
      action: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
    };
  }
  return {
    border: 'border-l-4 border-l-slate-300',
    badge: 'bg-slate-500 text-white ring-slate-500',
    action: 'border-slate-200 text-slate-400'
  };
};
const calendarMarkers = [{
  id: 'd03',
  day: 3,
  type: 'Onsite'
}, {
  id: 'd05',
  day: 5,
  type: 'Online'
}, {
  id: 'd10',
  day: 10,
  type: 'Onsite'
}, {
  id: 'd12',
  day: 12,
  type: 'Online'
}, {
  id: 'd17',
  day: 17,
  type: 'Onsite'
}, {
  id: 'd19',
  day: 19,
  type: 'Online'
}, {
  id: 'd24',
  day: 24,
  type: 'Onsite'
}, {
  id: 'd26',
  day: 26,
  type: 'Onsite'
}];
const initialResourceFolders: ResourceFolder[] = [{
  id: 'folder-physics',
  name: 'Physics',
  createdDate: '18 Jun 2024'
}, {
  id: 'folder-chemistry',
  name: 'Chemistry',
  createdDate: '17 Jun 2024'
}, {
  id: 'folder-mathematics',
  name: 'Mathematics',
  createdDate: '16 Jun 2024'
}];
const initialSharedResources: SharedResource[] = [{
  id: 'resource-general-notes',
  title: 'SSC General Notes',
  subject: 'General',
  link: 'https://drive.google.com/general-notes',
  note: 'A concise starter pack of formulas, exam reminders, and revision prompts.',
  thumbnailUrl: '',
  folderId: null,
  createdDate: '18 Jun 2024'
}, {
  id: 'resource-motion',
  title: 'Chapter 1 - Motion',
  subject: 'Physics',
  link: 'https://drive.google.com/chapter-1-motion',
  note: 'Motion graphs, solved examples, and class practice problems for the week.',
  thumbnailUrl: '',
  folderId: 'folder-physics',
  createdDate: '17 Jun 2024'
}, {
  id: 'resource-force',
  title: 'Chapter 2 - Force',
  subject: 'Physics',
  link: 'https://drive.google.com/chapter-2-force',
  note: 'Force diagrams and short answer preparation with answer keys included.',
  thumbnailUrl: '',
  folderId: 'folder-physics',
  createdDate: '16 Jun 2024'
}];
const emptyResourceForm: ResourceFormState = {
  title: '',
  subject: '',
  folderId: 'root',
  driveLink: '',
  thumbnailUrl: '',
  note: ''
};
const subjectPill = (subject: string) => {
  if (subject.toLowerCase().includes('physics')) {
    return 'bg-blue-50 text-blue-700 ring-blue-100';
  }
  if (subject.toLowerCase().includes('chem')) {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
  }
  if (subject.toLowerCase().includes('math')) {
    return 'bg-violet-50 text-violet-700 ring-violet-100';
  }
  return 'bg-slate-100 text-slate-700 ring-slate-200';
};
const initialNotices: Notice[] = [{
  id: 'n1',
  title: 'Bring calculator for model test',
  date: '18 Jun 2024',
  description: 'Please bring a scientific calculator and your previous worksheet for the upcoming model test review session.'
}, {
  id: 'n2',
  title: 'Schedule adjusted for Eid week',
  date: '14 Jun 2024',
  description: 'Your Thursday class will move to Saturday morning this week. The online link will be sent one hour before class.'
}, {
  id: 'n3',
  title: 'New resources shared',
  date: '10 Jun 2024',
  description: 'A new folder containing vector notes, board questions, and answer keys has been shared in your resource area.'
}];
const trackerDays = [{
  id: 'td1',
  date: '18 Jun 2024'
}, {
  id: 'td2',
  date: '19 Jun 2024'
}, {
  id: 'td3',
  date: '20 Jun 2024'
}, {
  id: 'td4',
  date: '21 Jun 2024'
}];
const initialServiceCards: ServiceCard[] = [{
  id: 'service-ssc',
  title: 'SSC',
  badge: 'Secondary',
  badgeTone: 'bg-blue-50 text-blue-700 ring-blue-100',
  description: 'Master the fundamentals of science with expert-led sessions designed to build strong conceptual clarity and exam confidence for SSC students.',
  subjects: [{
    id: 'subject-ssc-physics',
    name: 'Physics'
  }, {
    id: 'subject-ssc-chemistry',
    name: 'Chemistry'
  }, {
    id: 'subject-ssc-biology',
    name: 'Biology'
  }, {
    id: 'subject-ssc-math',
    name: 'Math'
  }]
}, {
  id: 'service-hsc',
  title: 'HSC',
  badge: 'Higher Secondary',
  badgeTone: 'bg-teal-50 text-teal-700 ring-teal-100',
  description: 'Elevate your understanding with advanced, structured coaching that sharpens analytical thinking and prepares you thoroughly for HSC board examinations.',
  subjects: [{
    id: 'subject-hsc-physics',
    name: 'Physics'
  }, {
    id: 'subject-hsc-chemistry',
    name: 'Chemistry'
  }, {
    id: 'subject-hsc-ict',
    name: 'ICT'
  }]
}];
const emptyServiceCard: ServiceCard = {
  id: 'service-draft',
  title: '',
  badge: '',
  badgeTone: 'bg-blue-50 text-blue-700 ring-blue-100',
  description: '',
  subjects: []
};
const previewServiceCard: ServiceCard = {
  ...emptyServiceCard,
  subjects: [{
    id: 'subject-preview-physics',
    name: 'Physics'
  }, {
    id: 'subject-preview-chemistry',
    name: 'Chemistry'
  }, {
    id: 'subject-preview-biology',
    name: 'Biology'
  }]
};
const initialBookingSlots: BookingTimeSlot[] = [{
  id: 'slot-friday-saturday',
  day: 'Friday, Saturday',
  time: '4:00 PM to 5:00 PM'
}, {
  id: 'slot-sunday',
  day: 'Sunday',
  time: '10:00 AM to 11:30 AM'
}];
const statusBadge = (status: string) => {
  if (status === 'Approved' || status === 'Active' || status === 'Completed') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  }
  if (status === 'Refused' || status === 'Due') {
    return 'bg-red-50 text-red-700 ring-red-200';
  }
  if (status === 'Contacted') {
    return 'bg-blue-50 text-blue-700 ring-blue-200';
  }
  if (status === 'Paused') {
    return 'bg-amber-50 text-amber-700 ring-amber-200';
  }
  return 'bg-yellow-50 text-yellow-700 ring-yellow-200';
};
export const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('landing');
  const [requestFilter, setRequestFilter] = useState<RequestFilter>('All');
  const [studentView, setStudentView] = useState<ViewMode>('list');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0]);
  const [detailOpen, setDetailOpen] = useState(true);
  const [studentTab, setStudentTab] = useState<StudentTab>('Profile');
  const [notice, setNotice] = useState('');
  const [attendanceFormOpen, setAttendanceFormOpen] = useState(false);
  const [newResourceOpen, setNewResourceOpen] = useState(false);
  const [resourceView, setResourceView] = useState<ViewMode>('grid');
  const [resourceFolders, setResourceFolders] = useState<ResourceFolder[]>(initialResourceFolders);
  const [sharedResources, setSharedResources] = useState<SharedResource[]>(initialSharedResources);
  const [activeResourceFolderId, setActiveResourceFolderId] = useState<string | null>(null);
  const [createFolderOpen, setCreateFolderOpen] = useState(true);
  const [newFolderName, setNewFolderName] = useState('New Folder');
  const [newResourceForm, setNewResourceForm] = useState<ResourceFormState>(emptyResourceForm);
  const [resourceToast, setResourceToast] = useState('');
  const [pendingDeleteResourceId, setPendingDeleteResourceId] = useState('');
  const newFolderInputRef = useRef<HTMLInputElement>(null);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [expandedNotice, setExpandedNotice] = useState('n1');
  const [cycleSize, setCycleSize] = useState<PaymentCycleSize>('8 Classes');
  const [paymentAlert, setPaymentAlert] = useState(true);
  const [cyclePaymentStatuses, setCyclePaymentStatuses] = useState<Record<string, CycleStatus>>({
    'cycle-8-1': 'Due'
  });
  const [cyclePaidDates, setCyclePaidDates] = useState<Record<string, string>>({});
  const [cyclePaymentDraftDates, setCyclePaymentDraftDates] = useState<Record<string, string>>({
    'cycle-8-1': '2025-01-20'
  });
  const [pendingPaymentCycleId, setPendingPaymentCycleId] = useState('');
  const [cycleAlerts, setCycleAlerts] = useState<Record<string, boolean>>({
    'cycle-8-1': true
  });
  const [accountPaused, setAccountPaused] = useState(false);
  const [deletePreview, setDeletePreview] = useState(true);
  const [trackerDate, setTrackerDate] = useState('18 Jun 2024');
  const [classMarks, setClassMarks] = useState<Record<string, ClassMark>>({
    s1: 'Onsite',
    s2: 'Online',
    s3: 'Not Taken',
    s4: 'Onsite',
    s5: 'Online'
  });
  const [landingTab, setLandingTab] = useState<LandingTab>('Service Card');
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>(initialServiceCards);
  const [editingServiceCardId, setEditingServiceCardId] = useState('');
  const [pendingServiceCardDeleteId, setPendingServiceCardDeleteId] = useState('');
  const [newServiceCardOpen, setNewServiceCardOpen] = useState(true);
  const [newServiceCard, setNewServiceCard] = useState<ServiceCard>(previewServiceCard);
  const [newServiceSubjectDraft, setNewServiceSubjectDraft] = useState('');
  const [serviceSubjectDrafts, setServiceSubjectDrafts] = useState<Record<string, string>>({});
  const [availableSeats, setAvailableSeats] = useState(1);
  const [bookingSlots, setBookingSlots] = useState<BookingTimeSlot[]>(initialBookingSlots);
  const filteredStudents = useMemo(() => students.filter(student => `${student.name} ${student.className} ${student.institute}`.toLowerCase().includes(studentSearch.toLowerCase())), [studentSearch]);
  const activeResourceFolder = resourceFolders.find(folder => folder.id === activeResourceFolderId);
  const rootResources = sharedResources.filter(resource => resource.folderId === null);
  const folderResources = sharedResources.filter(resource => resource.folderId === activeResourceFolderId);
  const displayedResources = activeResourceFolder ? folderResources : rootResources;
  const title = activeSection === 'requests' ? 'Requests Hub' : activeSection === 'students' ? 'Student Management' : activeSection === 'attendance' ? 'Attendance Tracker' : activeSection === 'payments' ? 'Payment Methods' : 'Landing Page Controls';
  const presentCount = Object.values(classMarks).filter(mark => mark !== 'Not Taken').length;
  const onlineCount = Object.values(classMarks).filter(mark => mark === 'Online').length;
  const onsiteCount = Object.values(classMarks).filter(mark => mark === 'Onsite').length;
  const paymentCycleLength = cycleSize === '8 Classes' ? 8 : 12;
  const generatedPaymentCycles = useMemo<PaymentCycle[]>(() => {
    const cycleGroups: PaymentCycle[] = [];
    for (let start = 0; start < completedAttendanceDates.length; start += paymentCycleLength) {
      const cycleIndex = Math.floor(start / paymentCycleLength) + 1;
      const id = `cycle-${paymentCycleLength}-${cycleIndex}`;
      const dates = completedAttendanceDates.slice(start, start + paymentCycleLength);
      const isComplete = dates.length === paymentCycleLength;
      const savedStatus = cyclePaymentStatuses[id];
      const status: CycleStatus = isComplete ? savedStatus ?? 'Due' : 'In Progress';
      cycleGroups.push({
        id,
        title: ordinalMonthTitle(cycleIndex),
        dates,
        status,
        paidDate: cyclePaidDates[id] ?? '',
        limit: paymentCycleLength,
        isComplete
      });
    }
    return cycleGroups.reverse();
  }, [cyclePaymentStatuses, cyclePaidDates, paymentCycleLength]);
  const markCyclePaid = (cycle: PaymentCycle) => {
    const receivedDate = cyclePaymentDraftDates[cycle.id] || '2025-01-20';
    setCyclePaymentStatuses(current => ({
      ...current,
      [cycle.id]: 'Completed'
    }));
    setCyclePaidDates(current => ({
      ...current,
      [cycle.id]: receivedDate
    }));
    setPendingPaymentCycleId('');
    setNotice(`${cycle.title} marked as paid.`);
  };
  const markCycleDue = (cycle: PaymentCycle) => {
    setCyclePaymentStatuses(current => ({
      ...current,
      [cycle.id]: 'Due'
    }));
    setCyclePaidDates(current => ({
      ...current,
      [cycle.id]: ''
    }));
    setPendingPaymentCycleId('');
    setNotice(`${cycle.title} marked as due.`);
  };
  const navigateTo = (section: AdminSection) => {
    setActiveSection(section);
    if (section === 'students') {
      setDetailOpen(true);
      setStudentTab('Profile');
    }
  };
  const selectStudent = (student: Student) => {
    setSelectedStudent(student);
    setDetailOpen(true);
    setStudentTab('Profile');
  };
  useEffect(() => {
    if (createFolderOpen) {
      window.setTimeout(() => {
        newFolderInputRef.current?.focus();
        newFolderInputRef.current?.select();
      }, 0);
    }
  }, [createFolderOpen]);
  const openResourceModal = () => {
    setNewResourceForm({
      ...emptyResourceForm,
      folderId: activeResourceFolderId ?? 'root'
    });
    setNewResourceOpen(true);
  };
  const createResourceFolder = () => {
    const trimmedName = newFolderName.trim();
    if (!trimmedName) {
      return;
    }
    setResourceFolders(current => [{
      id: `folder-${Date.now()}`,
      name: trimmedName,
      createdDate: 'Today'
    }, ...current]);
    setNewFolderName('New Folder');
    setCreateFolderOpen(false);
  };
  const shareResource = () => {
    const targetFolderId = newResourceForm.folderId === 'root' ? null : newResourceForm.folderId;
    setSharedResources(current => [{
      id: `resource-${Date.now()}`,
      title: newResourceForm.title || 'Untitled Resource',
      subject: newResourceForm.subject || 'General',
      link: newResourceForm.driveLink || 'https://drive.google.com/',
      note: newResourceForm.note || 'No note added yet.',
      thumbnailUrl: newResourceForm.thumbnailUrl,
      folderId: targetFolderId,
      createdDate: 'Today'
    }, ...current]);
    setNewResourceOpen(false);
    setResourceToast('Resource shared successfully! Student has been notified.');
    window.setTimeout(() => setResourceToast(''), 3000);
  };
  const folderPath = (folderId: string | null) => {
    const folder = resourceFolders.find(item => item.id === folderId);
    return folder ? folder.name : 'Root';
  };
  const updateServiceCard = (cardId: string, updates: Partial<ServiceCard>) => {
    setServiceCards(current => current.map(card => card.id === cardId ? {
      ...card,
      ...updates
    } : card));
  };
  const addSubjectToCard = (cardId: string) => {
    const nextSubject = serviceSubjectDrafts[cardId]?.replace(/,$/, '').trim();
    if (!nextSubject) {
      return;
    }
    setServiceCards(current => current.map(card => card.id === cardId && !card.subjects.some(subject => subject.name.toLowerCase() === nextSubject.toLowerCase()) ? {
      ...card,
      subjects: [...card.subjects, {
        id: `subject-${cardId}-${Date.now()}`,
        name: nextSubject
      }]
    } : card));
    setServiceSubjectDrafts(current => ({
      ...current,
      [cardId]: ''
    }));
  };
  const removeSubjectFromCard = (cardId: string, subjectId: string) => {
    setServiceCards(current => current.map(card => card.id === cardId ? {
      ...card,
      subjects: card.subjects.filter(item => item.id !== subjectId)
    } : card));
  };
  const addSubjectToNewCard = () => {
    const nextSubject = newServiceSubjectDraft.replace(/,$/, '').trim();
    if (!nextSubject || newServiceCard.subjects.some(subject => subject.name.toLowerCase() === nextSubject.toLowerCase())) {
      return;
    }
    setNewServiceCard(current => ({
      ...current,
      subjects: [...current.subjects, {
        id: `subject-new-${Date.now()}`,
        name: nextSubject
      }]
    }));
    setNewServiceSubjectDraft('');
  };
  const createServiceCard = () => {
    const createdCard: ServiceCard = {
      ...newServiceCard,
      id: `service-${Date.now()}`,
      title: newServiceCard.title.trim() || 'New Service',
      badge: newServiceCard.badge.trim() || 'New',
      description: newServiceCard.description.trim() || 'Add a concise, student-facing description for this service card.',
      badgeTone: 'bg-blue-50 text-blue-700 ring-blue-100'
    };
    setServiceCards(current => [...current, createdCard]);
    setNewServiceCard(emptyServiceCard);
    setNewServiceSubjectDraft('');
    setNewServiceCardOpen(false);
    setNotice('Service card created.');
  };
  const updateBookingSlot = (slotId: string, updates: Partial<BookingTimeSlot>) => {
    setBookingSlots(current => current.map(slot => slot.id === slotId ? {
      ...slot,
      ...updates
    } : slot));
  };
  return <div className="min-h-screen bg-[#F9FAFB] font-sans text-slate-900">
      <AppSidebar activeSection={activeSection} onNavigate={navigateTo} onLogout={() => setNotice('Admin session closed safely.')} />

      <main className="min-h-screen lg:ml-[240px]">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0D9488]">
                <span>RHTacademy / Admin</span>
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                <span>{title}</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-2 pr-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E40AF] text-sm font-black text-white">
                <span>RH</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-900">
                  <span>Admin User</span>
                </p>
                <p className="text-xs font-medium text-slate-500">
                  <span>admin@rhtacademy.com</span>
                </p>
              </div>
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden" aria-label="Mobile admin sections">
            <button type="button" onClick={() => navigateTo('requests')} className={`rounded-full px-4 py-2 text-sm font-bold ${activeSection === 'requests' ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-700'}`}><span>Requests</span></button>
            <button type="button" onClick={() => navigateTo('students')} className={`rounded-full px-4 py-2 text-sm font-bold ${activeSection === 'students' ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-700'}`}><span>Students</span></button>
            <button type="button" onClick={() => navigateTo('attendance')} className={`rounded-full px-4 py-2 text-sm font-bold ${activeSection === 'attendance' ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-700'}`}><span>Attendance</span></button>
            <button type="button" onClick={() => navigateTo('payments')} className={`rounded-full px-4 py-2 text-sm font-bold ${activeSection === 'payments' ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-700'}`}><span>Payments</span></button>
            <button type="button" onClick={() => navigateTo('landing')} className={`rounded-full px-4 py-2 text-sm font-bold ${activeSection === 'landing' ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-700'}`}><span>Landing</span></button>
          </nav>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {notice && <div className="mb-5 flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800" role="status">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')} className="rounded-full p-1 hover:bg-teal-100">
                <X size={16} aria-hidden="true" />
              </button>
            </div>}

          {activeSection === 'requests' && <section aria-labelledby="requests-title" className="space-y-7">
              <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center">
                <div>
                  <h2 id="requests-title" className="text-2xl font-black tracking-tight text-slate-950"><span>Requests Hub</span></h2>
                  <p className="mt-1 text-sm text-slate-500"><span>Review new enquiries and admission conversations.</span></p>
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter requests">
                  {requestFilters.map(filter => <button key={filter} type="button" onClick={() => setRequestFilter(filter)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${requestFilter === filter ? 'bg-[#1E40AF] text-white shadow-sm' : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-white'}`}>
                      <span>{filter}</span>
                    </button>)}
                </div>
              </div>

              <section aria-labelledby="incoming-title">
                <h3 id="incoming-title" className="mb-4 text-lg font-black text-slate-950"><span>Latest Incoming</span></h3>
                {latestRequests.length > 0 ? <div className="grid gap-4 xl:grid-cols-3">
                    {latestRequests.map(request => <article key={request.id} className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${request.type === 'Registration' ? 'border-l-4 border-l-[#1E40AF]' : request.type === 'Booking' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-orange-400'}`}>
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" aria-label="New request" />
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${request.type === 'Registration' ? 'bg-blue-50 text-blue-700' : request.type === 'Booking' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>{request.type}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-400"><span>{request.timestamp}</span></p>
                        </div>
                        <h4 className="text-xl font-black text-slate-950"><span>{request.name}</span></h4>
                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                          <p className="flex items-center gap-2"><Mail size={15} aria-hidden="true" /><span>{request.email}</span></p>
                          <p className="flex items-center gap-2"><Phone size={15} aria-hidden="true" /><span>{request.phone}</span></p>
                          <p className="line-clamp-2 text-slate-500"><span>{request.detail}</span></p>
                        </div>
                        <div className="mt-5 flex gap-2">
                          {request.type === 'Registration' && <div className="flex w-full gap-2">
                              <button type="button" onClick={() => setNotice('Registration approved.')} className="flex-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-black text-white"><span>Confirm</span></button>
                              <button type="button" onClick={() => setNotice('Registration refused.')} className="flex-1 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-black text-red-600"><span>Refuse</span></button>
                            </div>}
                          {request.type === 'Booking' && <button type="button" onClick={() => setNotice('Booking marked as contacted.')} className="w-full rounded-xl bg-[#0D9488] px-3 py-2.5 text-sm font-black text-white"><span>Mark Contacted</span></button>}
                          {request.type === 'Contact' && <button type="button" onClick={() => setNotice('Full contact message opened.')} className="w-full rounded-xl bg-[#1E40AF] px-3 py-2.5 text-sm font-black text-white"><span>View Full</span></button>}
                        </div>
                      </article>)}
                  </div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                    <Inbox className="mx-auto text-slate-300" size={42} aria-hidden="true" />
                    <h4 className="mt-4 text-lg font-black text-slate-900"><span>No new requests at this time</span></h4>
                    <p className="mt-1 text-sm text-slate-500"><span>Fresh registration, booking, and contact requests will appear here.</span></p>
                  </div>}
              </section>

              <section aria-labelledby="history-title" className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h3 id="history-title" className="text-lg font-black"><span>History Table</span></h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Type</th><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status badge</th><th className="px-5 py-3">Action</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {historyRows.map(row => <tr key={row.id} className="hover:bg-slate-50/80"><td className="px-5 py-4 font-bold text-slate-700">{row.type}</td><td className="px-5 py-4 font-bold text-slate-950">{row.name}</td><td className="px-5 py-4 text-slate-500">{row.email}</td><td className="px-5 py-4 text-slate-500">{row.date}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusBadge(row.status)}`}>{row.status}</span></td><td className="px-5 py-4"><button type="button" className="font-black text-[#1E40AF] hover:underline"><span>View</span></button></td></tr>)}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4"><p className="text-xs font-semibold text-slate-500"><span>Showing 1–5 of 15 requests</span></p><nav className="flex items-center gap-1" aria-label="Request pagination"><button type="button" aria-label="Previous page" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><ChevronLeft size={16} /></button><button type="button" className="rounded-lg bg-[#1E40AF] px-3 py-1.5 text-sm font-black text-white"><span>1</span></button><button type="button" className="rounded-lg px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-100"><span>2</span></button><button type="button" className="rounded-lg px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-100"><span>3</span></button><span className="px-1 text-slate-400">…</span><button type="button" aria-label="Next page" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><ChevronRight size={16} /></button></nav></div>
              </section>
            </section>}

          {activeSection === 'students' && detailOpen && <section aria-labelledby="student-detail-title" className="space-y-5">
              <button type="button" onClick={() => setDetailOpen(false)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#1E40AF] shadow-sm hover:bg-blue-50">
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Back to Students</span>
              </button>
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className={`flex h-24 w-24 items-center justify-center rounded-full text-3xl font-black ${selectedStudent.tone}`}><span>{selectedStudent.initials}</span></div>
                    <div>
                      <h2 id="student-detail-title" className="text-3xl font-black tracking-tight text-slate-950"><span>{selectedStudent.name}</span></h2>
                      <p className="mt-1 text-sm font-bold text-slate-600"><span>{selectedStudent.className} · {selectedStudent.institute}</span></p>
                      <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500"><span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusBadge(accountPaused ? 'Paused' : selectedStudent.status)}`}>{accountPaused ? 'Paused' : selectedStudent.status}</span><span className="inline-flex items-center gap-1"><Mail size={14} />{selectedStudent.email}</span><span className="inline-flex items-center gap-1"><Phone size={14} />{selectedStudent.phone}</span></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 overflow-x-auto border-b border-slate-200">
                  <div className="flex min-w-max gap-1">
                    {studentTabs.map(tab => <button key={tab} type="button" onClick={() => setStudentTab(tab)} className={`border-b-2 px-4 py-3 text-sm font-black transition ${studentTab === tab ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-slate-500 hover:text-slate-950'}`}><span>{tab}</span></button>)}
                  </div>
                </div>

                <div className="pt-6">
                  {studentTab === 'Profile' && <div className="grid gap-6 lg:grid-cols-2">
                      <section aria-labelledby="original-profile" className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <h3 id="original-profile" className="text-lg font-black"><span>Original Student Profile</span></h3>
                        <dl className="mt-4 grid gap-3 text-sm">
                          <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500">Original Name</dt><dd className="font-bold text-slate-950">{selectedStudent.name}</dd></div>
                          <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500">Class</dt><dd className="font-bold text-slate-950">{selectedStudent.className}</dd></div>
                          <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500">Institute</dt><dd className="font-bold text-slate-950">{selectedStudent.institute}</dd></div>
                          <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500">Email</dt><dd className="font-bold text-slate-950">{selectedStudent.email}</dd></div>
                          <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500">Phone</dt><dd className="font-bold text-slate-950">{selectedStudent.phone}</dd></div>
                          <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500">Gender</dt><dd className="font-bold text-slate-950">{selectedStudent.gender}</dd></div>
                          <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500">Created At</dt><dd className="font-bold text-slate-950">{selectedStudent.createdAt}</dd></div>
                        </dl>
                      </section>
                      <form className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={event => {
                  event.preventDefault();
                  setNotice('Admin-only student view saved.');
                }}>
                        <h3 className="text-lg font-black"><span>Admin View Overrides</span></h3>
                        <div className="mt-4 space-y-4">
                          <label className="block text-sm font-black text-slate-700"><span>Custom Name</span><input defaultValue={selectedStudent.name} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-blue-200" /></label>
                          <label className="block text-sm font-black text-slate-700"><span>Custom Class</span><input defaultValue={selectedStudent.className} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-blue-200" /></label>
                          <label className="block text-sm font-black text-slate-700"><span>Custom Institute</span><input defaultValue={selectedStudent.institute} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-blue-200" /></label>
                        </div>
                        <p className="mt-4 rounded-2xl bg-blue-50 p-3 text-sm font-semibold text-blue-800"><span>These changes only affect your admin view and do not modify the student's actual profile.</span></p>
                        <button type="submit" className="mt-4 rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white"><span>Save Admin View</span></button>
                      </form>
                    </div>}

                  {studentTab === 'Attendance' && <div className="space-y-6">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h3 className="text-xl font-black"><span>June 2024 Attendance</span></h3><p className="text-sm text-slate-500"><span>Green marks onsite, sky-blue marks online.</span></p></div><button type="button" onClick={() => setAttendanceFormOpen(!attendanceFormOpen)} className="rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white"><span>Mark Attendance</span></button></div>
                      {attendanceFormOpen && <form className="grid gap-3 rounded-3xl border border-blue-100 bg-blue-50 p-4 sm:grid-cols-4" onSubmit={event => {
                  event.preventDefault();
                  setNotice('Attendance confirmed and payment count updated.');
                }}><label className="text-sm font-black text-slate-700"><span>Date</span><input type="date" className="mt-2 w-full rounded-xl border border-blue-100 px-3 py-2" /></label><div className="text-sm font-black text-slate-700"><span>Class Type</span><div className="mt-2 flex rounded-xl bg-white p-1"><button type="button" className="flex-1 rounded-lg bg-[#0D9488] px-3 py-2 text-white"><span>Onsite</span></button><button type="button" className="flex-1 rounded-lg px-3 py-2 text-slate-600"><span>Online</span></button></div></div><label className="text-sm font-black text-slate-700"><span>Schedule Time</span><input type="time" defaultValue="16:30" className="mt-2 w-full rounded-xl border border-blue-100 px-3 py-2" /></label><button type="submit" className="self-end rounded-xl bg-[#1E40AF] px-4 py-2.5 text-sm font-black text-white"><span>Confirm</span></button></form>}
                      <div className="grid grid-cols-7 overflow-hidden rounded-3xl border border-slate-200 bg-white text-center text-sm shadow-sm">
                        {weekdays.map(day => <div key={day.id} className="bg-slate-50 px-2 py-3 font-black text-slate-500"><span>{day.label}</span></div>)}
                        {Array.from({
                    length: 30
                  }, (_, day) => day + 1).map(day => {
                    const marker = calendarMarkers.find(item => item.day === day);
                    return <div key={`cal-${day}`} className="min-h-20 border-t border-slate-100 px-2 py-3"><span className="font-black text-slate-700">{day}</span>{marker && <span className={`mx-auto mt-2 block h-3 w-3 rounded-full ${marker.type === 'Onsite' ? 'bg-emerald-500' : 'bg-sky-400'}`} aria-label={marker.type} />}</div>;
                  })}
                      </div>
                      <div className="grid gap-3 lg:grid-cols-[1fr_280px]"><div className="rounded-3xl border border-slate-200 p-4"><h4 className="font-black"><span>Attendance history</span></h4><div className="mt-3 space-y-2">{attendanceRecords.map(record => <div key={record.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span className="font-bold text-slate-700">{record.date}</span><span className={`rounded-full px-2.5 py-1 text-xs font-black ${record.type === 'Onsite' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>{record.type} · Completed</span></div>)}</div></div><form onSubmit={event => {
                    event.preventDefault();
                    setNotice('Schedule time saved.');
                  }} className="rounded-3xl border border-slate-200 p-4"><h4 className="font-black"><span>Schedule Time</span></h4><input type="time" defaultValue="16:30" className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2" /><button type="submit" className="mt-3 w-full rounded-xl bg-[#0D9488] px-4 py-2.5 text-sm font-black text-white"><span>Set Schedule</span></button></form></div>
                    </div>}

                  {studentTab === 'Resource Share' && <div className="rounded-[28px] bg-[#F9FAFB] p-3 sm:p-5">
                      {resourceToast && <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 shadow-lg" role="status">
                          <span>{resourceToast}</span>
                        </div>}
                      <section aria-labelledby="resource-library-title" className="space-y-6">
                        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:flex-row xl:items-center xl:justify-between">
                          <nav aria-label="Resource breadcrumb" className="flex min-w-0 items-center gap-2 text-sm font-black text-slate-500">
                            <button type="button" onClick={() => setActiveResourceFolderId(null)} className="rounded-full px-2 py-1 text-[#1E40AF] hover:bg-blue-50">
                              <span>Resources</span>
                            </button>
                            {activeResourceFolder && <span className="text-slate-300">&gt;</span>}
                            {activeResourceFolder && <button type="button" onClick={() => setActiveResourceFolderId(null)} className="truncate rounded-full px-2 py-1 text-slate-900 hover:bg-slate-100">
                                <span>{activeResourceFolder.name}</span>
                              </button>}
                          </nav>
                          <div className="flex flex-wrap items-center gap-2">
                            <button type="button" onClick={() => setCreateFolderOpen(true)} className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-black text-[#1E40AF] shadow-sm hover:border-[#1E40AF] hover:bg-blue-50">
                              <FolderPlus size={17} aria-hidden="true" />
                              <span>New Folder</span>
                            </button>
                            <button type="button" onClick={openResourceModal} className="inline-flex items-center gap-2 rounded-2xl bg-[#1E40AF] px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-800">
                              <FilePlus size={17} aria-hidden="true" />
                              <span>New Resource</span>
                            </button>
                            <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1" role="group" aria-label="Resource view toggle">
                              <button type="button" aria-label="Show resources as list" onClick={() => setResourceView('list')} className={`rounded-xl p-2 ${resourceView === 'list' ? 'bg-[#0D9488] text-white shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>
                                <List size={17} aria-hidden="true" />
                              </button>
                              <button type="button" aria-label="Show resources as grid" onClick={() => setResourceView('grid')} className={`rounded-xl p-2 ${resourceView === 'grid' ? 'bg-[#0D9488] text-white shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>
                                <Grid3X3 size={17} aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 id="resource-library-title" className="text-2xl font-black tracking-tight text-slate-950"><span>Google Drive-style Library</span></h3>
                          <p className="mt-1 text-sm font-semibold text-slate-500"><span>Organize folders and student-facing resources without leaving this profile.</span></p>
                        </div>

                        {!activeResourceFolder && resourceView === 'grid' && <div className="space-y-7">
                            <section aria-labelledby="folders-heading">
                              <div className="mb-3 flex items-center gap-2">
                                <h4 id="folders-heading" className="text-sm font-black uppercase tracking-[0.18em] text-slate-500"><span>Folders</span></h4>
                                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200">{resourceFolders.length}</span>
                              </div>
                              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {resourceFolders.map(folder => <button key={folder.id} type="button" onClick={() => setActiveResourceFolderId(folder.id)} className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md">
                                    <Folder className="text-amber-400 transition group-hover:text-amber-500" size={40} aria-hidden="true" />
                                    <h5 className="mt-5 text-base font-black text-slate-950"><span>{folder.name}</span></h5>
                                    <p className="mt-1 text-sm font-semibold text-slate-500"><span>{sharedResources.filter(resource => resource.folderId === folder.id).length} files · {folder.createdDate}</span></p>
                                  </button>)}
                              </div>
                            </section>
                            <section aria-labelledby="files-heading">
                              <div className="mb-3 flex items-center gap-2">
                                <h4 id="files-heading" className="text-sm font-black uppercase tracking-[0.18em] text-slate-500"><span>Shared Files</span></h4>
                                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200">{rootResources.length} files</span>
                              </div>
                              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {rootResources.map(resource => <article key={resource.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
                                    {resource.thumbnailUrl ? <img src={resource.thumbnailUrl} alt={`${resource.title} thumbnail`} className="h-32 w-full object-cover" /> : <div className="flex h-32 items-center justify-center bg-slate-100"><ImageIcon className="text-slate-300" size={34} aria-hidden="true" /></div>}
                                    <div className="p-4">
                                      <div className="flex items-center justify-between gap-3">
                                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${subjectPill(resource.subject)}`}>{resource.subject}</span>
                                        <a href={resource.link} target="_blank" rel="noreferrer" aria-label={`Open ${resource.title} in Google Drive`} className="rounded-xl p-2 text-[#1E40AF] hover:bg-blue-50">
                                          <Link2 size={16} aria-hidden="true" />
                                        </a>
                                      </div>
                                      <h5 className="mt-3 font-black text-slate-950"><span>{resource.title}</span></h5>
                                      <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-500"><span>{resource.note}</span></p>
                                      <p className="mt-2 text-xs font-bold text-slate-400"><span>📁 {folderPath(resource.folderId)}</span></p>
                                      <div className="mt-4 flex items-center justify-between gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                                        {pendingDeleteResourceId === resource.id ? <div className="flex items-center gap-2 text-xs font-black text-red-700"><span>Delete this resource?</span><button type="button" onClick={() => setSharedResources(current => current.filter(item => item.id !== resource.id))} className="rounded-lg bg-red-600 px-2 py-1 text-white"><span>Yes</span></button><button type="button" onClick={() => setPendingDeleteResourceId('')} className="rounded-lg border border-slate-200 px-2 py-1 text-slate-600"><span>No</span></button></div> : <div className="flex gap-1"><button type="button" aria-label={`Edit ${resource.title}`} className="rounded-xl bg-slate-50 p-2 text-slate-500 hover:text-[#1E40AF]"><Edit3 size={15} aria-hidden="true" /></button><button type="button" aria-label={`Delete ${resource.title}`} onClick={() => setPendingDeleteResourceId(resource.id)} className="rounded-xl bg-slate-50 p-2 text-slate-500 hover:text-red-600"><Trash2 size={15} aria-hidden="true" /></button></div>}
                                      </div>
                                    </div>
                                  </article>)}
                              </div>
                            </section>
                          </div>}

                        {!activeResourceFolder && resourceView === 'list' && <section aria-labelledby="resource-list-heading" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <h4 id="resource-list-heading" className="sr-only"><span>Resources list table</span></h4>
                            <div className="overflow-x-auto">
                              <table className="w-full min-w-[860px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Icon</th><th className="px-5 py-3">Name</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Subject</th><th className="px-5 py-3">Created Date</th><th className="px-5 py-3">Actions</th></tr></thead>
                                <tbody>
                                  {resourceFolders.map(folder => <tr key={`list-${folder.id}`} className="bg-white transition hover:bg-blue-50/60"><td className="px-5 py-4"><Folder className="text-amber-400" size={24} aria-hidden="true" /></td><td className="px-5 py-4 font-black text-slate-950">{folder.name}</td><td className="px-5 py-4"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-100">Folder</span></td><td className="px-5 py-4 font-bold text-slate-400">—</td><td className="px-5 py-4 font-semibold text-slate-500">{folder.createdDate}</td><td className="px-5 py-4"><button type="button" onClick={() => setActiveResourceFolderId(folder.id)} className="rounded-xl border border-blue-200 px-3 py-2 text-xs font-black text-[#1E40AF]"><span>Open</span></button></td></tr>)}
                                  {rootResources.map(resource => <tr key={`list-${resource.id}`} className="bg-[#F8FAFC] transition hover:bg-blue-50/60"><td className="px-5 py-4"><FileText className="text-[#1E40AF]" size={24} aria-hidden="true" /></td><td className="px-5 py-4 font-black text-slate-950">{resource.title}</td><td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100">Resource</span></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ${subjectPill(resource.subject)}`}>{resource.subject}</span></td><td className="px-5 py-4 font-semibold text-slate-500">{resource.createdDate}</td><td className="px-5 py-4"><div className="flex items-center gap-1"><a href={resource.link} target="_blank" rel="noreferrer" aria-label={`Open ${resource.title} drive link`} className="rounded-xl p-2 text-[#1E40AF] hover:bg-white"><Link2 size={15} /></a><button type="button" aria-label={`Edit ${resource.title}`} className="rounded-xl p-2 text-slate-500 hover:bg-white hover:text-[#1E40AF]"><Edit3 size={15} /></button><button type="button" aria-label={`Delete ${resource.title}`} onClick={() => setPendingDeleteResourceId(resource.id)} className="rounded-xl p-2 text-slate-500 hover:bg-white hover:text-red-600"><Trash2 size={15} /></button>{pendingDeleteResourceId === resource.id && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-black text-red-700 ring-1 ring-red-100"><span>Delete this resource?</span><button type="button" onClick={() => setSharedResources(current => current.filter(item => item.id !== resource.id))} className="text-red-700 underline"><span>Yes</span></button><button type="button" onClick={() => setPendingDeleteResourceId('')} className="text-slate-500 underline"><span>No</span></button></span>}</div></td></tr>)}
                                </tbody>
                              </table>
                            </div>
                          </section>}

                        {activeResourceFolder && <section aria-labelledby="folder-files-heading" className="space-y-4">
                            <div className="flex items-center gap-2">
                              <h4 id="folder-files-heading" className="text-sm font-black uppercase tracking-[0.18em] text-slate-500"><span>{activeResourceFolder.name} Files</span></h4>
                              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200">{folderResources.length} files</span>
                            </div>
                            {folderResources.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm"><FolderOpen className="mx-auto text-slate-300" size={56} aria-hidden="true" /><h5 className="mt-5 text-xl font-black text-slate-900"><span>This folder is empty.</span></h5><p className="mx-auto mt-2 max-w-md text-sm font-semibold text-slate-500"><span>Add a resource to get started.</span></p><button type="button" onClick={openResourceModal} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#1E40AF] px-4 py-2.5 text-sm font-black text-white"><FilePlus size={16} aria-hidden="true" /><span>New Resource</span></button></div> : resourceView === 'grid' ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {displayedResources.map(resource => <article key={`folder-card-${resource.id}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
                                    {resource.thumbnailUrl ? <img src={resource.thumbnailUrl} alt={`${resource.title} thumbnail`} className="h-32 w-full object-cover" /> : <div className="flex h-32 items-center justify-center bg-slate-100"><ImageIcon className="text-slate-300" size={34} aria-hidden="true" /></div>}
                                    <div className="p-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${subjectPill(resource.subject)}`}>{resource.subject}</span><h5 className="mt-3 font-black text-slate-950"><span>{resource.title}</span></h5><p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-500"><span>{resource.note}</span></p><p className="mt-2 text-xs font-bold text-slate-400"><span>📁 {folderPath(resource.folderId)}</span></p><div className="mt-4 flex items-center gap-1"><a href={resource.link} target="_blank" rel="noreferrer" aria-label={`Open ${resource.title} in Google Drive`} className="rounded-xl bg-slate-50 p-2 text-[#1E40AF]"><Link2 size={15} /></a><button type="button" aria-label={`Edit ${resource.title}`} className="rounded-xl bg-slate-50 p-2 text-slate-500 hover:text-[#1E40AF]"><Edit3 size={15} /></button><button type="button" aria-label={`Delete ${resource.title}`} onClick={() => setPendingDeleteResourceId(resource.id)} className="rounded-xl bg-slate-50 p-2 text-slate-500 hover:text-red-600"><Trash2 size={15} /></button>{pendingDeleteResourceId === resource.id && <span className="ml-1 inline-flex items-center gap-1 text-xs font-black text-red-700"><span>Delete this resource?</span><button type="button" onClick={() => setSharedResources(current => current.filter(item => item.id !== resource.id))} className="underline"><span>Yes</span></button><button type="button" onClick={() => setPendingDeleteResourceId('')} className="text-slate-500 underline"><span>No</span></button></span>}</div></div>
                                  </article>)}
                              </div> : <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Icon</th><th className="px-5 py-3">Name</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Subject</th><th className="px-5 py-3">Created Date</th><th className="px-5 py-3">Actions</th></tr></thead><tbody>{displayedResources.map(resource => <tr key={`folder-row-${resource.id}`} className="bg-white transition hover:bg-blue-50/60"><td className="px-5 py-4"><FileText className="text-[#1E40AF]" size={24} /></td><td className="px-5 py-4 font-black text-slate-950">{resource.title}</td><td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100">Resource</span></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ${subjectPill(resource.subject)}`}>{resource.subject}</span></td><td className="px-5 py-4 font-semibold text-slate-500">{resource.createdDate}</td><td className="px-5 py-4"><div className="flex items-center gap-1"><a href={resource.link} target="_blank" rel="noreferrer" aria-label={`Open ${resource.title} drive link`} className="rounded-xl p-2 text-[#1E40AF] hover:bg-slate-50"><Link2 size={15} /></a><button type="button" aria-label={`Edit ${resource.title}`} className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-[#1E40AF]"><Edit3 size={15} /></button><button type="button" aria-label={`Delete ${resource.title}`} onClick={() => setPendingDeleteResourceId(resource.id)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-red-600"><Trash2 size={15} /></button>{pendingDeleteResourceId === resource.id && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-black text-red-700"><span>Delete this resource?</span><button type="button" onClick={() => setSharedResources(current => current.filter(item => item.id !== resource.id))} className="underline"><span>Yes</span></button><button type="button" onClick={() => setPendingDeleteResourceId('')} className="text-slate-500 underline"><span>No</span></button></span>}</div></td></tr>)}</tbody></table></div></div>}
                          </section>}
                      </section>

                      {createFolderOpen && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-folder-title">
                          <form className="w-full max-w-[400px] rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-200" onSubmit={event => {
                    event.preventDefault();
                    createResourceFolder();
                  }}>
                            <div className="flex items-center justify-between gap-4">
                              <h4 id="create-folder-title" className="text-xl font-black text-slate-950"><span>Create New Folder</span></h4>
                              <button type="button" aria-label="Close create folder modal" onClick={() => setCreateFolderOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={17} aria-hidden="true" /></button>
                            </div>
                            <label className="mt-5 block text-sm font-black text-slate-700"><span>Folder Name</span><input ref={newFolderInputRef} value={newFolderName} onChange={event => setNewFolderName(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                            <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setCreateFolderOpen(false)} className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600"><span>Cancel</span></button><button type="submit" className="rounded-2xl bg-[#1E40AF] px-4 py-2.5 text-sm font-black text-white"><span>Create Folder</span></button></div>
                          </form>
                        </div>}

                      {newResourceOpen && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="share-resource-title">
                          <form className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-200 sm:p-6" onSubmit={event => {
                    event.preventDefault();
                    shareResource();
                  }}>
                            <div className="flex items-center justify-between gap-4">
                              <h4 id="share-resource-title" className="text-2xl font-black text-slate-950"><span>Share New Resource</span></h4>
                              <button type="button" aria-label="Close resource modal" onClick={() => setNewResourceOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18} aria-hidden="true" /></button>
                            </div>
                            <div className="mt-5 space-y-4">
                              <label className="block text-sm font-black text-slate-700"><span>Resource Title</span><input value={newResourceForm.title} onChange={event => setNewResourceForm(current => ({
                          ...current,
                          title: event.target.value
                        }))} placeholder="e.g. Chapter 3 - Newton's Laws" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                              <label className="block text-sm font-black text-slate-700"><span>Subject</span><input value={newResourceForm.subject} onChange={event => setNewResourceForm(current => ({
                          ...current,
                          subject: event.target.value
                        }))} placeholder="e.g. Physics, Chemistry, Math" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                              <label className="block text-sm font-black text-slate-700"><span>Folder</span><select value={newResourceForm.folderId} onChange={event => setNewResourceForm(current => ({
                          ...current,
                          folderId: event.target.value
                        }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"><option value="root">Root / No Folder</option>{resourceFolders.map(folder => <option key={`select-${folder.id}`} value={folder.id}>{folder.name}</option>)}</select></label>
                              <label className="block text-sm font-black text-slate-700"><span>Google Drive Link</span><div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100"><Link2 size={17} className="text-slate-400" aria-hidden="true" /><input type="url" value={newResourceForm.driveLink} onChange={event => setNewResourceForm(current => ({
                            ...current,
                            driveLink: event.target.value
                          }))} placeholder="https://drive.google.com/..." className="w-full font-semibold outline-none" /></div></label>
                              <label className="block text-sm font-black text-slate-700"><span>Thumbnail URL</span><div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100"><ImageIcon size={17} className="text-slate-400" aria-hidden="true" /><input type="url" value={newResourceForm.thumbnailUrl} onChange={event => setNewResourceForm(current => ({
                            ...current,
                            thumbnailUrl: event.target.value
                          }))} placeholder="https://... (optional)" className="w-full font-semibold outline-none" /></div></label>
                              <label className="block text-sm font-black text-slate-700"><span>Short Note</span><textarea rows={3} value={newResourceForm.note} onChange={event => setNewResourceForm(current => ({
                          ...current,
                          note: event.target.value
                        }))} placeholder="Add a brief note about this resource..." className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                            </div>
                            <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setNewResourceOpen(false)} className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600"><span>Cancel</span></button><button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-[#0D9488] px-4 py-2.5 text-sm font-black text-white"><Share2 size={16} aria-hidden="true" /><span>Share Resource</span></button></div>
                          </form>
                        </div>}
                    </div>}

                  {studentTab === 'Sent Notice' && <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                      <form className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={event => {
                  event.preventDefault();
                  const nextNotice = {
                    id: `notice-${Date.now()}`,
                    title: 'Custom notice from admin',
                    date: 'Today',
                    description: 'A carefully written notice has been sent to the student portal.'
                  };
                  setNotices(current => [nextNotice, ...current]);
                  setNotice('Notice sent to student.');
                }}><h3 className="text-xl font-black"><span>Send Notice</span></h3><input placeholder="Notice Title" className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3" /><textarea placeholder="Description" rows={4} className="mt-3 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3" /><button type="submit" className="mt-3 rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white"><span>Send Notice</span></button></form>
                      <section aria-labelledby="previous-notices" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><h3 id="previous-notices" className="text-xl font-black"><span>Previous Notices</span></h3><div className="mt-4 space-y-3">{notices.slice(0, 5).map(item => <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><h4 className="font-black"><span>{item.title}</span></h4><p className="text-xs font-bold text-slate-500"><span>{item.date}</span></p></div><div className="flex gap-2"><button type="button" onClick={() => setExpandedNotice(expandedNotice === item.id ? '' : item.id)} className="rounded-lg bg-white p-2 text-[#1E40AF]"><Eye size={15} /></button><button type="button" onClick={() => setNotices(current => current.filter(noticeItem => noticeItem.id !== item.id))} className="rounded-lg bg-white p-2 text-red-600"><Trash2 size={15} /></button></div></div><p className={`${expandedNotice === item.id ? 'mt-3' : 'mt-3 line-clamp-2'} text-sm text-slate-600`}><span>{item.description}</span></p></article>)}</div><div className="mt-4 flex justify-end gap-1"><button type="button" className="rounded-lg p-2 text-slate-500"><ChevronLeft size={16} /></button><button type="button" className="rounded-lg bg-[#1E40AF] px-3 py-1.5 text-sm font-black text-white"><span>1</span></button><button type="button" className="rounded-lg px-3 py-1.5 text-sm font-bold text-slate-600"><span>2</span></button><span className="px-1 text-slate-400">…</span></div></section>
                    </div>}

                  {studentTab === 'Payment' && <div className="space-y-5">
                      <section className="rounded-3xl border border-teal-200 bg-teal-50 p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h3 className="text-xl font-black text-slate-950"><span>Payment Cycle Configuration</span></h3><p className="mt-1 text-sm font-semibold text-teal-800"><span>Select how many completed classes create one payment cycle.</span></p></div><div className="flex rounded-2xl bg-white p-1"><button type="button" onClick={() => setCycleSize('8 Classes')} className={`rounded-xl px-4 py-2 text-sm font-black ${cycleSize === '8 Classes' ? 'bg-[#0D9488] text-white' : 'text-slate-600'}`}><span>8 Classes</span></button><button type="button" onClick={() => setCycleSize('12 Classes')} className={`rounded-xl px-4 py-2 text-sm font-black ${cycleSize === '12 Classes' ? 'bg-[#0D9488] text-white' : 'text-slate-600'}`}><span>12 Classes</span></button></div><button type="button" onClick={() => setNotice('Payment cycle saved.')} className="rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white"><span>Save Cycle</span></button></div></section>
                      <section className="space-y-4" aria-label="Generated payment cycles">
                        {generatedPaymentCycles.map(cycle => {
                    const cycleTone = paymentCycleTone(cycle.status);
                    const alertActive = cycleAlerts[cycle.id] ?? false;
                    return <article key={cycle.id} className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${cycleTone.border}`}>
                              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                <h3 className="text-xl font-black tracking-tight text-slate-950"><span>{cycle.title}</span></h3>
                                <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ring-1 ${cycleTone.badge}`}><span>{cycle.status}</span></span>
                              </div>
                              <div className="mt-5">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400"><span>Taken Classes:</span></p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {cycle.dates.map(date => <span key={`${cycle.id}-${date.id}`} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-[#1E40AF] ring-1 ring-blue-100"><span>{date.label}</span></span>)}
                                </div>
                                <p className="mt-3 text-sm font-bold text-slate-500"><span>{cycle.dates.length} of {cycle.limit} classes completed{cycle.status === 'In Progress' ? ' (In Progress)' : ''}</span></p>
                              </div>
                              {cycle.status === 'Completed' && cycle.paidDate && <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-black text-emerald-700 ring-1 ring-emerald-100"><Check size={15} aria-hidden="true" /><span>Paid on: {formatPaidDate(cycle.paidDate)}</span></p>}
                              <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 lg:flex-row lg:items-end lg:justify-between">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                  {cycle.status === 'Completed' ? <button type="button" onClick={() => markCycleDue(cycle)} className={`rounded-2xl border bg-white px-4 py-2.5 text-sm font-black ${cycleTone.action}`}><span>Mark as Due</span></button> : <button type="button" disabled={!cycle.isComplete} onClick={() => {
                            setPendingPaymentCycleId(cycle.id);
                            setCyclePaymentDraftDates(current => ({
                              ...current,
                              [cycle.id]: current[cycle.id] || '2025-01-20'
                            }));
                          }} className={`rounded-2xl border bg-white px-4 py-2.5 text-sm font-black ${cycle.isComplete ? cycleTone.action : 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'}`}><span>Mark as Paid</span></button>}
                                  {pendingPaymentCycleId === cycle.id && cycle.status === 'Due' && <label className="text-sm font-black text-slate-700"><span>Payment Received Date</span><input type="date" value={cyclePaymentDraftDates[cycle.id] ?? '2025-01-20'} onChange={event => setCyclePaymentDraftDates(current => ({
                              ...current,
                              [cycle.id]: event.target.value
                            }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 sm:w-[210px]" /></label>}
                                  {pendingPaymentCycleId === cycle.id && cycle.status === 'Due' && <button type="button" onClick={() => markCyclePaid(cycle)} className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white"><span>Confirm Paid</span></button>}
                                </div>
                                <button type="button" title="When active, student sees a payment due popup on their portal" aria-pressed={alertActive} onClick={() => setCycleAlerts(current => ({
                          ...current,
                          [cycle.id]: !alertActive
                        }))} className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-black ${alertActive ? 'border-red-600 bg-red-600 text-white shadow-sm shadow-red-950/10' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                                  <Bell size={16} aria-hidden="true" />
                                  <span>{alertActive ? 'Alert Active' : 'Set Due Alert'}</span>
                                </button>
                              </div>
                            </article>;
                  })}
                      </section>
                      <section className="flex flex-col justify-between gap-4 rounded-3xl border border-red-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center"><div className="flex gap-3"><Bell className="text-red-500" aria-hidden="true" /><div><h3 className="font-black"><span>Due Payment Alert</span></h3><p className="text-sm text-slate-500"><span>When enabled, student will see a payment due alert on their dashboard</span></p></div></div><button type="button" onClick={() => setPaymentAlert(!paymentAlert)} className={`h-8 w-14 rounded-full p-1 transition ${paymentAlert ? 'bg-red-500' : 'bg-slate-300'}`} aria-pressed={paymentAlert}><span className={`block h-6 w-6 rounded-full bg-white transition ${paymentAlert ? 'translate-x-6' : 'translate-x-0'}`} /></button></section>
                    </div>}

                  {studentTab === 'Action' && <div className="grid gap-5 lg:grid-cols-2">
                      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-xl font-black"><span>Pause / Resume Account</span></h3><p className="mt-3 flex items-center gap-2 text-sm font-black text-emerald-700"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><span>{accountPaused ? 'Account Paused' : 'Account Active'}</span></p><button type="button" onClick={() => setAccountPaused(!accountPaused)} className={`mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white ${accountPaused ? 'bg-emerald-600' : 'bg-amber-500'}`}>{accountPaused ? <Check size={17} /> : <Pause size={17} />}<span>{accountPaused ? 'Resume Account' : 'Pause Account'}</span></button><p className="mt-4 text-sm font-semibold text-slate-500"><span>Paused students can login but will see a restricted access page</span></p></section>
                      <section className="rounded-3xl border border-red-200 bg-red-50 p-5"><h3 className="text-xl font-black text-red-800"><span>Delete Account</span></h3><button type="button" onClick={() => setDeletePreview(true)} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white"><Trash2 size={17} /><span>Delete Student Account</span></button>{deletePreview && <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-red-100"><div className="flex items-start gap-3"><AlertTriangle className="text-red-600" aria-hidden="true" /><div><p className="font-black text-slate-950"><span>Are you sure you want to delete this student?</span></p><p className="mt-1 text-sm text-slate-600"><span>This action cannot be undone.</span></p><div className="mt-4 flex gap-2"><button type="button" onClick={() => setDeletePreview(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700"><span>Cancel</span></button><button type="button" onClick={() => setNotice('Delete confirmation requires owner approval.')} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white"><span>Confirm Delete</span></button></div></div></div></div>}</section>
                    </div>}
                </div>
              </div>
            </section>}

          {activeSection === 'students' && !detailOpen && <section aria-labelledby="students-title" className="space-y-5">
              <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:flex-row lg:items-end"><div><h2 id="students-title" className="text-2xl font-black"><span>Students</span></h2><p className="mt-1 text-sm text-slate-500"><span>Search, sort, and open the full student profile panel.</span></p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="flex min-w-[280px] items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm"><Search size={16} /><span className="sr-only">Search students</span><input value={studentSearch} onChange={event => setStudentSearch(event.target.value)} placeholder="Search by name, class, institute…" className="w-full outline-none" /></label><select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold"><option>Name A-Z</option><option>Date First</option><option>Date Last</option></select><div className="flex rounded-2xl border border-slate-200 p-1"><button type="button" aria-label="List View" onClick={() => setStudentView('list')} className={`rounded-xl p-3 ${studentView === 'list' ? 'bg-blue-50 text-[#1E40AF]' : 'text-slate-400'}`}><List size={17} /></button><button type="button" aria-label="Grid View" onClick={() => setStudentView('grid')} className={`rounded-xl p-3 ${studentView === 'grid' ? 'bg-blue-50 text-[#1E40AF]' : 'text-slate-400'}`}><Grid3X3 size={17} /></button></div></div></div>
              {studentView === 'list' ? <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Avatar</th><th className="px-5 py-3">Full Name</th><th className="px-5 py-3">Class</th><th className="px-5 py-3">Institute</th><th className="px-5 py-3">Account Status</th><th className="px-5 py-3">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredStudents.map(student => <tr key={student.id}><td className="px-5 py-4"><span className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-black ${student.tone}`}>{student.initials}</span></td><td className="px-5 py-4 font-black">{student.name}</td><td className="px-5 py-4 text-slate-600">{student.className}</td><td className="px-5 py-4 text-slate-500">{student.institute}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusBadge(student.status)}`}>{student.status}</span></td><td className="px-5 py-4"><button type="button" onClick={() => selectStudent(student)} className="rounded-xl border border-blue-200 px-4 py-2 text-xs font-black text-[#1E40AF]"><span>View Details</span></button></td></tr>)}</tbody></table></div></div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredStudents.map(student => <article key={student.id} className="rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200"><div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black ${student.tone}`}>{student.initials}</div><h3 className="mt-4 text-lg font-black"><span>{student.name}</span></h3><p className="mt-1 text-sm text-slate-500"><span>{student.className} · {student.institute}</span></p><span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusBadge(student.status)}`}>{student.status}</span><button type="button" onClick={() => selectStudent(student)} className="mt-4 w-full rounded-2xl border border-blue-200 px-4 py-3 text-sm font-black text-[#1E40AF]"><span>View Details</span></button></article>)}</div>}
            </section>}

          {activeSection === 'attendance' && <section aria-labelledby="attendance-title" className="space-y-5">
              <div className="grid gap-4 md:grid-cols-4"><article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><Users className="text-[#1E40AF]" /><p className="mt-4 text-3xl font-black"><span>{students.length}</span></p><p className="text-sm font-bold text-slate-500"><span>Total Students</span></p></article><article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><Check className="text-emerald-600" /><p className="mt-4 text-3xl font-black"><span>{presentCount}</span></p><p className="text-sm font-bold text-slate-500"><span>Present Today</span></p></article><article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><Globe2 className="text-sky-500" /><p className="mt-4 text-3xl font-black"><span>{onlineCount}</span></p><p className="text-sm font-bold text-slate-500"><span>Online</span></p></article><article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><Building2 className="text-[#0D9488]" /><p className="mt-4 text-3xl font-black"><span>{onsiteCount}</span></p><p className="text-sm font-bold text-slate-500"><span>Onsite</span></p></article></div>
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 id="attendance-title" className="text-2xl font-black"><span>Interactive Monthly Calendar</span></h2><p className="mt-1 text-sm text-slate-500"><span>Select a date to mark all student attendance.</span></p></div><select value={trackerDate} onChange={event => setTrackerDate(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black">{trackerDays.map(day => <option key={day.id}>{day.date}</option>)}</select></div><div className="mt-5 grid grid-cols-7 overflow-hidden rounded-3xl border border-slate-200 text-center text-sm">{weekdays.map(day => <div key={`tracker-${day.id}`} className="bg-slate-50 px-2 py-3 font-black text-slate-500">{day.label}</div>)}{Array.from({
                length: 30
              }, (_, day) => day + 1).map(day => <button key={`tracker-day-${day}`} type="button" onClick={() => setTrackerDate(`${String(day).padStart(2, '0')} Jun 2024`)} className={`min-h-16 border-t border-slate-100 font-black ${trackerDate.startsWith(String(day).padStart(2, '0')) ? 'bg-blue-50 text-[#1E40AF]' : 'text-slate-700'}`}><span>{day}</span></button>)}</div></div>
              <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"><div className="border-b border-slate-200 px-5 py-4"><h3 className="font-black"><span>Mark students for {trackerDate}</span></h3></div><div className="divide-y divide-slate-100">{students.map(student => <div key={`mark-${student.id}`} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-black ${student.tone}`}>{student.initials}</span><div><p className="font-black"><span>{student.name}</span></p><p className="text-sm text-slate-500"><span>{student.className}</span></p></div></div><div className="flex rounded-2xl bg-slate-100 p-1"><button type="button" onClick={() => setClassMarks(current => ({
                    ...current,
                    [student.id]: 'Onsite'
                  }))} className={`rounded-xl px-3 py-2 text-xs font-black ${classMarks[student.id] === 'Onsite' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}><span>Onsite</span></button><button type="button" onClick={() => setClassMarks(current => ({
                    ...current,
                    [student.id]: 'Online'
                  }))} className={`rounded-xl px-3 py-2 text-xs font-black ${classMarks[student.id] === 'Online' ? 'bg-sky-500 text-white' : 'text-slate-600'}`}><span>Online</span></button><button type="button" onClick={() => setClassMarks(current => ({
                    ...current,
                    [student.id]: 'Not Taken'
                  }))} className={`rounded-xl px-3 py-2 text-xs font-black ${classMarks[student.id] === 'Not Taken' ? 'bg-slate-700 text-white' : 'text-slate-600'}`}><span>Not Taken</span></button></div></div>)}</div></div>
            </section>}

          {activeSection === 'payments' && <section aria-labelledby="payment-methods-title" className="space-y-5"><div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-[#1E40AF]"><Landmark /></div><div><h2 id="payment-methods-title" className="text-2xl font-black"><span>Bank Details</span></h2><p className="text-sm text-slate-500"><span>Maintain the bank account shown to students.</span></p></div></div><form className="mt-5 grid gap-3 md:grid-cols-3"><input placeholder="Bank Name" className="rounded-2xl border border-slate-200 px-4 py-3" /><input placeholder="Account Name" className="rounded-2xl border border-slate-200 px-4 py-3" /><input placeholder="Account Number" className="rounded-2xl border border-slate-200 px-4 py-3" /><input placeholder="Branch Name" className="rounded-2xl border border-slate-200 px-4 py-3" /><input placeholder="Swift Code" className="rounded-2xl border border-slate-200 px-4 py-3" /><input placeholder="Routing Number" className="rounded-2xl border border-slate-200 px-4 py-3" /><button type="button" className="rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white"><span>Add Bank</span></button></form><article className="mt-4 flex flex-col justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center"><div><p className="font-black"><span>Eastern Trust Bank</span></p><p className="text-sm text-slate-500"><span>RHTacademy Education · 000-129-445891 · Gulshan Branch</span></p></div><div className="flex gap-2"><button type="button" className="rounded-xl bg-white p-2 text-[#1E40AF]"><Edit3 size={16} /></button><button type="button" className="rounded-xl bg-white p-2 text-red-600"><Trash2 size={16} /></button></div></article></div><div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between"><h2 className="text-2xl font-black"><span>MFS Details</span></h2><button type="button" className="rounded-2xl bg-[#0D9488] px-4 py-2.5 text-sm font-black text-white"><span>Add MFS Account</span></button></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[{
                id: 'bkash',
                name: 'bKash',
                tone: 'bg-pink-50 text-pink-700'
              }, {
                id: 'nagad',
                name: 'Nagad',
                tone: 'bg-orange-50 text-orange-700'
              }, {
                id: 'rocket',
                name: 'Rocket',
                tone: 'bg-purple-50 text-purple-700'
              }, {
                id: 'taptap',
                name: 'Taptap',
                tone: 'bg-blue-50 text-blue-700'
              }].map(item => <article key={item.id} className="rounded-3xl border border-slate-200 p-4"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-black ${item.tone}`}>{item.name.charAt(0)}</div><h3 className="mt-4 font-black"><span>{item.name}</span></h3><input defaultValue="+880 1712 000 999" className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /><button type="button" className="mt-3 rounded-xl border border-blue-200 px-4 py-2 text-sm font-black text-[#1E40AF]"><span>Edit</span></button></article>)}</div></div></section>}

          {activeSection === 'landing' && <section aria-labelledby="landing-title" className="space-y-5">
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <h2 id="landing-title" className="text-2xl font-black"><span>Landing Page Controls</span></h2>
                <div className="mt-4 flex gap-2 overflow-x-auto">
                  {landingTabs.map(tab => <button key={tab.id} type="button" onClick={() => setLandingTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-black ${landingTab === tab.id ? 'bg-[#1E40AF] text-white' : 'bg-slate-100 text-slate-600'}`}><span>{tab.label}</span></button>)}
                </div>
              </div>
              {landingTab === 'About Me' && <form className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex flex-col gap-5 lg:flex-row"><div className="text-center"><div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-50 text-[#1E40AF]"><UserRound size={42} /></div><button type="button" className="mt-3 inline-flex items-center gap-2 rounded-xl border border-blue-200 px-3 py-2 text-sm font-black text-[#1E40AF]"><Upload size={15} /><span>Upload</span></button></div><div className="grid flex-1 gap-3 md:grid-cols-3"><input placeholder="Name" defaultValue="Rahat Hossain" className="rounded-2xl border border-slate-200 px-4 py-3" /><input placeholder="Degree" defaultValue="MSc in Physics" className="rounded-2xl border border-slate-200 px-4 py-3" /><input placeholder="Institute" defaultValue="University of Dhaka" className="rounded-2xl border border-slate-200 px-4 py-3" /><textarea placeholder="Description" defaultValue="I help SSC and HSC students build confidence through focused lessons, structured resources, and steady feedback." className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 md:col-span-3" /><button type="button" className="rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white"><span>Save Changes</span></button></div></div></form>}
              {landingTab === 'Service Card' && <section aria-labelledby="service-cards-title" className="space-y-4">
                  <div className="flex flex-col justify-between gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center">
                    <div>
                      <h3 id="service-cards-title" className="text-2xl font-black text-slate-950"><span>Service Cards</span></h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500"><span>Edit the service cards shown on the public landing page.</span></p>
                    </div>
                    <button type="button" onClick={() => setNewServiceCardOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1E40AF] px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-blue-800">
                      <Plus size={16} aria-hidden="true" />
                      <span>Add New Card</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {serviceCards.map(card => <article key={card.id} className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${card.badgeTone}`}>{card.badge}</span>
                            <h4 className="mt-3 text-2xl font-black tracking-tight text-slate-950"><span>{card.title}</span></h4>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <button type="button" aria-label={`Edit ${card.title} service card`} onClick={() => {
                      setPendingServiceCardDeleteId('');
                      setEditingServiceCardId(card.id);
                    }} className="rounded-xl bg-blue-50 p-2.5 text-[#1E40AF] hover:bg-blue-100">
                              <Edit3 size={16} aria-hidden="true" />
                            </button>
                            <button type="button" aria-label={`Delete ${card.title} service card`} onClick={() => {
                      setEditingServiceCardId('');
                      setPendingServiceCardDeleteId(card.id);
                    }} className="rounded-xl bg-red-50 p-2.5 text-red-600 hover:bg-red-100">
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        {pendingServiceCardDeleteId === card.id && <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                            <p className="font-black text-red-800"><span>Delete this service card?</span></p>
                            <p className="mt-1 text-sm font-semibold text-red-700"><span>This will remove it from the landing page.</span></p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <button type="button" onClick={() => {
                      setServiceCards(current => current.filter(item => item.id !== card.id));
                      setPendingServiceCardDeleteId('');
                    }} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white"><span>Yes, Delete</span></button>
                              <button type="button" onClick={() => setPendingServiceCardDeleteId('')} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600"><span>Cancel</span></button>
                            </div>
                          </div>}
                        {editingServiceCardId === card.id ? <form className="mt-5 space-y-4" onSubmit={event => {
                  event.preventDefault();
                  setEditingServiceCardId('');
                  setNotice('Service card saved.');
                }}>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <label className="block text-sm font-black text-slate-700"><span>Title</span><input value={card.title} onChange={event => updateServiceCard(card.id, {
                        title: event.target.value
                      })} placeholder="SSC" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                              <label className="block text-sm font-black text-slate-700"><span>Badge</span><input value={card.badge} onChange={event => updateServiceCard(card.id, {
                        badge: event.target.value
                      })} placeholder="Secondary" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                            </div>
                            <label className="block text-sm font-black text-slate-700"><span>Description</span><textarea rows={3} value={card.description} onChange={event => updateServiceCard(card.id, {
                      description: event.target.value
                    })} placeholder="Write an attractive service description" className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                            <div>
                              <p className="text-sm font-black text-slate-700"><span>Subjects</span></p>
                              <div className="mt-2 flex gap-2">
                                <input value={serviceSubjectDrafts[card.id] ?? ''} onChange={event => setServiceSubjectDrafts(current => ({
                        ...current,
                        [card.id]: event.target.value
                      }))} onKeyDown={event => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addSubjectToCard(card.id);
                        }
                      }} aria-label="Enter a subject name" placeholder="Enter a subject name" className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                                <button type="button" onClick={() => addSubjectToCard(card.id)} className="shrink-0 rounded-2xl bg-[#1E40AF] px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-blue-800">
                                  <span>+ Add</span>
                                </button>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {card.subjects.map(subject => <span key={subject.id} className="inline-flex items-center gap-1.5 rounded-full bg-[#0D9488] px-3 py-1.5 text-xs font-black text-white shadow-sm shadow-teal-900/10"><span>{subject.name}</span><button type="button" aria-label={`Remove ${subject.name}`} onClick={() => removeSubjectFromCard(card.id, subject.id)} className="rounded-full text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"><span>×</span></button></span>)}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button type="submit" className="rounded-2xl bg-[#0D9488] px-5 py-3 text-sm font-black text-white"><span>Save Card</span></button>
                              <button type="button" onClick={() => setEditingServiceCardId('')} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600"><span>Cancel</span></button>
                            </div>
                          </form> : <div className="mt-5">
                            <p className="line-clamp-1 text-sm font-semibold leading-6 text-slate-600"><span>{card.description}</span></p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {card.subjects.map(subject => <span key={`view-${subject.id}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200"><span>{subject.name}</span></span>)}
                            </div>
                          </div>}
                      </article>)}
                    {newServiceCardOpen && <form className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6" onSubmit={event => {
                event.preventDefault();
                createServiceCard();
              }}>
                        <h4 className="text-xl font-black text-slate-950"><span>Create New Service Card</span></h4>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <label className="block text-sm font-black text-slate-700"><span>Title</span><input value={newServiceCard.title} onChange={event => setNewServiceCard(current => ({
                      ...current,
                      title: event.target.value
                    }))} placeholder="Title" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                          <label className="block text-sm font-black text-slate-700"><span>Badge</span><input value={newServiceCard.badge} onChange={event => setNewServiceCard(current => ({
                      ...current,
                      badge: event.target.value
                    }))} placeholder="Badge" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                        </div>
                        <label className="mt-4 block text-sm font-black text-slate-700"><span>Description</span><textarea rows={3} value={newServiceCard.description} onChange={event => setNewServiceCard(current => ({
                    ...current,
                    description: event.target.value
                  }))} placeholder="Description" className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                        <div className="mt-4">
                          <p className="text-sm font-black text-slate-700"><span>Subjects</span></p>
                          <div className="mt-2 flex gap-2">
                            <input value={newServiceSubjectDraft} onChange={event => setNewServiceSubjectDraft(event.target.value)} onKeyDown={event => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addSubjectToNewCard();
                      }
                    }} aria-label="Enter a subject name" placeholder="Enter a subject name" className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                            <button type="button" onClick={addSubjectToNewCard} className="shrink-0 rounded-2xl bg-[#1E40AF] px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-blue-800">
                              <span>+ Add</span>
                            </button>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {newServiceCard.subjects.map(subject => <span key={`new-${subject.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#0D9488] px-3 py-1.5 text-xs font-black text-white shadow-sm shadow-teal-900/10"><span>{subject.name}</span><button type="button" aria-label={`Remove ${subject.name}`} onClick={() => setNewServiceCard(current => ({
                        ...current,
                        subjects: current.subjects.filter(item => item.id !== subject.id)
                      }))} className="rounded-full text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"><span>×</span></button></span>)}
                          </div>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          <button type="submit" className="rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white"><span>Create Card</span></button>
                          <button type="button" onClick={() => {
                    setNewServiceCardOpen(false);
                    setNewServiceCard(emptyServiceCard);
                    setNewServiceSubjectDraft('');
                  }} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600"><span>Cancel</span></button>
                        </div>
                      </form>}
                  </div>
                </section>}
              {landingTab === 'Booking Schedule' && <section aria-labelledby="booking-schedule-title" className="space-y-5">
                  <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <h3 id="booking-schedule-title" className="text-2xl font-black text-slate-950"><span>Booking Schedule Configuration</span></h3>
                  </div>
                  <section aria-labelledby="available-seats-title" className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h4 id="available-seats-title" className="text-xl font-black text-slate-950"><span>Available Seats</span></h4>
                        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500"><span>Set to 0 to disable booking and grey out the Book Now button on the landing page.</span></p>
                      </div>
                      <div className="flex items-center justify-center gap-3 rounded-full bg-slate-50 p-2 ring-1 ring-slate-200">
                        <button type="button" aria-label="Decrease available seats" onClick={() => setAvailableSeats(current => Math.max(0, current - 1))} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-black text-[#1E40AF] shadow-sm"><span>−</span></button>
                        <input type="number" min={0} value={availableSeats} onChange={event => setAvailableSeats(Math.max(0, Number(event.target.value)))} aria-label="Available Seats" className="h-12 w-24 rounded-full border border-slate-200 bg-white text-center text-2xl font-black text-slate-950 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                        <button type="button" aria-label="Increase available seats" onClick={() => setAvailableSeats(current => current + 1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-black text-[#1E40AF] shadow-sm"><span>+</span></button>
                      </div>
                    </div>
                    <button type="button" onClick={() => setNotice('Available seats saved.')} className="mt-5 rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white"><span>Save Seats</span></button>
                  </section>
                  <section aria-labelledby="time-slots-title" className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
                    <div>
                      <h4 id="time-slots-title" className="text-xl font-black text-slate-950"><span>Time Slots</span></h4>
                      <p className="mt-1 text-sm font-semibold text-slate-500"><span>Each slot has a Day field and a Time field. Both are required.</span></p>
                    </div>
                    <div className="mt-5 space-y-3">
                      {bookingSlots.map(slot => <div key={slot.id} className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
                          <label className="flex-1 text-sm font-black text-slate-700"><span className="sr-only">Day</span><input value={slot.day} onChange={event => updateBookingSlot(slot.id, {
                      day: event.target.value
                    })} placeholder="e.g. Friday, Saturday" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-black text-slate-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                          <span className="hidden text-slate-300 sm:inline" aria-hidden="true">—</span>
                          <label className="flex-1 text-sm font-semibold text-slate-700"><span className="sr-only">Time</span><input value={slot.time} onChange={event => updateBookingSlot(slot.id, {
                      time: event.target.value
                    })} placeholder="e.g. 4:00 PM to 5:00 PM" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" /></label>
                          <button type="button" aria-label={`Delete ${slot.day || 'empty'} time slot`} onClick={() => setBookingSlots(current => current.filter(item => item.id !== slot.id))} className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-xl font-black text-red-600 hover:bg-red-100"><span>×</span></button>
                        </div>)}
                    </div>
                    <button type="button" onClick={() => setBookingSlots(current => [...current, {
                id: `slot-${Date.now()}`,
                day: '',
                time: ''
              }])} className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-blue-200 px-4 py-2.5 text-sm font-black text-[#1E40AF] hover:bg-blue-50">
                      <Plus size={15} aria-hidden="true" />
                      <span>Add Time Slot</span>
                    </button>
                    <button type="button" onClick={() => setNotice('Booking schedule saved.')} className="mt-5 w-full rounded-2xl bg-[#0D9488] px-5 py-3 text-sm font-black text-white"><span>Save Schedule</span></button>
                  </section>
                </section>}
            </section>}
        </div>
      </main>
    </div>;
};