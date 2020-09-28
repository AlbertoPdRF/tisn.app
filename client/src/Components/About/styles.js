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
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '2rem',
  },
  image: {
    width: '65%',
  },
  center: {
    textAlign: 'center',
  },
  footer: {
    marginTop: '5%',
    textAlign: 'center',
  },
  button: {
    textTransform: 'capitalize',
  },
}));

export default Style;
