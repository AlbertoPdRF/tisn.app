import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import HomeToolbar from '../HomeToolbar/HomeToolbar';
import HomeFooter from '../HomeFooter/HomeFooter'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 1),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
      paddingBottom: theme.spacing(2),
    },
    display: 'flex',
    minHeight: '100vh',
  },
  grow: {
    flexGrow: 1,
  },
  fullWidth: {
    width: '100%',
  },
  center: {
    textAlign: 'center',
  },
}));

const Home = () => {  
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={1} direction="column" className={classes.grow}>
        <Grid item>
          <HomeToolbar />
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
          <HomeFooter />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
