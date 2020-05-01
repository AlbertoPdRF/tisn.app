import React, { useState, useEffect, Fragment } from 'react';
import { useHistory, Link } from 'react-router-dom';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';

import { getFriendships } from '../../logic/api';
import {
  classifyFriendships,
  buildMessageNotificationsObject,
  sortChats,
} from '../../logic/utils';
import { formatDateTime, formatDate } from '../../logic/date-time';

import { useUser } from '../UserProvider/UserProvider';
import { useNotifications } from '../NotificationsProvider/NotificationsProvider';

import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Chats = () => {
  const history = useHistory();
  const style = Style();
  const user = useUser();
  const notifications = useNotifications();

  const [friendships, setFriendships] = useState(null);
  const [messageNotifications, setMessageNotifications] = useState({});
  const [messageAllNotifications, setMessageAllNotifications] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);
      getFriendships(user._id)
        .then((data) =>
          setFriendships(classifyFriendships(data.friendships, user).accepted)
        )
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (notifications) {
      setMessageNotifications(
        buildMessageNotificationsObject(notifications.message)
      );
      setMessageAllNotifications(
        buildMessageNotificationsObject(notifications.messageAll)
      );
    }
  }, [notifications]);

  useEffect(() => {
    if (friendships && messageAllNotifications) {
      setFriendships(sortChats(friendships, messageAllNotifications));
    }
  }, [friendships, messageAllNotifications]);

  const friendshipCardHeader = (friendship) => {
    const friendshipUser =
      friendship.requestant._id === user._id
        ? friendship.receivant
        : friendship.requestant;

    return (
      <CardHeader
        avatar={
          <Avatar
            src={friendshipUser.avatar}
            alt={`${friendshipUser.name}'s avatar`}
            style={{ margin: '4px' }}
          >
            {friendshipUser.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={friendshipUser.name}
        subheader={
          messageAllNotifications[friendship._id]
            ? `Last message at ${formatDateTime(
                messageAllNotifications[friendship._id][0].createdAt
              )}`
            : `Friends since ${formatDate(friendship.acceptedAt)}`
        }
        subheaderTypographyProps={{ className: style.preLine }}
      />
    );
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container justify="center" spacing={2}>
          <Grid item className={`${style.fullWidth} ${style.center}`}>
            <Typography variant="h2">Chats</Typography>
          </Grid>
          {friendships && friendships.length > 0
            ? friendships.map((friendship) => (
                <Grid item key={friendship._id}>
                  <Badge
                    badgeContent={
                      messageNotifications[friendship._id] &&
                      messageNotifications[friendship._id].length
                    }
                    color="secondary"
                  >
                    <Card>
                      <CardActionArea
                        component={Link}
                        to={`/chats/${friendship._id}`}
                      >
                        {friendshipCardHeader(friendship)}
                      </CardActionArea>
                    </Card>
                  </Badge>
                </Grid>
              ))
            : !loading && (
                <Grid item className={`${style.fullWidth} ${style.center}`}>
                  <Typography gutterBottom variant="body1">
                    You have no friendships.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => history.push('/users')}
                  >
                    Browse users!
                  </Button>
                </Grid>
              )}
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default Chats;
