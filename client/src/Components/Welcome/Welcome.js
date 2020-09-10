import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CategoryIcon from '@material-ui/icons/Category';
import DateRangeIcon from '@material-ui/icons/DateRange';
import PeopleIcon from '@material-ui/icons/People';
import Button from '@material-ui/core/Button';

import Footer from '../Footer/Footer';

import Style from '../Style/Style';

const Welcome = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const style = Style();

  return (
    <div className={`${style.root} ${style.fullHeight}`}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={style.center}>
          <Typography variant="h5" component="h2">
            {t('welcome.title')}
          </Typography>
        </Grid>
        <Grid item className={style.center}>
          <Typography gutterBottom variant="body1" color="primary">
            {t('welcome.slogan')}
          </Typography>
        </Grid>
        <Grid item className={style.center}>
          <Typography gutterBottom variant="body1">
            {t('welcome.overview')}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container justify="center" spacing={1}>
            <Grid item sm={6} xs={12}>
              <Card>
                <CardHeader
                  avatar={<CategoryIcon />}
                  title={t('welcome.overviewInterestsTitle')}
                  titleTypographyProps={{ variant: 'h6', component: 'h3' }}
                />
              </Card>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Card>
                <CardHeader
                  avatar={<DateRangeIcon />}
                  title={t('welcome.overviewEventsTitle')}
                  titleTypographyProps={{ variant: 'h6', component: 'h3' }}
                />
              </Card>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Card>
                <CardHeader
                  avatar={<PeopleIcon />}
                  title={t('welcome.overviewPeopleTitle')}
                  titleTypographyProps={{ variant: 'h6', component: 'h3' }}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={style.center} style={{ marginTop: '24px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push('/about')}
          >
            {t('welcome.knowMore')}
          </Button>
        </Grid>
        <Grid item className={style.grow} />
        <Grid item>
          <Footer />
        </Grid>
      </Grid>
    </div>
  );
};

export default Welcome;
