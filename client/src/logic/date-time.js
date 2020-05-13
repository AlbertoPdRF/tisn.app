import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { enUS, es } from 'date-fns/locale';

const getLocale = () =>
  localStorage.getItem('i18nextLng') === 'es' ? es : enUS;

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

export const formatDate = (dateString) => formatUtcToTimeZone(dateString, 'P');

export const formatInputDateTime = (dateString) =>
  formatUtcToTimeZone(dateString, "yyyy-MM-dd'T'HH:mm");

export const formatDateTime = (dateTimeString) =>
  formatUtcToTimeZone(dateTimeString, "p'\n'P");

export const distanceToNow = (dateTimeString) =>
  formatDistanceToNow(parseISO(dateTimeString), { locale: getLocale() });

export const formatDateTimeRange = (startString, endString) => {
  const [startTime, startDate] = formatUtcToTimeZone(
    startString,
    "p'\n'P"
  ).split('\n');
  const [endTime, endDate] = formatUtcToTimeZone(endString, "p'\n'P'").split(
    '\n'
  );

  return startDate === endDate
    ? `${startTime} - ${endTime}\n${startDate}`
    : `${startTime}\n${startDate}\n-\n${endTime}\n${endDate}`;
};
