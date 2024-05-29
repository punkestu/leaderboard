import { v4 as uuidv4 } from 'uuid';
import { GAME_IS_EXISTS } from '../constants.js';

/**
 * @param {import('mysql2/promise').Connection} db
 * @param {string} gameName
 * @param {string} email
 * 
 * @returns {Promise<string|null>}
 */
export default async function (db, gameName, email) {
	const games = await db.execute('SELECT * FROM game WHERE name = ?', [gameName]);
	if (games && Array.isArray(games[0]) && games[0].length > 0) {
		return GAME_IS_EXISTS;
	}
	const key = uuidv4();
	await db.query('INSERT INTO game (name, `key`, email) VALUES (?, ?, ?)', [gameName, key, email]);
	return key;
}
