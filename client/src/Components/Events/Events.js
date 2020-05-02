import React, { useState, useEffect, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { getEvents, getInterests } from '../../logic/api';
import { inputDate } from '../../logic/date-time';
import { buildValidationErrorsObject } from '../../logic/utils';

import EventSearchForm from '../EventSearchForm/EventSearchForm';
import EventCard from '../EventCard/EventCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Events = () => {
  const style = Style();

  const now = inputDate(new Date().toISOString());

  const [events, setEvents] = useState(null);
  const [fromDate, setFromDate] = useState(now);
  const [name, setName] = useState('');
  const [allInterests, setAllInterests] = useState(null);
  const [relatedInterests, setRelatedInterests] = useState([]);
  const [query, setQuery] = useState(`?fromDate=${now}`);
  const [updateEvents, setUpdateEvents] = useState(true);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (updateEvents) {
      setLoading(true);
      setError(null);
      setValidationErrors({});
      getEvents(query)
        .then((data) => {
          if (data.errors) {
            setError('The form contains errors');
            setValidationErrors(buildValidationErrorsObject(data.errors));
          } else {
            setEvents(data.events);
          }
        })
        .catch((error) => setError(error))
        .finally(() => {
          setUpdateEvents(false);
          setLoading(false);
        });
    }
  }, [updateEvents, query]);

  useEffect(() => {
    setError(null);
    getInterests()
      .then((data) => setAllInterests(data.interests))
      .catch((error) => setError(error));
  }, []);

  const handleFromDateChange = (fromDate) => setFromDate(fromDate);

  const handleNameChange = (name) => setName(name);

  const handleRelatedInterestsChange = (relatedInterests) =>
    setRelatedInterests(relatedInterests);

  const handleSearchClick = () => {
    const params = new URLSearchParams();
    if (fromDate) {
      params.append('fromDate', fromDate);
    }

    if (name) {
      params.append('name', name);
    }
    if (relatedInterests.length > 0) {
      relatedInterests.forEach((interest) => {
        params.append('relatedInterests', interest._id);
      });
    }

    setQuery(`?${params.toString()}`);
    setUpdateEvents(true);
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container justify="center" spacing={2}>
          <Grid item className={`${style.fullWidth} ${style.center}`}>
            <Typography variant="h2">Events</Typography>
          </Grid>
          <Grid item className={`${style.fullWidth} ${style.center}`}>
            <EventSearchForm
              fromDate={fromDate}
              handleFromDateChange={handleFromDateChange}
              name={name}
              handleNameChange={handleNameChange}
              allInterests={allInterests}
              relatedInterests={relatedInterests}
              handleRelatedInterestsChange={handleRelatedInterestsChange}
              handleSearchClick={handleSearchClick}
              validationErrors={validationErrors}
              loading={loading}
            />
          </Grid>
          {events && events.length > 0
            ? events.map((event) => (
                <Grid item key={event._id}>
                  <EventCard event={event} />
                </Grid>
              ))
            : !loading && (
                <Grid item className={`${style.fullWidth} ${style.center}`}>
                  <Typography variant="body1">
                    There are no events matching this filter
                  </Typography>
                </Grid>
              )}
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default Events;
