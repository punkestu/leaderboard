import { error, json } from '@sveltejs/kit';
import checkGameEmail from '$lib/functions/checkGameEmail.js';
import sendEmail from '$lib/functions/sendEmail.js';
import { db } from '$lib/utils/db.js';

export async function POST({ request }) {
	try {
		const DB = await db();
		const { game, email } = await request.json();
		const check = await checkGameEmail(DB, game, email);
		DB.destroy();
		if (!check) return error(404, { message: 'Leaderboard not found' });
		const result = await sendEmail(email, game, check);
		return json({ body: { message: result } });
	} catch (/** @type {any} */ e) {
		return error(500, { message: 'Internal server error' });
	}
}
