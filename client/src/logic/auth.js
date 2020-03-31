import { fetchApi } from './api';

const localStorageKey = key => `Tisn.${key}`;

const logInOrSignUp = (action, user) => {
  const path = action === 'log-in' ? action : '';

  return fetchApi(`/users/${path}`, {
    method: 'POST',
    body: JSON.stringify({ user })
  });
};

export const signUp = user => logInOrSignUp('sign-up', user);
 
export const setUserSession = (user) => {
  localStorage.setItem(localStorageKey('accessToken'), user.accessToken);
  localStorage.setItem(localStorageKey('admin'), user.admin);
  localStorage.setItem(localStorageKey('user'), JSON.stringify(user));
}

export const getUser = () => {
  const user = localStorage.getItem(localStorageKey('user'));

  if (user) {
    return JSON.parse(user);
  }

  return null;
}

export const accessToken = () => localStorage.getItem(localStorageKey('accessToken'));

export const logIn = user => logInOrSignUp('log-in', user);

export const isLoggedIn = () => !!accessToken();

const admin = () => localStorage.getItem(localStorageKey('admin'));

export const isAdmin = () => !!admin();

const removeUserSession = () => {
  localStorage.removeItem(localStorageKey('accessToken'));
  localStorage.removeItem(localStorageKey('admin'));
  localStorage.removeItem(localStorageKey('user'));
}

export const logOut = () => removeUserSession();
