import React from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';

import Style from '../Style/Style';

const InterestsSelect = (props) => {
  const {
    allInterests,
    interests,
    handleInterestsChange,
    validationErrors,
  } = props;

  const { t } = useTranslation();
  const style = Style();

  return (
    <Autocomplete
      className={style.formInput}
      multiple
      disableClearable
      disableCloseOnSelect
      filterSelectedOptions
      options={allInterests
        .sort(
          (a, b) =>
            -t(`interestsList.${b.name}`).localeCompare(
              t(`interestsList.${a.name}`)
            )
        )
        .sort(
          (a, b) =>
            -t(`categoriesList.${b.category.name}`).localeCompare(
              t(`categoriesList.${a.category.name}`)
            )
        )}
      groupBy={(interest) => t(`categoriesList.${interest.category.name}`)}
      getOptionLabel={(interest) => t(`interestsList.${interest.name}`)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={t('interestsSelect.interests')}
          error={
            !!validationErrors.interests || !!validationErrors.relatedInterests
          }
          helperText={
            (validationErrors.interests &&
              t(`errorsList.${validationErrors.interests}`)) ||
            (validationErrors.relatedInterests &&
              t(`errorsList.${validationErrors.relatedInterests}`))
          }
        />
      )}
      noOptionsText={
        <Typography variant="body1">
          {`${t('interestsSelect.noMatchingInterest')}. `}
          <Link
            href="mailto:Tisn <support@tisn.app>"
            variant="body1"
            onMouseDown={(event) => event.preventDefault()}
          >
            {t('interestsSelect.askUs')}
          </Link>
        </Typography>
      }
      value={interests}
      onChange={(event, interests) => handleInterestsChange(interests)}
      renderTags={(interests, getTagProps) =>
        interests.map((interest, index) => (
          <Chip
            className={style.chip}
            variant="outlined"
            avatar={
              <Avatar
                src={interest.avatar}
                alt={t(`interestsList.${interest.name}`)}
              />
            }
            label={t(`interestsList.${interest.name}`)}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
};

export default InterestsSelect;
