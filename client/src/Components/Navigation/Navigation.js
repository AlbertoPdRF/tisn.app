import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { PublicRoute, PrivateRoute } from '../../logic/routes';

import Home from '../Home/Home';
import Welcome from '../Welcome/Welcome';
import LogInForm from '../LogInForm/LogInForm';
import SignUpForm from '../SignUpForm/SignUpForm';

const Navigation = () => {
  return (
    <Switch>
      <PrivateRoute exact path="/" component={Home} />

      <PublicRoute exact path="/welcome" component={Welcome} />
      <PublicRoute exact path="/log-in" component={LogInForm} />
      <PublicRoute exact path="/sign-up" component={SignUpForm} />

      <Redirect to="/" />
    </Switch>
  );
};

export default Navigation;
