-- Ensure we are working with the public schema
SET search_path TO public;

-- 1. Create School & Campus
INSERT INTO schools (id, name, motto, city, province)
VALUES ('11111111-1111-1111-1111-111111111111', 'P2P Alpha Academy', 'Nurturing Magic Every Day', 'Bulawayo', 'Bulawayo')
ON CONFLICT DO NOTHING;

INSERT INTO campuses (id, school_id, name, is_main)
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Main Campus', true)
ON CONFLICT DO NOTHING;

-- 2. Note on Profiles & Users:
-- Since auth.users is managed by Supabase Auth, we normally can't insert into public.profiles 
-- without a corresponding auth.user due to the foreign key constraint. 
-- For this MVP demo, we will temporarily drop the foreign key constraint to insert mock profiles, 
-- or we can create real users later.
-- To allow mock data, let's temporarily alter the profiles table to remove the FK on id:
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

INSERT INTO profiles (id, school_id, campus_id, full_name, role) VALUES 
('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Principal Sibanda', 'school_head'),
('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Mrs. Chipo Ndlovu', 'teacher'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Mr. Themba Moyo', 'teacher'),
('33333333-3333-3333-3333-333333333334', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Miss Sharon Ncube', 'teacher')
ON CONFLICT (id) DO NOTHING;

-- 3. Create Classes
INSERT INTO classes (id, campus_id, school_id, name, level, teacher_id, learner_count, academic_year) VALUES 
('44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'ECD A - Green Frogs', 'ecd_a', '33333333-3333-3333-3333-333333333332', 15, 2026),
('44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'ECD B - Golden Stars', 'ecd_b', '33333333-3333-3333-3333-333333333333', 20, 2026),
('44444444-4444-4444-4444-444444444443', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'ECD A - Playful Pandas', 'ecd_a', '33333333-3333-3333-3333-333333333334', 18, 2026)
ON CONFLICT (id) DO NOTHING;

-- 4. Learning Areas & Themes (Zim Heritage Curriculum)
INSERT INTO learning_areas (id, school_id, name, description, icon) VALUES 
('55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', 'Physical Development', 'Gross & fine motor games', '🏃'),
('55555555-5555-5555-5555-555555555552', '11111111-1111-1111-1111-111111111111', 'Language & Literacy', 'Rhymes, storytelling', '📖'),
('55555555-5555-5555-5555-555555555553', '11111111-1111-1111-1111-111111111111', 'Mathematical Concepts', 'Shapes, counting, patterns', '🔢')
ON CONFLICT (id) DO NOTHING;

INSERT INTO themes (id, school_id, name, term, week_start) VALUES 
('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', 'Wild Animals', 1, 1),
('66666666-6666-6666-6666-666666666662', '11111111-1111-1111-1111-111111111111', 'My Garden & Plants', 1, 5)
ON CONFLICT (id) DO NOTHING;

-- 5. Movement Data
INSERT INTO programme_coverage (class_id, week_start, running, jumping, balance, throwing, catching, total_sessions) VALUES 
('44444444-4444-4444-4444-444444444441', date_trunc('week', now())::date, 5, 2, 4, 1, 1, 13),
('44444444-4444-4444-4444-444444444442', date_trunc('week', now())::date, 5, 3, 2, 4, 1, 15)
ON CONFLICT (class_id, week_start) DO NOTHING;

-- 6. Quality Checks
INSERT INTO teacher_checkins (teacher_id, week_start, confidence_level, support_needed, support_topic, highlights, challenges) VALUES 
('33333333-3333-3333-3333-333333333332', date_trunc('week', now())::date, 5, false, null, 'Successfully completed underarm bucket toss with all 15 toddlers! 🎯', 'Need more clean sand for the sandbox activity next week.'),
('33333333-3333-3333-3333-333333333333', date_trunc('week', now())::date, 4, true, 'Flamingo Balance techniques', 'Children loved the Tyre Hop Obstacle Course. Great agility! 🦘', 'A few learners are still working on one-leg Flamingo balance.')
ON CONFLICT DO NOTHING;

INSERT INTO quality_indicators (school_id, week_start, curriculum_score, record_score, movement_score, teacher_score, overall_pulse, pulse_label) VALUES 
('11111111-1111-1111-1111-111111111111', date_trunc('week', now())::date, 74, 95, 88, 90, 92, 'excellent')
ON CONFLICT (school_id, week_start) DO NOTHING;
