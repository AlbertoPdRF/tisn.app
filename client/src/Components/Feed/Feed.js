import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const Feed = ({ classes = null }) => {
  return (
    <Grid container spacing={1} direction="column" className={classes.grow}>
      <Grid item className={classes.center}>
        <Typography variant="h1">
          Feed
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Feed;
