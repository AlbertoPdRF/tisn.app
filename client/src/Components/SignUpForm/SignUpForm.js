import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';

import countries from 'country-region-data';

import { postUser } from '../../logic/api';
import { buildValidationErrorsObject } from '../../logic/utils';
import { setUserSession } from '../../logic/auth';

import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const SignUpForm = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const style = Style();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState(null);
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  const handleCountryChange = (country) => {
    setCountry(country);

    setRegions(
      countries.filter(
        (c) => c.countryShortCode === country.countryShortCode
      )[0].regions
    );
    setRegion(null);
  };

  const handleSignUpClick = () => {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    postUser({
      name,
      email,
      password,
      confirmPassword,
      dateOfBirth,
      country: country.countryShortCode,
      region: region.shortCode,
    })
      .then((data) => {
        if (data.errors) {
          setError(t('signUpForm.error.formErrors'));
          setValidationErrors(buildValidationErrorsObject(data.errors));
          setLoading(false);
        } else {
          setUserSession(data.user);
          history.push('/');
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <Box p={1}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h2">{t('signUpForm.title')}</Typography>
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              label={t('signUpForm.name')}
              variant="outlined"
              value={name}
              onChange={(event) => setName(event.target.value)}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              label={t('signUpForm.email')}
              variant="outlined"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              type={showPasswords ? 'text' : 'password'}
              label={t('signUpForm.password')}
              variant="outlined"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                ),
              }}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              type={showPasswords ? 'text' : 'password'}
              label={t('signUpForm.confirmPassword')}
              variant="outlined"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              type="date"
              label={t('signUpForm.dateOfBirth')}
              variant="outlined"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!validationErrors.dateOfBirth}
              helperText={validationErrors.dateOfBirth}
            />
          </Grid>
          <Grid item>
            <Autocomplete
              className={style.formInput}
              disableClearable
              options={countries.sort(
                (a, b) =>
                  -t(`countriesList.${b.countryShortCode}`).localeCompare(
                    t(`countriesList.${a.countryShortCode}`)
                  )
              )}
              getOptionLabel={(country) =>
                t(`countriesList.${country.countryShortCode}`)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t('signUpForm.country')}
                  error={!!validationErrors.country}
                  helperText={validationErrors.country}
                />
              )}
              noOptionsText={t('signUpForm.noMatchingCountry')}
              value={country}
              onChange={(event, country) => handleCountryChange(country)}
            />
          </Grid>
          {regions && regions.length > 0 && (
            <Grid item>
              <Autocomplete
                className={style.formInput}
                disableClearable
                options={regions}
                getOptionLabel={(region) => region.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={t('signUpForm.region')}
                    error={!!validationErrors.region}
                    helperText={validationErrors.region}
                  />
                )}
                noOptionsText={t('signUpForm.noMatchingRegion')}
                value={region}
                onChange={(event, region) => setRegion(region)}
              />
            </Grid>
          )}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSignUpClick()}
              disabled={
                !name ||
                !email ||
                !password ||
                !confirmPassword ||
                !dateOfBirth ||
                !country ||
                !region ||
                loading
              }
            >
              {t('signUpForm.signUp')}
            </Button>
          </Grid>
        </Grid>
      </Box>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default SignUpForm;
