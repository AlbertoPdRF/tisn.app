import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';

import UserForm from '../UserForm/UserForm';

import Style from '../Style/Style';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const UserTabs = ({ match }) => {
  const style = Style();

  const [value, setValue] = useState(0);

  const id = match.params.id;

  return (
    <div className={style.root}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Typography variant="h2">
            Edit
          </Typography>
        </Grid>
        <Grid item>
          <Paper>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={(event, newValue) => setValue(newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Details" />
                <Tab label="Interests" />
                <Tab label="Settings" />
              </Tabs>
            </AppBar>
            <SwipeableViews
              index={value}
              onChangeIndex={(index) => setValue(index)}
            >
              <TabPanel value={value} index={0}>
                <UserForm id={id} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Typography variant="body1" className={`${style.center} ${style.formInput}`}>
                  Interests
                </Typography>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Typography variant="body1" className={`${style.center} ${style.formInput}`}>
                  Settings
                </Typography>
              </TabPanel>
            </SwipeableViews>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserTabs;
