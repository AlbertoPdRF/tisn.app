import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { isLoggedIn } from '../../logic/auth';

export const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => !isLoggedIn() ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />}
    />
  );
};
 
export const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => isLoggedIn() ? <Component {...props} /> : <Redirect to={{ pathname: '/welcome', state: { from: props.location } }} />}
    />
  );
};
