import React, { useState, useEffect } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import { getEvents } from '../../logic/api';

import EventCard from '../EventCard/EventCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Home = () => {
  const style = Style();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    getEvents()
      .then((data) => setEvents(data.events))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <LinearProgress />
  ) : (
    <div className={style.root}>
      <Grid container spacing={1} justify="center">
        {events.map((event) => (
          <Grid item key={event._id}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
      {error && <ErrorSnackbar error={error} />}
    </div>
  );
};

export default Home;
