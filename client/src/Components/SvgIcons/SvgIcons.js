import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core/styles';

import { ReactComponent as EventsImageLight } from '../../assets/images/events_light.svg';
import { ReactComponent as InterestsImageLight } from '../../assets/images/interests_light.svg';
import { ReactComponent as OpenSourceImageLight } from '../../assets/images/openSource_light.svg';
import { ReactComponent as UsersImageLight } from '../../assets/images/users_light.svg';
import { ReactComponent as EventsImageDark } from '../../assets/images/events_dark.svg';
import { ReactComponent as InterestsImageDark } from '../../assets/images/interests_dark.svg';
import { ReactComponent as OpenSourceImageDark } from '../../assets/images/openSource_dark.svg';
import { ReactComponent as UsersImageDark } from '../../assets/images/users_dark.svg';

const iconTypes = {
  light: {
    events: EventsImageLight,
    interests: InterestsImageLight,
    openSource: OpenSourceImageLight,
    users: UsersImageLight,
  },
  dark: {
    events: EventsImageDark,
    interests: InterestsImageDark,
    openSource: OpenSourceImageDark,
    users: UsersImageDark,
  },
};

const SvgIcon = ({ name, ...props }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const Icon = iconTypes[theme.palette.type][name];
  return (
    <Icon alt={t(`svgIcon.${name}`)} title={t(`svgIcon.${name}`)} {...props} />
  );
};

export default SvgIcon;
