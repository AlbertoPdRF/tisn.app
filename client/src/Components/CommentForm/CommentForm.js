import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Style from '../Style/Style';

const CommentForm = (props) => {
  const { parentComment, handleClick, validationErrors } = props;

  const { t } = useTranslation();
  const style = Style();

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContentChange = (content) => {
    setContent(content);
    setLoading(false);
  };

  return (
    <TextField
      multiline
      rowsMax={5}
      className={parentComment ? style.nestedComments : style.formInput}
      variant="outlined"
      placeholder={t('commentForm.comment')}
      value={content}
      onChange={(event) => setContent(event.target.value)}
      InputProps={{
        endAdornment: (
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              setLoading(true);
              handleClick(content, handleContentChange, parentComment);
            }}
            disabled={!content || loading}
          >
            {t('commentForm.post')}
          </Button>
        ),
      }}
      error={!!validationErrors.content}
      helperText={
        validationErrors.content && t(`errorsList.${validationErrors.content}`)
      }
    />
  );
};

export default CommentForm;
