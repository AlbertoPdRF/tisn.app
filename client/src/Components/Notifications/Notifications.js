import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { useNotifications } from '../NotificationsProvider/NotificationsProvider';

import NotificationCard from '../NotificationCard/NotificationCard';

import Style from '../Style/Style';

const Notifications = () => {
  const { t } = useTranslation();
  const style = Style();
  const notifications = useNotifications();

  const [regularNotifications, setRegularNotifications] = useState(null);
  const [regularReadNotifications, setRegularReadNotifications] = useState(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (notifications) {
      setRegularNotifications(notifications.regular);
      setRegularReadNotifications(notifications.regularRead);
      setLoading(false);
    }
  }, [notifications]);

  const notificationsGrid = (notifications) => (
    <Grid container justify="center" spacing={2}>
      {notifications.map((notification) => (
        <Grid item key={notification._id} sm={6} xs={12}>
          {<NotificationCard notification={notification} />}
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Fragment>
      {loading ? (
        <LinearProgress />
      ) : (
        <div className={style.root}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h2">{t('notifications.title')}</Typography>
            </Grid>
            <Grid item>
              {regularNotifications && regularNotifications.length > 0 ? (
                notificationsGrid(regularNotifications)
              ) : (
                <Typography variant="body1">
                  {t('notifications.noNew')}
                </Typography>
              )}
            </Grid>
            {regularReadNotifications && regularReadNotifications.length > 0 && (
              <Grid item>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    {t('notifications.read')}
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    {notificationsGrid(regularReadNotifications)}
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            )}
          </Grid>
        </div>
      )}
    </Fragment>
  );
};

export default Notifications;
