import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

import { logOut } from '../../logic/auth';
import { getUser, getNotifications } from '../../logic/api';
import { classifyNotifications } from '../../logic/utils';

import { useUser, useSetUser } from '../UserProvider/UserProvider';
import { useSetNotifications } from '../NotificationsProvider/NotificationsProvider';

import i18n from '../../i18n';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';
import NavigationBar from '../NavigationBar/NavigationBar';
import NavigationDrawer from '../NavigationDrawer/NavigationDrawer';

import Style from '../Style/Style';

const HideOnScroll = (props) => {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <div>{children}</div>
    </Slide>
  );
};

const Navigation = (props) => {
  const { container } = props;

  const style = Style();
  const user = useUser();
  const setUser = useSetUser();
  const history = useHistory();
  const setNotifications = useSetNotifications();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logUserOut, setLogUserOut] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getUser()
      .then((data) => {
        if (data.error || data.errors) {
          setLogUserOut(true);
        } else {
          setUser(data.user);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [setUser]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);

      if (user.preferredLocale !== i18n.language) {
        i18n.changeLanguage(user.preferredLocale);
      }

      getNotifications()
        .then((data) =>
          setNotifications(classifyNotifications(data.notifications))
        )
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, [user, setNotifications]);

  useEffect(() => {
    if (logUserOut) {
      setUser(null);
      logOut();
      history.push('/welcome');
    }
  }, [logUserOut, setUser, history]);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const drawer = user && (
    <NavigationDrawer
      clickHandler={handleDrawerToggle}
      logOutHandler={() => setLogUserOut(true)}
    />
  );

  return (
    <Fragment>
      <HideOnScroll {...props}>
        <NavigationBar toggleDrawer={handleDrawerToggle} />
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

export default Navigation;
