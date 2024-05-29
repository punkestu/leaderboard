import { GAME_KEY_INVALID, GAME_NOT_FOUND } from '$lib/constants';

/**
 * @param {import('mysql2/promise').Connection} db
 * @param {string} game
 * @param {string} key
 *
 * @returns {Promise<string|boolean>}
 */
export default async function (db, game, key) {
	await db.beginTransaction();
	/**
	 * @type {Array<any>}
	 */
	const [rows] = await db.query('SELECT id, name, `key` FROM game WHERE name = ?', [game]);
	if (Array.isArray(rows) && !rows.length) {
		return GAME_NOT_FOUND;
	}
	const gameRow = rows[0];
	if (gameRow.key !== key) {
		return GAME_KEY_INVALID;
	}
	await db.query('DELETE FROM game_leaderboard WHERE game_id = ?', [gameRow.id]);
	return true;
}
