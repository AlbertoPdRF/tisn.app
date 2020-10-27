import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();
  const style = Style();

  return (
    <Card>
      <CardActionArea component={Link} to={`/users/${user._id}`}>
        <CardHeader
          avatar={
            <Avatar
              src={user.avatar}
              alt={t('userCard.avatar', { name: user.name })}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={user.name}
        />
        {user.interests.length > 0 && (
          <CardContent className={style.userCardContent}>
            <AvatarGroup max={7}>
              {user.interests.map((interest) => (
                <Avatar
                  key={interest._id}
                  src={interest.avatar}
                  alt={t(`interestsList.${interest.name}`)}
                  title={t(`interestsList.${interest.name}`)}
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
