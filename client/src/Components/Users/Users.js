import React, { useState, useEffect, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { getUsers, getInterests } from '../../logic/api';
import { buildValidationErrorsObject } from '../../logic/utils';

import UserSearchForm from '../UserSearchForm/UserSearchForm';
import UserCard from '../UserCard/UserCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Users = () => {
  const style = Style();

  const [users, setUsers] = useState(null);
  const [name, setName] = useState('');
  const [allInterests, setAllInterests] = useState(null);
  const [interests, setInterests] = useState([]);
  const [query, setQuery] = useState('');
  const [updateUsers, setUpdateUsers] = useState(true);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (updateUsers) {
      setLoading(true);
      setError(null);
      setValidationErrors({});
      getUsers(query)
        .then((data) => {
          if (data.errors) {
            setError('The form contains errors');
            setValidationErrors(buildValidationErrorsObject(data.errors));
          } else {
            setUsers(data.users);
          }
        })
        .catch((error) => setError(error))
        .finally(() => {
          setUpdateUsers(false);
          setLoading(false);
        });
    }
  }, [updateUsers, query]);

  useEffect(() => {
    setError(null);
    getInterests()
      .then((data) => setAllInterests(data.interests))
      .catch((error) => setError(error));
  }, []);

  const handleNameChange = (name) => setName(name);

  const handleInterestsChange = (interests) => setInterests(interests);

  const handleSearchClick = () => {
    const params = new URLSearchParams();
    if (name) {
      params.append('name', name);
    }
    if (interests.length > 0) {
      interests.forEach((interest) => {
        params.append('interests', interest._id);
      });
    }

    setQuery(`?${params.toString()}`);
    setUpdateUsers(true);
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container justify="center" spacing={2}>
          <Grid item className={`${style.fullWidth} ${style.center}`}>
            <Typography variant="h2">Users</Typography>
          </Grid>
          <Grid item className={`${style.fullWidth} ${style.center}`}>
            <UserSearchForm
              name={name}
              handleNameChange={handleNameChange}
              allInterests={allInterests}
              interests={interests}
              handleInterestsChange={handleInterestsChange}
              handleSearchClick={handleSearchClick}
              validationErrors={validationErrors}
              loading={loading}
            />
          </Grid>
          {users && users.length > 0
            ? users.map((user) => (
                <Grid item key={user._id}>
                  <UserCard user={user} />
                </Grid>
              ))
            : !loading && (
                <Grid item className={`${style.fullWidth} ${style.center}`}>
                  <Typography variant="body1">
                    There are no users matching this filter
                  </Typography>
                </Grid>
              )}
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default Users;
