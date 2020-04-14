import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import {
  getInterests,
  getEvent,
  postEvent,
  putEvent,
  postAttendant,
} from '../../logic/api';
import { inputDateTime } from '../../logic/date-time';
import { uploadFile } from '../../logic/file-upload';

import { useUser } from '../UserProvider/UserProvider';

import Style from '../Style/Style';
import EventCard from '../EventCard/EventCard';

const EventForm = ({ match }) => {
  const history = useHistory();
  const user = useUser();
  const style = Style();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [interests, setInterests] = useState([]);
  const [relatedInterests, setRelatedInterests] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getInterests()
      .then((data) => setInterests(data.interests))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  const id = match.params.id;
  useEffect(() => {
    if (id) {
      setLoading(true);
      if (user && interests.length > 0) {
        getEvent(id)
          .then((data) => {
            if (!(user._id === data.event.createdBy || user.admin)) {
              history.push(`/events/${id}`);
            } else {
              setName(data.event.name);
              setDescription(data.event.description);
              setStartDate(inputDateTime(data.event.startDate));
              setEndDate(inputDateTime(data.event.endDate));
              setCreatedBy(data.event.createdBy);
              setRelatedInterests(
                interests.filter((interest) =>
                  data.event.relatedInterests.some(
                    (relatedInterest) => relatedInterest._id === interest._id
                  )
                )
              );
              setCoverPhoto(data.event.coverPhoto);
            }
          })
          .catch((error) => setError(error.message))
          .finally(() => setLoading(false));
      }
    } else {
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCreatedBy('');
      setRelatedInterests([]);
      setCoverPhoto('');
      setLoading(false);
    }
  }, [id, user, interests, history]);

  const handleFileUpload = (file) => {
    if (file) {
      setLoading(true);
      uploadFile(file)
        .then((data) => setCoverPhoto(data.uploadedFile.secure_url))
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  };

  const handleNewClick = () => {
    setLoading(true);
    postEvent({
      name,
      description,
      startDate,
      endDate,
      createdBy: user._id,
      relatedInterests,
      coverPhoto,
    })
      .then((data) => {
        postAttendant(data.event._id, {
          event: data.event._id,
          user: user._id,
        })
          .then((data) => history.push(`/events/${data.attendant.event}`))
          .catch((error) => {
            setError(error);
            setLoading(false);
          });
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleEditClick = () => {
    setLoading(true);
    putEvent(id, {
      name,
      description,
      startDate,
      endDate,
      createdBy,
      relatedInterests,
      coverPhoto,
    })
      .then((data) => history.push(`/events/${data.event._id}`))
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <Box p={1}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item className={style.center}>
            <Typography variant="h2">
              {`${id ? 'Edit' : 'New'} event`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" component="h3">
              Event card preview
            </Typography>
          </Grid>
          <Grid item>
            <EventCard
              event={{
                name,
                description,
                relatedInterests,
                coverPhoto,
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h4" component="h3">
              Event details
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              type="file"
              accept="image/*"
              label="Cover photo"
              variant="outlined"
              onChange={(event) => handleFileUpload(event.target.files[0])}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              label="Name"
              variant="outlined"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              multiline
              rows={5}
              label="Description"
              variant="outlined"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              type="datetime-local"
              label="Start date and time"
              variant="outlined"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              type="datetime-local"
              label="End date and time"
              variant="outlined"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              select
              multiple
              label="Related interests"
              variant="outlined"
              value={relatedInterests}
              onChange={(event) => setRelatedInterests(event.target.value)}
              SelectProps={{ multiple: true }}
            >
              {interests.map((interest) => (
                <MenuItem key={interest._id} value={interest}>
                  {interest.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            {id && (
              <Button
                className={style.buttons}
                variant="outlined"
                color="primary"
                onClick={() => history.push(`/events/${id}`)}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button
              className={id && style.buttons}
              variant="contained"
              color="primary"
              onClick={() => (id ? handleEditClick() : handleNewClick())}
              disabled={
                loading || !name || !description || !startDate || !endDate
              }
            >
              {id ? 'Edit' : 'Create'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default EventForm;
