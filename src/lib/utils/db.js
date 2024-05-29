import { createConnection } from 'mysql2/promise';
import { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } from '$env/static/private';

export const db = async () => {
	return await createConnection(
		`mysql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
	);
};
