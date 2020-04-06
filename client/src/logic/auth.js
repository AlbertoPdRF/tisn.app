import { fetchApi } from './api';

const logInOrSignUp = (action, user) => {
  const path = action === 'log-in' ? action : '';

  return fetchApi(`/users/${path}`, {
    method: 'POST',
    body: JSON.stringify({ user })
  });
};

export const signUp = user => logInOrSignUp('sign-up', user);

const localStorageKey = key => `Tisn.${key}`;

export const setUserSession = (user) => localStorage.setItem(localStorageKey('accessToken'), user.accessToken);

export const accessToken = () => localStorage.getItem(localStorageKey('accessToken'));

export const logIn = user => logInOrSignUp('log-in', user);

export const isLoggedIn = () => {
  if (!!accessToken()) {
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(getPayloadFromToken().exp);

    if (new Date() <= expirationDate) {
      return true;
    }
  }

  logOut();
  return false;
}

export const getPayloadFromToken = () => JSON.parse(atob(accessToken().split('.')[1]));

export const isAdmin = () => !!getPayloadFromToken().admin;

const removeUserSession = () => localStorage.removeItem(localStorageKey('accessToken'));

export const logOut = () => removeUserSession();
