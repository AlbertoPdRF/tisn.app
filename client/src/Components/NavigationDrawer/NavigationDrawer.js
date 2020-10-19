import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import HomeIcon from '@material-ui/icons/Home';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EventIcon from '@material-ui/icons/Event';
import AddIcon from '@material-ui/icons/Add';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import CategoryIcon from '@material-ui/icons/Category';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { useUser } from '../UserProvider/UserProvider';
import Footer from '../Footer/Footer';

const getPrimaryMenuItems = (user) => {
  return [
    {
      name: 'home',
      path: '/',
      icon: HomeIcon,
      isSeperated: true,
    },
    {
      name: 'events',
      path: '/events',
      icon: DateRangeIcon,
      isSeperated: false,
    },
    {
      name: 'myEvents',
      path: '/events/mine',
      icon: EventIcon,
      isSeperated: false,
    },
    {
      name: 'createEvent',
      path: '/events/new',
      icon: AddIcon,
      isSeperated: true,
    },
    {
      name: 'users',
      path: '/users',
      icon: PeopleIcon,
      isSeperated: false,
    },
    {
      name: 'myProfile',
      path: `/users/${user._id}`,
      icon: PersonIcon,
      isSeperated: true,
    },
    {
      name: 'interests',
      path: '/interests',
      icon: CategoryIcon,
      isSeperated: false,
    },
  ];
};

const getSecondaryMenuItems = (history, logOut) => {
  return [
    {
      name: 'about',
      handler: () => history.push('/about'),
      icon: InfoIcon,
    },
    {
      name: 'logOut',
      handler: logOut,
      icon: ExitToAppIcon,
    },
  ];
};

const NavigationDrawer = (props) => {
  const { clickHandler, logOutHandler } = props;
  const user = useUser();
  const history = useHistory();
  const { t } = useTranslation();
  const primaryMenuItems = getPrimaryMenuItems(user);
  const secondaryMenuItems = getSecondaryMenuItems(history, logOutHandler);

  return (
    <Fragment>
      <div
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          height: 'calc(100vh - 152px)',
        }}
      >
        <List>
          <ListItem
            button
            onClick={() => {
              history.push(`/users/${user._id}`);
              clickHandler();
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={user.avatar}
                alt={t('navigationBarAndDrawer.avatar', { name: user.name })}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.name} />
          </ListItem>
          <Divider />
          {primaryMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Fragment key={item.name}>
                <ListItem
                  button
                  onClick={() => {
                    history.push(item.path);
                    clickHandler();
                  }}
                >
                  <ListItemIcon>
                    <Icon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(`navigationBarAndDrawer.${item.name}`)}
                  />
                </ListItem>
                {item.isSeperated && <Divider />}
              </Fragment>
            );
          })}
        </List>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <List>
          {secondaryMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Fragment key={item.name}>
                <Divider />
                <ListItem
                  button
                  onClick={() => {
                    item.handler();
                    clickHandler();
                  }}
                >
                  <ListItemIcon>
                    <Icon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(`navigationBarAndDrawer.${item.name}`)}
                  />
                </ListItem>
              </Fragment>
            );
          })}
          <Divider />
          <ListItem>
            <Footer />
          </ListItem>
        </List>
      </div>
    </Fragment>
  );
};

export default NavigationDrawer;
