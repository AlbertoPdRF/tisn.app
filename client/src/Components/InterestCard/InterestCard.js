import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import Style from '../Style/Style';

const InterestCard = (props) => {
  const { interest, userInterested, handleClick, loading } = props;

  const { t } = useTranslation();
  const style = Style();

  return (
    <Card>
      <CardActionArea
        component={Link}
        to={`/events?interest=${interest._id}`}
        color="inherit"
        underline="none"
      >
        <CardHeader
          avatar={
            <Avatar
              src={interest.avatar}
              alt={t(`interestsList.${interest.name}`)}
            />
          }
          title={t(`interestsList.${interest.name}`)}
        />
      </CardActionArea>
      <CardActions className={style.interestCardActions}>
        <Button
          variant="text"
          color={userInterested ? 'secondary' : 'primary'}
          onClick={() => handleClick(interest, userInterested)}
          disabled={loading}
        >
          {userInterested ? t('interestsCard.remove') : t('interestsCard.add')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default InterestCard;
