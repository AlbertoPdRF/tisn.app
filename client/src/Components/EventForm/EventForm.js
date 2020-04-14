import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import Style from '../Style/Style';

const EventForm = (props) => {
  const {
    name,
    handleNameChange,
    description,
    handleDescriptionChange,
    startDate,
    handleStartDateChange,
    endDate,
    handleEndDateChange,
    coverPhoto,
    handleFileUpload,
  } = props;

  const style = Style();

  return (
    <Box p={1}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        {coverPhoto && (
          <Grid item>
            <img
              className={style.formInput}
              src={coverPhoto}
              alt="Cover photo"
            />
          </Grid>
        )}
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
            onChange={(event) => handleNameChange(event.target.value)}
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
            onChange={(event) => handleDescriptionChange(event.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            className={style.formInput}
            type="datetime-local"
            label="Start date and time"
            variant="outlined"
            value={startDate}
            onChange={(event) => handleStartDateChange(event.target.value)}
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
            onChange={(event) => handleEndDateChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventForm;
