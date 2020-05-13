import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { formatInputDateTime } from '../../logic/date-time';

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
    countries,
    country,
    handleCountryChange,
    regions,
    region,
    handleRegionChange,
    coverPhoto,
    handleUpload,
    attendantsLimit,
    handleAttendantsLimitChange,
    validationErrors,
  } = props;

  const { t } = useTranslation();
  const style = Style();

  return (
    <Box p={1}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        {coverPhoto && (
          <Grid item>
            <img
              className={style.image}
              src={coverPhoto}
              alt={t('eventForm.cover')}
            />
          </Grid>
        )}
        <Grid item>
          <TextField
            className={style.formInput}
            type="file"
            accept="image/*"
            label={t('eventForm.coverPhoto')}
            variant="outlined"
            onChange={(event) => handleUpload(event.target.files[0])}
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.fileType || !!validationErrors.coverPhoto}
            helperText={
              (validationErrors.fileType &&
                t(`errorsList.${validationErrors.fileType}`)) ||
              (validationErrors.coverPhoto &&
                t(`errorsList.${validationErrors.coverPhoto}`))
            }
          />
        </Grid>
        <Grid item>
          <TextField
            className={style.formInput}
            label={t('eventForm.name')}
            variant="outlined"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            error={!!validationErrors.name}
            helperText={
              validationErrors.name && t(`errorsList.${validationErrors.name}`)
            }
          />
        </Grid>
        <Grid item>
          <TextField
            className={style.formInput}
            multiline
            rows={5}
            label={t('eventForm.description')}
            variant="outlined"
            value={description}
            onChange={(event) => handleDescriptionChange(event.target.value)}
            error={!!validationErrors.description}
            helperText={
              validationErrors.description &&
              t(`errorsList.${validationErrors.description}`)
            }
          />
        </Grid>
        <Grid item>
          <TextField
            className={style.formInput}
            type="datetime-local"
            label={t('eventForm.startDate')}
            variant="outlined"
            value={startDate}
            onChange={(event) => handleStartDateChange(event.target.value)}
            InputProps={{
              inputProps: {
                min: formatInputDateTime(new Date().toISOString()),
              },
            }}
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.startDate}
            helperText={
              validationErrors.startDate &&
              t(`errorsList.${validationErrors.startDate}`)
            }
          />
        </Grid>
        <Grid item>
          <TextField
            className={style.formInput}
            type="datetime-local"
            label={t('eventForm.endDate')}
            variant="outlined"
            value={endDate}
            onChange={(event) => handleEndDateChange(event.target.value)}
            InputProps={{ inputProps: { min: startDate } }}
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.endDate}
            helperText={
              validationErrors.endDate &&
              t(`errorsList.${validationErrors.endDate}`)
            }
          />
        </Grid>
        <Grid item>
          <Autocomplete
            className={style.formInput}
            disableClearable
            options={countries.sort(
              (a, b) =>
                -t(`countriesList.${b.countryShortCode}`).localeCompare(
                  t(`countriesList.${a.countryShortCode}`)
                )
            )}
            getOptionLabel={(country) =>
              t(`countriesList.${country.countryShortCode}`)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={t('eventForm.country')}
                error={!!validationErrors.country}
                helperText={
                  validationErrors.country &&
                  t(`errorsList.${validationErrors.country}`)
                }
              />
            )}
            noOptionsText={t('eventForm.noMatchingCountry')}
            value={country}
            onChange={(event, country) => handleCountryChange(country)}
          />
        </Grid>
        {regions && regions.length > 0 && (
          <Grid item>
            <Autocomplete
              className={style.formInput}
              disableClearable
              options={regions}
              getOptionLabel={(region) => region.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t('eventForm.region')}
                  error={!!validationErrors.region}
                  helperText={
                    validationErrors.region &&
                    t(`errorsList.${validationErrors.region}`)
                  }
                />
              )}
              noOptionsText={t('eventForm.noMatchingRegion')}
              value={region}
              onChange={(event, region) => handleRegionChange(region)}
            />
          </Grid>
        )}
        <Grid item>
          <TextField
            className={style.formInput}
            type="number"
            min="2"
            step="1"
            label={t('eventForm.attendantsLimit')}
            variant="outlined"
            value={attendantsLimit}
            onChange={(event) =>
              handleAttendantsLimitChange(event.target.value)
            }
            InputProps={{
              inputProps: { min: 2 },
            }}
            error={!!validationErrors.attendantsLimit}
            helperText={
              validationErrors.attendantsLimit &&
              t(`errorsList.${validationErrors.attendantsLimit}`)
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventForm;
