import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';

import { ConfirmProvider } from 'material-ui-confirm';

import { UserProvider } from '../UserProvider/UserProvider';
import { NotificationsProvider } from '../NotificationsProvider/NotificationsProvider';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';

import Router from '../Router/Router';

const App = () => (
  <BrowserRouter>
    <UserProvider>
      <NotificationsProvider>
        <ThemeProvider>
          <ConfirmProvider>
            <Suspense fallback={<LinearProgress />}>
              <CssBaseline />
              <Router />
            </Suspense>
          </ConfirmProvider>
        </ThemeProvider>
      </NotificationsProvider>
    </UserProvider>
  </BrowserRouter>
);

export default App;
