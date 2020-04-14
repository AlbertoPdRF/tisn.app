import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import Style from '../Style/Style';

const UserInterestsForm = (props) => {
  const {
    allInterests,
    interests,
    handleInterestsChange
  } = props;

  const style = Style();

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <TextField
          className={style.formInput}
          select
          label="Interests"
          variant="outlined"
          value={interests}
          onChange={event => handleInterestsChange(event.target.value)}
          SelectProps={{ multiple: true }}
        >
          {allInterests.map(interest => (
            <MenuItem key={interest._id} value={interest}>
              {interest.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default UserInterestsForm;
