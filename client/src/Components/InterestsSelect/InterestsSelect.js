import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import Style from '../Style/Style';

const InterestsSelect = (props) => {
  const {
    allInterests,
    interests,
    handleInterestsChange,
    validationErrors,
  } = props;

  const style = Style();

  return (
    <Autocomplete
      className={style.formInput}
      multiple
      disableClearable
      filterSelectedOptions
      options={allInterests.sort(
        (a, b) => -b.category.name.localeCompare(a.category.name)
      )}
      groupBy={(interest) => interest.category.name}
      getOptionLabel={(interest) => interest.name}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Interests"
          error={
            !!validationErrors.interests || !!validationErrors.relatedInterests
          }
          helperText={
            validationErrors.interests || validationErrors.relatedInterests
          }
        />
      )}
      noOptionsText="No matching interests"
      value={interests}
      onChange={(event, interests) => handleInterestsChange(interests)}
      renderTags={(interests, getTagProps) =>
        interests.map((interest, index) => (
          <Chip
            className={style.chip}
            variant="outlined"
            avatar={<Avatar src={interest.avatar} alt={interest.name} />}
            label={interest.name}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
};

export default InterestsSelect;
