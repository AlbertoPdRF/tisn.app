import React, { useState, useEffect } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { getUsers } from '../../logic/api';

import UserCard from '../UserCard/UserCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Users = () => {
  const style = Style();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    getUsers()
      .then((data) => setUsers(data.users))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <LinearProgress />
  ) : (
    <div className={style.root}>
      <Grid container justify="center" spacing={2}>
        <Grid item className={`${style.fullWidth} ${style.center}`}>
          <Typography variant="h2">Users</Typography>
        </Grid>
        {users.map((user) => (
          <Grid item key={user._id}>
            <UserCard user={user} />
          </Grid>
        ))}
      </Grid>
      {error && <ErrorSnackbar error={error} />}
    </div>
  );
};

export default Users;
