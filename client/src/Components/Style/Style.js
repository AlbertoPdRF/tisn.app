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
  grow: {
    flexGrow: 1,
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 56px)',
    },
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100vh - 64px)',
    },
  },
  center: {
    textAlign: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  alignRight: {
    float: 'right',
    textAlign: 'right',
  },
  drawerPaper: {
    width: '250px',
  },
  commentCard: {
    [theme.breakpoints.down('sm')]: {
      width: '75vw',
    },
    [theme.breakpoints.up('md')]: {
      width: '720px',
    },
  },
  commentCardContent: {
    marginTop: '-24px',
  },
  commentCardActions: {
    float: 'right',
    marginTop: '-24px',
  },
  nestedComments: {
    [theme.breakpoints.down('sm')]: {
      width: '70vw',
    },
    [theme.breakpoints.up('md')]: {
      width: '672px',
    },
  },
  userCardContent: {
    marginTop: '-24px',
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
  buttonsStacked: {
    display: 'inline-block',
    width: '100px',
  },
  signUpButton: {
    color: theme.palette.primary.main,
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
  messagesCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  messagesCardContent: {
    flexGrow: 1,
    marginTop: '-8px',
    overflowY: 'scroll',
  },
  message: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: '75vw',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '720px',
    },
    borderRadius: '8px',
    padding: '4px 8px',
  },
  messageSent: {
    float: 'right',
    textAlign: 'right',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  messageReceived: {
    float: 'left',
    textAlign: 'left',
    color: 'black',
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
  },
  preLine: {
    whiteSpace: 'pre-line',
  },
}));

export default Style;
