-- ============================================================================
-- EduTrack AI - Supabase Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/kwnpeveeeyqjzrnrhrth/sql
-- ============================================================================

-- 1. Profiles Table (Students, Faculty, Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT 'Student',
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    course TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    xp_reward INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT DEFAULT 'Faculty',
    tag TEXT DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. AI Chat Messages Table (AI Academic Assistant History)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT DEFAULT 'default',
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Permissive policies for quick prototyping with anon key
CREATE POLICY "Public profiles are readable" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public assignments are readable and writable" ON public.assignments FOR ALL USING (true);
CREATE POLICY "Public announcements are readable and writable" ON public.announcements FOR ALL USING (true);
CREATE POLICY "Public chat messages are readable and writable" ON public.chat_messages FOR ALL USING (true);

-- Insert Sample Data
INSERT INTO public.assignments (title, course, due_date, status, xp_reward) VALUES
('Data Structures Problem Set 4', 'Computer Science 101', now() + interval '2 days', 'pending', 150),
('Physics Lab Report: Optics', 'Physics 202', now() + interval '4 days', 'pending', 100),
('Calculus Quiz 3 Review', 'Math 150', now() + interval '1 day', 'pending', 120),
('History Essay: Renaissance', 'History 105', now() - interval '1 day', 'completed', 200)
ON CONFLICT DO NOTHING;

INSERT INTO public.announcements (title, content, author, tag) VALUES
('Midterm Schedule Released', 'Midterm examinations will take place next week. Check your student portal for exact hall allocations.', 'Dean of Academics', 'Exam'),
('Extended Library Hours', 'The campus library will remain open until 10:00 PM throughout exam week.', 'Campus Services', 'Notice')
ON CONFLICT DO NOTHING;

INSERT INTO public.chat_messages (role, content) VALUES
('assistant', 'Hi! I am your EduTrack AI Assistant connected directly to your Supabase academic database. Ask me about your assignments, study tips, or to summarize any topic!')
ON CONFLICT DO NOTHING;
