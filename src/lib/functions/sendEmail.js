import nodemailer from 'nodemailer';
import { MAIL_HOST, MAIL_EMAIL, MAIL_USERNAME, MAIL_PASSWORD } from '$env/static/private';

/**
 * @param {*} email
 * @param {*} game
 * @param {*} check
 * 
 * @returns {Promise<string>}
 */
export default async function (email, game, check) {
	const transporter = nodemailer.createTransport({
		host: MAIL_HOST,
		port: 465,
		secure: true,
		auth: {
			user: MAIL_USERNAME,
			pass: MAIL_PASSWORD
		}
	});
	const mailOptions = {
		from: MAIL_EMAIL,
		to: email,
		subject: 'Revoke Leaderboard',
        html: `<p>Key for ${game} is ${check}</p>`
	};
	return new Promise((res, rej) => {
		transporter.sendMail(mailOptions, function (error) {
			if (error) {
				rej(error);
			} else {
				res('Leaderboard revoked');
			}
		});
	});
}
