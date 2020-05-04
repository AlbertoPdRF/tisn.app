import React from 'react';
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

  const style = Style();

  return (
    <Box p={1}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <TextField
            className={style.formInput}
            type="date"
            label="From date"
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
            options={countries}
            getOptionLabel={(country) => country.countryName}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Country"
                error={!!validationErrors.country}
                helperText={validationErrors.country}
              />
            )}
            noOptionsText="No matching country"
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
                  label="Region"
                  error={!!validationErrors.region}
                  helperText={validationErrors.region}
                />
              )}
              noOptionsText="No matching region"
              value={region}
              onChange={(event, region) => handleRegionChange(region)}
            />
          </Grid>
        )}
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
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventSearchForm;
