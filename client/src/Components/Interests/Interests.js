import React, { useState, useEffect, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { getInterests, putUser } from '../../logic/api';
import { groupInterests } from '../../logic/utils';

import { useUser, useSetUser } from '../UserProvider/UserProvider';

import InterestCard from '../InterestCard/InterestCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const Interests = () => {
  const style = Style();
  const user = useUser();
  const setUser = useSetUser();

  const [interests, setInterests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getInterests()
      .then((data) => setInterests(groupInterests(data.interests)))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (interest, userInterested) => {
    setLoading(true);
    setError(null);

    let userInterests = [];
    if (userInterested) {
      userInterests = user.interests.filter(
        (userInterest) => userInterest._id !== interest._id
      );
    } else {
      userInterests = [...user.interests, interest];
    }

    putUser(user._id, {
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      avatar: user.avatar,
      interests: userInterests,
    })
      .then((data) => {
        if (data.errors) {
          setError('Something went wrong');
        } else {
          setUser(data.user);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h2">Interests</Typography>
          </Grid>
          <Grid item>
            {interests &&
              interests.map((interestsGroup) => (
                <ExpansionPanel key={interestsGroup.category._id}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    {interestsGroup.category.name}
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container justify="center" spacing={2}>
                      {interestsGroup.interests.map((interest) => (
                        <Grid item key={interest._id}>
                          <InterestCard
                            interest={interest}
                            userInterested={user.interests.some(
                              (userInterest) =>
                                userInterest._id === interest._id
                            )}
                            handleClick={handleClick}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ))}
          </Grid>
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default Interests;
