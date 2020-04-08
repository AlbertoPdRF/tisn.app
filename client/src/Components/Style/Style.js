import { makeStyles } from '@material-ui/core/styles';

const Style = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 1),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
      paddingBottom: theme.spacing(2),
    },
    display: 'flex',
    minHeight: '100vh',
    maxWidth: '100vw'
  },
  grow: {
    flexGrow: 1
  },
  fullWidth: {
    width: '100%'
  },
  center: {
    textAlign: 'center'
  },
  drawerPaper: {
    width: 250,
  },
  card: {
    width: 300,
    height: 300
  },
  cardInterests: {
    float: 'right'
  },
  formInput: {
    [theme.breakpoints.down('sm')]: {
      width: '80vw'
    },
    [theme.breakpoints.up('md')]: {
      width: '768px'
    },
  }
}));

export default Style;
