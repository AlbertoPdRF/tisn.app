import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core/styles';

import { ReactComponent as EventsImageLight } from '../../assets/images/events-light.svg';
import { ReactComponent as InterestsImageLight } from '../../assets/images/interests-light.svg';
import { ReactComponent as OpenSourceImageLight } from '../../assets/images/openSource-light.svg';
import { ReactComponent as UsersImageLight } from '../../assets/images/users-light.svg';
import { ReactComponent as EventsImageDark } from '../../assets/images/events-dark.svg';
import { ReactComponent as InterestsImageDark } from '../../assets/images/interests-dark.svg';
import { ReactComponent as OpenSourceImageDark } from '../../assets/images/openSource-dark.svg';
import { ReactComponent as UsersImageDark } from '../../assets/images/users-dark.svg';

const images = {
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

const SvgImage = (props) => {
  const { name, ...rest } = props;

  const { t } = useTranslation();
  const theme = useTheme();

  const Image = images[theme.palette.type][name];

  return (
    <Image
      alt={t(`svgImage.${name}`)}
      title={t(`svgImage.${name}`)}
      {...rest}
    />
  );
};

export default SvgImage;
