-- =====================================================
-- MathQuest AI: Initial PostgreSQL Schema (Migration 001)
-- =====================================================

BEGIN;

-- 1. PLAYERS
-- Anonymous player profiles; no real name required.
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade SMALLINT NOT NULL CHECK (grade IN (5, 6)),
    nickname VARCHAR(24),
    avatar_id VARCHAR(40) NOT NULL DEFAULT 'default',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TOPICS
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    grade SMALLINT NOT NULL CHECK (grade IN (5, 6)),
    standard_code VARCHAR(100),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. QUESTIONS
-- Correct answers remain on the server.
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES topics(id),
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_index SMALLINT NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
    explanation TEXT NOT NULL DEFAULT '',
    difficulty VARCHAR(12) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    source VARCHAR(30) NOT NULL DEFAULT 'curated' CHECK (source IN ('curated', 'generated', 'imported')),
    validation_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (validation_status IN (
        'pending', 'machine_validated', 'math_validated', 'human_reviewed'
    )),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (
        jsonb_typeof(options) = 'array' AND jsonb_array_length(options) = 4
    )
);

CREATE INDEX IF NOT EXISTS idx_questions_topic_difficulty ON questions(topic_id, difficulty) WHERE is_active = TRUE;

-- 4. QUIZ SESSIONS
-- Stores the state needed to resume a quest after refresh.
CREATE TABLE IF NOT EXISTS quiz_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id),
    topic_id UUID NOT NULL REFERENCES topics(id),
    status VARCHAR(12) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
    total_questions SMALLINT NOT NULL DEFAULT 10 CHECK (total_questions = 10),
    current_position SMALLINT NOT NULL DEFAULT 0 CHECK (current_position BETWEEN 0 AND 10),
    current_difficulty VARCHAR(12) NOT NULL DEFAULT 'easy' CHECK (current_difficulty IN ('easy', 'medium', 'hard')),
    score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
    correct_count SMALLINT NOT NULL DEFAULT 0 CHECK (correct_count BETWEEN 0 AND 10),
    adaptive_streak SMALLINT NOT NULL DEFAULT 0 CHECK (adaptive_streak >= 0),
    combo SMALLINT NOT NULL DEFAULT 0 CHECK (combo >= 0),
    best_combo SMALLINT NOT NULL DEFAULT 0 CHECK (best_combo >= 0),
    served_question_ids UUID[] NOT NULL DEFAULT '{}',
    powerup_used BOOLEAN NOT NULL DEFAULT FALSE,
    powerup_question_id UUID REFERENCES questions(id),
    hidden_option_indices SMALLINT[] NOT NULL DEFAULT '{}',
    xp_earned INTEGER NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
    stars SMALLINT NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
    rewards_finalized BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sessions_player_created ON quiz_sessions(player_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON quiz_sessions(player_id, status) WHERE status = 'active';

-- 5. QUIZ ANSWERS
-- Unique session/question prevents duplicate answer records.
CREATE TABLE IF NOT EXISTS quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES quiz_sessions(id),
    question_id UUID NOT NULL REFERENCES questions(id),
    selected_index SMALLINT NOT NULL CHECK (selected_index BETWEEN 0 AND 3),
    is_correct BOOLEAN NOT NULL,
    points_awarded INTEGER NOT NULL DEFAULT 0 CHECK (points_awarded >= 0),
    difficulty_at_answer VARCHAR(12) NOT NULL CHECK (difficulty_at_answer IN ('easy', 'medium', 'hard')),
    used_powerup BOOLEAN NOT NULL DEFAULT FALSE,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_answers_session ON quiz_answers(session_id, answered_at);

-- 6. PLAYER PROGRESS
-- One overall progress record per player.
CREATE TABLE IF NOT EXISTS player_progress (
    player_id UUID PRIMARY KEY REFERENCES players(id),
    total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
    player_level INTEGER NOT NULL DEFAULT 1 CHECK (player_level >= 1),
    quests_completed INTEGER NOT NULL DEFAULT 0 CHECK (quests_completed >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PLAYER TOPIC PROGRESS
-- Tracks stars and best results separately for each topic.
CREATE TABLE IF NOT EXISTS player_topic_progress (
    player_id UUID NOT NULL REFERENCES players(id),
    topic_id UUID NOT NULL REFERENCES topics(id),
    total_stars INTEGER NOT NULL DEFAULT 0 CHECK (total_stars >= 0),
    best_score_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (best_score_percent BETWEEN 0 AND 100),
    quests_completed INTEGER NOT NULL DEFAULT 0 CHECK (quests_completed >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (player_id, topic_id)
);

-- 8. BADGES
-- Defines available achievements.
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'trophy',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. PLAYER BADGES
-- Each badge can be awarded to a player only once.
CREATE TABLE IF NOT EXISTS player_badges (
    player_id UUID NOT NULL REFERENCES players(id),
    badge_id UUID NOT NULL REFERENCES badges(id),
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (player_id, badge_id)
);

-- Seed Initial Badges
INSERT INTO badges (slug, name, description, icon) VALUES
  ( 'first-quest', 'First Quest', 'Complete your first math quest.', 'flag' ),
  ( 'combo-5', 'Combo Starter', 'Answer five questions correctly in a row.', 'zap' ),
  ( 'perfect-quest', 'Perfect Quest', 'Answer all ten questions correctly.', 'star' ),
  ( 'jungle-explorer', 'Jungle Explorer', 'Complete a Grade 5 Jungle Quest.', 'leaf' ),
  ( 'space-explorer', 'Space Explorer', 'Complete a Grade 6 Space Mission.', 'rocket' )
ON CONFLICT (slug) DO NOTHING;

COMMIT;
