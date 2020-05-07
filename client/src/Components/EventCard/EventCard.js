import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';

import { decodeText } from '../../logic/utils';

import Style from '../Style/Style';

const EventCard = (props) => {
  const { event } = props;

  const style = Style();

  const decodedName = decodeText(event.name);
  const decodedDescription = decodeText(event.description);

  return (
    <Card>
      <CardActionArea
        component={Link}
        to={event._id ? `/events/${event._id}` : '/events'}
        disabled={!event._id}
      >
        <CardMedia
          component="img"
          src={
            event.coverPhoto
              ? `${event.coverPhoto}`
              : '../../../event-placeholder.jpg'
          }
          alt={decodedName}
          height="140"
          title={decodedName}
        />
        <CardContent>
          <AvatarGroup className={style.alignRight} max={2}>
            {event.relatedInterests.map((interest) => (
              <Avatar
                key={interest._id}
                src={interest.avatar}
                alt={interest.name}
                title={interest.name}
              />
            ))}
          </AvatarGroup>
          <Typography gutterBottom variant="h5" component="h3">
            {decodedName.length < 20
              ? decodedName
              : `${decodedName.substring(0, 19)}...`}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            {decodedDescription.length < 140
              ? decodedDescription
              : `${decodedDescription.substring(0, 139)}...`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
