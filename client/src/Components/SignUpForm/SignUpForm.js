import React, { useState, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import { signUp, setUserSession } from '../../logic/auth';

const SignUpForm = () => {
  const history = useHistory();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = () => {
    setLoading(true);
    if (password !== confirmPassword) {
      setError('Passwords don\'t match');
      setLoading(false);
    } else {
      signUp({ name, email, password, dateOfBirth })
        .then(data => {
          setUserSession(data.user);
          setLoading(false);
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
          <Grid item>
            <Typography variant="h1">
              Sign up
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              type="password"
              label="Confirm password"
              variant="outlined"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
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
              variant="outlined"
              onClick={() => handleClick()}
              disabled={
                loading ||
                !name ||
                !email ||
                !password ||
                !confirmPassword ||
                !dateOfBirth
              }
            >
              Sign up
            </Button>
          </Grid>
          <Grid item>
            <Link href={`${process.env.PUBLIC_URL}/log-in`}>
              Log in
            </Link>
            {' | '}
            <Link href={`${process.env.PUBLIC_URL}/`}>
              Home
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default SignUpForm;
