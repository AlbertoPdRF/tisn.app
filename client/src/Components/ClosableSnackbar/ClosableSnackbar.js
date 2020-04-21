import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const ClosableSnackbar = (props) => {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      {...props}
      open={open}
      action={
        <IconButton color="inherit" onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      }
    />
  );
};

export default ClosableSnackbar;
