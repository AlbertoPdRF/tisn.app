import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Style from '../Style/Style';

const AdminDashboard = () => {
  const style = Style();

  return (
    <div className={style.root}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item className={style.center}>
          <Typography variant="h2">Admin dashboard</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
