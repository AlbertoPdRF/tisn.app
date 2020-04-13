import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import { getUser, postUser, putUser } from '../../logic/api';
import { setUserSession } from '../../logic/auth';
import { inputDate } from '../../logic/date-time';
import { uploadFile } from '../../logic/file-upload';

import { useUser, useSetUser } from '../UserProvider/UserProvider';

import Style from '../Style/Style';

const UserForm = ({ id = null }) => {
  const history = useHistory();
  const style = Style();

  const currentUser = useUser();
  const setCurrentUser = useSetUser();

  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && currentUser) {
      setLoading(true);
      if (currentUser._id === id) {
        setUser(currentUser);
        setLoading(false);
      } else if (currentUser.admin) {
        getUser(id)
          .then(data => setUser(data.user))
          .catch(error => setError(error.message))
          .finally(() => setLoading(false));
      } else {
        history.push(`/users/${currentUser._id}/edit`);
      }
    }
  }, [id, currentUser, history]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setName(user.name);
      setEmail(user.email);
      setDateOfBirth(inputDate(user.dateOfBirth));
      setAvatar(user.avatar);
      setLoading(false);
    }
  }, [user]);

  const handleFileUpload = file => {
    if (file) {
      setLoading(true);
      uploadFile(file)
        .then(data => setAvatar(data.uploadedFile.secure_url))
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }
  };

  const handleEditClick = () => {
    setLoading(true);
    putUser(id, { name, email, dateOfBirth, avatar })
      .then(data => {
        if (currentUser._id === id) {
          setCurrentUser(data.user);
        }
        history.push(`/users/${id}`);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleSignUpClick = () => {
    setLoading(true);
    if (password !== confirmPassword) {
      setError('Passwords don\'t match');
      setLoading(false);
    } else {
      postUser({ name, email, password, dateOfBirth })
        .then(data => {
          setUserSession(data.user);
          history.push('/');
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <Box p={1}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          {!id &&
          <Grid item>
            <Typography variant="h1">
                Sign up
            </Typography>
          </Grid>
          }
          {id &&
            <Fragment>
              <Grid item>
                <Avatar
                  className={style.avatar}
                  src={avatar}
                  alt={`${name}'s avatar`}
                >
                  {name.charAt(0).toUpperCase()}
                </Avatar>
              </Grid>
              <Grid item>
                <TextField
                  className={style.formInput}
                  type="file"
                  accept="image/*"
                  label="Avatar"
                  variant="outlined"
                  onChange={event => handleFileUpload(event.target.files[0])}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Fragment>
          }
          <Grid item>
            <TextField
              className={style.formInput}
              label="Name"
              variant="outlined"
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              label="Email"
              variant="outlined"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </Grid>
          {!id &&
            <Fragment>
              <Grid item>
                <TextField
                  className={style.formInput}
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  className={style.formInput}
                  type="password"
                  label="Confirm password"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={event => setConfirmPassword(event.target.value)}
                />
              </Grid>
            </Fragment>
          }
          <Grid item>
            <TextField
              className={style.formInput}
              type="date"
              label="Date of birth"
              variant="outlined"
              value={dateOfBirth}
              onChange={event => setDateOfBirth(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => id ? handleEditClick() : handleSignUpClick()}
              disabled={
                loading ||
                !name ||
                !email ||
                (!id && (
                  !password ||
                  !confirmPassword
                )) ||
                !dateOfBirth
              }
            >
              {id ? 'Edit' : 'Sign up'}
            </Button>
          </Grid>
          {!id &&
            <Grid item>
              <Link href="/log-in">
                Log in
              </Link>
              {' | '}
              <Link href="/">
                Home
              </Link>
            </Grid>
          }
        </Grid>
      </Box>
    </Fragment>
  );
};

export default UserForm;
