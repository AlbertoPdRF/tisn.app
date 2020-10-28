import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ScheduleIcon from '@material-ui/icons/Schedule';
import RoomIcon from '@material-ui/icons/Room';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import countries from 'country-region-data';

import { decodeText, decodeAndLinkifyText } from '../../logic/utils';
import { formatDateTimeRange } from '../../logic/date-time';

import ShareMenu from '../ShareMenu/ShareMenu';

import Style from '../Style/Style';

const EventDetails = (props) => {
  const {
    event,
    restrictedDisplay,
    futureEvent,
    userAttending,
    handleClick,
    attendees,
    limitMet,
    loading,
  } = props;

  const { t } = useTranslation();
  const history = useHistory();
  const style = Style();

  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');

  useEffect(() => {
    if (event) {
      const c = countries.filter(
        (country) => country.countryShortCode === event.country
      )[0];
      setCountry(c);
      setRegion(
        c.regions.filter((region) => region.shortCode === event.region)[0]
      );
    }
  }, [event]);

  const decodedName = decodeText(event.name);

  return (
    <Card elevation={0}>
      <CardMedia
        component="img"
        src={
          event.coverPhoto
            ? event.coverPhoto
            : '../../../event-placeholder.jpeg'
        }
        alt={decodedName}
        title={decodedName}
      />
      <CardContent>
        <div className={style.alignCenterVertically}>
          <Typography
            gutterBottom
            className={`${style.minWidth} ${style.breakWord}`}
            variant="h5"
            component="h3"
          >
            {decodedName}
          </Typography>
          <div className={style.grow} />
          {restrictedDisplay && (
            <IconButton
              color="primary"
              onClick={() => history.push(`/events/${event._id}/edit`)}
            >
              <EditIcon />
            </IconButton>
          )}
        </div>
        <Typography
          gutterBottom
          className={`${style.preLine} ${style.breakWord}`}
          variant="body1"
          color="textSecondary"
          dangerouslySetInnerHTML={{
            __html: decodeAndLinkifyText(event.description),
          }}
        />
        <ScheduleIcon className={style.alignLeft} />
        <Typography gutterBottom variant="body1">
          {formatDateTimeRange(event.startDate, event.endDate)}
        </Typography>
        <RoomIcon className={style.alignLeft} />
        <Typography gutterBottom variant="body1">
          {`${region.name}, ${t(`countriesList.${country.countryShortCode}`)}`}
        </Typography>
        <Typography variant="h6" component="h4">
          {t('eventDetails.relatedInterests')}
        </Typography>
        {event.relatedInterests.map((interest) => (
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
        {attendees && attendees.length > 0 && (
          <Fragment>
            <Typography variant="h6" component="h4">
              {t('eventDetails.attendees')}
            </Typography>
            <AvatarGroup max={event.attendeesLimit}>
              {attendees.map((attendee) => (
                <Avatar
                  key={attendee.user._id}
                  src={attendee.user.avatar}
                  alt={t('eventDetails.avatar', { name: attendee.user.name })}
                  title={attendee.user.name}
                  component={Link}
                  to={`/users/${attendee.user._id}`}
                  color="inherit"
                  underline="none"
                  style={{ textDecoration: 'none' }}
                >
                  {attendee.user.name.charAt(0).toUpperCase()}
                </Avatar>
              ))}
            </AvatarGroup>
          </Fragment>
        )}
      </CardContent>
      <CardActions style={{ marginTop: '-24px' }}>
        <Grid container justify="flex-end" alignItems="center">
          <Grid item>
            <ShareMenu
              title={decodedName}
              text={decodedName}
              url={window.location.href}
            />
          </Grid>
          <Grid item className={style.grow} />
          {futureEvent && (
            <Fragment>
              <Grid item>
                {(!limitMet || userAttending) && (
                  <Button
                    variant={userAttending ? 'outlined' : 'contained'}
                    color={userAttending ? 'secondary' : 'primary'}
                    onClick={() => handleClick()}
                    disabled={loading}
                  >
                    {userAttending
                      ? t('eventDetails.notAttend')
                      : t('eventDetails.attend')}
                  </Button>
                )}
              </Grid>
              <Grid item className={`${style.fullWidth} ${style.alignRight}`}>
                <Typography className={style.preLine} variant="body1">
                  {attendees &&
                    t('eventDetails.spot', {
                      count: event.attendeesLimit - attendees.length,
                      max: event.attendeesLimit,
                    })}
                </Typography>
              </Grid>
            </Fragment>
          )}
        </Grid>
      </CardActions>
    </Card>
  );
};

export default EventDetails;
