/**
 * @param {import('mysql2/promise').Connection} db
 * @param {string} game
 *
 * @returns {Promise<{leaderboard: [{name: string, score: number}], name: string} | undefined>}
 */
export default async function (db, game) {
	/**
	 * @type {Array<any>}
	 */
	const [leaderboard] = await db.query(
		'SELECT * FROM game_leaderboard WHERE game_id = (SELECT id FROM game WHERE name = ?) ORDER BY point DESC',
		[game]
	);
	return (
		leaderboard && {
			name: game,
			leaderboard: leaderboard.map((/** @type {{ name: any; point: any; }} */ row) => ({
				name: row.name,
				score: row.point
			}))
		}
	);
}
