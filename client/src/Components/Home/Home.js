import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Welcome from '../Welcome/Welcome';
import Feed from '../Feed/Feed';

import { isLoggedIn } from '../../logic/auth';

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
      {isLoggedIn()
        ? <Feed classes={classes} />
        : <Welcome classes={classes} />
      }
    </div>
  );
};

export default Home;
