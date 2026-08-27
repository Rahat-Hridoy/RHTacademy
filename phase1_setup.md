# Phase 1: Database Schema, RLS Policies, Environment Variables & CLI Setup

## 1. Supabase SQL Migration Script

> [!IMPORTANT]
> **COPY AND PASTE THE FOLLOWING SQL BLOCK INTO YOUR SUPABASE SQL EDITOR.**
> This single block contains all tables, constraints, and Row Level Security (RLS) policies.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TABLES CREATION
-- ==========================================

-- profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    full_name TEXT,
    class TEXT,
    gender TEXT,
    institute TEXT,
    avatar_url TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    account_status TEXT CHECK (account_status IN ('active', 'paused')) DEFAULT 'active',
    admin_custom_name TEXT,
    admin_custom_class TEXT,
    admin_custom_institute TEXT,
    schedule_time TEXT,
    payment_cycle_limit INTEGER CHECK (payment_cycle_limit IN (8, 12)) DEFAULT 8,
    due_payment_alert BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- registration_requests
CREATE TABLE registration_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    class TEXT NOT NULL,
    gender TEXT NOT NULL,
    institute TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'refused')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- booking_requests
CREATE TABLE booking_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    selected_subject TEXT NOT NULL,
    class_time TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'contacted')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique partial index for booking_requests (one active booking per email)
CREATE UNIQUE INDEX idx_booking_requests_unique_active_email
ON booking_requests (email)
WHERE status IN ('pending', 'contacted');

-- contact_messages
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    class_type TEXT CHECK (class_type IN ('onsite', 'online')) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- payment_cycles
CREATE TABLE payment_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    cycle_number INTEGER NOT NULL,
    total_classes_count INTEGER DEFAULT 0,
    cycle_class_limit INTEGER DEFAULT 8,
    payment_status TEXT CHECK (payment_status IN ('due', 'completed')) DEFAULT 'due',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- payment_methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT CHECK (type IN ('bank', 'mfs')) NOT NULL,
    name TEXT NOT NULL,
    account_name TEXT,
    account_number TEXT NOT NULL,
    branch_name TEXT,
    swift_code TEXT,
    routing_number TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- notices
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- resource_folders
CREATE TABLE resource_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    parent_folder_id UUID REFERENCES resource_folders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- resources
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES resource_folders(id) ON DELETE CASCADE,
    folder_name TEXT,
    subject TEXT,
    drive_link TEXT NOT NULL,
    thumbnail_url TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- about_me
CREATE TABLE about_me (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    about_me_photo TEXT,
    name TEXT NOT NULL,
    degree TEXT,
    institute TEXT,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- booking_cards
CREATE TABLE booking_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT CHECK (category IN ('SSC', 'HSC')) NOT NULL,
    label_name TEXT NOT NULL,
    badge TEXT,
    icons TEXT,
    subjects TEXT[] DEFAULT '{}',
    s_note TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- schedule_booking
CREATE TABLE schedule_booking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    available_seat INTEGER DEFAULT 1,
    available_time TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- admin_auth_logs
CREATE TABLE admin_auth_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address TEXT UNIQUE NOT NULL,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==========================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_me ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_auth_logs ENABLE ROW LEVEL SECURITY;

-- Students can strictly access/update ONLY their own records
CREATE POLICY "Students can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can view their own attendance" ON attendance FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view their own payment_cycles" ON payment_cycles FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view their own notices" ON notices FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view their own resource_folders" ON resource_folders FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view their own resources" ON resources FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = student_id);

-- Public visitors can insert into public request tables
CREATE POLICY "Public can insert registration_requests" ON registration_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert booking_requests" ON booking_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Public visitors can read landing page CMS tables
CREATE POLICY "Public can read about_me" ON about_me FOR SELECT USING (true);
CREATE POLICY "Public can read booking_cards" ON booking_cards FOR SELECT USING (true);
CREATE POLICY "Public can read schedule_booking" ON schedule_booking FOR SELECT USING (true);
CREATE POLICY "Public can read payment_methods" ON payment_methods FOR SELECT USING (true);

-- (Admins will bypass RLS entirely by using the Supabase Service Role key in the server backend, or custom Admin policies can be added if using a specific admin role.)
```

## 2. Environment Variables

Create a `.env.local` file in your root project directory and add the following keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend API (For Email Notifications)
RESEND_API_KEY=your_resend_api_key

# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Admin Authentication
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_secure_password
```

## 3. Terminal Setup CLI Commands

Run these commands in your terminal to initialize the project, components, and dependencies.

```bash
# 1. Initialize Next.js project (if not already created)
# Note: Since you are already in the project folder, you can run:
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# 2. Initialize Shadcn UI (Accept default values when prompted)
npx shadcn@latest init -d

# 3. Add necessary Shadcn UI components for this project
npx shadcn@latest add button card input label form table tabs dialog dropdown-menu avatar badge toast popover calendar alert scroll-area checkbox switch

# 4. Install required core NPM packages
npm install @supabase/supabase-js @supabase/ssr resend lucide-react framer-motion react-google-recaptcha date-fns react-hook-form @hookform/resolvers zod
```
