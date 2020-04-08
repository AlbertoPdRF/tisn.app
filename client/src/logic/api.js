import { BASE_API_URL } from './env';
import { accessToken, getPayloadFromToken } from './auth';

export const getCurrentUser = () => fetchApi(`/users/${getPayloadFromToken()._id}`, { method: 'GET' });

export const getEvents = () => fetchApi('/events', { method: 'GET' });

export const postEvent = (event) => {
  return fetchApi('/events', {
    method: 'POST',
    body: JSON.stringify({ event })
  });
};

export const getEvent = (id) => fetchApi(`/events/${id}`, { method: 'GET' });

export const getInterests = () => fetchApi('/interests', { method: 'GET' });

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
