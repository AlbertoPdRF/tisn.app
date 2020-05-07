import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CategoryIcon from '@material-ui/icons/Category';
import EmailIcon from '@material-ui/icons/Email';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import AddCommentIcon from '@material-ui/icons/AddComment';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { decodeText } from '../../logic/utils';

import { useNotifications } from '../NotificationsProvider/NotificationsProvider';

import Style from '../Style/Style';

const Notifications = () => {
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
      case 'Event':
        return <AddIcon />;
      case 'Avatar':
        return <AccountCircleIcon />;
      case 'Interests':
        return <CategoryIcon />;
      case 'Email':
        return <EmailIcon />;
      case 'Attendant':
        return <PlusOneIcon />;
      case 'Comment':
        return <AddCommentIcon />;
      case 'Friendship':
        return <PersonAddIcon />;
      case 'Announcement':
        return <AnnouncementIcon />;
      default:
        return <AnnouncementIcon />;
    }
  };

  const notificationsGrid = (notifications) => (
    <Grid container justify="center" spacing={2}>
      {notifications.map((notification) => (
        <Grid item key={notification._id} sm={6} xs={12}>
          <Card>
            <CardActionArea component={Link} to={notification.path}>
              <CardHeader
                avatar={notificationAvatar(decodeText(notification.type))}
                title={decodeText(notification.title)}
                subheader={decodeText(notification.content)}
              />
            </CardActionArea>
          </Card>
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
              <Typography variant="h2">Notifications</Typography>
            </Grid>
            <Grid item>
              {regularNotifications && regularNotifications.length > 0 ? (
                notificationsGrid(regularNotifications)
              ) : (
                <Typography variant="body1">
                  You have no new notifications!
                </Typography>
              )}
            </Grid>
            {regularReadNotifications && regularReadNotifications.length > 0 && (
              <Grid item>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    Read
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
