import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Style from '../Style/Style';

const CommentForm = (props) => {
  const { parentComment, handleClick } = props;

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
      className={parentComment ? style.nestedComments : style.formInput}
      variant="outlined"
      placeholder="Write a comment..."
      value={content}
      onChange={(event) => setContent(event.target.value)}
      InputProps={{
        endAdornment: (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setLoading(true);
              handleClick(content, handleContentChange, parentComment);
            }}
            disabled={!content || loading}
          >
            Post
          </Button>
        ),
      }}
    />
  );
};

export default CommentForm;
