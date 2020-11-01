export const BASE_API_URL =
	process.env.NODE_ENV === 'production'
		? 'https://api.tisn.app'
		: 'http://localhost:9000';
