import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import { formatDate } from '../../logic/date-time';

import Style from '../Style/Style';

const UserDetails = (props) => {
  const {
    user,
    userIsCurrentUser,
    currentUserFriendship,
    friendshipButton,
    handleFriendshipClick,
    restrictedDisplay,
  } = props;

  const history = useHistory();
  const style = Style();

  return (
    <Card>
      <CardContent>
        <Avatar
          className={style.avatar}
          src={user.avatar}
          alt={`${user.avatar}'s avatar`}
        >
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <div className={`${style.buttonsStacked} ${style.alignRight}`}>
          {!userIsCurrentUser &&
            (!currentUserFriendship ||
            currentUserFriendship.receivant._id === user._id ||
            currentUserFriendship.accepted ? (
              friendshipButton(currentUserFriendship)
            ) : (
              <Fragment>
                <Button
                  className={style.alignRight}
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleFriendshipClick(currentUserFriendship, true)
                  }
                >
                  Accept
                </Button>
                <Button
                  className={style.alignRight}
                  style={{ marginTop: '8px' }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleFriendshipClick(currentUserFriendship)}
                >
                  Reject
                </Button>
              </Fragment>
            ))}
          {restrictedDisplay && (
            <Button
              className={style.alignRight}
              style={{ marginTop: '8px' }}
              variant="outlined"
              color="primary"
              onClick={() => history.push(`/users/${user._id}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
        <Typography variant="h5" component="h3">
          {user.name}
        </Typography>
        <Typography gutterBottom variant="body1" color="textSecondary">
          {`Joined on ${formatDate(user.createdAt)}`}
        </Typography>
        {restrictedDisplay && (
          <Fragment>
            <Typography variant="body1">
              {formatDate(user.dateOfBirth)}
            </Typography>
            <Typography gutterBottom variant="body1">
              {user.email}
            </Typography>
          </Fragment>
        )}
        {user.interests.length > 0 && (
          <Fragment>
            <Typography variant="h6" component="h4">
              Interests:
            </Typography>
            {user.interests.map((interest) => (
              <Chip
                className={style.chip}
                variant="outlined"
                key={interest._id}
                avatar={<Avatar src={interest.avatar} alt={interest.name} />}
                label={interest.name}
              />
            ))}
          </Fragment>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDetails;
