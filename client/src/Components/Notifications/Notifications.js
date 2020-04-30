import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import AddCommentIcon from '@material-ui/icons/AddComment';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';

import { decodeText } from '../../logic/utils';

import { useNotifications } from '../NotificationsProvider/NotificationsProvider';

import Style from '../Style/Style';

const Notifications = () => {
  const style = Style();
  const notifications = useNotifications();

  const [regularNotifications, setRegularNotifications] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (notifications) {
      setRegularNotifications(notifications.regular);
      setLoading(false);
    }
  }, [notifications]);

  const notificationAvatar = (type) => {
    switch (type) {
      case 'General':
        return <AnnouncementIcon />;
      case 'Attendant':
        return <PlusOneIcon />;
      case 'Comment':
        return <AddCommentIcon />;
      case 'Friendship':
        return <PersonAddIcon />;
      default:
        return <AnnouncementIcon />;
    }
  };

  return (
    <Fragment>
      {loading ? (
        <LinearProgress />
      ) : (
        <div className={style.root}>
          <Grid container justify="center" spacing={2}>
            <Grid item className={`${style.fullWidth} ${style.center}`}>
              <Typography variant="h2">Notifications</Typography>
            </Grid>
            {regularNotifications && regularNotifications.length > 0 ? (
              regularNotifications.map((notification) => (
                <Grid item key={notification._id}>
                  <Card>
                    <CardActionArea component={Link} to={notification.path}>
                      <CardHeader
                        avatar={notificationAvatar(
                          decodeText(notification.type)
                        )}
                        title={decodeText(notification.title)}
                        subheader={decodeText(notification.content)}
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1">
                You have no new notifications!
              </Typography>
            )}
          </Grid>
        </div>
      )}
    </Fragment>
  );
};

export default Notifications;
