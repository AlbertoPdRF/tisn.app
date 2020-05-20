import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import countries from 'country-region-data';

import { getUsers, getInterests } from '../../logic/api';
import { buildValidationErrorsObject } from '../../logic/utils';

import { useUser } from '../UserProvider/UserProvider';

import UserSearchForm from '../UserSearchForm/UserSearchForm';
import UserCard from '../UserCard/UserCard';
import SearchFabAndDialog from '../SearchFabAndDialog/SearchFabAndDialog';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Users = () => {
  const { t } = useTranslation();
  const style = Style();
  const currentUser = useUser();

  const [users, setUsers] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [country, setCountry] = useState(null);
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState(null);
  const [allInterests, setAllInterests] = useState(null);
  const [interests, setInterests] = useState([]);
  const [includeCurrentUser, setIncludeCurrentUser] = useState(false);
  const [query, setQuery] = useState('');
  const [updateUsers, setUpdateUsers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const c = countries.filter(
        (country) => country.countryShortCode === currentUser.country
      )[0];
      const r = c.regions.filter(
        (region) => region.shortCode === currentUser.region
      )[0];
      setCountry(c);
      setRegions(c.regions);
      setRegion(r);

      const params = new URLSearchParams({
        country: c.countryShortCode,
        region: r.shortCode,
      });

      setQuery(`?${params.toString()}`);
      setUpdateUsers(true);
    }
  }, [currentUser]);

  useEffect(() => {
    if (updateUsers) {
      setLoading(true);
      setError(null);
      setValidationErrors({});
      getUsers(query)
        .then((data) => {
          if (data.errors) {
            setError(t('errorsList.formErrors'));
            setValidationErrors(buildValidationErrorsObject(data.errors));
          } else {
            setUsers(
              data.users.filter(
                (user) => includeCurrentUser || user._id !== currentUser._id
              )
            );
          }
        })
        .catch((error) => setError(error))
        .finally(() => {
          setUpdateUsers(false);
          setLoading(false);
        });
    }
  }, [currentUser, includeCurrentUser, updateUsers, query, t]);

  useEffect(() => {
    setError(null);
    getInterests()
      .then((data) => setAllInterests(data.interests))
      .catch((error) => setError(error));
  }, []);

  const handleDialogToggle = () => setDialogOpen(!dialogOpen);

  const handleNameChange = (name) => setName(name);

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

  const handleInterestsChange = (interests) => setInterests(interests);

  const handleIncludeCurrentUserChange = (includeCurrentUser) => {
    setIncludeCurrentUser(includeCurrentUser);
  };

  const handleSearchClick = () => {
    const params = new URLSearchParams();
    if (name) {
      params.append('name', name);
    }
    if (country) {
      params.append('country', country.countryShortCode);

      if (region) {
        params.append('region', region.shortCode);
      }
    }
    if (interests.length > 0) {
      interests.forEach((interest) => {
        params.append('interests', interest._id);
      });
    }

    setQuery(`?${params.toString()}`);
    setUpdateUsers(true);
    handleDialogToggle();
    window.scrollTo(0, 0);
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container justify="center" spacing={2}>
          <Grid item className={`${style.fullWidth} ${style.center}`}>
            <Typography variant="h2">{t('users.title')}</Typography>
          </Grid>
          {users && users.length > 0
            ? users.map((user) => (
                <Grid item key={user._id} md={4} sm={6} xs={12}>
                  <UserCard user={user} />
                </Grid>
              ))
            : !loading && (
                <Grid item className={`${style.fullWidth} ${style.center}`}>
                  <Typography variant="body1">{t('users.noUsers')}</Typography>
                </Grid>
              )}
        </Grid>
      </div>
      <SearchFabAndDialog
        dialogOpen={dialogOpen}
        handleDialogToggle={handleDialogToggle}
      >
        <UserSearchForm
          name={name}
          handleNameChange={handleNameChange}
          countries={countries}
          country={country}
          handleCountryChange={handleCountryChange}
          regions={regions}
          region={region}
          handleRegionChange={handleRegionChange}
          allInterests={allInterests}
          interests={interests}
          handleInterestsChange={handleInterestsChange}
          includeCurrentUser={includeCurrentUser}
          handleIncludeCurrentUserChange={handleIncludeCurrentUserChange}
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

export default Users;
