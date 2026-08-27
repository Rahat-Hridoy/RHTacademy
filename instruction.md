Act as a Senior Full-Stack Engineer. We are building "RHTacademy" (Student Management Platform) using Next.js latest (App Router), Tailwind CSS, Shadcn UI, Supabase (PostgreSQL), Resend, and Google reCAPTCHA.

***Phase 1: Database Schema, RLS Policies, Environment Variables & CLI Setup.***

1. Provide the complete Supabase SQL migration script for PostgreSQL database. Generate exact table definitions, primary keys (UUID), foreign key constraints with cascade deletes, indexes, and dynamic check constraints for:
   - profiles: (id [UUID auth.users PK], username [UNIQUE], email [UNIQUE], phone_number, full_name, class, gender, institute, avatar_url, is_approved [default false], account_status ['active'/'paused'], admin_custom_name, admin_custom_class, admin_custom_institute, schedule_time, payment_cycle_limit [8 or 12, default 8], due_payment_alert [boolean default false], created_at, updated_at)
   - registration_requests: (id, name, email, phone, class, gender, institute, status ['pending'/'approved'/'refused'], created_at)
   - booking_requests: (id, name, email, phone, selected_subject, class_time, status ['pending'/'contacted'], created_at) -> INCLUDE a unique partial index so an email can only have ONE active pending/contacted booking at a time!
   - contact_messages: (id, name, email, message, created_at)
   - attendance: (id, student_id [FK profiles], date, class_type ['onsite'/'online'], completed [boolean], created_at)
   - payment_cycles: (id, student_id [FK profiles], cycle_number, total_classes_count, cycle_class_limit, payment_status ['due'/'completed'], paid_at, created_at, updated_at)
   - payment_methods: (id, type ['bank'/'mfs'], name, account_name, account_number, branch_name, swift_code, routing_number, icon, created_at)
   - notices: (id, student_id [FK profiles], title, content, created_at)
   - resource_folders: (id, student_id [FK profiles], name, parent_folder_id [FK self for subfolders], created_at)
   - resources: (id, student_id [FK profiles], folder_id [FK resource_folders], folder_name, subject, drive_link, thumbnail_url, note, created_at)
   - notifications: (id, student_id [FK profiles], title, message, is_read [boolean default false], created_at)
   - about_me: (id, about_me_photo, name, degree, institute, description, updated_at)
   - booking_cards: (id, category ['SSC'/'HSC'], label_name, badge, icons, subjects [ARRAY], s_note, updated_at)
   - schedule_booking: (id, available_seat [int default 1], available_time [ARRAY], updated_at)
   - admin_auth_logs: (id, ip_address [UNIQUE], failed_attempts [default 0], locked_until [TIMESTAMPTZ], updated_at)

2. Implement Row Level Security (RLS) policies ensuring:
   - Students can strictly access/update ONLY their own records (profiles, attendance, payment_cycles, notices, resource_folders, resources, notifications).
   - Public visitors can insert into registration_requests, booking_requests, contact_messages.
   - Public visitors can read landing page CMS tables (about_me, booking_cards, schedule_booking).

3. List all necessary environment variables for `.env.local` (Supabase, Resend, Recaptcha, Admin credentials).

4. Provide exact terminal setup CLI commands for Next.js, Shadcn UI components, and required NPM packages (@supabase/supabase-js, @supabase/ssr, resend, lucide-react, framer-motion, react-google-recaptcha, date-fns).

Note: Output production-ready clean SQL scripts and setup code. Do not attempt direct DB execution.

---------------------------------------------------------------------

***Phase 2: Authentication and Security Implementation for RHTacademy.***

Note : for UI follow the authPage.md file

Requirements:
1. Student Registration Flow:
   - Public registration form: Name, Class, Gender (Male/Female), Institute (optional), Phone, Email, Password with Show/Hide password toggle.
   - On submit, insert data into `registration_requests` table with status 'pending' and display: "Wait for Admin Review. After confirmation, you will be able to login."

2. Student Login & Password Reset:
   - Login page using Username or Email + Password. Include Google reCAPTCHA and Show/Hide password toggle.
   - Maintain 30-day session state.
   - Forgot Password Flow: Send 6-digit OTP to user email via Resend API (valid 3 minutes with UI countdown timer). On verification, allow user to set primary and confirm new password, then redirect to login.

