import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SwipeableViews from 'react-swipeable-views';

import {
  getUser,
  getFriendships,
  postFriendship,
  putFriendship,
  deleteFriendship,
  putNotification,
  getNotifications,
} from '../../logic/api';
import { classifyFriendships, classifyNotifications } from '../../logic/utils';

import { useUser } from '../UserProvider/UserProvider';
import {
  useNotifications,
  useSetNotifications,
} from '../NotificationsProvider/NotificationsProvider';

import { useConfirm } from 'material-ui-confirm';

import TabPanel from '../TabPanel/TabPanel';
import UserDetails from '../UserDetails/UserDetails';
import Friendships from '../Friendships/Friendships';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const User = ({ match }) => {
  const { t } = useTranslation();
  const style = Style();
  const currentUser = useUser();
  const notifications = useNotifications();
  const setNotifications = useSetNotifications();
  const confirm = useConfirm();

  const [value, setValue] = useState(0);
  const [user, setUser] = useState(null);
  const [userIsCurrentUser, setUserIsCurrentUser] = useState(false);
  const [restrictedDisplay, setRestrictedDisplay] = useState(false);
  const [updateFriendships, setUpdateFriendships] = useState(true);
  const [pendingFriendships, setPendingFriendships] = useState(null);
  const [acceptedFriendships, setAcceptedFriendships] = useState(null);
  const [currentUserFriendship, setCurrentUserFriendship] = useState(null);
  const [friendshipButtonHover, setFriendshipButtonHover] = useState(false);
  const [updateNotifications, setUpdateNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const friendshipsTab = match.path.endsWith('/friendships');
  useEffect(() => {
    if (friendshipsTab) {
      setValue(1);
    }
  }, [friendshipsTab]);

  const id = match.params.userId;
  useEffect(() => {
    setLoading(true);
    setError(null);
    if (currentUser) {
      const userIsCurrentUserCheck = currentUser._id === id;
      setUserIsCurrentUser(userIsCurrentUserCheck);
      if (userIsCurrentUserCheck) {
        setUser(currentUser);
        setRestrictedDisplay(true);
        setUpdateFriendships(true);
        if (!friendshipsTab) {
          setValue(0);
        }
        setLoading(false);
      } else {
        if (currentUser.admin) {
          setRestrictedDisplay(true);
        } else {
          setRestrictedDisplay(false);
        }

        getUser(id)
          .then((data) => {
            setUser(data.user);
            setUpdateFriendships(true);
            if (!friendshipsTab) {
              setValue(0);
            }
          })
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
      }
    }
  }, [id, currentUser, friendshipsTab]);

  useEffect(() => {
    if (currentUser && updateFriendships) {
      setLoading(true);
      setError(null);
      getFriendships(id)
        .then((data) => {
          const classifiedFriendships = classifyFriendships(
            data.friendships,
            currentUser
          );
          setPendingFriendships(classifiedFriendships.pending);
          setAcceptedFriendships(classifiedFriendships.accepted);
          setCurrentUserFriendship(classifiedFriendships.currentUserFriendship);
        })
        .catch((error) => setError(error))
        .finally(() => {
          setUpdateFriendships(false);
          setLoading(false);
        });
    }
  }, [id, currentUser, updateFriendships]);

  useEffect(() => {
    if (currentUser && userIsCurrentUser && notifications) {
      setError(null);

      const friendshipNotifications = notifications.regular.filter(
        (notification) => notification.type.endsWith('FriendshipRequest')
      );

      if (value === 1 && friendshipNotifications.length > 0) {
        friendshipNotifications.forEach((notification, index) => {
          notification.read = true;
          notification.readAt = new Date();

          putNotification(currentUser._id, notification._id, notification)
            .then((data) => {
              if (data.errors) {
                setError(t('errorsList.generic'));
              }

              if (index === friendshipNotifications.length - 1) {
                setUpdateNotifications(true);
              }
            })
            .catch((error) => setError(error));
        });
      }
    }
  }, [currentUser, userIsCurrentUser, value, notifications, t]);

  useEffect(() => {
    if (updateNotifications) {
      setError(null);
      getNotifications()
        .then((data) =>
          setNotifications(classifyNotifications(data.notifications))
        )
        .catch((error) => setError(error));
    }
  }, [updateNotifications, setNotifications]);

  const handleFriendshipClick = (friendship, accept = false) => {
    setLoading(true);
    setError(null);
    if (friendship) {
      if (accept) {
        friendship.accepted = true;
        friendship.acceptedAt = new Date();

        putFriendship(id, friendship._id, friendship)
          .then(() => setUpdateFriendships(true))
          .catch((error) => {
            setError(error);
            setLoading(false);
          });
      } else {
        confirm({
          title: t('user.confirm.title'),
          description: t('user.confirm.description'),
          confirmationText: friendship.accepted
            ? t('user.confirm.unfriendConfirmationText')
            : t('user.confirm.deleteConfirmationText'),
          confirmationButtonProps: {
            variant: 'contained',
            color: 'secondary',
          },
          cancellationText: t('user.confirm.cancellationText'),
          cancellationButtonProps: {
            variant: 'contained',
            color: 'primary',
          },
        })
          .then(() => {
            deleteFriendship(id, friendship._id, friendship)
              .then(() => setUpdateFriendships(true))
              .catch((error) => {
                setError(error);
                setLoading(false);
              });
          })
          .catch(() => setLoading(false));
      }
    } else {
      postFriendship(id, {
        requestant: currentUser,
        receivant: user,
      })
        .then(() => setUpdateFriendships(true))
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  };

  const friendshipButton = (friendship, alignRight = true) => {
    let color;
    if (friendship) {
      if (friendshipButtonHover) {
        color = 'secondary';
      } else {
        color = 'primary';
      }
    } else {
      color = 'primary';
    }

    const variant = friendship ? 'outlined' : 'contained';

    let text;
    if (friendship) {
      if (friendship.accepted) {
        if (friendshipButtonHover) {
          text = t('user.unfriend');
        } else {
          text = t('user.friends');
        }
      } else {
        if (friendshipButtonHover) {
          text = t('user.delete');
        } else {
          text = t('user.pending');
        }
      }
    } else {
      text = t('user.befriend');
    }

    return (
      <Button
        onMouseOver={() => setFriendshipButtonHover(true)}
        onMouseOut={() => setFriendshipButtonHover(false)}
        className={alignRight && style.alignRight}
        color={color}
        variant={variant}
        onClick={() => handleFriendshipClick(friendship)}
        disabled={loading}
      >
        {text}
      </Button>
    );
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      {user && (
        <div className={style.root}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h2">
                {userIsCurrentUser
                  ? t('user.myProfileTitle')
                  : t('user.profileTitle')}
              </Typography>
            </Grid>
            <Grid item className={style.fullWidth}>
              <Paper>
                <AppBar position="static" color="default">
                  <Tabs
                    value={value}
                    onChange={(event, newValue) => setValue(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                  >
                    <Tab label={t('user.details')} />
                    <Tab label={t('user.friendships')} />
                  </Tabs>
                </AppBar>
                <SwipeableViews
                  index={value}
                  onChangeIndex={(index) => setValue(index)}
                >
                  <TabPanel value={value} index={0}>
                    <UserDetails
                      user={user}
                      userIsCurrentUser={userIsCurrentUser}
                      currentUserFriendship={currentUserFriendship}
                      friendshipButton={friendshipButton}
                      handleFriendshipClick={handleFriendshipClick}
                      restrictedDisplay={restrictedDisplay}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Friendships
                      user={user}
                      userIsCurrentUser={userIsCurrentUser}
                      pendingFriendships={pendingFriendships}
                      handleFriendshipClick={handleFriendshipClick}
                      acceptedFriendships={acceptedFriendships}
                    />
                  </TabPanel>
                </SwipeableViews>
              </Paper>
            </Grid>
          </Grid>
        </div>
      )}
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default User;
