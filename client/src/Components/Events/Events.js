import { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import countries from 'country-region-data';

import { getEvents, getInterests } from '../../logic/api';
import { formatInputDate } from '../../logic/date-time';
import { buildValidationErrorsObject } from '../../logic/utils';

import { useUser } from '../UserProvider/UserProvider';

import EventSearchForm from '../EventSearchForm/EventSearchForm';
import EventCard from '../EventCard/EventCard';
import SearchFabAndDialog from '../SearchFabAndDialog/SearchFabAndDialog';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Events = () => {
  const { t } = useTranslation();
  const style = Style();
  const user = useUser();

  const [events, setEvents] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const interestParam = new URLSearchParams(window.location.search).get(
    'interest'
  );

  useEffect(() => {
    if (user) {
      const now = new Date().toISOString();
      setFromDate(formatInputDate(now));

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
      if (interestParam) {
        params.append('relatedInterests', interestParam);
      }

      setQuery(`?${params.toString()}`);
      setUpdateEvents(true);
    }
  }, [user, interestParam]);

  useEffect(() => {
    if (updateEvents) {
      setLoading(true);
      setError(null);
      setValidationErrors({});
      getEvents(query)
        .then((data) => {
          if (data.errors) {
            setError(t('errorsList.formErrors'));
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
  }, [updateEvents, query, t]);

  useEffect(() => {
    setError(null);
    getInterests()
      .then((data) => setAllInterests(data.interests))
      .catch((error) => setError(error));
  }, []);

  useEffect(() => {
    if (interestParam && allInterests) {
      setRelatedInterests(
        allInterests.filter((interest) => interest._id === interestParam)
      );
    }
  }, [interestParam, allInterests]);

  const handleDialogToggle = () => setDialogOpen(!dialogOpen);

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
      params.append('fromDate', new Date(`${fromDate}T00:00`).toISOString());
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
    handleDialogToggle();
    window.scrollTo(0, 0);
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container justify="center" spacing={2}>
          <Grid item className={`${style.fullWidth} ${style.center}`}>
            <Typography variant="h2">{t('events.title')}</Typography>
          </Grid>
          {events && events.length > 0
            ? events.map((event) => (
                <Grid item key={event._id} md={4} sm={6} xs={12}>
                  <EventCard event={event} />
                </Grid>
              ))
            : !loading && (
                <Grid item className={`${style.fullWidth} ${style.center}`}>
                  <Typography variant="body1">
                    {t('events.noEvents')}
                  </Typography>
                </Grid>
              )}
        </Grid>
      </div>
      <SearchFabAndDialog
        dialogOpen={dialogOpen}
        handleDialogToggle={handleDialogToggle}
      >
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
      </SearchFabAndDialog>
      {error && (
        <ErrorSnackbar error={error} className={style.snackbarAboveFab} />
      )}
    </Fragment>
  );
};

export default Events;
