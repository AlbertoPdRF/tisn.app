import React, { useState, useEffect, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import { getEvents } from '../../logic/api';
import { inputDate } from '../../logic/date-time';

import { useUser } from '../UserProvider/UserProvider';

import EventCard from '../EventCard/EventCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Home = () => {
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
          {events &&
            events.length > 0 &&
            events.map((event) => (
              <Grid item key={event._id}>
                <EventCard event={event} />
              </Grid>
            ))}
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default Home;
