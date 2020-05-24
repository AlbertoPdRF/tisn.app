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
  minWidth: {
    minWidth: '50%',
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
  alignCenterVertically: {
    display: 'flex',
    alignItems: 'center',
  },
  alignRight: {
    float: 'right',
    textAlign: 'right',
  },
  alignLeft: {
    float: 'left',
    textAlign: 'left',
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
    borderRadius: theme.shape.borderRadius,
    borderColor: theme.palette.grey[300],
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
    color: 'rgba(0, 0, 0, 0.87)', // === theme.palette.text.primary of light theme
    backgroundColor: theme.palette.grey[300],
  },
  preLine: {
    whiteSpace: 'pre-line',
  },
  breakWord: {
    wordWrap: 'break-word',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  snackbarAboveFab: {
    marginBottom: '80px',
  },
}));

export default Style;
