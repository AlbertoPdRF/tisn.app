import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from '../Home/Home';

const Navigation = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/log-in" />
      <Route exact path="/sign-up" />
      <Redirect to="/" />
    </Switch>
  );
};

export default Navigation;
