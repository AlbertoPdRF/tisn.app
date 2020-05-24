import React, { useState, Fragment, useEffect } from 'react';
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
import Button from '@material-ui/core/Button';

import { buildValidationErrorsObject } from '../../logic/utils';
import { logIn, setUserSession } from '../../logic/auth';

import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const LogInForm = (props) => {
  const { from } = props.location.state || { from: { pathname: '/' } };

  const { t } = useTranslation();
  const history = useHistory();
  const style = Style();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (props.location.state) {
      setError(t('errorsList.logIn'));
    }
  }, [props, t]);

  const handleClick = () => {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    logIn({ email, password })
      .then((data) => {
        if (data.error) {
          setError(t('errorsList.wrongEmailAndOrPassword'));
          setLoading(false);
        } else if (data.errors) {
          setError(t('errorsList.formErrors'));
          setValidationErrors(buildValidationErrorsObject(data.errors));
          setLoading(false);
        } else {
          setUserSession(data.user);
          history.push(from);
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
            <Typography variant="h2">{t('logInForm.title')}</Typography>
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              label={t('logInForm.email')}
              variant="outlined"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={!!validationErrors.email}
              helperText={
                validationErrors.email &&
                t(`errorsList.${validationErrors.email}`)
              }
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              type={showPassword ? 'text' : 'password'}
              label={t('logInForm.password')}
              variant="outlined"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                ),
              }}
              error={!!validationErrors.password}
              helperText={
                validationErrors.password &&
                t(`errorsList.${validationErrors.password}`)
              }
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClick()}
              disabled={!email || !password || loading}
            >
              {t('logInForm.logIn')}
            </Button>
          </Grid>
        </Grid>
      </Box>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default LogInForm;
