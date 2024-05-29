/**
 * @param {import('mysql2/promise').Connection} db
 *
 * @returns {Promise<string[]>}
 */
export default async function (db) {
	const [rows] = await db.query('SELECT name FROM game');
	const leaderboard = Array.isArray(rows) ? rows.map((/** @type {any} */ row) => row.name) : [];

	return leaderboard;
}
