import React from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';

import Style from '../Style/Style';

const LogInForm = (props) => {
  const {
    email,
    handleEmailChange,
    password,
    handlePasswordChange,
    showPassword,
    handleShowPasswordChange,
    handleLogInClick,
    loading,
    validationErrors,
  } = props;

  const { t } = useTranslation();
  const style = Style();

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <TextField
          className={style.formInput}
          label={t('logInForm.email')}
          variant="outlined"
          value={email}
          onChange={(event) => handleEmailChange(event.target.value)}
          error={!!validationErrors.email}
          helperText={
            validationErrors.email && t(`errorsList.${validationErrors.email}`)
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
          onChange={(event) => handlePasswordChange(event.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                color="primary"
                onClick={() => handleShowPasswordChange(!showPassword)}
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
          onClick={() => handleLogInClick()}
          disabled={!email || !password || loading}
        >
          {t('logInForm.logIn')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default LogInForm;
