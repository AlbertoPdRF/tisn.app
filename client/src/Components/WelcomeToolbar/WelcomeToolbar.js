import React from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const WelcomeToolbar = () => {
  const history = useHistory();

  return (
    <Grid container alignItems="center" justify="flex-end" spacing={1}>
      <Grid item>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => history.push('/log-in')}
        >
          Log in
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push('/sign-up')}
        >
          Sign up
        </Button>
      </Grid>
    </Grid>
  );
};

export default WelcomeToolbar;
