import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';

import Style from '../Style/Style';

const EventCard = ({ event = {} }) => {
  const style = Style();

  return (
    <Card className={style.card}>
      <CardActionArea
        component={Link}
        to={event._id ? `/events/${event._id}` : '/events'}
        disabled={!event._id}
      >
        <CardMedia
          component="img"
          src={event.coverPhoto
            ? `${event.coverPhoto}`
            : "../../../event-placeholder.jpg"
          }
          alt={event.name}
          height="140"
          title={event.name}
        />
        <CardContent>
          <AvatarGroup className={style.alignRight} max={2}>
            {event.relatedInterests.map(interest => (
              <Avatar
                key={interest._id}
                src={interest.avatar}
                alt={interest.name}
              />
            ))}
          </AvatarGroup>
          <Typography gutterBottom variant="h5" component="h3">
            {event.name.length < 30
              ? event.name
              : `${event.name.substring(0, 29)}...`
            }
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            {event.description.length < 115
              ? event.description
              : `${event.description.substring(0, 114)}...`
            }
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
