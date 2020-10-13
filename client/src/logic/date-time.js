import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { enUS, es } from 'date-fns/locale';

import i18n from '../i18n';

const locales = [enUS, es];

const getLocale = () =>
  locales.filter((locale) => locale.code.startsWith(i18n.language))[0];

const formatUtcToTimeZone = (dateString, formatString) =>
  format(
    utcToZonedTime(
      parseISO(dateString),
      Intl.DateTimeFormat().resolvedOptions().timeZone
    ),
    formatString,
    {
      locale: getLocale(),
    }
  );

export const formatInputDate = (dateString) =>
  formatUtcToTimeZone(dateString, 'yyyy-MM-dd');

export const formatDate = (dateString) =>
  format(parseISO(dateString.split('T')[0]), 'P', {
    locale: getLocale(),
  });

export const formatInputDateTime = (dateString) =>
  formatUtcToTimeZone(dateString, "yyyy-MM-dd'T'HH:mm");

export const formatDateTime = (dateTimeString) =>
  formatUtcToTimeZone(dateTimeString, "p'\n'P");

export const distanceToNow = (dateTimeString) =>
  formatDistanceToNow(parseISO(dateTimeString), { locale: getLocale() });

export const formatDateTimeRange = (startString, endString) => {
  const [startTime, startDate] = formatUtcToTimeZone(
    startString,
    "p'\n'PPP"
  ).split('\n');
  const [endTime, endDate] = formatUtcToTimeZone(endString, "p'\n'PPP'").split(
    '\n'
  );

  return startDate === endDate
    ? `${startTime} - ${endTime}, ${startDate}`
    : `${startTime}, ${startDate} - ${endTime}, ${endDate}`;
};
