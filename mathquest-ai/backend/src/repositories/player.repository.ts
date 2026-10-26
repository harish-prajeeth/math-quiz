import { query, isDbConnected } from '../db/pool';
import { SQL } from '../db/queries';

export interface PlayerRecord {
  id: string;
  grade: number;
  nickname: string;
  avatar_id: string;
  created_at: Date;
  updated_at: Date;
}

// In-memory fallback
const inMemoryPlayers = new Map<string, PlayerRecord>();

export const PlayerRepository = {
  async createPlayer(data: { grade: number; nickname?: string; avatarId?: number | string }): Promise<PlayerRecord> {
    const avatarIdStr = String(data.avatarId ?? '0');
    const nick = data.nickname?.trim() || 'Explorer';

    if (isDbConnected()) {
      try {
        const res = await query<PlayerRecord>(SQL.INSERT_PLAYER, [data.grade, nick, avatarIdStr]);
        return res.rows[0];
      } catch (err) {
        console.warn('Postgres error creating player, using memory fallback:', err);
      }
    }

    const id = crypto.randomUUID();
    const player: PlayerRecord = {
      id,
      grade: data.grade,
      nickname: nick,
      avatar_id: avatarIdStr,
      created_at: new Date(),
      updated_at: new Date(),
    };
    inMemoryPlayers.set(id, player);
    return player;
  },

  async getPlayerById(id: string): Promise<PlayerRecord | null> {
    if (isDbConnected()) {
      try {
        const res = await query<PlayerRecord>(SQL.GET_PLAYER_BY_ID, [id]);
        return res.rows[0] || null;
      } catch (err) {
        console.warn('Postgres error fetching player:', err);
      }
    }

    return inMemoryPlayers.get(id) || null;
  },
};
