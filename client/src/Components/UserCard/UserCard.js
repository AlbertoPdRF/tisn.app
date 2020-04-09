import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

import { BASE_API_URL } from '../../logic/env';
import { formatDate } from '../../logic/date';

const UserCard = ({ user = {} }) => {
  return (
    <Card>
      <CardActionArea
        component={Link}
        to={`/users/${user._id}`}
      >
        <CardHeader
          avatar={
            <Avatar
              src={`${BASE_API_URL}${user.avatar}`}
              alt={`${user.name}'s avatar`}
            />
          }
          title={user.name}
          subheader={`Joined on ${formatDate(user.createdAt)}`}
        />
        {user.interests.length > 0 &&
          <CardContent>
            <AvatarGroup>
              {user.interests.map(interest => (
                <Avatar
                  key={interest._id}
                  src={`${BASE_API_URL}${interest.avatar}`}
                  alt={interest.name}
                />
              ))}
            </AvatarGroup>
          </CardContent>
        }
      </CardActionArea>
    </Card>
  );
};

export default UserCard;
