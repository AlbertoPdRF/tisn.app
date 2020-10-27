import { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from '@material-ui/core/Button';

import SwipeableViews from 'react-swipeable-views';
import countries from 'country-region-data';
import { useConfirm } from 'material-ui-confirm';

import i18n from '../../i18n';

import {
  getUser,
  putUser,
  deleteUser,
  getInterests,
  putNotification,
  getNotifications,
} from '../../logic/api';
import {
  buildValidationErrorsObject,
  classifyNotifications,
} from '../../logic/utils';
import { logOut } from '../../logic/auth';
import { formatInputDate } from '../../logic/date-time';
import { upload } from '../../logic/upload';

import { useUser, useSetUser } from '../UserProvider/UserProvider';
import {
  useNotifications,
  useSetNotifications,
} from '../NotificationsProvider/NotificationsProvider';

import TabPanel from '../TabPanel/TabPanel';
import UserForm from '../UserForm/UserForm';
import InterestsSelect from '../InterestsSelect/InterestsSelect';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const UserTabs = ({ match }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const style = Style();
  const currentUser = useUser();
  const setCurrentUser = useSetUser();
  const notifications = useNotifications();
  const setNotifications = useSetNotifications();
  const confirm = useConfirm();

  const [value, setValue] = useState(0);
  const [user, setUser] = useState(null);
  const [allInterests, setAllInterests] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState(null);
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState(null);
  const [preferredLocale, setPreferredLocale] = useState('');
  const [avatar, setAvatar] = useState('');
  const [interests, setInterests] = useState([]);
  const [updatedFields, setUpdatedFields] = useState(null);
  const [updateNotifications, setUpdateNotifications] = useState(false);
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
          .then((data) => setUser(data.user))
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
      setDateOfBirth(formatInputDate(user.dateOfBirth));

      const c = countries.filter(
        (country) => country.countryShortCode === user.country
      )[0];
      setCountry(c);
      setRegions(c.regions);
      setRegion(
        c.regions.filter((region) => region.shortCode === user.region)[0]
      );

      setPreferredLocale(user.preferredLocale);
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

  useEffect(() => {
    if (currentUser && notifications) {
      setError(null);

      const avatarNotifications = notifications.regular.filter(
        (notification) => notification.type === 'uploadAvatar'
      );

      if (avatarNotifications.length > 0) {
        avatarNotifications.forEach((notification, index) => {
          notification.read = true;
          notification.readAt = new Date();

          putNotification(currentUser._id, notification._id, notification)
            .then((data) => {
              if (data.errors) {
                setError(t('errorsList.generic'));
              }

              if (index === avatarNotifications.length - 1) {
                setUpdateNotifications(true);
              }
            })
            .catch((error) => setError(error));
        });
      }
    }
  }, [currentUser, notifications, t]);

  useEffect(() => {
    if (updateNotifications) {
      setError(null);
      getNotifications()
        .then((data) =>
          setNotifications(classifyNotifications(data.notifications))
        )
        .catch((error) => setError(error));
    }
  }, [updateNotifications, setNotifications]);

  useEffect(() => {
    if (
      validationErrors.name ||
      validationErrors.email ||
      validationErrors.dateOfBirth ||
      validationErrors.country ||
      validationErrors.region ||
      validationErrors.avatar
    ) {
      setValue(0);
    } else if (validationErrors.interests) {
      setValue(1);
    }
  }, [validationErrors]);

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

  const handleCountryChange = (country) => {
    setCountry(country);
    if (!updatedFields || !updatedFields.country) {
      setUpdatedFields({ ...updatedFields, country: true });
    }

    setRegions(
      countries.filter(
        (c) => c.countryShortCode === country.countryShortCode
      )[0].regions
    );
    setRegion(null);
  };

  const handleRegionChange = (region) => {
    setRegion(region);
    if (!updatedFields || !updatedFields.region) {
      setUpdatedFields({ ...updatedFields, region: true });
    }
  };

  const handlePreferredLocaleChange = (preferredLocale) => {
    setPreferredLocale(preferredLocale);
    if (!updatedFields || !updatedFields.preferredLocale) {
      setUpdatedFields({ ...updatedFields, preferredLocale: true });
    }
  };

  const handleUpload = (file) => {
    if (file) {
      setLoading(true);
      setError(null);
      setValidationErrors({});
      upload(file)
        .then((data) => {
          if (data.errors) {
            setError(t('errorsList.formErrors'));
            setValidationErrors(buildValidationErrorsObject(data.errors));
          } else {
            setAvatar(data.uploadedFile.secure_url);
            if (!updatedFields || !updatedFields.avatar) {
              setUpdatedFields({ ...updatedFields, avatar: true });
            }
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

  const handleSaveClick = () => {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    putUser(userId, {
      name,
      email,
      dateOfBirth,
      country: country.countryShortCode,
      region: region.shortCode,
      preferredLocale,
      avatar,
      interests,
    })
      .then((data) => {
        if (data.errors) {
          setError(t('errorsList.formErrors'));
          setValidationErrors(buildValidationErrorsObject(data.errors));
          setLoading(false);
        } else {
          if (currentUser._id === userId) {
            setCurrentUser(data.user);
            if (data.user.preferredLocale !== i18n.language) {
              i18n.changeLanguage(data.user.preferredLocale);
            }
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
          setError(t('errorsList.generic'));
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
            <Typography variant="h2">{t('userTabs.title')}</Typography>
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
                  <Tab label={t('userTabs.details')} />
                  <Tab label={t('userTabs.interests')} />
                  <Tab label={t('userTabs.settings')} />
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
                      countries={countries}
                      country={country}
                      handleCountryChange={handleCountryChange}
                      regions={regions}
                      region={region}
                      handleRegionChange={handleRegionChange}
                      avatar={avatar}
                      handleUpload={handleUpload}
                      validationErrors={validationErrors}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {allInterests && (
                      <InterestsSelect
                        allInterests={allInterests}
                        interests={interests}
                        handleInterestsChange={handleInterestsChange}
                        validationErrors={validationErrors}
                      />
                    )}
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item>
                        <TextField
                          className={style.formInput}
                          select
                          label={t('userTabs.language')}
                          variant="outlined"
                          value={preferredLocale}
                          onChange={(event) =>
                            handlePreferredLocaleChange(event.target.value)
                          }
                          error={!!validationErrors.preferredLocale}
                          helperText={
                            validationErrors.preferredLocale &&
                            t(`errorsList.${validationErrors.preferredLocale}`)
                          }
                        >
                          {i18n.options.whitelist
                            .filter((option) => option !== 'cimode')
                            .sort(
                              (a, b) =>
                                -t(`userTabs.languages.${b}`).localeCompare(
                                  t(`userTabs.languages.${a}`)
                                )
                            )
                            .map((language) => (
                              <MenuItem key={language} value={language}>
                                {t(`userTabs.languages.${language}`)}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Grid>
                      <Grid item>
                        <ExpansionPanel className={style.formInput}>
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                          >
                            {t('userTabs.deleteAccount')}
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails
                            className={style.justifyCenter}
                          >
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => {
                                confirm({
                                  title: t('userTabs.confirm.title'),
                                  description: t(
                                    'userTabs.confirm.description'
                                  ),
                                  confirmationText: t(
                                    'userTabs.confirm.confirmationText'
                                  ),
                                  confirmationButtonProps: {
                                    variant: 'contained',
                                    color: 'secondary',
                                  },
                                  cancellationText: t(
                                    'userTabs.confirm.cancellationText'
                                  ),
                                  cancellationButtonProps: {
                                    variant: 'contained',
                                    color: 'primary',
                                  },
                                }).then(() => handleDeleteClick());
                              }}
                            >
                              {t('userTabs.delete')}
                            </Button>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </Grid>
                    </Grid>
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
              {t('userTabs.cancel')}
            </Button>
            <Button
              className={style.buttons}
              variant="contained"
              color="primary"
              onClick={() => handleSaveClick()}
              disabled={
                !updatedFields ||
                !name ||
                !email ||
                !dateOfBirth ||
                !country ||
                !region ||
                loading
              }
            >
              {t('userTabs.save')}
            </Button>
          </Grid>
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default UserTabs;
