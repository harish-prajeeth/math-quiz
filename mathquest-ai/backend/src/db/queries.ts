/**
 * SQL queries for PostgreSQL database operations
 */

export const SQL = {
  // Players
  INSERT_PLAYER: `
    INSERT INTO players (grade, nickname, avatar_id)
    VALUES ($1, $2, $3)
    RETURNING id, grade, nickname, avatar_id, created_at, updated_at;
  `,
  GET_PLAYER_BY_ID: `
    SELECT id, grade, nickname, avatar_id, created_at, updated_at
    FROM players
    WHERE id = $1;
  `,

  // Topics
  UPSERT_TOPIC: `
    INSERT INTO topics (slug, title, description, grade, standard_code, sort_order)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (slug) DO UPDATE
      SET title = EXCLUDED.title,
          description = EXCLUDED.description,
          standard_code = EXCLUDED.standard_code,
          sort_order = EXCLUDED.sort_order
    RETURNING id, slug, title, description, grade, standard_code, sort_order;
  `,
  GET_TOPICS: `
    SELECT id, slug, title, description, grade, standard_code, sort_order
    FROM topics
    WHERE is_active = TRUE
    ORDER BY sort_order ASC;
  `,
  GET_TOPIC_BY_SLUG: `
    SELECT id, slug, title, description, grade, standard_code, sort_order
    FROM topics
    WHERE slug = $1 AND is_active = TRUE;
  `,

  // Questions
  INSERT_QUESTION: `
    INSERT INTO questions (topic_id, question_text, options, correct_index, explanation, difficulty, source, validation_status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, topic_id, question_text, options, correct_index, explanation, difficulty, source, validation_status;
  `,
  GET_QUESTIONS_FOR_TOPIC: `
    SELECT id, topic_id, question_text, options, correct_index, explanation, difficulty, source, validation_status
    FROM questions
    WHERE topic_id = $1 AND is_active = TRUE;
  `,
  GET_QUESTION_BY_ID: `
    SELECT id, topic_id, question_text, options, correct_index, explanation, difficulty, source, validation_status
    FROM questions
    WHERE id = $1;
  `,

  // Quiz Sessions
  CREATE_SESSION: `
    INSERT INTO quiz_sessions (
      player_id, topic_id, status, total_questions, current_position,
      current_difficulty, score, correct_count, adaptive_streak, combo, best_combo,
      served_question_ids, powerup_used, hidden_option_indices
    ) VALUES ($1, $2, 'active', 10, 0, $3, 0, 0, 0, 0, 0, $4, FALSE, '{}')
    RETURNING *;
  `,
  GET_SESSION_BY_ID: `
    SELECT * FROM quiz_sessions WHERE id = $1;
  `,
  UPDATE_SESSION_PROGRESS: `
    UPDATE quiz_sessions
    SET current_position = $2,
        current_difficulty = $3,
        score = $4,
        correct_count = $5,
        adaptive_streak = $6,
        combo = $7,
        best_combo = $8,
        powerup_used = $9,
        powerup_question_id = $10,
        hidden_option_indices = $11,
        status = $12,
        xp_earned = $13,
        stars = $14,
        rewards_finalized = $15,
        completed_at = $16,
        updated_at = NOW()
    WHERE id = $1
    RETURNING *;
  `,

  // Quiz Answers
  INSERT_ANSWER: `
    INSERT INTO quiz_answers (
      session_id, question_id, selected_index, is_correct, points_awarded, difficulty_at_answer, used_powerup
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (session_id, question_id) DO NOTHING
    RETURNING *;
  `,
  GET_ANSWERS_FOR_SESSION: `
    SELECT * FROM quiz_answers WHERE session_id = $1 ORDER BY answered_at ASC;
  `,

  // Player Progress
  UPSERT_PROGRESS: `
    INSERT INTO player_progress (player_id, total_xp, player_level, quests_completed, updated_at)
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (player_id) DO UPDATE
      SET total_xp = EXCLUDED.total_xp,
          player_level = EXCLUDED.player_level,
          quests_completed = EXCLUDED.quests_completed,
          updated_at = NOW()
    RETURNING *;
  `,
  GET_PROGRESS: `
    SELECT player_id, total_xp, player_level, quests_completed, updated_at
    FROM player_progress
    WHERE player_id = $1;
  `,

  // Player Topic Progress
  UPSERT_TOPIC_PROGRESS: `
    INSERT INTO player_topic_progress (player_id, topic_id, total_stars, best_score_percent, quests_completed, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    ON CONFLICT (player_id, topic_id) DO UPDATE
      SET total_stars = GREATEST(player_topic_progress.total_stars, EXCLUDED.total_stars),
          best_score_percent = GREATEST(player_topic_progress.best_score_percent, EXCLUDED.best_score_percent),
          quests_completed = player_topic_progress.quests_completed + 1,
          updated_at = NOW()
    RETURNING *;
  `,
  GET_ALL_TOPIC_PROGRESS: `
    SELECT topic_id, total_stars, best_score_percent, quests_completed
    FROM player_topic_progress
    WHERE player_id = $1;
  `,

  // Badges
  GET_BADGES: `
    SELECT id, slug, name, description, icon FROM badges ORDER BY slug ASC;
  `,
  GET_PLAYER_BADGES: `
    SELECT b.id, b.slug, b.name, b.description, b.icon, pb.earned_at
    FROM player_badges pb
    JOIN badges b ON pb.badge_id = b.id
    WHERE pb.player_id = $1;
  `,
  AWARD_BADGE: `
    INSERT INTO player_badges (player_id, badge_id)
    VALUES ($1, $2)
    ON CONFLICT (player_id, badge_id) DO NOTHING
    RETURNING *;
  `,
};