3. Admin Authentication & Security (/admin):
   - Admin Login page at `/admin` requiring Username & Password.
   - Real-time password criteria checklist (uppercase, lowercase, number, special char, min 8 chars).
   - Session "Remember Me" for 7 days.
   - Brute-force protection: Track failed login attempts. After 5 failed attempts, trigger a 300-second lock (pessimistic lock). Subsequent failures lock out for 24 hours.

Generate modular React Server Actions and Next.js Auth handlers for this flow.

***Phase 3: Public Landing Page Development for RHTacademy.***

Note : for UI follow the landingPage.md file

Design Guidelines:
- Follow ui.md file for color palette and fonts .
- Single language (English only). Clean UI (follow ui.md file).

Sections:
1. Navbar: Floating centered navbar (Home, About, Book Schedule, Contact) + Top-right button "Login as Student".
2. Hero Section: Attractive Teaching Lottie Animation + CTA showcasing admin expertise.
3. About Me Section: Left part: Circular admin avatar frame, Name, Degree, Institute. Right part: Short descriptive biography (Fetched dynamically from `about_me`).
4. Book Schedule Section:
   - Two category cards: SSC (Physics, Chemistry, Biology, Math) and HSC (Physics, Chemistry, ICT).
   - Seat Availability Card , if there is no seat availalbe then the booking button will be desable to click. after successfull booking the seat number will be decrease 1. (Initially set to "1 Seat Available" , Available seat number dynamically fetched from DB).
   - Booking Flow: Clicking "Book Now" opens a modal (Name, Valid Email, Phone, Subjects, Available time slots dynamically fetched from DB).
   - On booking: Trigger email notification via Resend to Admin + show user message: "Admin will contact you within 24 hours" + save entry into `booking_requests`.
   note : one can book a seat only once by a email address. If user try again after one book (in the phase of pending / contacted) with same email address then prevent the booking for the email and show a message as 'The email is already booked a schedule'.
5. Contact Section: Contact form (Name, Email, Message) saving data to `contact_messages`.

Build clean Next.js UI components using Tailwind CSS and Framer Motion.

---------------------------------------------------------------

***Phase 4: Admin Panel Core & Unified Requests Management (/admin/dashboard).***

Task:
Create the Admin Dashboard layout with a unified "Requests" section.

Features:
1. Requests Hub:
   - Displays all incoming requests: Registration Requests, Booking Requests, and Contact Messages in one place.
   - Clear badge tags identifying request types (e.g., [REGISTRATION], [BOOKING], [CONTACT]).
   - Top Section: Highlighted cards for the latest incoming requests with a green dot alert indicator.
   - History List: Below the top cards, show a paginated table/list (5 items per page) of previous requests.
   - Actions:
     - For Registration Requests: "Confirm" button (moves user to `profiles` table, sets `is_approved = true`, sends approval email via Resend) and "Refuse" button (sends rejection email).
     - For Booking Requests: Option to mark status and send follow-up message to applicant.
   - Display an empty card state when no new requests exist.

Build responsive UI components using Tailwind CSS and Lucide icons.

***Phase 5: Admin Panel Student Management, Attendance , Payment Cycle & Landing page Controls.***

Note : for UI follow the adminPortal.md file

