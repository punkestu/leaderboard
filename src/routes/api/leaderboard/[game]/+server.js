import { error, json } from '@sveltejs/kit';
import postScore from '$lib/functions/postScore';
import getLeaderBoard from '$lib/functions/getLeaderBoard';
import resetLeaderBoard from '$lib/functions/resetLeaderBoard';
import { db } from '$lib/utils/db';
import { GAME_KEY_INVALID, GAME_NOT_FOUND } from '$lib/constants';

export async function GET({ params }) {
	try {
		const DB = await db();
		const { game } = params;
		const leaderboard = await getLeaderBoard(DB, game);
		DB.destroy();
		if (!leaderboard) {
			throw new Error(GAME_NOT_FOUND);
		}
		return json({
			body: leaderboard
		});
	} catch (/** @type {any} */ e) {
		if (e.message === GAME_NOT_FOUND) {
			return error(404, { message: 'Leaderboard not found' });
		}
		console.log(e);
		return error(500, { message: 'Internal server error' });
	}
}

export async function POST({ params, request }) {
	try {
		const DB = await db();
		const { game } = params;
		const { name, score } = await request.json();
		if (typeof name !== 'string' || typeof score !== 'number') {
			throw new Error('Invalid input');
		}
		const key = request.headers.get('x-api-key');
		if (!key) {
			throw new Error('Unauthorized');
		}
		const added = await postScore(DB, game, name, score, key);
		if (typeof added === 'string') {
			throw new Error(added);
		}
		DB.destroy();
		return json({
			body: {
				message: added ? 'You are in leaderboard' : 'You are not in leaderboard'
			}
		}, { status: added ? 201 : 200 });
	} catch (/** @type {any} */ e) {
		if (e.message === 'Unauthorized') {
			return error(401, { message: 'Unauthorized' });
		}
		if (e.message === 'Invalid input') {
			return error(400, { message: 'Invalid input' });
		}
		if (e.message === GAME_NOT_FOUND) {
			return error(404, { message: 'Game not found' });
		}
		if (e.message === GAME_KEY_INVALID) {
			return error(403, { message: 'Game key invalid' });
		}
		console.log(e);
		return error(500, { message: 'Internal server error' });
	}
}

export async function DELETE({ params, request }) {
	try {
		const DB = await db();
		const { game } = params;
		const key = request.headers.get('x-api-key');
		if (!key) {
			return error(401, { message: 'Unauthorized' });
		}
		const reset = await resetLeaderBoard(DB, game, key);
        if (typeof reset === 'string') {
			throw new Error(reset);
		}
		DB.destroy();
		return json({
			body: {
				message: reset ? 'Leaderboard reset' : 'Leaderboard not reset'
			}
		});
	} catch (/** @type {any} */ e) {
		if (e.message === 'Unauthorized') {
			return error(401, { message: 'Unauthorized' });
		}
		if (e.message === GAME_NOT_FOUND) {
			return error(404, { message: 'Game not found' });
		}
		if (e.message === GAME_KEY_INVALID) {
			return error(403, { message: 'Game key invalid' });
		}
		console.log(e);
		return error(500, { message: 'Internal server error' });
	}
}
