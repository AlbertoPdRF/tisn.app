import { makeStyles } from '@material-ui/core/styles';

const Style = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 1),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
      paddingBottom: theme.spacing(2),
    },
    display: 'flex',
    maxWidth: '100vw',
  },
  minHeight: {
    minHeight: '100vh',
  },
  grow: {
    flexGrow: 1,
  },
  fullWidth: {
    width: '100%',
  },
  center: {
    textAlign: 'center',
  },
  alignRight: {
    float: 'right',
    textAlign: 'right',
  },
  drawerPaper: {
    width: 250,
  },
  eventCard: {
    width: 300,
    height: 300,
  },
  userCard: {
    width: 150,
    height: 150,
  },
  formInput: {
    [theme.breakpoints.down('sm')]: {
      width: '75vw',
    },
    [theme.breakpoints.up('md')]: {
      width: '720px',
    },
  },
  avatar: {
    height: '200px',
    width: '200px',
    margin: 'auto',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  buttons: {
    margin: theme.spacing(0.5),
  },
}));

export default Style;
