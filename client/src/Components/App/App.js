import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';

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
            <Suspense fallback={<LinearProgress />}>
              <CssBaseline />
              <Navigation />
            </Suspense>
          </ConfirmProvider>
        </NotificationsProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
