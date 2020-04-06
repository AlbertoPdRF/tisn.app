import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const state = useState(null);

  return (
    <UserContext.Provider value={state}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const [user, setUser] = useContext(UserContext);
  return user;
};

export const useSetUser = () => {
  const [user, setUser] = useContext(UserContext);
  return setUser;
};
