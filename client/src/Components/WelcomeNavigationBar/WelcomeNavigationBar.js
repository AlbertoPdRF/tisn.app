import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

import Style from '../Style/Style';

const WelcomeNavigationBar = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  const style = Style();

  return (
    <AppBar
      position="static"
      color={theme.palette.type === 'dark' ? 'inherit' : 'primary'}
    >
      <Toolbar>
        <Link
          edge="start"
          variant="h4"
          color="inherit"
          underline="none"
          href="/"
        >
          Tisn
        </Link>
        <div className={style.grow} />
        <Button
          edge="end"
          className={style.buttons}
          size={matches ? 'small' : 'medium'}
          variant="outlined"
          color="inherit"
          onClick={() => history.push('/log-in')}
        >
          {t('welcomeNavigationBar.logIn')}
        </Button>
        <Button
          edge="end"
          className={style.buttons}
          size={matches ? 'small' : 'medium'}
          variant="contained"
          color={theme.palette.type === 'dark' ? 'default' : 'inherit'}
          style={{
            color: theme.palette.type === 'light' && theme.palette.primary.main,
          }}
          onClick={() => history.push('/sign-up')}
        >
          {t('welcomeNavigationBar.signUp')}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default WelcomeNavigationBar;
