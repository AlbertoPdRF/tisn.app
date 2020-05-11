import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import SwipeableViews from 'react-swipeable-views';

import {
  getEvent,
  getAttendants,
  postAttendant,
  deleteAttendant,
  getComments,
  postComment,
  putNotification,
  getNotifications,
} from '../../logic/api';
import {
  groupComments,
  buildValidationErrorsObject,
  classifyNotifications,
} from '../../logic/utils';

import { useUser } from '../UserProvider/UserProvider';
import {
  useNotifications,
  useSetNotifications,
} from '../NotificationsProvider/NotificationsProvider';

import TabPanel from '../TabPanel/TabPanel';
import EventDetails from '../EventDetails/EventDetails';
import CommentCard from '../CommentCard/CommentCard';
import CommentForm from '../CommentForm/CommentForm';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Event = ({ match }) => {
  const { t } = useTranslation();
  const style = Style();
  const user = useUser();
  const notifications = useNotifications();
  const setNotifications = useSetNotifications();

  const [value, setValue] = useState(0);
  const [event, setEvent] = useState(null);
  const [attendants, setAttendants] = useState(null);
  const [updateAttendants, setUpdateAttendants] = useState(true);
  const [comments, setComments] = useState(null);
  const [updateComments, setUpdateComments] = useState(true);
  const [updateNotifications, setUpdateNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  const commentsTab = match.path.endsWith('/comments');
  useEffect(() => {
    if (commentsTab) {
      setValue(1);
    }
  }, [commentsTab]);

  const id = match.params.eventId;
  useEffect(() => {
    setLoading(true);
    setError(null);
    getEvent(id)
      .then((data) => setEvent(data.event))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (updateAttendants) {
      setError(null);
      getAttendants(id)
        .then((data) => setAttendants(data.attendants))
        .catch((error) => setError(error))
        .finally(() => {
          setUpdateAttendants(false);
          setLoading(false);
        });
    }
  }, [id, updateAttendants]);

  useEffect(() => {
    if (updateComments) {
      getComments(id)
        .then((data) => setComments(groupComments(data.comments)))
        .catch((error) => setError(error))
        .finally(() => {
          setUpdateComments(false);
          setLoading(false);
        });
    }
  }, [id, updateComments]);

  useEffect(() => {
    if (user && id && notifications) {
      setError(null);

      const attendantNotifications = notifications.regular.filter(
        (notification) =>
          notification.type === 'Attendant' &&
          notification.path.split('/')[2] === id
      );
      const commentNotifications = notifications.regular.filter(
        (notification) =>
          notification.type === 'Comment' &&
          notification.path.split('/')[2] === id
      );

      const markNotificationsAsRead = (notifications) => {
        notifications.forEach((notification, index) => {
          notification.read = true;
          notification.readAt = new Date();

          putNotification(user._id, notification._id, notification)
            .then((data) => {
              if (data.errors) {
                setError(t('event.error.generic'));
              }

              if (index === notifications.length - 1) {
                setUpdateNotifications(true);
              }
            })
            .catch((error) => setError(error));
        });
      };

      if (value === 0 && attendantNotifications.length > 0) {
        markNotificationsAsRead(attendantNotifications);
      }
      if (value === 1 && commentNotifications.length > 0) {
        markNotificationsAsRead(commentNotifications);
      }
    }
  }, [user, id, value, notifications, t]);

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

  const handleAttendantsClick = () => {
    setLoading(true);
    setError(null);
    if (userAttending) {
      const attendant = attendants.filter(
        (attendant) => attendant.user._id === user._id
      )[0];

      deleteAttendant(id, attendant._id, attendant)
        .then(() => setUpdateAttendants(true))
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    } else {
      postAttendant(id, {
        event,
        user,
      })
        .then(() => setUpdateAttendants(true))
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  };

  const handleCommentsClick = (
    commentContent,
    handleCommentContentChange,
    parentComment
  ) => {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    const comment = {
      event,
      user,
      content: commentContent,
    };
    if (parentComment) {
      comment.parentComment = parentComment;
    }

    postComment(id, comment)
      .then((data) => {
        if (data.errors) {
          setError(t('event.error.formErrors'));
          setValidationErrors(buildValidationErrorsObject(data.errors));
          setLoading(false);
        } else {
          setUpdateComments(true);
          handleCommentContentChange('');
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const futureEvent = event && new Date(event.startDate) >= new Date();

  const restrictedDisplay =
    futureEvent && user && (user._id === event.createdBy || user.admin);

  const userAttending =
    user &&
    attendants &&
    attendants.some((attendant) => attendant.user._id === user._id);

  const limitMet =
    event && attendants && attendants.length >= event.attendantsLimit;

  return (
    <Fragment>
      {loading && <LinearProgress />}
      {event && user && (
        <div className={style.root}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h2">Event</Typography>
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
                    <Tab label={t('event.details')} />
                    <Tab label={t('event.comments')} />
                  </Tabs>
                </AppBar>
                <SwipeableViews
                  index={value}
                  onChangeIndex={(index) => setValue(index)}
                >
                  <TabPanel value={value} index={0}>
                    <EventDetails
                      event={event}
                      restrictedDisplay={restrictedDisplay}
                      futureEvent={futureEvent}
                      userAttending={userAttending}
                      handleClick={handleAttendantsClick}
                      attendants={attendants}
                      limitMet={limitMet}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {userAttending ? (
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item>
                          <CommentForm
                            parentComment={null}
                            handleClick={handleCommentsClick}
                            validationErrors={validationErrors}
                          />
                        </Grid>
                        {comments &&
                          comments.map((commentsGroup) => (
                            <Grid item key={commentsGroup.comment._id}>
                              <CommentCard
                                commentsGroup={commentsGroup}
                                handleClick={handleCommentsClick}
                                validationErrors={validationErrors}
                              />
                            </Grid>
                          ))}
                      </Grid>
                    ) : (
                      <div className={style.center}>
                        <Typography gutterBottom variant="body1">
                          {t('event.onlyAttendants')}
                        </Typography>
                        {futureEvent && !limitMet && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAttendantsClick()}
                          >
                            {t('event.attend')}
                          </Button>
                        )}
                      </div>
                    )}
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

export default Event;
