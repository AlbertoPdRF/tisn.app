import React from 'react';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

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
                  Pending
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
            <Grid item key={friendship._id}>
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
              <Typography variant="body1">
                {`${
                  userIsCurrentUser ? 'You have' : `${user.name} has`
                } no friendships.`}
              </Typography>
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Friendships;
