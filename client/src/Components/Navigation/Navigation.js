import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { PublicRoute, PrivateRoute, AdminRoute } from '../Router/Router';

import Home from '../Home/Home';
import NewEventForm from '../NewEventForm/NewEventForm';
import Event from '../Event/Event';
import Users from '../Users/Users';
import User from '../User/User';

import Welcome from '../Welcome/Welcome';
import LogInForm from '../LogInForm/LogInForm';
import UserForm from '../UserForm/UserForm';

import AdminDashboard from '../AdminDashboard/AdminDashboard';

const Navigation = () => {
  return (
    <Switch>
      <PrivateRoute exact path="/" component={Home} />
      <PrivateRoute exact path="/events/new" component={NewEventForm} />
      <PrivateRoute exact path="/events/:id" component={Event} />
      <PrivateRoute exact path="/users" component={Users} />
      <PrivateRoute exact path="/users/:id" component={User} />
      <PrivateRoute exact path="/users/:id/edit" component={UserForm} />

      <PublicRoute exact path="/welcome" component={Welcome} />
      <PublicRoute exact path="/log-in" component={LogInForm} />
      <PublicRoute exact path="/sign-up" component={UserForm} />

      <AdminRoute exact path="/admin" component={AdminDashboard} />

      <Redirect to="/" />
    </Switch>
  );
};

export default Navigation;
