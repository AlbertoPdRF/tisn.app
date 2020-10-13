import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Link from '@material-ui/core/Link';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import i18n from '../../i18n';

import { getUser, getNotifications } from '../../logic/api';
import {
  classifyNotifications,
  buildMessageNotificationsObject,
} from '../../logic/utils';
import { logOut } from '../../logic/auth';

import { useUser, useSetUser } from '../UserProvider/UserProvider';
import {
  useNotifications,
  useSetNotifications,
} from '../NotificationsProvider/NotificationsProvider';
import { useToggleTheme } from '../ThemeProvider/ThemeProvider';

import FriendshipCard from '../FriendshipCard/FriendshipCard';
import NotificationCard from '../NotificationCard/NotificationCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';
import NavigationDrawer from '../NavigationDrawer/NavigationDrawer';

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

  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const style = Style();

  const user = useUser();
  const setUser = useSetUser();
  const notifications = useNotifications();
  const setNotifications = useSetNotifications();
  const toggleTheme = useToggleTheme();

  const [openedPopoverId, setOpenedPopoverId] = useState(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [messageNotifications, setMessageNotifications] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    if (notifications) {
      setMessageNotifications(
        buildMessageNotificationsObject(notifications.message)
      );
    }
  }, [notifications]);

  useEffect(() => {
    if (logUserOut) {
      setUser(null);
      logOut();
      history.push('/welcome');
    }
  }, [logUserOut, setUser, history]);

  const handlePopoverOpen = (event, popoverId) => {
    setPopoverAnchorEl(event.target);
    setOpenedPopoverId(popoverId);
  };

  const handlePopoverClose = () => {
    setOpenedPopoverId(null);
    setPopoverAnchorEl(null);
  };

  const messageNotificationsDisplayed = {};
  const messagesPopoverId = 'messages-popover';
  const messagesPopover = notifications && messageNotifications && (
    <Popover
      className={style.popover}
      id={messagesPopoverId}
      open={openedPopoverId === messagesPopoverId}
      anchorEl={popoverAnchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={() => handlePopoverClose()}
    >
      <Grid container direction="column" alignItems="center" spacing={0}>
        {notifications.message.map((notification) => {
          let toReturn;
          if (
            messageNotificationsDisplayed[
            `${notification.referencedFriendship._id}`
            ]
          ) {
            toReturn = null;
          } else {
            messageNotificationsDisplayed[
              `${notification.referencedFriendship._id}`
            ] = true;
            toReturn = (
              <Grid
                item
                key={notification._id}
                className={style.popoverGridItem}
              >
                <FriendshipCard
                  user={user}
                  friendship={
                    messageNotifications[
                      `${notification.referencedFriendship._id}`
                    ][0].referencedFriendship
                  }
                  messageNotifications={
                    messageNotifications[
                    `${notification.referencedFriendship._id}`
                    ]
                  }
                  handlePopoverClose={handlePopoverClose}
                />
              </Grid>
            );
          }

          return toReturn;
        })}
        <Grid item className={`${style.popoverGridItem} ${style.center}`}>
          <Typography gutterBottom variant="body1">
            {t(
              `navigationBarAndDrawer.no${notifications.message.length > 0 ? 'More' : ''
              }NewMessages`
            )}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history.push('/chats');
              handlePopoverClose();
            }}
          >
            {t('navigationBarAndDrawer.allMessages')}
          </Button>
        </Grid>
      </Grid>
    </Popover>
  );

  const notificationsPopoverId = 'notifications-popover';
  const notificationsPopover = notifications && (
    <Popover
      className={style.popover}
      id={notificationsPopoverId}
      open={openedPopoverId === notificationsPopoverId}
      anchorEl={popoverAnchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={() => handlePopoverClose()}
    >
      <Grid container direction="column" alignItems="center" spacing={0}>
        {notifications.regular.map((notification) => (
          <Grid item key={notification._id} className={style.popoverGridItem}>
            <NotificationCard
              notification={notification}
              handlePopoverClose={handlePopoverClose}
            />
          </Grid>
        ))}
        <Grid item className={`${style.popoverGridItem} ${style.center}`}>
          <Typography gutterBottom variant="body1">
            {t(
              `navigationBarAndDrawer.no${notifications.regular.length > 0 ? 'More' : ''
              }NewNotifications`
            )}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history.push('/notifications');
              handlePopoverClose();
            }}
          >
            {t('navigationBarAndDrawer.allNotifications')}
          </Button>
        </Grid>
      </Grid>
    </Popover>
  );

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const drawer = user && (
    <NavigationDrawer clickHandler={handleDrawerToggle} logOutHandler={() => setLogUserOut(true)} />
  );

  return (
    <Fragment>
      <HideOnScroll {...props}>
        <AppBar color={theme.palette.type === 'dark' ? 'inherit' : 'primary'}>
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
            <IconButton edge="end" color="inherit" onClick={toggleTheme}>
              {theme.palette.type === 'dark' ? (
                <Brightness7Icon />
              ) : (
                  <Brightness4Icon />
                )}
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              onClick={(event) => handlePopoverOpen(event, messagesPopoverId)}
            >
              <Badge
                badgeContent={notifications && notifications.message.length}
                color="secondary"
              >
                <ChatIcon />
              </Badge>
            </IconButton>
            {messagesPopover}
            <IconButton
              edge="end"
              color="inherit"
              onClick={(event) =>
                handlePopoverOpen(event, notificationsPopoverId)
              }
            >
              <Badge
                badgeContent={notifications && notifications.regular.length}
                color="secondary"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            {notificationsPopover}
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
