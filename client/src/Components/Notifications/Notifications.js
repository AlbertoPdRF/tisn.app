import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import EmailIcon from '@material-ui/icons/Email';
import AddIcon from '@material-ui/icons/Add';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CategoryIcon from '@material-ui/icons/Category';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import AddCommentIcon from '@material-ui/icons/AddComment';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { useNotifications } from '../NotificationsProvider/NotificationsProvider';

import Style from '../Style/Style';

const Notifications = () => {
  const { t } = useTranslation();
  const style = Style();
  const notifications = useNotifications();

  const [regularNotifications, setRegularNotifications] = useState(null);
  const [regularReadNotifications, setRegularReadNotifications] = useState(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (notifications) {
      setRegularNotifications(notifications.regular);
      setRegularReadNotifications(notifications.regularRead);
      setLoading(false);
    }
  }, [notifications]);

  const notificationAvatar = (type) => {
    switch (type) {
      case 'confirmEmail':
        return <EmailIcon />;
      case 'createEvent':
        return <AddIcon />;
      case 'uploadAvatar':
        return <AccountCircleIcon />;
      case 'selectInterests':
        return <CategoryIcon />;
      case 'newAttendant':
        return <PlusOneIcon />;
      case 'newComment':
        return <AddCommentIcon />;
      case 'newFriendshipRequest':
      case 'acceptedFriendshipRequest':
        return <PersonAddIcon />;
      default:
        return <AnnouncementIcon />;
    }
  };

  const card = (notification) => {
    const type = notification.type;
    const avatar = notificationAvatar(type);
    const subheader = t(`notifications.${type}.subheader`);

    let path;
    const keys = {};
    switch (type) {
      case 'confirmEmail':
        path = `/users/${notification.user}/send-email-confirmation-email`;
        break;
      case 'createEvent':
        path = '/events/new';
        break;
      case 'uploadAvatar':
        path = `/users/${notification.user}/edit`;
        break;
      case 'selectInterests':
        path = '/interests';
        break;
      case 'newAttendant':
      case 'newComment':
        keys.userName = notification.referencedUser
          ? notification.referencedUser.name
          : t('notifications.deletedUser');
        keys.eventName = notification.referencedEvent
          ? notification.referencedEvent.name
          : t('notifications.deletedEvent');
        path =
          notification.referencedEvent &&
          `/events/${notification.referencedEvent._id}`;
        if (path && type === 'newComment') {
          path += '/comments';
        }
        break;
      case 'newFriendshipRequest':
      case 'acceptedFriendshipRequest':
        keys.name = notification.referencedUser
          ? notification.referencedUser.name
          : t('notifications.deletedUser');
        path = `/users/${notification.user}/friendships`;
        break;
      default:
        break;
    }
    const title = t(`notifications.${type}.title`, keys);

    return (
      <Card>
        <CardActionArea
          component={Link}
          to={path ? path : '/'}
          disabled={!path}
        >
          <CardHeader avatar={avatar} title={title} subheader={subheader} />
        </CardActionArea>
      </Card>
    );
  };

  const notificationsGrid = (notifications) => (
    <Grid container justify="center" spacing={2}>
      {notifications.map((notification) => (
        <Grid item key={notification._id} sm={6} xs={12}>
          {card(notification)}
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Fragment>
      {loading ? (
        <LinearProgress />
      ) : (
        <div className={style.root}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h2">{t('notifications.title')}</Typography>
            </Grid>
            <Grid item>
              {regularNotifications && regularNotifications.length > 0 ? (
                notificationsGrid(regularNotifications)
              ) : (
                <Typography variant="body1">
                  {t('notifications.noNew')}
                </Typography>
              )}
            </Grid>
            {regularReadNotifications && regularReadNotifications.length > 0 && (
              <Grid item>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    {t('notifications.read')}
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    {notificationsGrid(regularReadNotifications)}
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            )}
          </Grid>
        </div>
      )}
    </Fragment>
  );
};

export default Notifications;
