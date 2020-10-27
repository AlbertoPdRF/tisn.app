import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';

import { distanceToNow } from '../../logic/date-time';

import Style from '../Style/Style';

const FriendshipCard = (props) => {
  const {
    user,
    friendship,
    params,
    messageNotifications,
    handlePopoverClose,
  } = props;

  const { t } = useTranslation();
  const style = Style();

  const friendshipUser =
    friendship.requestant._id === user._id
      ? friendship.receivant
      : friendship.requestant;

  let path = `/chats/${friendship._id}`;
  if (params) {
    path += `?${params.toString()}`;
  }

  return (
    <Card onClick={() => handlePopoverClose && handlePopoverClose()}>
      <CardActionArea component={Link} to={path}>
        <CardHeader
          avatar={
            <Badge
              badgeContent={messageNotifications && messageNotifications.length}
              color="secondary"
              overlap="circle"
            >
              <Avatar
                src={friendshipUser.avatar}
                alt={t('friendshipCard.avatar', {
                  name: friendshipUser.name,
                })}
                style={{ margin: '4px' }}
              >
                {friendshipUser.name.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
          }
          title={friendshipUser.name}
          subheader={
            friendship.lastMessageAt
              ? t('friendshipCard.lastMessage', {
                  timeDistance: distanceToNow(friendship.lastMessageAt),
                })
              : t('friendshipCard.noMessages', {
                  timeDistance: distanceToNow(friendship.acceptedAt),
                })
          }
          subheaderTypographyProps={{ className: style.preLine }}
        />
      </CardActionArea>
    </Card>
  );
};

export default FriendshipCard;
