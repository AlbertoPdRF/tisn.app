import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';

import InterestsSelect from '../InterestsSelect/InterestsSelect';

import Style from '../Style/Style';

const UserSearchForm = (props) => {
  const {
    name,
    handleNameChange,
    countries,
    country,
    handleCountryChange,
    regions,
    region,
    handleRegionChange,
    allInterests,
    interests,
    handleInterestsChange,
    handleSearchClick,
    validationErrors,
    loading,
  } = props;

  const { t } = useTranslation();
  const style = Style();

  return (
    <Box p={1}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <TextField
            className={style.formInput}
            label={t('userSearchForm.name')}
            variant="outlined"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
          />
        </Grid>
        <Grid item>
          <Autocomplete
            className={style.formInput}
            options={countries}
            getOptionLabel={(country) => country.countryName}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={t('userSearchForm.country')}
                error={!!validationErrors.country}
                helperText={validationErrors.country}
              />
            )}
            noOptionsText={t('userSearchForm.noMatchingCountry')}
            value={country}
            onChange={(event, country) => handleCountryChange(country)}
          />
        </Grid>
        {regions && regions.length > 0 && (
          <Grid item>
            <Autocomplete
              className={style.formInput}
              options={regions}
              getOptionLabel={(region) => region.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t('userSearchForm.region')}
                  error={!!validationErrors.region}
                  helperText={validationErrors.region}
                />
              )}
              noOptionsText={t('userSearchForm.noMatchingRegion')}
              value={region}
              onChange={(event, region) => handleRegionChange(region)}
            />
          </Grid>
        )}
        {allInterests && (
          <Grid item>
            <InterestsSelect
              allInterests={allInterests}
              interests={interests}
              handleInterestsChange={handleInterestsChange}
              validationErrors={validationErrors}
            />
          </Grid>
        )}
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSearchClick()}
            disabled={loading}
          >
            {t('userSearchForm.search')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserSearchForm;
