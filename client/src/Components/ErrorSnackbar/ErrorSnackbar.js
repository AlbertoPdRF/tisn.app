import { useTranslation } from 'react-i18next';
import Portal from '@material-ui/core/Portal';

import ClosableSnackbar from '../ClosableSnackbar/ClosableSnackbar';

const ErrorSnackbar = (props) => {
  const { error, ...other } = props;

  const { t } = useTranslation();

  const message = typeof error === 'string' ? error : t('errorsList.generic');

  return (
    <Portal>
      <ClosableSnackbar
        message={message}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        {...other}
      />
    </Portal>
  );
};

export default ErrorSnackbar;
