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
import { buildValidationErrorsObject } from '../../logic/array';
import { logOut } from '../../logic/auth';
import { inputDate } from '../../logic/date-time';
import { uploadFile } from '../../logic/file-upload';

import { useConfirm } from 'material-ui-confirm';

import { useUser, useSetUser } from '../UserProvider/UserProvider';

import TabPanel from '../TabPanel/TabPanel';
import UserForm from '../UserForm/UserForm';
import InterestsSelect from '../InterestsSelect/InterestsSelect';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

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
  const [updatedFields, setUpdatedFields] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  const userId = match.params.userId;
  useEffect(() => {
    if (userId && currentUser) {
      setLoading(true);
      setError(null);
      if (currentUser._id === userId) {
        setUser(currentUser);
        setLoading(false);
      } else if (currentUser.admin) {
        getUser(userId)
          .then((data) => {
            if (data.errors) {
              const error = data.errors[0];
              setError(`${error.param} ${error.msg}`);
            } else {
              setUser(data.user);
            }
          })
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
      } else {
        history.push(`/users/${currentUser._id}/edit`);
      }
    }
  }, [userId, currentUser, history]);

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

  const handleNameChange = (name) => {
    setName(name);
    if (!updatedFields || !updatedFields.name) {
      setUpdatedFields({ ...updatedFields, name: true });
    }
  };

  const handleEmailChange = (email) => {
    setEmail(email);
    if (!updatedFields || !updatedFields.email) {
      setUpdatedFields({ ...updatedFields, email: true });
    }
  };

  const handleDateOfBirthChange = (dateOfBirth) => {
    setDateOfBirth(dateOfBirth);
    if (!updatedFields || !updatedFields.dateOfBirth) {
      setUpdatedFields({ ...updatedFields, dateOfBirth: true });
    }
  };

  const handleFileUpload = (file) => {
    if (file) {
      setLoading(true);
      uploadFile(file)
        .then((data) => {
          setAvatar(data.uploadedFile.secure_url);
          if (!updatedFields || !updatedFields.avatar) {
            setUpdatedFields({ ...updatedFields, avatar: true });
          }
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  };

  const handleInterestsChange = (interests) => {
    setInterests(interests);
    if (!updatedFields || !updatedFields.interests) {
      setUpdatedFields({ ...updatedFields, interests: true });
    }
  };

  const handleEditClick = () => {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    putUser(userId, {
      name,
      email,
      dateOfBirth,
      avatar,
      interests,
    })
      .then((data) => {
        if (data.errors) {
          setError('The form contains errors');
          setValidationErrors(buildValidationErrorsObject(data.errors));
          setLoading(false);
        } else {
          if (currentUser._id === userId) {
            setCurrentUser(data.user);
          }
          history.push(`/users/${userId}`);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleDeleteClick = () => {
    setLoading(true);
    setError(null);
    deleteUser(userId)
      .then((data) => {
        if (data.errors) {
          const error = data.errors[0];
          setError(`${error.param} ${error.msg}`);
          setLoading(false);
        } else {
          if (currentUser._id === userId) {
            logOut();
            setCurrentUser(null);
            history.push('/welcome');
          } else {
            history.push('/users');
          }
        }
      })
      .catch((error) => {
        setError(error);
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
                      validationErrors={validationErrors}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <InterestsSelect
                      allInterests={allInterests}
                      interests={interests}
                      handleInterestsChange={handleInterestsChange}
                      validationErrors={validationErrors}
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
              onClick={() => history.push(`/users/${userId}`)}
            >
              Cancel
            </Button>
            <Button
              className={style.buttons}
              variant="contained"
              color="primary"
              onClick={() => handleEditClick()}
              disabled={
                !updatedFields || loading || !name || !email || !dateOfBirth
              }
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default UserTabs;
