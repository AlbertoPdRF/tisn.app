import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Style from '../Style/Style';
import WelcomeToolbar from '../WelcomeToolbar/WelcomeToolbar';
import WelcomeFooter from '../WelcomeFooter/WelcomeFooter';

const Welcome = () => {
  const style = Style();

  return (
    <div className={`${style.root} ${style.minHeight}`}>
      <Grid container className={style.grow} direction="column" spacing={1}>
        <Grid item>
          <WelcomeToolbar />
        </Grid>
        <Grid item className={style.center}>
          <Typography variant="h1">Tisn</Typography>
        </Grid>
        <Grid item className={style.center}>
          <Typography variant="subtitle1">
            The introverts' social network
          </Typography>
        </Grid>
        <Grid item className={style.grow} />
        <Grid item className={style.fullWidth}>
          <WelcomeFooter />
        </Grid>
      </Grid>
    </div>
  );
};

export default Welcome;
