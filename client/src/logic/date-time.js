import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const formatUtcToTimeZone = (dateString, formatString) =>
  format(
    utcToZonedTime(
      parseISO(dateString),
      Intl.DateTimeFormat().resolvedOptions().timeZone
    ),
    formatString
  );

export const formatInputDate = (dateString) =>
  formatUtcToTimeZone(dateString, 'yyyy-MM-dd');

export const formatDate = (dateString) =>
  formatUtcToTimeZone(dateString, 'MMM d, yyyy');

export const formatInputDateTime = (dateString) =>
  formatUtcToTimeZone(dateString, "yyyy-MM-dd'T'HH:mm");

export const formatDateTime = (dateTimeString) =>
  formatUtcToTimeZone(dateTimeString, "H:mm'\n'MMM d, yyyy");

export const formatDateTimeRange = (startString, endString) => {
  const [
    startMinute,
    startHour,
    startDay,
    startMonth,
    startYear,
  ] = formatUtcToTimeZone(startString, 'mm H d MMM yyyy').split(' ');
  const [endMinute, endHour, endDay, endMonth, endYear] = formatUtcToTimeZone(
    endString,
    'mm H d MMM yyyy'
  ).split(' ');

  const timeRange = `${startHour}:${startMinute} - ${endHour}:${endMinute}`;

  let dayRange;
  if (startDay === endDay && startMonth === endMonth && startYear === endYear) {
    dayRange = `${startMonth} ${startDay}, ${startYear}`;
  } else if (startMonth === endMonth && startYear === endYear) {
    dayRange = `${startMonth} ${startDay} - ${endDay}, ${endYear}`;
  } else if (startYear === endYear) {
    dayRange = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
  } else {
    dayRange = `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
  }

  return `${timeRange}\n${dayRange}`;
};
