import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import { getInterests, postEvent } from '../../logic/api';
import { uploadFile } from '../../logic/file-upload';

import { useUser } from '../UserProvider/UserProvider';

import Style from '../Style/Style';
import EventCard from '../EventCard/EventCard';

const NewEventForm = () => {
  const history = useHistory();
  const user = useUser();
  const style = Style();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interests, setInterests] = useState([]);
  const [relatedInterests, setRelatedInterests] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getInterests()
      .then(data => setInterests(data.interests))
      .catch(error => console.log(error));
  }, []);

  const handleClick = () => {
    setLoading(true);
    postEvent({
      name,
      description,
      startDate,
      endDate,
      createdBy: user._id,
      relatedInterests,
      attendants: [user._id],
      coverPhoto
    })
      .then(data => {
        setLoading(false);
        history.push(`/events/${data.event._id}`);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  const handleFileUpload = file => {
    uploadFile(file)
      .then(data => {
        setCoverPhoto(data.path);
      })
      .catch(error => {
        setError(error);
        console.log(error);
      });
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <Box p={1}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item className={style.center}>
            <Typography variant="h2">
              New event
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" component="h3">
              Event card preview
            </Typography>
          </Grid>
          <Grid item>
            <EventCard event={{
              _id: "dummy",
              name,
              description,
              relatedInterests,
              coverPhoto
            }} />
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
              onChange={event => handleFileUpload(event.target.files[0])}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              label="Name"
              variant="outlined"
              value={name}
              onChange={event => setName(event.target.value)}
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
              onChange={event => setDescription(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              className={style.formInput}
              type="datetime-local"
              label="Start date and time"
              variant="outlined"
              value={startDate}
              onChange={event => setStartDate(event.target.value)}
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
              onChange={event => setEndDate(event.target.value)}
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
              onChange={event => setRelatedInterests(event.target.value)}
              SelectProps={{ multiple: true }}
            >
              {interests.map(interest => (
                <MenuItem key={interest._id} value={interest}>
                  {interest.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => handleClick()}
              disabled={
                loading ||
                !name ||
                !description ||
                !startDate ||
                !endDate
              }
            >
              Create new event
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default NewEventForm;
