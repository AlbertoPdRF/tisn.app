import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { isLoggedIn, isAdmin } from '../../logic/auth';

import WelcomeNavigationBar from '../WelcomeNavigationBar/WelcomeNavigationBar';
import NavigationBarAndDrawer from '../NavigationBarAndDrawer/NavigationBarAndDrawer';

export const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      !isLoggedIn() ? (
        <Fragment>
          <WelcomeNavigationBar />
          <Component {...props} />
        </Fragment>
      ) : (
        <Redirect to={{ pathname: '/' }} />
      )
    }
  />
);

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn() ? (
        <Fragment>
          <NavigationBarAndDrawer />
          <Component {...props} />
        </Fragment>
      ) : (
        <Redirect
          to={{
            pathname: props.location.pathname === '/' ? '/welcome' : '/log-in',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAdmin() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: isLoggedIn() ? '/' : '/log-in',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export const AnyRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Fragment>
          {isLoggedIn() ? <NavigationBarAndDrawer /> : <WelcomeNavigationBar />}
          <Component {...props} />
        </Fragment>
      )}
    />
  );
};
