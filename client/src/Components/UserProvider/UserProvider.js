import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const state = useState(null);

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  // eslint-disable-next-line
  const [user, setUser] = useContext(UserContext);
  return user;
};

export const useSetUser = () => {
  // eslint-disable-next-line
  const [user, setUser] = useContext(UserContext);
  return setUser;
};
