/**
 * @param {import('mysql2/promise').Connection} db
 * @param {string} game
 * @param {string} email
 *
 * @returns {Promise<string|boolean>}
 */
export default async function (db, game, email) {
	/**
	 * @type {Array<any>}
	 */
	const [leaderboard] = await db.query('SELECT * FROM game WHERE name = ? AND email = ?', [
		game,
		email
	]);
	return leaderboard && leaderboard.length > 0 && leaderboard[0].key;
}
