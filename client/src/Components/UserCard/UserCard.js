import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

import Style from '../Style/Style';

const UserCard = (props) => {
  const { user } = props;

  const style = Style();

  return (
    <Card className={style.userCard}>
      <CardActionArea component={Link} to={`/users/${user._id}`}>
        <CardHeader
          avatar={
            <Avatar src={user.avatar} alt={`${user.name}'s avatar`}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={user.name}
        />
        {user.interests.length > 0 && (
          <CardContent className={style.userCardContent}>
            <AvatarGroup max={3}>
              {user.interests.map((interest) => (
                <Avatar
                  key={interest._id}
                  src={interest.avatar}
                  alt={interest.name}
                />
              ))}
            </AvatarGroup>
          </CardContent>
        )}
      </CardActionArea>
    </Card>
  );
};

export default UserCard;
