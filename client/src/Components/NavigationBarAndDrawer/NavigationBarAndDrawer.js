import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from '@material-ui/icons/Home';
import EventIcon from '@material-ui/icons/Event';
import AddIcon from '@material-ui/icons/Add';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import CategoryIcon from '@material-ui/icons/Category';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import ChatIcon from '@material-ui/icons/Chat';
import Link from '@material-ui/core/Link';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import { getUser, getNotifications } from '../../logic/api';
import { classifyNotifications } from '../../logic/utils';
import { logOut } from '../../logic/auth';

import { useUser, useSetUser } from '../UserProvider/UserProvider';
import {
  useNotifications,
  useSetNotifications,
} from '../NotificationsProvider/NotificationsProvider';

import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const HideOnScroll = (props) => {
  const { children } = props;

  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const NavigationBarAndDrawer = (props) => {
  const { container } = props;
  const history = useHistory();
  const style = Style();

  const user = useUser();
  const setUser = useSetUser();
  const notifications = useNotifications();
  const setNotifications = useSetNotifications();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getUser()
      .then((data) => setUser(data.user))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [setUser]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getNotifications()
      .then((data) =>
        setNotifications(classifyNotifications(data.notifications))
      )
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [setNotifications]);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const drawer = user && (
    <Fragment>
      <List>
        <ListItem
          button
          onClick={() => {
            history.push(`/users/${user._id}`);
            handleDrawerToggle();
          }}
        >
          <ListItemAvatar>
            <Avatar src={user.avatar} alt={`${user.name}'s avatar`}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push('/');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push('/events/mine');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="My events" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            history.push('/events/new');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="New event" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push('/users');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            history.push(`/users/${user._id}`);
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="My profile" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push('/interests');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Interests" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            logOut();
            setUser(null);
            history.push('/welcome');
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </ListItem>
      </List>
    </Fragment>
  );

  return (
    <Fragment>
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Link variant="h4" color="inherit" underline="none" href="/">
              Tisn
            </Link>
            <div className={style.grow} />
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => history.push('/chats')}
            >
              <Badge
                badgeContent={notifications && notifications.messages.length}
                color="secondary"
              >
                <ChatIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      {!loading && user && (
        <SwipeableDrawer
          anchor="left"
          container={container}
          open={drawerOpen}
          onOpen={handleDrawerToggle}
          onClose={handleDrawerToggle}
          classes={{
            paper: style.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </SwipeableDrawer>
      )}
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default NavigationBarAndDrawer;
