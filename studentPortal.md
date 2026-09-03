Act as a senior full-stack developer. implement Phase 6: Student Portal Interface & Features (/portal/id=[student_id]) for RHTacademy based on the updated prompt specification below.

 Carefully read and review the studentPortalUI.md file . this is reference for Student portal UI.Follow the UI exactly. 

================================================================
RHTacademy - Student Portal Specification (Phase 6 Upgrade)
Target Route: /portal/id=[student_id]
================================================================

UI & LAYOUT REQUIREMENTS:
-------------------------
- Design System: Match the exact UI styling, design language, colors, card layouts, and density of the RHTacademy Admin Portal.
- Top Bar:
  - Left: "Student Portal" page title and active breadcrumbs.
  - Right: Notification bell icon (with interactive dropdown popup) + Profile view avatar (default Male/Female SVG fallback).
- Profile Modal:
  - Triggered by clicking the top bar profile avatar.
  - Allows updating Avatar, Name, Class, Institute, Phone, Email, and Password.
  - Email/Password changes require OTP validation sent to the old email address before saving updates.
- Left Sidebar Navigation:
  1. Dashboard
  2. Progress Track
  3. To-Do
  4. Exam
  5. Resources
  6. Payment
  7. Logout

PAGE COMPONENTS & WORKFLOWS:
----------------------------

1. Dashboard (/portal/dashboard):
   - Due Payment Warning: Display a red alert banner card at the top ONLY if the previous payment cycle status is "Due".
   - Class Track Card: 
     - Dual-view card containing a Calendar view showing completed class dates (Green circle = Onsite, Sky-blue circle = Online).
     - Center Radial Gauge displaying completed classes out of the cycle total set by admin (e.g., 8 or 12 classes).
   - Notice Board: Displays the top 5 latest notices (LIFO order) with pagination.

2. Progress Track (/portal/progress):
   - Calendar View & Daily Task Setup:
     - Interactive calendar view where clicking any date opens a task assignment modal.
     - Clicking "+ Add Task" appends Title and Details fields. Students can add multiple tasks for a single date.
     - Dates with assigned tasks render visual badges on the calendar. Tasks can be edited or deleted later.
   - Active Day Execution:
     - On the active date, assigned tasks populate the daily execution list.
     - Checking off a task marks it as done and applies a strikethrough (`line-through`) visual text style.
   - Graph View Toggle:
     - Located at the top-right corner of the calendar.
     - Toggling "Graph View" replaces the calendar in-place with a weekly progress line graph (Percentage vs. Time). Clicking again returns to the calendar view.

3. To-Do (/portal/todo):
   - Kanban Board: Three-column layout (`To Do`, `In Progress`, `Done`).
   - Creation Modal: Single "+ Add To-Do" button at top-right opens a modal with "Name" and "Details" fields.
   - Card Details: Displays Title, Description, and Created Date.
   - Interactivity: Full drag-and-drop or status toggle support to move items across columns.

4. Exam Portal (/portal/exam):
   - Overview Screen:
     - Upcoming Exams Card: Shows scheduled exams with an active countdown timer.
     - Current Exam Card: Shows active exams ready to start.
     - Previous Exam History: Tabular/card view of completed exams with scores and dates.
   - Active Exam Focus Mode (Full-Screen View):
     - Clicking a current exam enters full-page mode, hiding all upcoming and history cards.
     - Persistent countdown timer at top.
     - All MCQ questions render on a single page with a "Submit Exam" button at the bottom.
   - Results & Answer Review:
     - Displays summary metrics upon submission or time expiry: Obtained Marks, Current/Total Marks, Wrong Answers, and Skipped Questions.
     - Includes a "Review Answer" feature comparing student choices directly with correct answer keys.

5. Resources (/portal/resources):
   - Displays subject folders created by the admin.
   - Grid/List view toggle button.
   - Clicking any resource card opens the Google Drive link in a new browser tab (`target="_blank"`).

6. Payment (/portal/payment):
   - Top Section: Status card for current 8-class/12-class cycle (Green = Completed, Red = Due) along with dates of conducted classes.
   - History Section: Vertical list showing up to 3 recent past cycle cards, with a "See More" button for pagination.
   - Bottom Section: Display admin-configured Bank and MFS transfer details cards for manual transfers.

DIRECT ADMIN TRIGGER & NOTIFICATIONS:
-------------------------------------
- Admin interface functionality to push individual Notices (Title, Content) or shared Resources (Folder, Subject, Drive Link, Thumbnail, Note) directly to targeted student IDs.
- Automatic notification creation in the student's top-bar notification dropdown upon push.

SECURITY & ROW LEVEL SECURITY (RLS):
-----------------------------------
- Enforce strict Supabase RLS policies ensuring students can query and access ONLY their own user records (`auth.uid() = student_id`).



Note :
1. if you need anything update on DB then just ask me and will provide the schema , I will manually handle them.
2. Backend logic : Ensure all backend logic are perfectly workable and optimize for the section . (don;t mistake or miss any backend logic. ) must act as a senior and expert backend engineer.
3 dont touch other UI and functionality. just work on Student panel
4. Must give me the best and proper output with less token burn . so work efficiently.
