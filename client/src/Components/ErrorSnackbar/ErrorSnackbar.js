import React from 'react';
import Portal from '@material-ui/core/Portal';

import ClosableSnackbar from '../ClosableSnackbar/ClosableSnackbar';

const ErrorSnackbar = (props) => {
  const { error } = props;

  const message = typeof error === 'string' ? error : 'Something went wrong';

  return (
    <Portal>
      <ClosableSnackbar
        message={message}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      />
    </Portal>
  );
};

export default ErrorSnackbar;
