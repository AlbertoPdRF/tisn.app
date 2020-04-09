import React, { useState, useEffect, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import { getUser } from '../../logic/api';
import { BASE_API_URL } from '../../logic/env';
import { formatDate } from '../../logic/date';

import { useUser } from '../UserProvider/UserProvider';

import Style from '../Style/Style';

const User = ({ match }) => {
  const style = Style();
  const currentUser = useUser();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const id = match.params.id;
  useEffect(() => {
    getUser(id)
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    loading ? (
      <LinearProgress />
    ) : (
      <div className={style.root}>
        <Grid container spacing={1} justify="center">
          <Grid item>
            <Card>
              <CardContent>
                <Avatar
                  className={style.avatar}
                  src={`${BASE_API_URL}${user.avatar}`}
                  alt={`${user.avatar}'s avatar`}
                />
                <Typography gutterBottom variant="h5" component="h3">
                  {user.name}
                </Typography>
                {user._id === currentUser._id &&
                  <Fragment>
                    <Typography gutterBottom variant="body1">
                      {formatDate(user.dateOfBirth)}
                    </Typography>
                    <Typography gutterBottom variant="body1">
                      {user.email}
                    </Typography>
                  </Fragment>
                }
                {user.interests.length > 0 && (
                  <Fragment>
                    <Typography variant="h6" component="h4">
                      Interests:
                    </Typography>
                    {user.interests.map(interest => (
                      <Chip
                        className={style.chip}
                        variant="outlined"
                        key={interest._id}
                        avatar={
                          <Avatar
                            src={`${BASE_API_URL}${interest.avatar}`}
                            alt={interest.name}
                          />
                        }
                        label={interest.name}
                      />
                    ))}
                  </Fragment>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    )
  );
};

export default User;
