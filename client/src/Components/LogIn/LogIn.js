import React, { useState, Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import GoogleLogin from 'react-google-login';

import { buildValidationErrorsObject } from '../../logic/utils';
import { logIn, setUserSession } from '../../logic/auth';

import LogInForm from '../LogInForm/LogInForm';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const LogIn = (props) => {
  const { from } = props.location.state || { from: { pathname: '/' } };

  const { t } = useTranslation();
  const history = useHistory();
  const style = Style();

  const [displayButtons, setDisplayButtons] = useState(true);
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

  const handleEmailChange = (email) => setEmail(email);

  const handlePasswordChange = (password) => setPassword(password);

  const handleShowPasswordChange = (showPassword) =>
    setShowPassword(showPassword);

  const handleLogIn = (user, path) => {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    logIn(user, path)
      .then((data) => {
        if (data.error) {
          let errorMessage;
          if (data.error['email']) {
            errorMessage = t('errorsList.noEmail');
          } else {
            errorMessage = t('errorsList.wrongEmailAndOrPassword');
          }
          setError(errorMessage);
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

  const handleGoogleLogInClick = (googleResponse) => {
    handleLogIn(googleResponse, 'google');
  };

  const handleEmailLogInClick = () => {
    handleLogIn({ email, password }, '');
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h2">{t('logIn.title')}</Typography>
          </Grid>
          {displayButtons ? (
            <Grid item>
              <GoogleLogin
                clientId="559898025939-c2ssn40k4ru7eemeagf3jml24v8clpvb.apps.googleusercontent.com"
                onSuccess={handleGoogleLogInClick}
                render={(renderProps) => (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={renderProps.onClick}
                  >
                    Google
                  </Button>
                )}
              />
            </Grid>
          ) : (
            <Grid item>
              <LogInForm
                email={email}
                handleEmailChange={handleEmailChange}
                password={password}
                handlePasswordChange={handlePasswordChange}
                showPassword={showPassword}
                handleShowPasswordChange={handleShowPasswordChange}
                handleLogInClick={handleEmailLogInClick}
                loading={loading}
                validationErrors={validationErrors}
              />
            </Grid>
          )}
          <Grid item>
            <Button
              variant={displayButtons ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setDisplayButtons(!displayButtons)}
            >
              {displayButtons ? t('logIn.email') : t('logIn.other')}
            </Button>
          </Grid>
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default LogIn;
