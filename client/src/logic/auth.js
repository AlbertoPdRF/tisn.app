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
 
export const setUserSession = (accessToken, user) => {
  localStorage.setItem(localStorageKey('accessToken'), accessToken);
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

export const removeUserSession = () => {
  localStorage.removeItem(localStorageKey('accessToken'));
  localStorage.removeItem(localStorageKey('user'));
}

export const logOut = () => removeUserSession();
