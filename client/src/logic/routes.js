import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { accessToken } from './auth';

export const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => !accessToken() ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />}
    />
  );
};
 
export const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => accessToken() ? <Component {...props} /> : <Redirect to={{ pathname: '/welcome', state: { from: props.location } }} />}
    />
  );
};
