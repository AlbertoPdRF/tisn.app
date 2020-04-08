import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';

import { BASE_API_URL } from '../../logic/env';

import Style from '../Style/Style';

const EventCard = ({ event = {} }) => {
  const style = Style();

  return (
    <Card className={style.card}>
      <CardActionArea
        component={Link}
        to={`/events/${event._id}`}
        disabled={event._id === "dummy"}
      >
        <CardMedia
          component="img"
          src={event.coverPhoto ? `${BASE_API_URL}${event.coverPhoto}` : `${process.env.PUBLIC_URL}/event-placeholder.jpg`}
          alt={event.name}
          height="140"
          title={event.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h3" noWrap>
            {event.name}
          </Typography>
          <AvatarGroup className={style.cardInterests} max={1}>
            {event.relatedInterests.map(interest => (
              <Avatar key={interest.name} alt={interest.name} src={interest.avatar} />
            ))}
          </AvatarGroup>
          <Typography variant="body1" color="textSecondary" component="p">
            {event.description.length < 120
              ? event.description
              : `${event.description.substring(0, 119)}...`
            }
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
