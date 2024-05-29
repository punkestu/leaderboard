import { error, json } from '@sveltejs/kit';
import getLeaderBoards from '$lib/functions/getLeaderBoards.js';
import createLeaderBoard from '$lib/functions/createLeaderBoard.js';
import { db } from '$lib/utils/db.js';
import { GAME_IS_EXISTS } from '$lib/constants';

export async function GET() {
	try {
		const DB = await db();
		const leaderboard = await getLeaderBoards(DB);
		DB.destroy();
		return json({
			body: {
				leaderboard
			}
		});
	} catch (/** @type {any} */ e) {
		return error(500, { message: 'Internal server error' });
	}
}

export async function POST({ request }) {
	try {
		const DB = await db();
		const { game, email } = await request.json();
		const key = await createLeaderBoard(DB, game, email);
		DB.destroy();
		if (key === GAME_IS_EXISTS) {
			throw new Error(GAME_IS_EXISTS);
		}
		return json({
			body: {
				message: 'Leaderboard created',
				key
			}
		});
	} catch (/** @type {any} */ e) {
		if (e.message === GAME_IS_EXISTS) {
			return error(409, { message: 'Leaderboard already exists' });
		}
		return error(500, { message: 'Internal server error' });
	}
}
