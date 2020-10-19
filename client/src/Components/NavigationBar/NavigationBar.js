import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import ChatIcon from '@material-ui/icons/Chat';
import IconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { useToggleTheme } from '../ThemeProvider/ThemeProvider';
import { useUser } from '../UserProvider/UserProvider';
import { buildMessageNotificationsObject } from '../../logic/utils';
import { useNotifications } from '../NotificationsProvider/NotificationsProvider';
import NotificationCard from '../NotificationCard/NotificationCard';
import Style from '../Style/Style';
import FriendshipCard from '../FriendshipCard/FriendshipCard';
import NavigationPopover from '../NavigationPopover/NavigationPopover';

const NavigationBar = (props) => {
  const { toggleDrawer } = props;
  const style = Style();
  const user = useUser();
  const theme = useTheme();
  const toggleTheme = useToggleTheme();
  const notifications = useNotifications();

  const [openedPopoverId, setOpenedPopoverId] = useState(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [messageNotifications, setMessageNotifications] = useState(null);

  useEffect(() => {
    if (notifications) {
      setMessageNotifications(
        buildMessageNotificationsObject(notifications.message)
      );
    }
  }, [notifications]);

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
    <NavigationPopover
      type="messages"
      id={messagesPopoverId}
      popoverAnchorEl={popoverAnchorEl}
      total={notifications.message.length}
      handlePopoverClose={handlePopoverClose}
      isOpen={openedPopoverId === messagesPopoverId}
    >
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
            <Grid item key={notification._id} className={style.popoverGridItem}>
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
    </NavigationPopover>
  );

  const notificationsPopoverId = 'notifications-popover';
  const notificationsPopover = notifications && (
    <NavigationPopover
      type="notifications"
      id={notificationsPopoverId}
      popoverAnchorEl={popoverAnchorEl}
      total={notifications.regular.length}
      handlePopoverClose={handlePopoverClose}
      isOpen={openedPopoverId === notificationsPopoverId}
    >
      {notifications.regular.map((notification) => (
        <Grid item key={notification._id} className={style.popoverGridItem}>
          <NotificationCard
            notification={notification}
            handlePopoverClose={handlePopoverClose}
          />
        </Grid>
      ))}
    </NavigationPopover>
  );

  return (
    <AppBar color={theme.palette.type === 'dark' ? 'inherit' : 'primary'}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
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
          onClick={(event) => handlePopoverOpen(event, notificationsPopoverId)}
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
  );
};

export default NavigationBar;
