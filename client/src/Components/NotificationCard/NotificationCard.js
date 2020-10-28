import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import EmailIcon from '@material-ui/icons/Email';
import AddIcon from '@material-ui/icons/Add';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CategoryIcon from '@material-ui/icons/Category';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import AddCommentIcon from '@material-ui/icons/AddComment';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';

const NotificationCard = (props) => {
  const { notification, handlePopoverClose } = props;
  const { t } = useTranslation();

  const type = notification.type;
  let path;
  let avatar;
  const keys = {};
  switch (type) {
    case 'confirmEmail':
      path = `/users/${notification.user}/send-email-confirmation-email`;
      avatar = <EmailIcon color="primary" />;

      break;
    case 'createEvent':
      path = '/events/new';
      avatar = <AddIcon color="primary" />;

      break;
    case 'uploadAvatar':
      path = `/users/${notification.user}/edit`;
      avatar = <AccountCircleIcon color="primary" />;

      break;
    case 'selectInterests':
      path = '/interests';
      avatar = <CategoryIcon color="primary" />;

      break;
    case 'newAttendee':
    case 'newComment':
      path =
        notification.referencedEvent &&
        `/events/${notification.referencedEvent._id}`;
      if (path && type === 'newComment') {
        path += '/comments';
      }

      if (type === 'newAttendee') {
        avatar = <PlusOneIcon color="primary" />;
      } else if (type === 'newComment') {
        avatar = <AddCommentIcon color="primary" />;
      }

      keys.userName = notification.referencedUser
        ? notification.referencedUser.name
        : t('notificationCard.deletedUser');
      keys.eventName = notification.referencedEvent
        ? notification.referencedEvent.name
        : t('notificationCard.deletedEvent');

      break;
    case 'newFriendshipRequest':
    case 'acceptedFriendshipRequest':
      avatar = <PersonAddIcon color="primary" />;
      path = `/users/${notification.user}/friendships`;

      keys.name = notification.referencedUser
        ? notification.referencedUser.name
        : t('notificationCard.deletedUser');

      break;
    default:
      break;
  }
  const title = t(`notificationCard.${type}.title`, keys);
  const subheader = t(`notificationCard.${type}.subheader`);

  return (
    <Card onClick={() => handlePopoverClose && handlePopoverClose()}>
      <CardActionArea component={Link} to={path ? path : '/'} disabled={!path}>
        <CardHeader avatar={avatar} title={title} subheader={subheader} />
      </CardActionArea>
    </Card>
  );
};

export default NotificationCard;
