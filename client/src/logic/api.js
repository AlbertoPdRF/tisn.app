import { BASE_API_URL } from './env';
import { accessToken } from './auth';

export const getEvents = () => fetchApi('/events', { method: 'GET' });

export const fetchApi = (path, fetchOptions = {}) => {
  return fetch(
    `${BASE_API_URL}${path}`,
    Object.assign({}, fetchOptions, {
      headers: new Headers({
        'Authorization': `Bearer ${accessToken()}`,
        'Content-Type': 'application/json'
      })
    })
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response;
    })
    .then(response => response.json());
};
