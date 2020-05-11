import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import countries from 'country-region-data';

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

  const { t } = useTranslation();
  const history = useHistory();
  const style = Style();

  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');

  useEffect(() => {
    if (user) {
      const c = countries.filter(
        (country) => country.countryShortCode === user.country
      )[0];
      setCountry(c.countryName);
      setRegion(
        c.regions.filter((region) => region.shortCode === user.region)[0].name
      );
    }
  }, [user]);

  return (
    <Card elevation={0}>
      <CardContent>
        <Avatar
          src={user.avatar}
          alt={t('userDetails.avatar', { name: user.name })}
          style={{ height: '200px', width: '200px', margin: 'auto' }}
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
                  {t('userDetails.accept')}
                </Button>
                <Button
                  className={style.alignRight}
                  style={{ marginTop: '8px' }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleFriendshipClick(currentUserFriendship)}
                >
                  {t('userDetails.reject')}
                </Button>
              </Fragment>
            ))}
          {!userIsCurrentUser &&
            currentUserFriendship &&
            currentUserFriendship.accepted && (
              <Button
                className={style.alignRight}
                style={{ marginTop: '8px' }}
                variant="contained"
                color="primary"
                onClick={() =>
                  history.push(`/chats/${currentUserFriendship._id}`)
                }
              >
                {t('userDetails.chat')}
              </Button>
            )}
          {restrictedDisplay && (
            <Button
              className={style.alignRight}
              style={{ marginTop: '8px' }}
              variant="outlined"
              color="primary"
              onClick={() => history.push(`/users/${user._id}/edit`)}
            >
              {t('userDetails.edit')}
            </Button>
          )}
        </div>
        <Typography variant="h5" component="h3">
          {user.name}
        </Typography>
        <Typography variant="body1">{`${region}, ${country}`}</Typography>
        <Typography gutterBottom variant="body1" color="textSecondary">
          {t('userDetails.joined', {
            userCreatedAt: formatDate(user.createdAt),
          })}
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
        {(userIsCurrentUser || user.interests.length > 0) && (
          <Fragment>
            <Typography variant="h6" component="h4">
              {t('userDetails.interests')}
            </Typography>
            {user.interests.map((interest) => (
              <Chip
                className={style.chip}
                variant="outlined"
                key={interest._id}
                avatar={<Avatar src={interest.avatar} alt={interest.name} />}
                label={interest.name}
                clickable
                onClick={() => history.push(`/events?interest=${interest._id}`)}
              />
            ))}
            {userIsCurrentUser && (
              <Chip
                className={style.chip}
                variant="outlined"
                color="primary"
                label={t('userDetails.manage')}
                clickable
                onClick={() =>
                  history.push(`/users/${user._id}/edit/interests`)
                }
              />
            )}
          </Fragment>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDetails;
