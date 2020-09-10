import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { isLoggedIn } from '../../logic/auth';

import {
  PublicRoute,
  PrivateRoute,
  AdminRoute,
  AnyRoute,
} from '../Routes/Routes';

import Welcome from '../Welcome/Welcome';
import LogInForm from '../LogInForm/LogInForm';
import SignUpForm from '../SignUpForm/SignUpForm';

import Home from '../Home/Home';
import Events from '../Events/Events';
import UserEvents from '../UserEvents/UserEvents';
import EventSteps from '../EventSteps/EventSteps';
import Event from '../Event/Event';
import Users from '../Users/Users';
import User from '../User/User';
import UserTabs from '../UserTabs/UserTabs';
import Interests from '../Interests/Interests';
import Chats from '../Chats/Chats';
import Chat from '../Chat/Chat';
import Notifications from '../Notifications/Notifications';
import Email from '../Email/Email';

import AdminDashboard from '../AdminDashboard/AdminDashboard';

import About from '../About/About';

const Navigation = () => {
  return (
    <Switch>
      <PublicRoute exact path="/welcome" component={Welcome} />
      <PublicRoute exact path="/log-in" component={LogInForm} />
      <PublicRoute exact path="/sign-up" component={SignUpForm} />

      <PrivateRoute exact path="/" component={Home} />
      <PrivateRoute exact path="/events" component={Events} />
      <PrivateRoute exact path="/events/mine" component={UserEvents} />
      <PrivateRoute exact path="/events/new" component={EventSteps} />
      <PrivateRoute
        exact
        path={['/events/:eventId', '/events/:eventId/comments']}
        component={Event}
      />
      <PrivateRoute exact path="/events/:eventId/edit" component={EventSteps} />
      <PrivateRoute exact path="/users" component={Users} />
      <PrivateRoute
        exact
        path={['/users/:userId', '/users/:userId/friendships']}
        component={User}
      />
      <PrivateRoute
        exact
        path={['/users/:userId/edit', '/users/:userId/edit/interests']}
        component={UserTabs}
      />
      <PrivateRoute exact path="/interests" component={Interests} />
      <PrivateRoute exact path="/chats" component={Chats} />
      <PrivateRoute exact path="/chats/:friendshipId" component={Chat} />
      <PrivateRoute exact path="/notifications" component={Notifications} />
      <PrivateRoute
        exact
        path={[
          '/users/:userId/confirm-email',
          '/users/:userId/send-email-confirmation-email',
        ]}
        component={Email}
      />

      <AdminRoute exact path="/admin" component={AdminDashboard} />

      <AnyRoute exact path="/about" component={About} />

      <Redirect to={isLoggedIn() ? '/' : '/welcome'} />
    </Switch>
  );
};

export default Navigation;
