import React, { useState, useEffect, Fragment } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Link from '@material-ui/core/Link';

import SwipeableViews from 'react-swipeable-views';

import { getUserEvents, deleteEvent } from '../../logic/api';

import { useUser } from '../UserProvider/UserProvider';

import TabPanel from '../TabPanel/TabPanel';
import EventsTable from '../EventsTable/EventsTable';

import Style from '../Style/Style';

const UserEvents = () => {
  const style = Style();
  const user = useUser();

  const [value, setValue] = useState(0);
  const [currentAttendingEvents, setCurrentAttendingEvents] = useState([]);
  const [pastAttendingEvents, setPastAttendingEvents] = useState([]);
  const [currentCreatedEvents, setCurrentCreatedEvents] = useState([]);
  const [pastCreatedEvents, setPastCreatedEvents] = useState([]);
  const [updateEvents, setUpdateEvents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const classifyEvents = (events, now) => {
    const current = [];
    const past = [];
    events.forEach((event) => {
      if (new Date(event.startDate) >= now) {
        current.push(event);
      } else {
        past.push(event);
      }
    });

    past.reverse();
    return { current, past };
  };

  useEffect(() => {
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
      .catch((error) => setError(error.message))
      .finally(() => {
        setUpdateEvents(false);
        setLoading(false);
      });
  }, [updateEvents]);

  const handleDeleteClick = (event) => {
    setLoading(true);
    deleteEvent(event._id, event)
      .then(() => setUpdateEvents(true))
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <div className={style.root}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h2">My events</Typography>
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
                  <Tab label="Attending" />
                  <Tab label="Created" />
                </Tabs>
              </AppBar>
              {user && (
                <SwipeableViews
                  index={value}
                  onChangeIndex={(index) => setValue(index)}
                >
                  <TabPanel value={value} index={0}>
                    <ExpansionPanel defaultExpanded>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        Current
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        {currentAttendingEvents.length > 0 ? (
                          <EventsTable
                            events={currentAttendingEvents}
                            displayActions={false}
                          />
                        ) : (
                          <div className={style.center}>
                            <Typography variant="body1">
                              You have no current attending events.
                            </Typography>
                            <Link href="/events" variant="body1">
                              Browse events!
                            </Link>
                          </div>
                        )}
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        Past
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        {pastAttendingEvents.length > 0 ? (
                          <EventsTable
                            events={pastAttendingEvents}
                            displayActions={false}
                          />
                        ) : (
                          <div className={style.center}>
                            <Typography variant="body1">
                              You have no past attending events.
                            </Typography>
                            <Link href="/events" variant="body1">
                              Browse events!
                            </Link>
                          </div>
                        )}
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <ExpansionPanel defaultExpanded>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        Current
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        {currentCreatedEvents.length > 0 ? (
                          <EventsTable
                            events={currentCreatedEvents}
                            displayActions={true}
                            handleDeleteClick={handleDeleteClick}
                          />
                        ) : (
                          <div className={style.center}>
                            <Typography variant="body1">
                              You have no current created events.
                            </Typography>
                            <Link href="/events/new" variant="body1">
                              Create a new event!
                            </Link>
                          </div>
                        )}
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        Past
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        {pastCreatedEvents.length > 0 ? (
                          <EventsTable
                            events={pastCreatedEvents}
                            displayActions={false}
                          />
                        ) : (
                          <div className={style.center}>
                            <Typography variant="body1">
                              You have no past created events.
                            </Typography>
                            <Link href="/events/new" variant="body1">
                              Create a new event!
                            </Link>
                          </div>
                        )}
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </TabPanel>
                </SwipeableViews>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

export default UserEvents;
