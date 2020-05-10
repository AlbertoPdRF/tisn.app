import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CategoryIcon from '@material-ui/icons/Category';
import DateRangeIcon from '@material-ui/icons/DateRange';
import PeopleIcon from '@material-ui/icons/People';
import Link from '@material-ui/core/Link';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';

import Style from '../Style/Style';

const Welcome = () => {
  const style = Style();

  return (
    <div className={`${style.root} ${style.fullHeight}`}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={style.center}>
          <Typography variant="h5" component="h2">
            The introverts' social network
          </Typography>
        </Grid>
        <Grid item className={style.center}>
          <Typography gutterBottom variant="body1" color="primary">
            Meet people while doing what you enjoy!
          </Typography>
        </Grid>
        <Grid item className={style.center} style={{ marginTop: '16px' }}>
          <Typography gutterBottom variant="body1">
            It has never been easier:
          </Typography>
        </Grid>
        <Grid item>
          <Grid container justify="center" spacing={1}>
            <Grid item md={4} sm={6} xs={12}>
              <Card>
                <CardHeader
                  avatar={<CategoryIcon />}
                  title="Select your interests"
                  titleTypographyProps={{ variant: 'h6', component: 'h3' }}
                />
              </Card>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Card>
                <CardHeader
                  avatar={<DateRangeIcon />}
                  title="Browse events"
                  titleTypographyProps={{ variant: 'h6', component: 'h3' }}
                  subheader="And create your own!"
                />
              </Card>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Card>
                <CardHeader
                  avatar={<PeopleIcon />}
                  title="Meet people!"
                  titleTypographyProps={{ variant: 'h6', component: 'h3' }}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={style.grow} />
        <Grid item>
          <Grid container justify="center" spacing={2}>
            <Grid item>
              <Link
                href="https://www.instagram.com/tisn.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="https://twitter.com/tisn_app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="https://www.facebook.com/tisnapp/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Welcome;
