import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';

import InterestsSelect from '../InterestsSelect/InterestsSelect';

import Style from '../Style/Style';

const EventSearchForm = (props) => {
  const {
    fromDate,
    handleFromDateChange,
    countries,
    country,
    handleCountryChange,
    regions,
    region,
    handleRegionChange,
    name,
    handleNameChange,
    allInterests,
    relatedInterests,
    handleRelatedInterestsChange,
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
            type="date"
            label={t('eventSearchForm.fromDate')}
            variant="outlined"
            value={fromDate}
            onChange={(event) => handleFromDateChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.fromDate}
            helperText={validationErrors.fromDate}
          />
        </Grid>
        <Grid item>
          <Autocomplete
            className={style.formInput}
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
                label={t('eventSearchForm.country')}
                error={!!validationErrors.country}
                helperText={validationErrors.country}
              />
            )}
            noOptionsText={t('eventSearchForm.noMatchingCountry')}
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
                  label={t('eventSearchForm.region')}
                  error={!!validationErrors.region}
                  helperText={validationErrors.region}
                />
              )}
              noOptionsText={t('eventSearchForm.noMatchingRegion')}
              value={region}
              onChange={(event, region) => handleRegionChange(region)}
            />
          </Grid>
        )}
        <Grid item>
          <TextField
            className={style.formInput}
            label={t('eventSearchForm.name')}
            variant="outlined"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
          />
        </Grid>
        {allInterests && (
          <Grid item>
            <InterestsSelect
              allInterests={allInterests}
              interests={relatedInterests}
              handleInterestsChange={handleRelatedInterestsChange}
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
            {t('eventSearchForm.search')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventSearchForm;
