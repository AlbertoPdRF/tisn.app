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
        to={`/events/${event._id}`}
      >
        <CardMedia
          component="img"
          src="../../../event-placeholder.jpg"
          alt={event.name}
          height="140"
          title={event.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {event.name}
          </Typography>
          <AvatarGroup className={style.cardInterests} max={1}>
            {event.relatedInterests.map(interest => (
              <Avatar key={interest.name} alt={interest.name} src={interest.avatar} />
            ))}
          </AvatarGroup>
          <Typography variant="body1" color="textSecondary" component="p">
            {event.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
