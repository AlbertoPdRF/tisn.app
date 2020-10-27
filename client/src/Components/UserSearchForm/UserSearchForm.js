import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
    includeCurrentUser,
    handleIncludeCurrentUserChange,
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
          <Typography variant="h3">{t('userSearchForm.title')}</Typography>
        </Grid>
        <Grid item>
          <TextField
            className={style.formInput}
            label={t('userSearchForm.name')}
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
                label={t('userSearchForm.country')}
                error={!!validationErrors.country}
                helperText={
                  validationErrors.country &&
                  t(`errorsList.${validationErrors.country}`)
                }
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
                  helperText={
                    validationErrors.region &&
                    t(`errorsList.${validationErrors.region}`)
                  }
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
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={includeCurrentUser}
                onChange={(event) =>
                  handleIncludeCurrentUserChange(event.target.checked)
                }
              />
            }
            label={t('userSearchForm.includeCurrentUser')}
          />
        </Grid>
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
