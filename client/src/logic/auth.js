import { fetchApi } from './api';

export const localStorageKey = key => `Tisn.${key}`;

const logInOrSignUp = (action, user) => {
  const path = action === 'log-in' ? action : '';

  return fetchApi(`/users/${path}`, {
    method: 'POST',
    body: JSON.stringify({ user })
  });
};

export const signUp = user => logInOrSignUp('sign-up', user);

export const accessToken = () => localStorage.getItem(localStorageKey('accessToken'));

export const logIn = user => logInOrSignUp('log-in', user);

export const isLoggedIn = () => !!accessToken();

export const logOut = () => localStorage.removeItem(localStorageKey('accessToken'));
