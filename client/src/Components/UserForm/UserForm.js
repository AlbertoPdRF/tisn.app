import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Style from '../Style/Style';

const UserForm = (props) => {
  const {
    name,
    handleNameChange,
    email,
    handleEmailChange,
    dateOfBirth,
    handleDateOfBirthChange,
    countries,
    country,
    handleCountryChange,
    regions,
    region,
    handleRegionChange,
    avatar,
    handleUpload,
    validationErrors,
  } = props;

  const { t } = useTranslation();
  const style = Style();

  return (
    <Box p={1}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Avatar
            src={avatar}
            alt={t('userForm.avatarAlt', { name })}
            style={{ height: '200px', width: '200px', margin: 'auto' }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
        </Grid>
        <Grid item>
          <TextField
            className={style.formInput}
            type="file"
            accept="image/*"
            label={t('userForm.avatar')}
            variant="outlined"
            onChange={(event) => handleUpload(event.target.files[0])}
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.fileType || !!validationErrors.avatar}
            helperText={
              (validationErrors.fileType &&
                t(`errorsList.${validationErrors.fileType}`)) ||
              (validationErrors.avatar &&
                t(`errorsList.${validationErrors.avatar}`))
            }
          />
        </Grid>
        <Grid item>
          <TextField
            className={style.formInput}
            label={t('userForm.name')}
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
            label={t('userForm.email')}
            variant="outlined"
            value={email}
            onChange={(event) => handleEmailChange(event.target.value)}
            error={!!validationErrors.email}
            helperText={
              validationErrors.email &&
              t(`errorsList.${validationErrors.email}`)
            }
          />
        </Grid>
        <Grid item>
          <TextField
            className={style.formInput}
            type="date"
            label={t('userForm.dateOfBirth')}
            variant="outlined"
            value={dateOfBirth}
            onChange={(event) => handleDateOfBirthChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.dateOfBirth}
            helperText={
              validationErrors.dateOfBirth &&
              t(`errorsList.${validationErrors.dateOfBirth}`)
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
                label={t('userForm.country')}
                error={!!validationErrors.country}
                helperText={
                  validationErrors.country &&
                  t(`errorsList.${validationErrors.country}`)
                }
              />
            )}
            noOptionsText={t('userForm.noMatchingCountry')}
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
                  label={t('userForm.region')}
                  error={!!validationErrors.region}
                  helperText={
                    validationErrors.region &&
                    t(`errorsList.${validationErrors.region}`)
                  }
                />
              )}
              noOptionsText={t('userForm.noMatchingRegion')}
              value={region}
              onChange={(event, region) => handleRegionChange(region)}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UserForm;
