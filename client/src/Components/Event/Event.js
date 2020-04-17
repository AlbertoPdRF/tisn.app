import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';

import {
  getEvent,
  getAttendants,
  postAttendant,
  deleteAttendant,
} from '../../logic/api';
import { formatDateTimeRange } from '../../logic/date-time';

import { useUser } from '../UserProvider/UserProvider';

import Style from '../Style/Style';

const Event = ({ match }) => {
  const history = useHistory();
  const style = Style();
  const user = useUser();

  const [event, setEvent] = useState(null);
  const [attendants, setAttendants] = useState(null);
  const [updateAttendants, setUpdateAttendants] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const id = match.params.id;
  useEffect(() => {
    setLoading(true);
    getEvent(id)
      .then((data) => setEvent(data.event))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (updateAttendants) {
      getAttendants(id)
        .then((data) => setAttendants(data.attendants))
        .catch((error) => setError(error.message))
        .finally(() => {
          setLoading(false);
          setUpdateAttendants(false);
        });
    }
  }, [id, updateAttendants]);

  const handleAttendClick = () => {
    setLoading(true);
    postAttendant(id, {
      event: id,
      user: user._id,
    })
      .then(() => setUpdateAttendants(true))
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleNotAttendClick = () => {
    setLoading(true);

    const attendant = attendants.filter(
      (attendant) => attendant.user._id === user._id
    )[0];
    const nonPopulatedAttendant = {
      event: attendant.event,
      user: attendant.user._id,
    };

    deleteAttendant(id, attendant._id, nonPopulatedAttendant)
      .then(() => setUpdateAttendants(true))
      .catch((error) => {
        setError(error.message);
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

  return (
    <Fragment>
      {loading && <LinearProgress />}
      {event && (
        <div className={style.root}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h2">Event</Typography>
            </Grid>
            <Grid item>
              <Card>
                <CardMedia
                  component="img"
                  src={
                    event.coverPhoto
                      ? event.coverPhoto
                      : '../../../event-placeholder.jpg'
                  }
                  alt={event.name}
                  title={event.name}
                />
                <CardContent>
                  <div className={style.alignRight}>
                    {restrictedDisplay && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => history.push(`/events/${id}/edit`)}
                      >
                        Edit
                      </Button>
                    )}
                    {formatDateTimeRange(event.startDate, event.endDate)
                      .split('\n')
                      .map((text, index) => (
                        <Typography
                          key={index}
                          gutterBottom={!!index}
                          variant="h5"
                          component="p"
                          color="textSecondary"
                        >
                          {text}
                        </Typography>
                      ))}
                    {futureEvent && (
                      <Button
                        variant={userAttending ? 'outlined' : 'contained'}
                        color={userAttending ? 'secondary' : 'primary'}
                        onClick={() =>
                          userAttending
                            ? handleNotAttendClick()
                            : handleAttendClick()
                        }
                      >
                        {userAttending ? "I won't attend" : 'I will attend!'}
                      </Button>
                    )}
                  </div>
                  <Typography gutterBottom variant="h5" component="h3">
                    {event.name}
                  </Typography>
                  <Fragment>
                    {event.description.split('\n').map((text, index) => (
                      <Typography
                        key={index}
                        gutterBottom
                        variant="body1"
                        component="p"
                        color="textSecondary"
                      >
                        {text}
                      </Typography>
                    ))}
                  </Fragment>
                  {event.relatedInterests.length > 0 && (
                    <Fragment>
                      <Typography variant="h6" component="h4">
                        Related interests:
                      </Typography>
                      {event.relatedInterests.map((interest) => (
                        <Chip
                          className={style.chip}
                          variant="outlined"
                          key={interest._id}
                          avatar={
                            <Avatar src={interest.avatar} alt={interest.name} />
                          }
                          label={interest.name}
                        />
                      ))}
                    </Fragment>
                  )}
                  {attendants && attendants.length > 0 && (
                    <Fragment>
                      <Typography variant="h6" component="h4">
                        Attendants:
                      </Typography>
                      <AvatarGroup>
                        {attendants.map((attendant) => (
                          <Avatar
                            key={attendant.user._id}
                            src={attendant.user.avatar}
                            alt={`${attendant.user.name}'s avatar`}
                          >
                            {attendant.user.name.charAt(0).toUpperCase()}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </Fragment>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </Fragment>
  );
};

export default Event;
