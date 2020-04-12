import React, { useState, useEffect, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';

import { getEvent } from '../../logic/api';
import { formatDateTimeRange } from '../../logic/date-time';

import Style from '../Style/Style';

const Event = ({ match }) => {
  const style = Style();

  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const id = match.params.id;
  useEffect(() => {
    getEvent(id)
      .then(data => setEvent(data.event))
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    loading ? (
      <LinearProgress />
    ) : (
      <div className={style.root}>
        <Grid container spacing={1} justify="center">
          <Grid item>
            <Card>
              <CardMedia
                component="img"
                src={event.coverPhoto
                  ? event.coverPhoto
                  : "../../../event-placeholder.jpg"
                }
                alt={event.name}
                title={event.name}
              />
              <CardContent>
                <div className={style.alignRight}>
                  <Fragment>
                    {formatDateTimeRange(
                      event.startDate,
                      event.endDate
                    )
                      .split('\n')
                      .map((text, index) =>
                        <Typography
                          key={index}
                          gutterBottom={!!index}
                          variant="h5"
                          component="p"
                          color="textSecondary"
                        >
                          {text}
                        </Typography>
                      )
                    }
                  </Fragment>
                  <Button variant="contained" color="primary">
                    I will attend!
                  </Button>
                </div>
                <Typography gutterBottom variant="h5" component="h3">
                  {event.name}
                </Typography>
                <Fragment>
                  {event.description
                    .split('\n')
                    .map((text, index) =>
                      <Typography
                        key={index}
                        gutterBottom
                        variant="body1"
                        component="p"
                        color="textSecondary"
                      >
                        {text}
                      </Typography>
                    )
                  }
                </Fragment>
                {event.relatedInterests.length > 0 && (
                  <Fragment>
                    <Typography variant="h6" component="h4">
                      Related interests:
                    </Typography>
                    <AvatarGroup>
                      {event.relatedInterests.map(interest => (
                        <Avatar
                          key={interest._id}
                          src={interest.avatar}
                          alt={interest.name}
                        />
                      ))}
                    </AvatarGroup>
                  </Fragment>
                )}
                {event.attendants.length > 0 && (
                  <Fragment>
                    <Typography variant="h6" component="h4">
                      Attendants:
                    </Typography>
                    <AvatarGroup>
                      {event.attendants.map(attendant => (
                        <Avatar
                          key={attendant._id}
                          src={attendant.avatar}
                          alt={`${attendant.name}'s avatar`}
                        >
                          {attendant.name.charAt(0).toUpperCase()}
                        </Avatar>
                      ))}
                    </AvatarGroup>
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

export default Event;
