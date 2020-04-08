import { format, parseISO } from 'date-fns';

export const formatDate = dateString => format(parseISO(dateString), 'MMM do, yyyy');

export const formatDateTimeRange = (startString, endString) => {
  const [startMinute, startHour, startDay, startMonth, startYear] = format(
    parseISO(startString),
    'mm H do MMM yyyy'
  ).split(' ');
  const [endMinute, endHour, endDay, endMonth, endYear] = format(
    parseISO(endString),
    'mm H do MMM yyyy'
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

  return (`${timeRange}\n${dayRange}`);
};
