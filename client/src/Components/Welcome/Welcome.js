import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import WelcomeToolbar from '../WelcomeToolbar/WelcomeToolbar';
import WelcomeFooter from '../WelcomeFooter/WelcomeFooter';

const Welcome = ({ classes = null }) => {
  return (
    <Grid container spacing={1} direction="column" className={classes.grow}>
      <Grid item>
        <WelcomeToolbar />
      </Grid>
      <Grid item className={classes.center}>
        <Typography variant="h1">
          Tisn
        </Typography>
      </Grid>
      <Grid item className={classes.center}>
        <Typography variant="subtitle1">
          The introverts' social network
        </Typography>
      </Grid>
      <Grid item className={classes.grow} />
      <Grid item className={classes.fullWidth}>
        <WelcomeFooter />
      </Grid>
    </Grid>
  );
};

export default Welcome;
