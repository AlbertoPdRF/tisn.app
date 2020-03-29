import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from '../Home/Home';
import LogInForm from '../LogInForm/LogInForm';
import SignUpForm from '../SignUpForm/SignUpForm';

const Navigation = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/log-in" component={LogInForm} />
      <Route exact path="/sign-up" component={SignUpForm} />
      <Redirect to="/" />
    </Switch>
  );
};

export default Navigation;
