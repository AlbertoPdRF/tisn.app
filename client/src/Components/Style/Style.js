import { makeStyles } from '@material-ui/core/styles';

const Style = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 1),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
      paddingBottom: theme.spacing(2),
    },
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100vw',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '960px',
      margin: 'auto',
    },
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
    width: '250px',
  },
  eventCard: {
    width: '300px',
    height: '300px',
  },
  userCard: {
    width: '150px',
    height: '150px',
  },
  interestCard: {
    width: '250px',
    height: '100px',
  },
  interestCardActions: {
    float: 'right',
    marginTop: '-24px',
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
  image: {
    [theme.breakpoints.down('sm')]: {
      width: '75vw',
    },
    [theme.breakpoints.up('md')]: {
      width: '720px',
    },
    border: 'solid',
    borderWidth: '1px',
    borderRadius: '4px',
    borderColor: 'rgba(0, 0, 0, 0.23)',
  },
}));

export default Style;
