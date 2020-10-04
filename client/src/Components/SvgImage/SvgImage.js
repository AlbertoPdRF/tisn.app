import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core/styles';

import { ReactComponent as EventsImage } from '../../assets/images/events.svg';
import { ReactComponent as InterestsImage } from '../../assets/images/interests.svg';
import { ReactComponent as OpenSourceImage } from '../../assets/images/openSource.svg';
import { ReactComponent as UsersImage } from '../../assets/images/users.svg';

const images = {
  users: UsersImage,
  events: EventsImage,
  interests: InterestsImage,
  openSource: OpenSourceImage,
};

const SvgImage = (props) => {
  const { name, ...rest } = props;

  const { t } = useTranslation();
  const theme = useTheme();

  const Image = images[name];

  return (
    <Image
      alt={t(`svgImage.${name}`)}
      title={t(`svgImage.${name}`)}
      fill={theme.palette.primary.main}
      {...rest}
    />
  );
};

export default SvgImage;
