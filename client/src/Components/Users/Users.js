import React, { useState, useEffect } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import { getUsers } from '../../logic/api';

import Style from '../Style/Style';
import UserCard from '../UserCard/UserCard';

const Users = () => {
  const style = Style();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(data => setUsers(data.users))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <LinearProgress />
  ) : (
    <div className={style.root}>
      <Grid container spacing={1} justify="center">
        {users.map(user => (
          <Grid item key={user._id}>
            <UserCard user={user} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Users;
