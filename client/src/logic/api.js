import { BASE_API_URL } from './env';
import { accessToken, getPayloadFromToken } from './auth';

export const getUsers = (query = '') =>
  fetchApi(`/users${query}`, { method: 'GET' });

export const postUser = (user, path = '') => {
  return fetchApi(`/users/${path}`, {
    method: 'POST',
    body: JSON.stringify({ user }),
  });
};

export const getUser = (userId = getPayloadFromToken()._id) =>
  fetchApi(`/users/${userId}`, { method: 'GET' });

export const putUser = (userId, user) => {
  return fetchApi(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ user }),
  });
};

export const deleteUser = (userId = getPayloadFromToken()._id) =>
  fetchApi(`/users/${userId}`, { method: 'DELETE' });

export const getUserEvents = (userId = getPayloadFromToken()._id) =>
  fetchApi(`/users/${userId}/events`, { method: 'GET' });

export const getEvents = (query = '') =>
  fetchApi(`/events${query}`, { method: 'GET' });

export const postEvent = (event) => {
  return fetchApi('/events', {
    method: 'POST',
    body: JSON.stringify({ event }),
  });
};

export const getEvent = (eventId) =>
  fetchApi(`/events/${eventId}`, { method: 'GET' });

export const putEvent = (eventId, event) => {
  return fetchApi(`/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify({ event }),
  });
};

export const deleteEvent = (eventId, event) =>
  fetchApi(`/events/${eventId}`, {
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

export const getFriendships = (userId) =>
  fetchApi(`/users/${userId}/friendships`, { method: 'GET' });

export const postFriendship = (userId, friendship) => {
  return fetchApi(`/users/${userId}/friendships`, {
    method: 'POST',
    body: JSON.stringify({ friendship }),
  });
};

export const getFriendship = (userId, friendshipId) =>
  fetchApi(`/users/${userId}/friendships/${friendshipId}`, { method: 'GET' });

export const putFriendship = (userId, friendshipId, friendship) => {
  return fetchApi(`/users/${userId}/friendships/${friendshipId}`, {
    method: 'PUT',
    body: JSON.stringify({ friendship }),
  });
};

export const deleteFriendship = (userId, friendshipId, friendship) => {
  return fetchApi(`/users/${userId}/friendships/${friendshipId}`, {
    method: 'DELETE',
    body: JSON.stringify({ friendship }),
  });
};

export const getMessages = (userId, friendshipId) =>
  fetchApi(`/users/${userId}/friendships/${friendshipId}/messages`, {
    method: 'GET',
  });

export const postMessage = (userId, friendshipId, message) =>
  fetchApi(`/users/${userId}/friendships/${friendshipId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

export const getNotifications = (userId = getPayloadFromToken()._id) =>
  fetchApi(`/users/${userId}/notifications`, { method: 'GET' });

export const putNotification = (userId, notificationId, notification) => {
  return fetchApi(`/users/${userId}/notifications/${notificationId}`, {
    method: 'PUT',
    body: JSON.stringify({ notification }),
  });
};

const fetchApi = (path, fetchOptions = {}) => {
  return fetch(
    `${BASE_API_URL}${path}`,
    Object.assign({}, fetchOptions, {
      headers: new Headers({
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json',
      }),
    })
  ).then((response) => response.json());
};
