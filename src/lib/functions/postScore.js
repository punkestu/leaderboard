import { maxLeaderboardSize } from '../constants.js';
import { GAME_KEY_INVALID, GAME_NOT_FOUND } from '../constants.js';

/**
 * @param {import('mysql2/promise').Connection} db
 * @param {string} game
 * @param {string} name
 * @param {number} score
 * @param {string} key
 *
 * @returns {Promise<boolean|string>}
 */
export default async function (db, game, name, score, key) {
	await db.beginTransaction();
	/**
	 * @type {Array<any>}
	 */
	const [rows] = await db.query('SELECT id, name, `key` FROM game WHERE name = ?', [game]);
	if (Array.isArray(rows) && !rows.length) {
		return GAME_NOT_FOUND;
	}
	/**
	 * @type {{ key: string; name: string; id: number;}}
	 */
	const gameRow = rows[0];
	if (gameRow.key !== key) {
		return GAME_KEY_INVALID;
	}
	/**
	 * @type {Array<any>}
	 */
	const [leaderboard] = await db.query(
		'SELECT * FROM game_leaderboard WHERE game_id = ? ORDER BY point ASC, created_at DESC',
		[gameRow.id]
	);
	const minScore = leaderboard[0] || null;
	if (minScore && leaderboard.length >= maxLeaderboardSize && score <= minScore.point) {
		await db.rollback();
		return false;
	}
	if (leaderboard.length >= maxLeaderboardSize) {
		await db.query('DELETE FROM game_leaderboard WHERE id=?', [minScore.id]);
	}
	await db.query('INSERT INTO game_leaderboard (game_id, name, point) VALUES (?, ?, ?)', [
		gameRow.id,
		name,
		score
	]);
	await db.commit();
	return true;
}
