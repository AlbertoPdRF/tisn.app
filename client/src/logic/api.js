import { BASE_API_URL } from './env';
import { accessToken, getPayloadFromToken } from './auth';

export const getUsers = () => fetchApi('/users', { method: 'GET' });

export const postUser = (user, path = '') => {
  return fetchApi(`/users/${path}`, {
    method: 'POST',
    body: JSON.stringify({ user }),
  });
};

export const getUser = (id = getPayloadFromToken()._id) =>
  fetchApi(`/users/${id}`, { method: 'GET' });

export const putUser = (id, user) => {
  return fetchApi(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ user }),
  });
};

export const deleteUser = (id = getPayloadFromToken()._id) =>
  fetchApi(`/users/${id}`, { method: 'DELETE' });

export const getUserEvents = (id = getPayloadFromToken()._id) =>
  fetchApi(`/users/${id}/events`, { method: 'GET' });

export const getEvents = () => fetchApi('/events', { method: 'GET' });

export const postEvent = (event) => {
  return fetchApi('/events', {
    method: 'POST',
    body: JSON.stringify({ event }),
  });
};

export const getEvent = (id) => fetchApi(`/events/${id}`, { method: 'GET' });

export const putEvent = (id, event) => {
  return fetchApi(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ event }),
  });
};

export const deleteEvent = (id, event) =>
  fetchApi(`/events/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ event }),
  });

export const getAttendants = (eventId) =>
  fetchApi(`/events/${eventId}/attendants`, { method: 'GET' });

export const postAttendant = (eventId, attendant) => {
  return fetchApi(`/events/${eventId}/attendants`, {
    method: 'POST',
    body: JSON.stringify({ attendant }),
  });
};

export const deleteAttendant = (eventId, attendantId, attendant) => {
  return fetchApi(`/events/${eventId}/attendants/${attendantId}`, {
    method: 'DELETE',
    body: JSON.stringify({ attendant }),
  });
};

export const getComments = (eventId) =>
  fetchApi(`/events/${eventId}/comments`, { method: 'GET' });

export const postComment = (eventId, comment) => {
  return fetchApi(`/events/${eventId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  });
};

export const getInterests = () => fetchApi('/interests', { method: 'GET' });

const fetchApi = (path, fetchOptions = {}) => {
  return fetch(
    `${BASE_API_URL}${path}`,
    Object.assign({}, fetchOptions, {
      headers: new Headers({
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json',
      }),
    })
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response;
    })
    .then((response) => response.json());
};
