import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import InterestsSelect from '../InterestsSelect/InterestsSelect';

import Style from '../Style/Style';

const UserSearchForm = (props) => {
  const {
    name,
    handleNameChange,
    allInterests,
    interests,
    handleInterestsChange,
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
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserSearchForm;
