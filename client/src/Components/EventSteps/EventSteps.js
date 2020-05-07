import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import countries from 'country-region-data';

import {
  getInterests,
  getEvent,
  postEvent,
  putEvent,
  putNotification,
  getNotifications,
} from '../../logic/api';
import {
  decodeText,
  buildValidationErrorsObject,
  classifyNotifications,
} from '../../logic/utils';
import { inputDateTime } from '../../logic/date-time';
import { upload } from '../../logic/upload';

import { useUser } from '../UserProvider/UserProvider';
import {
  useNotifications,
  useSetNotifications,
} from '../NotificationsProvider/NotificationsProvider';

import Style from '../Style/Style';

import EventForm from '../EventForm/EventForm';
import InterestsSelect from '../InterestsSelect/InterestsSelect';
import EventCard from '../EventCard/EventCard';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

const EventSteps = ({ match }) => {
  const history = useHistory();
  const user = useUser();
  const notifications = useNotifications();
  const setNotifications = useSetNotifications();
  const style = Style();

  const [activeStep, setActiveStep] = useState(0);
  const [event, setEvent] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [country, setCountry] = useState(null);
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState(null);
  const [createdBy, setCreatedBy] = useState('');
  const [interests, setInterests] = useState(null);
  const [relatedInterests, setRelatedInterests] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState('');
  const [attendantsLimit, setAttendantsLimit] = useState('');
  const [updatedFields, setUpdatedFields] = useState(null);
  const [updateNotifications, setUpdateNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  const id = match.params.eventId;
  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      if (user) {
        getEvent(id)
          .then((data) => {
            if (!(user._id === data.event.createdBy || user.admin)) {
              history.push(`/events/${id}`);
            } else {
              setEvent(data.event);
              setName(decodeText(data.event.name));
              setDescription(decodeText(data.event.description));
              setStartDate(inputDateTime(data.event.startDate));
              setEndDate(inputDateTime(data.event.endDate));

              const c = countries.filter(
                (country) => country.countryShortCode === data.event.country
              )[0];
              setCountry(c);
              setRegions(c.regions);
              setRegion(
                c.regions.filter(
                  (region) => region.shortCode === data.event.region
                )[0]
              );

              setCreatedBy(data.event.createdBy);
              setCoverPhoto(data.event.coverPhoto);
              setAttendantsLimit(data.event.attendantsLimit);
            }
          })
          .catch((error) => setError(error))
          .finally(() => setLoading(false));
      }
    } else {
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCountry(null);
      setRegions([]);
      setRegion(null);
      setCreatedBy('');
      setCoverPhoto('');
      setAttendantsLimit('');
      setActiveStep(0);
      setLoading(false);
    }
  }, [id, user, interests, history]);

  useEffect(() => {
    setLoading(true);
    getInterests()
      .then((data) => setInterests(data.interests))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    if (id && event && interests) {
      setRelatedInterests(
        interests.filter((interest) =>
          event.relatedInterests.some(
            (relatedInterest) => relatedInterest._id === interest._id
          )
        )
      );
    } else {
      setRelatedInterests([]);
    }
    setLoading(false);
  }, [id, event, interests]);

  useEffect(() => {
    if (user && notifications) {
      setError(null);

      const eventNotifications = notifications.regular.filter(
        (notification) => notification.type === 'Event'
      );

      if (eventNotifications.length > 0) {
        eventNotifications.forEach((notification, index) => {
          notification.read = true;
          notification.readAt = new Date();

          putNotification(user._id, notification._id, notification)
            .then((data) => {
              if (data.errors) {
                setError('Something went wrong');
              }

              if (index === eventNotifications.length - 1) {
                setUpdateNotifications(true);
              }
            })
            .catch((error) => setError(error));
        });
      }
    }
  }, [user, notifications]);

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

  const steps = ['Details', 'Interests', 'Preview'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <EventForm
            name={name}
            handleNameChange={handleNameChange}
            description={description}
            handleDescriptionChange={handleDescriptionChange}
            startDate={startDate}
            handleStartDateChange={handleStartDateChange}
            endDate={endDate}
            handleEndDateChange={handleEndDateChange}
            countries={countries}
            country={country}
            handleCountryChange={handleCountryChange}
            regions={regions}
            region={region}
            handleRegionChange={handleRegionChange}
            coverPhoto={coverPhoto}
            handleUpload={handleUpload}
            attendantsLimit={attendantsLimit}
            handleAttendantsLimitChange={handleAttendantsLimitChange}
            validationErrors={validationErrors}
          />
        );
      case 1:
        return (
          interests && (
            <InterestsSelect
              allInterests={interests}
              interests={relatedInterests}
              handleInterestsChange={handleRelatedInterestsChange}
              validationErrors={validationErrors}
            />
          )
        );
      case 2:
        return (
          <EventCard
            event={{
              name,
              description,
              relatedInterests,
              coverPhoto,
            }}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  const isNextOrCreateDisabled = () => {
    const firstNextDisabled =
      !name ||
      !description ||
      !startDate ||
      !endDate ||
      !country ||
      !region ||
      !attendantsLimit;
    const secondNextDisabled =
      !relatedInterests || relatedInterests.length === 0;
    const createDisabled =
      firstNextDisabled || secondNextDisabled || loading || !updatedFields;
    switch (activeStep) {
      case 0:
        return firstNextDisabled;
      case 1:
        return secondNextDisabled;
      case 2:
        return createDisabled;
      default:
        return true;
    }
  };

  const handleNext = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const lastStep = activeStep === steps.length - 1;

  const handleNameChange = (name) => {
    setName(name);
    if (!updatedFields || !updatedFields.name) {
      setUpdatedFields({ ...updatedFields, name: true });
    }
  };

  const handleDescriptionChange = (description) => {
    setDescription(description);
    if (!updatedFields || !updatedFields.description) {
      setUpdatedFields({ ...updatedFields, description: true });
    }
  };

  const handleStartDateChange = (startDate) => {
    setStartDate(startDate);
    if (!updatedFields || !updatedFields.startDate) {
      setUpdatedFields({ ...updatedFields, startDate: true });
    }
  };

  const handleEndDateChange = (endDate) => {
    setEndDate(endDate);
    if (!updatedFields || !updatedFields.endDate) {
      setUpdatedFields({ ...updatedFields, endDate: true });
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

  const handleUpload = (file) => {
    if (file) {
      setLoading(true);
      setError(null);
      setValidationErrors({});
      upload(file)
        .then((data) => {
          if (data.errors) {
            const error = data.errors[0];
            setError(`${error.param.split('.')[1]} ${error.msg}`);
            setValidationErrors(buildValidationErrorsObject(data.errors));
          } else {
            setCoverPhoto(data.uploadedFile.secure_url);
            if (!updatedFields || !updatedFields.coverPhoto) {
              setUpdatedFields({ ...updatedFields, coverPhoto: true });
            }
          }
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  };

  const handleAttendantsLimitChange = (attendantsLimit) => {
    setAttendantsLimit(attendantsLimit);
    if (!updatedFields || !updatedFields.attendantsLimit) {
      setUpdatedFields({ ...updatedFields, attendantsLimit: true });
    }
  };

  const handleRelatedInterestsChange = (relatedInterests) => {
    setRelatedInterests(relatedInterests);
    if (!updatedFields || !updatedFields.relatedInterests) {
      setUpdatedFields({ ...updatedFields, relatedInterests: true });
    }
  };

  const handleNewClick = () => {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    postEvent({
      name,
      description,
      startDate,
      endDate,
      country: country.countryShortCode,
      region: region.shortCode,
      createdBy: user._id,
      relatedInterests,
      coverPhoto,
      attendantsLimit,
    })
      .then((data) => {
        if (data.errors) {
          setError('The form contains errors');
          setValidationErrors(buildValidationErrorsObject(data.errors));
          setLoading(false);
        } else {
          history.push(`/events/${data.event._id}`);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleEditClick = () => {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    putEvent(id, {
      name,
      description,
      startDate,
      endDate,
      country: country.countryShortCode,
      region: region.shortCode,
      createdBy,
      relatedInterests,
      coverPhoto,
      attendantsLimit,
    })
      .then((data) => {
        if (data.errors) {
          setError('The form contains errors');
          setValidationErrors(buildValidationErrorsObject(data.errors));
          setLoading(false);
        } else {
          history.push(`/events/${data.event._id}`);
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
      <Typography className={style.center} variant="h2">
        {`${id ? 'Edit' : 'New'} event`}
      </Typography>
      <Stepper
        className={`${style.root} ${style.fullWidth}`}
        style={{ backgroundColor: 'inherit' }}
        activeStep={activeStep}
      >
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep !== steps.length && (
        <div className={style.root}>
          <Grid container justify="center" spacing={2}>
            <Grid
              item
              md={activeStep === 2 && 4}
              sm={activeStep === 2 && 6}
              xs={activeStep === 2 && 12}
            >
              {getStepContent(activeStep)}
            </Grid>
            <Grid item className={`${style.fullWidth} ${style.center}`}>
              <Button
                className={style.buttons}
                variant="outlined"
                color="primary"
                onClick={() =>
                  id ? history.push(`/events/${id}`) : history.push('/')
                }
                disabled={loading}
              >
                Cancel
              </Button>
              {!!activeStep && (
                <Button
                  className={style.buttons}
                  variant="outlined"
                  color="primary"
                  onClick={() => handleBack()}
                >
                  Back
                </Button>
              )}
              <Button
                className={style.buttons}
                variant="contained"
                color="primary"
                onClick={() => {
                  lastStep
                    ? id
                      ? handleEditClick()
                      : handleNewClick()
                    : handleNext();
                }}
                disabled={isNextOrCreateDisabled()}
              >
                {lastStep ? (id ? 'Edit' : 'Create') : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default EventSteps;
