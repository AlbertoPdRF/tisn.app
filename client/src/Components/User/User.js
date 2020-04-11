import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

import { getUser } from '../../logic/api';
import { formatDate } from '../../logic/datetime';

import { useUser } from '../UserProvider/UserProvider';

import Style from '../Style/Style';

const User = ({ match }) => {
  const history = useHistory();
  const style = Style();
  const currentUser = useUser();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const id = match.params.id;
  useEffect(() => {
    getUser(id)
      .then(data => setUser(data.user))
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }, [id]);

  const restrictedDisplay = currentUser && (
    currentUser._id === id ||
    currentUser.admin
  );

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
                  src={user.avatar}
                  alt={`${user.avatar}'s avatar`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                {restrictedDisplay &&
                  <Button
                    className={style.alignRight}
                    variant="outlined"
                    color="primary"
                      onClick={() => history.push(`/users/${id}/edit`)}
                  >
                    Edit
                  </Button>
                }
                <Typography variant="h5" component="h3">
                  {user.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {`Joined on ${formatDate(user.createdAt)}`}
                </Typography>
                <Typography gutterBottom variant="body1" color="textSecondary">
                  {`Updated on ${formatDate(user.updatedAt)}`}
                </Typography>
                {restrictedDisplay &&
                  <Fragment>
                    <Typography variant="body1">
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
                            src={interest.avatar}
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
