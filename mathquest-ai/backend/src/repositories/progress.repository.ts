import { query, isDbConnected } from '../db/pool';
import { SQL } from '../db/queries';

export interface PlayerProgressRecord {
  playerId: string;
  playerLevel: number;
  xp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  completedMissions: Record<string, number>;
  starsByTopic?: Record<string, number>;
  badges: string[];
}

export interface BadgeRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  hint?: string;
  icon?: string;
}

const inMemoryProgress = new Map<string, PlayerProgressRecord>();

const DEFAULT_BADGES: BadgeRecord[] = [
  { id: 'first-quest', slug: 'first-quest', title: 'First Quest', description: 'Complete your first math quest.', hint: 'Finish any quest on the map.', icon: '🎯' },
  { id: 'combo-5', slug: 'combo-5', title: 'Combo Starter', description: 'Answer five questions correctly in a row.', hint: 'Hit combo x5 in battle.', icon: '⚡' },
  { id: 'perfect-quest', slug: 'perfect-quest', title: 'Perfect Quest', description: 'Answer all ten questions correctly.', hint: 'Score 10/10 on a quest.', icon: '⭐' },
  { id: 'perfect-score', slug: 'perfect-score', title: 'Perfect Score', description: 'Answered every question correctly!', hint: 'Score 10/10 on a quest.', icon: '⭐' },
  { id: 'jungle-explorer', slug: 'jungle-explorer', title: 'Jungle Explorer', description: 'Complete a Grade 5 Jungle Quest.', hint: 'Conquer the Vine Guardian.', icon: '🍃' },
  { id: 'space-explorer', slug: 'space-explorer', title: 'Space Explorer', description: 'Complete a Grade 6 Space Mission.', hint: 'Tame the Asteroid Beast.', icon: '🚀' },
  { id: 'math-explorer', slug: 'math-explorer', title: 'Math Explorer', description: 'Explored a new math topic!', hint: 'Try a new mission on the map.', icon: '🧭' },
  { id: 'quest-complete', slug: 'quest-complete', title: 'Quest Complete', description: 'Finished all 10 questions in a quest.', hint: 'Complete all questions.', icon: '🏆' },
  { id: 'rising-star', slug: 'rising-star', title: 'Rising Star', description: 'Scored over 70% in a quest.', hint: 'Get 7 or more questions right.', icon: '🌟' },
  { id: 'hard-mode-hero', slug: 'hard-mode-hero', title: 'Hard Mode Hero', description: 'Answered a hard question correctly.', hint: 'Build a streak to reach Master tier.', icon: '💪' },
];

export const ProgressRepository = {
  async getBadges(): Promise<BadgeRecord[]> {
    if (isDbConnected()) {
      try {
        const res = await query(SQL.GET_BADGES);
        if (res.rows.length > 0) {
          return res.rows.map(r => ({
            id: r.slug,
            slug: r.slug,
            title: r.name,
            description: r.description,
            hint: r.description,
            icon: r.icon,
          }));
        }
      } catch (err) {
        console.warn('Postgres error fetching badges:', err);
      }
    }
    return DEFAULT_BADGES;
  },

  async getPlayerProgress(playerId: string): Promise<PlayerProgressRecord | null> {
    if (inMemoryProgress.has(playerId)) {
      return inMemoryProgress.get(playerId)!;
    }

    if (isDbConnected()) {
      try {
        const progRes = await query(SQL.GET_PROGRESS, [playerId]);
        if (progRes.rows.length > 0) {
          const row = progRes.rows[0];
          const totalXp = row.total_xp;
          const level = row.player_level;
          const xpIntoLevel = totalXp % 100;

          // Topic progress
          const topicRes = await query(SQL.GET_ALL_TOPIC_PROGRESS, [playerId]);
          const completedMissions: Record<string, number> = {};
          topicRes.rows.forEach(tr => {
            completedMissions[tr.topic_id] = tr.total_stars;
          });

          // Badges
          const badgeRes = await query(SQL.GET_PLAYER_BADGES, [playerId]);
          const badges = badgeRes.rows.map(br => br.slug);

          const record: PlayerProgressRecord = {
            playerId,
            playerLevel: level,
            xp: totalXp,
            xpIntoLevel,
            xpForNextLevel: 100,
            completedMissions,
            starsByTopic: completedMissions,
            badges: badges.length > 0 ? badges : ['first-quest'],
          };
          inMemoryProgress.set(playerId, record);
          return record;
        }
      } catch (err) {
        console.warn('Postgres error fetching player progress:', err);
      }
    }

    return null;
  },

  async savePlayerProgress(record: PlayerProgressRecord): Promise<void> {
    inMemoryProgress.set(record.playerId, record);

    if (isDbConnected()) {
      try {
        // Upsert overall progress
        await query(SQL.UPSERT_PROGRESS, [
          record.playerId,
          record.xp,
          record.playerLevel,
          Object.keys(record.completedMissions).length,
        ]);

        // Upsert topic progress
        for (const [topicId, stars] of Object.entries(record.completedMissions)) {
          await query(SQL.UPSERT_TOPIC_PROGRESS, [
            record.playerId,
            topicId,
            stars,
            stars * 33.33,
            1,
          ]);
        }
      } catch (err) {
        console.warn('Postgres error saving player progress:', err);
      }
    }
  },

  async awardBadge(playerId: string, badgeSlug: string): Promise<void> {
    const prog = inMemoryProgress.get(playerId);
    if (prog && !prog.badges.includes(badgeSlug)) {
      prog.badges.push(badgeSlug);
    }

    if (isDbConnected()) {
      try {
        // Find badge ID
        const bRes = await query('SELECT id FROM badges WHERE slug = $1', [badgeSlug]);
        if (bRes.rows.length > 0) {
          const badgeId = bRes.rows[0].id;
          await query(SQL.AWARD_BADGE, [playerId, badgeId]);
        }
      } catch (err) {
        console.warn('Postgres error awarding badge:', err);
      }
    }
  },
};
