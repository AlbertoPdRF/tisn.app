import { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { getFriendships } from '../../logic/api';
import {
  classifyFriendships,
  buildMessageNotificationsObject,
  sortChats,
} from '../../logic/utils';

import { useUser } from '../UserProvider/UserProvider';
import { useNotifications } from '../NotificationsProvider/NotificationsProvider';

import FriendshipCard from '../FriendshipCard/FriendshipCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Chats = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const style = Style();
  const user = useUser();
  const notifications = useNotifications();

  const [friendships, setFriendships] = useState(null);
  const [messageNotifications, setMessageNotifications] = useState(null);
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
    }
  }, [notifications]);

  useEffect(() => {
    if (friendships) {
      setFriendships(sortChats(friendships));
    }
  }, [friendships]);

  const params = new URLSearchParams(window.location.search);

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container justify="center" spacing={2}>
          <Grid item className={`${style.fullWidth} ${style.center}`}>
            <Typography variant="h2">{t('chats.title')}</Typography>
          </Grid>
          {messageNotifications && friendships && friendships.length > 0
            ? friendships.map((friendship) => (
                <Grid item key={friendship._id} md={4} sm={6} xs={12}>
                  <FriendshipCard
                    user={user}
                    friendship={friendship}
                    params={params}
                    messageNotifications={
                      messageNotifications[`${friendship._id}`]
                    }
                  />
                </Grid>
              ))
            : !loading && (
                <Grid item className={`${style.fullWidth} ${style.center}`}>
                  <Typography gutterBottom variant="body1">
                    {t('chats.noFriendships')}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => history.push('/users')}
                  >
                    {t('chats.browseUsers')}
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
