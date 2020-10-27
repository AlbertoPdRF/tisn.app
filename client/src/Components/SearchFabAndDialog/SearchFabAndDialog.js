import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';

import Style from '../Style/Style';

const SearchFabAndDialog = (props) => {
  const { dialogOpen, handleDialogToggle, children } = props;

  const { t } = useTranslation();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const style = Style();

  return (
    <Fragment>
      <Fab
        className={style.fab}
        variant={matches ? 'round' : 'extended'}
        color="primary"
        onClick={() => handleDialogToggle()}
      >
        <SearchIcon />
        {!matches && (
          <Typography variant="body1">
            {t('searchFabAndDialog.search')}
          </Typography>
        )}
      </Fab>
      <Dialog
        maxWidth={false}
        open={dialogOpen}
        onClose={() => handleDialogToggle()}
      >
        {children}
      </Dialog>
    </Fragment>
  );
};

export default SearchFabAndDialog;
