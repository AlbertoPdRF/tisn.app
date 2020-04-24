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
    handleUpload,
    attendantsLimit,
    handleAttendantsLimitChange,
    validationErrors,
  } = props;

  const style = Style();

  return (
    <Box p={1}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        {coverPhoto && (
          <Grid item>
            <img className={style.image} src={coverPhoto} alt="Event cover" />
          </Grid>
        )}
        <Grid item>
          <TextField
            className={style.formInput}
            type="file"
            accept="image/*"
            label="Cover photo"
            variant="outlined"
            onChange={(event) => handleUpload(event.target.files[0])}
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.fileType || !!validationErrors.coverPhoto}
            helperText={
              validationErrors.fileType || validationErrors.coverPhoto
            }
          />
        </Grid>
        <Grid item>
          <TextField
            className={style.formInput}
            label="Name"
            variant="outlined"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
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
            error={!!validationErrors.description}
            helperText={validationErrors.description}
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
            error={!!validationErrors.startDate}
            helperText={validationErrors.startDate}
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
            error={!!validationErrors.endDate}
            helperText={validationErrors.endDate}
          />
        </Grid>
        <Grid item>
          <TextField
            className={style.formInput}
            type="number"
            min="2"
            step="1"
            label="Attendants limit"
            variant="outlined"
            value={attendantsLimit}
            onChange={(event) =>
              handleAttendantsLimitChange(event.target.value)
            }
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.attendantsLimit}
            helperText={validationErrors.attendantsLimit}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventForm;
