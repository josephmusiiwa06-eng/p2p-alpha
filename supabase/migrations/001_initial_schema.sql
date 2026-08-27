-- Core Domain
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    motto TEXT,
    address TEXT,
    city TEXT,
    province TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE campuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    is_main BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id),
    campus_id UUID REFERENCES campuses(id),
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('school_head','teacher','admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id),
    name TEXT NOT NULL,
    level TEXT CHECK (level IN ('ecd_a','ecd_b')),
    teacher_id UUID REFERENCES profiles(id),
    learner_count INTEGER DEFAULT 0,
    academic_year INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Curriculum Domain
CREATE TABLE learning_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    term INTEGER,
    week_start INTEGER,
    week_end INTEGER
);

CREATE TABLE curriculum_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_area_id UUID NOT NULL REFERENCES learning_areas(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    competency_code TEXT
);

CREATE TABLE lesson_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES profiles(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    theme_id UUID REFERENCES themes(id),
    learning_area_id UUID REFERENCES learning_areas(id),
    title TEXT NOT NULL,
    objectives TEXT,
    activities JSONB DEFAULT '[]',
    resources JSONB DEFAULT '[]',
    teaching_approach TEXT[] DEFAULT '{}',
    duration_minutes INTEGER DEFAULT 30,
    assessment_notes TEXT,
    status TEXT CHECK (status IN ('draft','ready','delivered')) DEFAULT 'draft',
    scheduled_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE logbook_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_plan_id UUID NOT NULL REFERENCES lesson_plans(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    completed_at TIMESTAMPTZ DEFAULT now(),
    reflection_worked TEXT,
    reflection_difficult TEXT,
    reflection_change TEXT,
    participation_level TEXT CHECK (participation_level IN ('excellent','good','fair','poor')),
    notes TEXT
);

-- Movement Domain
CREATE TABLE skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT
);

CREATE TABLE movement_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    skill_category_id UUID REFERENCES skill_categories(id),
    equipment JSONB DEFAULT '[]',
    min_learners INTEGER DEFAULT 1,
    max_learners INTEGER DEFAULT 40,
    duration_minutes INTEGER DEFAULT 15,
    low_resource_friendly BOOLEAN DEFAULT true,
    instructions TEXT,
    created_by UUID REFERENCES profiles(id),
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE class_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id),
    session_date DATE NOT NULL,
    duration_minutes INTEGER,
    activities JSONB DEFAULT '[]',
    skill_categories_covered TEXT[] DEFAULT '{}',
    equipment_used JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE programme_coverage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    running INTEGER DEFAULT 0,
    jumping INTEGER DEFAULT 0,
    balance INTEGER DEFAULT 0,
    throwing INTEGER DEFAULT 0,
    catching INTEGER DEFAULT 0,
    coordination INTEGER DEFAULT 0,
    fine_motor INTEGER DEFAULT 0,
    rhythm INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    UNIQUE(class_id, week_start)
);

-- Quality Domain
CREATE TABLE teacher_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES profiles(id),
    week_start DATE NOT NULL,
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
    support_needed BOOLEAN DEFAULT false,
    support_topic TEXT,
    highlights TEXT,
    challenges TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quality_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    week_start DATE NOT NULL,
    curriculum_score DECIMAL(5,2),
    record_score DECIMAL(5,2),
    movement_score DECIMAL(5,2),
    teacher_score DECIMAL(5,2),
    readiness_score DECIMAL(5,2),
    overall_pulse DECIMAL(5,2),
    pulse_label TEXT CHECK (pulse_label IN ('excellent','good','needs_attention','critical')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(school_id, week_start)
);

CREATE TABLE attention_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    severity TEXT CHECK (severity IN ('red','amber','green')) NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    action_url TEXT,
    related_class_id UUID REFERENCES classes(id),
    related_teacher_id UUID REFERENCES profiles(id),
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE readiness_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    category TEXT NOT NULL,
    requirement TEXT NOT NULL,
    status TEXT CHECK (status IN ('complete','partial','missing')) DEFAULT 'missing',
    responsible_teacher_id UUID REFERENCES profiles(id),
    notes TEXT,
    due_date DATE,
    last_checked TIMESTAMPTZ
);

-- AI Domain
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    class_id UUID REFERENCES classes(id),
    teacher_id UUID REFERENCES profiles(id),
    insight_type TEXT CHECK (insight_type IN ('briefing','recommendation','alert','coaching')) NOT NULL,
    content TEXT NOT NULL,
    action_label TEXT,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ
);

CREATE TABLE ai_generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES profiles(id),
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    content_type TEXT CHECK (content_type IN ('lesson_plan','activity','suggestion')) NOT NULL,
    model_used TEXT DEFAULT 'gemini-2.0-flash',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Security Definer Functions
CREATE OR REPLACE FUNCTION public.current_user_school_id()
RETURNS UUID LANGUAGE SQL SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT school_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT LANGUAGE SQL SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- RLS Enables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE logbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE programme_coverage ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE attention_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE readiness_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_content ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Examples, to be expanded)
-- Profiles: Users can view profiles in their school. They can edit their own.
CREATE POLICY "View school profiles" ON profiles FOR SELECT USING (school_id = current_user_school_id());
CREATE POLICY "Edit own profile" ON profiles FOR UPDATE USING (id = auth.uid());

-- Schools: Head can view their own school.
CREATE POLICY "View own school" ON schools FOR SELECT USING (id = current_user_school_id());

-- Seed Data for Skill Categories
INSERT INTO skill_categories (name, description, icon) VALUES 
('Running', 'Locomotor skills involving moving rapidly on foot', '🏃'),
('Jumping', 'Propelling the body into the air and landing safely', '🦘'),
('Balance', 'Maintaining body equilibrium in stationary or moving tasks', '⚖️'),
('Throwing', 'Propelling an object through the air with hands', '⚾'),
('Catching', 'Receiving and controlling an airborne object', '👐'),
('Coordination', 'Combining movements smoothly and efficiently', '🔄'),
('Fine Motor', 'Small muscle movements, often involving hands and fingers', '🤏'),
('Rhythm', 'Moving in time with a beat or sound', '🎵')
ON CONFLICT (name) DO NOTHING;
