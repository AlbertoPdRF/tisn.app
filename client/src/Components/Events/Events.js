import React, { useState, useEffect, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import countries from 'country-region-data';

import { getEvents, getInterests } from '../../logic/api';
import { inputDate } from '../../logic/date-time';
import { buildValidationErrorsObject } from '../../logic/utils';

import { useUser } from '../UserProvider/UserProvider';

import EventSearchForm from '../EventSearchForm/EventSearchForm';
import EventCard from '../EventCard/EventCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Events = () => {
  const style = Style();
  const user = useUser();

  const [events, setEvents] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [country, setCountry] = useState(null);
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState(null);
  const [name, setName] = useState('');
  const [allInterests, setAllInterests] = useState(null);
  const [relatedInterests, setRelatedInterests] = useState([]);
  const [query, setQuery] = useState('');
  const [updateEvents, setUpdateEvents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const now = inputDate(new Date().toISOString());
      setFromDate(now);

      const c = countries.filter(
        (country) => country.countryShortCode === user.country
      )[0];
      const r = c.regions.filter(
        (region) => region.shortCode === user.region
      )[0];
      setCountry(c);
      setRegions(c.regions);
      setRegion(r);

      const params = new URLSearchParams({
        fromDate: now,
        country: c.countryShortCode,
        region: r.shortCode,
      });
      setQuery(`?${params.toString()}`);
      setUpdateEvents(true);
    }
  }, [user]);

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

  const handleCountryChange = (country) => {
    setCountry(country);

    if (country) {
      setRegions(
        countries.filter(
          (c) => c.countryShortCode === country.countryShortCode
        )[0].regions
      );
    } else {
      setRegions([]);
    }
    setRegion(null);
  };

  const handleRegionChange = (region) => setRegion(region);

  const handleNameChange = (name) => setName(name);

  const handleRelatedInterestsChange = (relatedInterests) =>
    setRelatedInterests(relatedInterests);

  const handleSearchClick = () => {
    const params = new URLSearchParams();
    if (fromDate) {
      params.append('fromDate', fromDate);
    }
    if (country) {
      params.append('country', country.countryShortCode);

      if (region) {
        params.append('region', region.shortCode);
      }
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
              countries={countries}
              country={country}
              handleCountryChange={handleCountryChange}
              regions={regions}
              region={region}
              handleRegionChange={handleRegionChange}
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
