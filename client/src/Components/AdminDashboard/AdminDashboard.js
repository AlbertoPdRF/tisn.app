import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Style from '../Style/Style';

const AdminDashboard = () => {
  const style = Style();

  return (
    <div className={style.root}>
      <Grid container spacing={1} direction="column" className={style.grow}>
        <Grid item className={style.center}>
          <Typography variant="h1">
            Admin dashboard
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