Features:
1. Student Management:
   - View mode toggles: List View (Avatar | Name | Class | Institute | View Detials) vs Grid View.
   - Search bar (by name, class, institute) and Sort options (Name, Registered date first/last).
   When admin click on View details button then a full section will open for the Student with Horizontal tab with sub section called "Profile", "Attandence", "Resource Share", "Sent Notice", "Payment", "Action"
   - Profile : Admin can see the student profile details , from here admin can edit the details of student (Name, Class, Institute). Admin can change them only for his own view. there will be original name , class and institute name besides admin can edit them for his own dashboard view. This change will no effect on Studnet endpoint.
   - Attendance : Admin can see the attendance of the student from here admin can mark attendance of student. and can see all previous attandance history in calenter view. admin can also set the schedule time for the student , so that student can see his schedule time in his own profile .
   - Resource Share : Admin can share resources to student with creating folder and sub folder  as like as google drive . And admin can create New Resource file after that a title field, drive-link field, thumbnail field and short note field will appear to instert data. after clicking the "Share Resource" button then the resoruce will share with the student and show a notifiation in notification icon. then studnet can see the resource as same as the admin set. thats mean resource card view will same both admin and student. 
   - Sent Notice : In the tab admin can sent notice to the studnet with Notice title, Description. Admin also can see the previously notice sent to the student as list view (after clicking the specific list then a detial will appear) with pagination (one page 5notice) view. Admin can also  delete the notice sent to the student. But After delete any notice , no need to notify it to the student. 
   - Payment : In the tab admin can see the payment history of the student as list view with payment status. (after clicking the specific list then a detial will appear) with pagination (one page 5payment) view. In this section Admin can specify the payment cycle of the student. Can update payemnt Status as Paid/ Due (if admin set Payemnt status as Paid then neet to set Payemt recive date as well).
    admin Can set a Alart for Due Payment ,then it will show as alart popup view (in the middle of the page) in student portal instantly when the studnet inter the portal. If the admin stop the alart for Due payment then it will stop showing alart popup in the student portal.
   - Action : Admin can pause , Delect the student account. IIf admin delect the account then student account will be deleted from the database.
   > pause / Resume account : if admin pause the account then student can login in but after login it will redirect to a new page and can see a message like "Your Student portal is Paused at this moment, please contact the admin for more information" and he/she not able to access his/her portal. and if admin resume the account then student will can redirect agian to his/her own portal after logged in.
   > Delete Account : if admin delete the student account then all info will remove from the database for the studnent_id.  But befor clicking delect a confirmation warning will must appear to the admin.  "Are you sure you want to delect this student?"

2. Attendance Tracker:
   - Interactive Calendar View to select specific dates.
   - Select Date -> List all students with toggle "Class Taken" (Onsite / Online).
   - Marking class completed updates student's conducted class count toward their 8-class payment cycle.

3. Payment Methods :
   - Payment Methods Admin: Add/Edit Bank Details (Bank Name, Account Name, Account Number, Branch, Swift, Routing) and MFS Details (bKash, Nagad, Rocket, Taptap icons + Account Number).

4. Landing Page (in this section appear sub-section called "About me", "Booking Card", "Schedule ")
   - About me: This section should display admin details (Name, Degree, Institute) along with a profile image. admin can chanage or update anything If he want.
   - Booking Card: This section should display booking card are already in appeared into landing page. admin can change or update anything If he want.
   - Schedule: This section should display schedule . admin can change or update Schedule time If he want.

Implement backend actions and frontend components for these admin tasks.

-----------------------------------------------------

***Phase 6: Student Portal Interface & Features (/portal/id=xxxxxxxxxxxxxxx).***

Note : for UI follow the studentPortal.md file

UI Layout:
- Top bar: Left "Student Portal" title, Right Notification icon (with dropdown popup) + Profile view avatar (male/female SVG default).
- Profile Modal: Click profile to update Avatar, edit Name, Class, Institute, Phone, email address, & Password. for change email address or password OTP will send to the old email address. After validation with otp then user can successfully change the email or password. 
- Left Sidebar: Dashboard, Track, Resource, Payment, Logout.

Page Components:
1. Dashboard:
   - Due Payment Warning: Red alert card at top ONLY if previous cycle status is "Due".
   - Class Track Card: Calendar view showing completed class dates (Green circle = Onsite, Sky-blue circle = Online) + Radial Gauge View in middle displaying completed classes out of 8-class cycle.
   - Notice Board: Displays latest 5 notices (Last-in-first-out order) with pagination.

2. Track Myself Tab: Show placeholder "Coming soon - Under development phase".

3. Resources Tab:
   - Display admin-created subject folders .
   - Grid/List view toggle. Clicking a resource card opens the Google Drive link in a new tab (`target="_blank"`).

4. Payment Tab:
   - Top Section: Show current 8-class/12-class cycle payment(as the admin set payment cycle type for the student) status card (Green = Completed, Red = Due) along with dates of the 8/12 conducted classes. Display up to 3 recent cycle cards with pagination for older ones as verticle card view. and after that student can see more by clicking "See More" button.
   - Bottom Section: Display Admin's configured Bank and MFS payment detail cards for student manual transfers.

5. Direct Notice/Resource Admin Trigger:
   - Create Admin interface to push individual notices (Title, Content) or shared Resources (Folder, Subject, Drive Link, Thumbnail, Note) directly to specific student dashboards and trigger notifications.

Ensure strict Supabase RLS policies so students view only their own records.

