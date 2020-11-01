import { BASE_API_URL } from './env';
import { accessToken } from './auth';

export const upload = (file) => {
	const formData = new FormData();
	formData.append('file', file);

	return fetch(`${BASE_API_URL}/uploads`, {
		method: 'POST',
		body: formData,
		headers: new Headers({
			Authorization: `Bearer ${accessToken()}`,
		}),
	}).then((response) => response.json());
};
