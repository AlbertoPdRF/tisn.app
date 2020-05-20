import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Chip from '@material-ui/core/Chip';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import ChatIcon from '@material-ui/icons/Chat';

import countries from 'country-region-data';

import { distanceToNow, formatDate } from '../../logic/date-time';

import ShareMenu from '../ShareMenu/ShareMenu';

import Style from '../Style/Style';

const UserDetails = (props) => {
  const {
    user,
    userIsCurrentUser,
    currentUserFriendship,
    friendshipButton,
    handleFriendshipClick,
    restrictedDisplay,
    loading,
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
      setCountry(c);
      setRegion(
        c.regions.filter((region) => region.shortCode === user.region)[0]
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
        <div className={style.alignCenterVertically}>
          <Typography
            gutterBottom
            className={`${style.minWidth} ${style.breakWord}`}
            variant="h5"
            component="h3"
          >
            {user.name}
          </Typography>
          <div className={style.grow} />
          {restrictedDisplay && (
            <IconButton
              color="primary"
              onClick={() => history.push(`/users/${user._id}/edit`)}
            >
              <EditIcon />
            </IconButton>
          )}
        </div>
        <Typography variant="body1">
          {`${region.name}, ${t(`countriesList.${country.countryShortCode}`)}`}
        </Typography>
        <Typography gutterBottom variant="body1" color="textSecondary">
          {t(`userDetails.${userIsCurrentUser ? 'you' : 'user'}Joined`, {
            timeDistance: distanceToNow(user.createdAt),
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
                avatar={
                  <Avatar
                    src={interest.avatar}
                    alt={t(`interestsList.${interest.name}`)}
                  />
                }
                label={t(`interestsList.${interest.name}`)}
                clickable
                onClick={() => history.push(`/events?interest=${interest._id}`)}
              />
            ))}
            {userIsCurrentUser && (
              <IconButton
                color="primary"
                onClick={() =>
                  history.push(`/users/${user._id}/edit/interests`)
                }
              >
                <EditIcon />
              </IconButton>
            )}
          </Fragment>
        )}
      </CardContent>
      <CardActions style={{ marginTop: '-24px' }}>
        <Grid container justify="flex-end" alignItems="center">
          <Grid item>
            <ShareMenu
              title={t('userDetails.shareText', { name: user.name })}
              text={t('userDetails.shareText', { name: user.name })}
              url={window.location.href}
            />
          </Grid>
          <Grid item className={style.grow} />
          {!userIsCurrentUser && (
            <Fragment>
              <Grid item>
                {!currentUserFriendship ||
                currentUserFriendship.receivant._id === user._id ||
                currentUserFriendship.accepted ? (
                  friendshipButton(currentUserFriendship)
                ) : (
                  <Fragment>
                    <Button
                      className={style.buttons}
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        handleFriendshipClick(currentUserFriendship)
                      }
                    >
                      {t('userDetails.reject')}
                    </Button>
                    <Button
                      className={style.buttons}
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleFriendshipClick(currentUserFriendship, true)
                      }
                    >
                      {t('userDetails.accept')}
                    </Button>
                  </Fragment>
                )}
              </Grid>
              {currentUserFriendship && currentUserFriendship.accepted && (
                <Grid item>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      history.push(`/chats/${currentUserFriendship._id}`)
                    }
                    disabled={loading}
                  >
                    <ChatIcon />
                  </IconButton>
                </Grid>
              )}
            </Fragment>
          )}
        </Grid>
      </CardActions>
    </Card>
  );
};

export default UserDetails;
