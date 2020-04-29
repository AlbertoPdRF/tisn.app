import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import { UserProvider } from '../UserProvider/UserProvider';
import { NotificationsProvider } from '../NotificationsProvider/NotificationsProvider';
import { ConfirmProvider } from 'material-ui-confirm';

import Navigation from '../Navigation/Navigation';

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <NotificationsProvider>
          <ConfirmProvider>
            <CssBaseline />
            <Navigation />
          </ConfirmProvider>
        </NotificationsProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
