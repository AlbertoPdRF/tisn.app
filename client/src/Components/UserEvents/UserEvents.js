import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SwipeableViews from 'react-swipeable-views';

import { getUserEvents, deleteEvent } from '../../logic/api';
import { classifyEvents } from '../../logic/utils';

import { useUser } from '../UserProvider/UserProvider';

import EventsTable from '../EventsTable/EventsTable';
import TabPanel from '../TabPanel/TabPanel';
import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const UserEvents = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const style = Style();
  const user = useUser();

  const [value, setValue] = useState(0);
  const [currentAttendingEvents, setCurrentAttendingEvents] = useState([]);
  const [pastAttendingEvents, setPastAttendingEvents] = useState([]);
  const [currentCreatedEvents, setCurrentCreatedEvents] = useState([]);
  const [pastCreatedEvents, setPastCreatedEvents] = useState([]);
  const [updateEvents, setUpdateEvents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    getUserEvents()
      .then((data) => {
        const now = new Date();

        const attendingEvents = classifyEvents(data.events.attending, now);
        setCurrentAttendingEvents(attendingEvents.current);
        setPastAttendingEvents(attendingEvents.past);

        const createdEvents = classifyEvents(data.events.created, now);
        setCurrentCreatedEvents(createdEvents.current);
        setPastCreatedEvents(createdEvents.past);
      })
      .catch((error) => setError(error))
      .finally(() => {
        setUpdateEvents(false);
        setLoading(false);
      });
  }, [updateEvents]);

  const handleDeleteClick = (event) => {
    setLoading(true);
    setError(null);
    deleteEvent(event._id, event)
      .then((data) => {
        if (data.errors) {
          setError(t('errorsList.generic'));
          setLoading(false);
        } else {
          setUpdateEvents(true);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const expansionPanel = (defaultExpanded, status, type, events) => (
    <ExpansionPanel defaultExpanded={defaultExpanded}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        {status === 'current' ? t('userEvents.current') : t('userEvents.past')}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {events.length > 0 ? (
          <EventsTable
            events={events}
            displayActions={status === 'current' && type === 'created'}
            handleDeleteClick={handleDeleteClick}
          />
        ) : (
          <div className={`${style.fullWidth} ${style.center}`}>
            <Typography gutterBottom variant="body1">
              {status === 'current'
                ? type === 'attending'
                  ? t('userEvents.noCurrentAttending')
                  : t('userEvents.noCurrentCreated')
                : type === 'attending'
                ? t('userEvents.noPastAttending')
                : t('userEvents.noPastCreated')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                history.push(`/events${type === 'attending' ? '' : '/new'}`)
              }
            >
              {type === 'attending'
                ? t('userEvents.browse')
                : t('userEvents.create')}
            </Button>
          </div>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h2">{t('userEvents.title')}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: '100vw' }}>
            <Paper>
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={(event, newValue) => setValue(newValue)}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label={t('userEvents.attending')} />
                  <Tab label={t('userEvents.created')} />
                </Tabs>
              </AppBar>
              {user && (
                <SwipeableViews
                  index={value}
                  onChangeIndex={(index) => setValue(index)}
                >
                  <TabPanel value={value} index={0}>
                    {expansionPanel(
                      true,
                      'current',
                      'attending',
                      currentAttendingEvents
                    )}
                    {expansionPanel(
                      false,
                      'past',
                      'attending',
                      pastAttendingEvents
                    )}
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {expansionPanel(
                      true,
                      'current',
                      'created',
                      currentCreatedEvents
                    )}
                    {expansionPanel(
                      false,
                      'past',
                      'created',
                      pastCreatedEvents
                    )}
                  </TabPanel>
                </SwipeableViews>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default UserEvents;
