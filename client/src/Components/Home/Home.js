import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { getEvents } from '../../logic/api';
import { inputDate } from '../../logic/date-time';

import { useUser } from '../UserProvider/UserProvider';

import EventCard from '../EventCard/EventCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Home = () => {
  const history = useHistory();
  const style = Style();
  const user = useUser();

  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setError(null);

      const params = new URLSearchParams();
      params.append('fromDate', inputDate(new Date().toISOString()));
      if (user.interests.length > 0) {
        user.interests.forEach((interest) => {
          params.append('interests', interest._id);
        });
      }

      getEvents(`?${params.toString()}`)
        .then((data) => setEvents(data.events))
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container justify="center" spacing={2}>
          {events && events.length > 0 && (
            <Fragment>
              {events.map((event) => (
                <Grid item key={event._id}>
                  <EventCard event={event} />
                </Grid>
              ))}
              <Grid item className={`${style.fullWidth} ${style.center}`}>
                <Typography variant="body1">
                  We have no more event recommendations for you right now,
                  please check back later or
                </Typography>
                <Button
                  className={style.buttons}
                  variant="contained"
                  color="primary"
                  onClick={() => history.push('/events')}
                >
                  Browse all events
                </Button>
                <Button
                  className={style.buttons}
                  variant="outlined"
                  color="primary"
                  onClick={() => history.push('/interests')}
                >
                  Adjust your interests
                </Button>
              </Grid>
            </Fragment>
          )}
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default Home;
