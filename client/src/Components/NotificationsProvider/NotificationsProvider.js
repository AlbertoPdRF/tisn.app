import { createContext, useState, useContext } from 'react';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const state = useState(null);

  return (
    <NotificationsContext.Provider value={state}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  // eslint-disable-next-line
  const [notifications, setNotifications] = useContext(NotificationsContext);
  return notifications;
};

export const useSetNotifications = () => {
  // eslint-disable-next-line
  const [notifications, setNotifications] = useContext(NotificationsContext);
  return setNotifications;
};
