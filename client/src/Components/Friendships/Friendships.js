import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import FriendshipsTable from '../FriendshipsTable/FriendshipsTable';
import UserCard from '../UserCard/UserCard';

import Style from '../Style/Style';

const Friendships = (props) => {
  const {
    user,
    userIsCurrentUser,
    pendingFriendships,
    handleFriendshipClick,
    acceptedFriendships,
  } = props;

  const { t } = useTranslation();
  const history = useHistory();
  const style = Style();

  const friendshipsPendingCurrentUserAction =
    userIsCurrentUser &&
    pendingFriendships &&
    pendingFriendships.length > 0 &&
    pendingFriendships.filter(
      (friendship) => friendship.receivant._id === user._id
    );

  return (
    <div className={style.root}>
      <Grid container justify="center" spacing={2}>
        {friendshipsPendingCurrentUserAction &&
          friendshipsPendingCurrentUserAction.length > 0 && (
            <Grid item className={style.fullWidth}>
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  {t('friendships.pending')}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <FriendshipsTable
                    friendships={friendshipsPendingCurrentUserAction}
                    displayActions={true}
                    handleFriendshipClick={handleFriendshipClick}
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          )}
        {acceptedFriendships && acceptedFriendships.length > 0 ? (
          acceptedFriendships.map((friendship) => (
            <Grid item key={friendship._id} md={4} sm={6} xs={12}>
              <UserCard
                user={
                  friendship.requestant._id === user._id
                    ? friendship.receivant
                    : friendship.requestant
                }
              />
            </Grid>
          ))
        ) : (
          <Grid item>
            <div className={`${style.fullWidth} ${style.center}`}>
              <Typography gutterBottom={userIsCurrentUser} variant="body1">
                {userIsCurrentUser
                  ? t('friendships.haveNoFriendships')
                  : t('friendships.hasNoFriendships', { name: user.name })}
              </Typography>
              {userIsCurrentUser && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => history.push('/users')}
                >
                  {t('friendships.browse')}
                </Button>
              )}
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Friendships;
