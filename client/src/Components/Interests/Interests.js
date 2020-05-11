import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import {
  getInterests,
  putUser,
  putNotification,
  getNotifications,
} from '../../logic/api';
import { groupInterests, classifyNotifications } from '../../logic/utils';

import { useUser, useSetUser } from '../UserProvider/UserProvider';
import {
  useNotifications,
  useSetNotifications,
} from '../NotificationsProvider/NotificationsProvider';

import InterestCard from '../InterestCard/InterestCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Interests = () => {
  const { t } = useTranslation();
  const style = Style();
  const user = useUser();
  const setUser = useSetUser();
  const notifications = useNotifications();
  const setNotifications = useSetNotifications();

  const [interests, setInterests] = useState(null);
  const [updateNotifications, setUpdateNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    getInterests()
      .then((data) => setInterests(groupInterests(data.interests)))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && notifications) {
      setError(null);

      const interestsNotifications = notifications.regular.filter(
        (notification) => notification.type === 'Interests'
      );

      if (interestsNotifications.length > 0) {
        interestsNotifications.forEach((notification, index) => {
          notification.read = true;
          notification.readAt = new Date();

          putNotification(user._id, notification._id, notification)
            .then((data) => {
              if (data.errors) {
                setError(t('interests.error.generic'));
              }

              if (index === interestsNotifications.length - 1) {
                setUpdateNotifications(true);
              }
            })
            .catch((error) => setError(error));
        });
      }
    }
  }, [user, notifications, t]);

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

  const handleClick = (interest, userInterested) => {
    setLoading(true);
    setError(null);

    let userInterests = [];
    if (userInterested) {
      userInterests = user.interests.filter(
        (userInterest) => userInterest._id !== interest._id
      );
    } else {
      userInterests = [...user.interests, interest];
    }

    putUser(user._id, {
      ...user,
      interests: userInterests,
    })
      .then((data) => {
        if (data.errors) {
          setError(t('interests.error.generic'));
        } else {
          setUser(data.user);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h2">{t('interests.title')}</Typography>
          </Grid>
          <Grid item>
            {user &&
              interests &&
              interests.map((interestsGroup) => (
                <ExpansionPanel key={interestsGroup.category._id}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    {interestsGroup.category.name}
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container justify="center" spacing={2}>
                      {interestsGroup.interests.map((interest) => (
                        <Grid item key={interest._id} md={4} sm={6} xs={12}>
                          <InterestCard
                            interest={interest}
                            userInterested={user.interests.some(
                              (userInterest) =>
                                userInterest._id === interest._id
                            )}
                            handleClick={handleClick}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ))}
          </Grid>
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default Interests;
