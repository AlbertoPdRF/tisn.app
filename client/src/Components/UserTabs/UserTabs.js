import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from '@material-ui/core/Button';

import SwipeableViews from 'react-swipeable-views';

import { getUser, putUser, deleteUser, getInterests } from '../../logic/api';
import { logOut } from '../../logic/auth';
import { inputDate } from '../../logic/date-time';
import { uploadFile } from '../../logic/file-upload';

import { useConfirm } from 'material-ui-confirm';

import { useUser, useSetUser } from '../UserProvider/UserProvider';

import TabPanel from '../TabPanel/TabPanel';
import UserForm from '../UserForm/UserForm';
import InterestsSelect from '../InterestsSelect/InterestsSelect';

import Style from '../Style/Style';

const UserTabs = ({ match }) => {
  const history = useHistory();
  const style = Style();
  const currentUser = useUser();
  const setCurrentUser = useSetUser();
  const confirm = useConfirm();

  const [value, setValue] = useState(0);
  const [user, setUser] = useState(null);
  const [allInterests, setAllInterests] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatar, setAvatar] = useState('');
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const id = match.params.id;
  useEffect(() => {
    if (id && currentUser) {
      setLoading(true);
      if (currentUser._id === id) {
        setUser(currentUser);
        setLoading(false);
      } else if (currentUser.admin) {
        getUser(id)
          .then((data) => setUser(data.user))
          .catch((error) => setError(error.message))
          .finally(() => setLoading(false));
      } else {
        history.push(`/users/${currentUser._id}/edit`);
      }
    }
  }, [id, currentUser, history]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setName(user.name);
      setEmail(user.email);
      setDateOfBirth(inputDate(user.dateOfBirth));
      setAvatar(user.avatar);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    getInterests()
      .then((data) => setAllInterests(data.interests))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && allInterests) {
      setLoading(true);
      setInterests(
        allInterests.filter((interest) =>
          user.interests.some(
            (userInterest) => userInterest._id === interest._id
          )
        )
      );
      setLoading(false);
    }
  }, [user, allInterests]);

  const handleNameChange = (name) => setName(name);

  const handleEmailChange = (email) => setEmail(email);

  const handleDateOfBirthChange = (dateOfBirth) => setDateOfBirth(dateOfBirth);

  const handleFileUpload = (file) => {
    if (file) {
      setLoading(true);
      uploadFile(file)
        .then((data) => setAvatar(data.uploadedFile.secure_url))
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  };

  const handleInterestsChange = (interests) => setInterests(interests);

  const handleEditClick = () => {
    setLoading(true);
    putUser(id, {
      name,
      email,
      dateOfBirth,
      avatar,
      interests,
    })
      .then((data) => {
        if (currentUser._id === id) {
          setCurrentUser(data.user);
        }
        history.push(`/users/${id}`);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleDeleteClick = () => {
    setLoading(true);
    deleteUser(id)
      .then(() => {
        if (currentUser._id === id) {
          logOut();
          setCurrentUser(null);
          history.push('/welcome');
        } else {
          history.push('/users');
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h2">Edit profile</Typography>
          </Grid>
          <Grid item>
            <Paper>
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={(event, newValue) => setValue(newValue)}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="Details" />
                  <Tab label="Interests" />
                  <Tab label="Settings" />
                </Tabs>
              </AppBar>
              {user && (
                <SwipeableViews
                  index={value}
                  onChangeIndex={(index) => setValue(index)}
                >
                  <TabPanel value={value} index={0}>
                    <UserForm
                      name={name}
                      handleNameChange={handleNameChange}
                      email={email}
                      handleEmailChange={handleEmailChange}
                      dateOfBirth={dateOfBirth}
                      handleDateOfBirthChange={handleDateOfBirthChange}
                      avatar={avatar}
                      handleFileUpload={handleFileUpload}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <InterestsSelect
                      allInterests={allInterests}
                      interests={interests}
                      handleInterestsChange={handleInterestsChange}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <ExpansionPanel className={style.formInput}>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        Delete account
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails
                        style={{ justifyContent: 'center' }}
                      >
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            confirm({
                              description:
                                'Deleting your account is a permanent action!',
                              confirmationText: 'Delete',
                              confirmationButtonProps: {
                                variant: 'contained',
                                color: 'secondary',
                              },
                              cancellationButtonProps: {
                                variant: 'contained',
                                color: 'primary',
                              },
                            }).then(() => handleDeleteClick());
                          }}
                        >
                          Delete
                        </Button>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </TabPanel>
                </SwipeableViews>
              )}
            </Paper>
          </Grid>
          <Grid item>
            <Button
              className={style.buttons}
              variant="outlined"
              color="primary"
              onClick={() => history.push(`/users/${id}`)}
            >
              Cancel
            </Button>
            <Button
              className={style.buttons}
              variant="contained"
              color="primary"
              onClick={() => handleEditClick()}
              disabled={loading || !name || !email || !dateOfBirth}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

export default UserTabs;
