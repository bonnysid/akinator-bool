import {
  addDays,
  differenceInDays, eachDayOfInterval,
  endOfDay,
  endOfMonth, endOfWeek,
  format,
  formatISO,
  startOfDay,
  startOfMonth,
  startOfWeek
} from 'date-fns';

export const formatDateZ = (iso: string): string => {
  if (!iso.includes('Z')) {
    const splittedISO = iso.split(/\+|-/g);
    const newISO = splittedISO.splice(0, splittedISO.length - 1).join('-');
    return newISO.concat('Z');
  }

  return iso;
};

export const getEndMonth = (periodDate: Date) => {
  const now = new Date();

  if (now.getMonth() === periodDate.getMonth() && now.getFullYear() === periodDate.getFullYear()) {
    return now;
  }

  return endOfMonth(periodDate);
};

export const formatDate = (date: Date) => {
  return formatDateZ(formatISO(date));
};

export const formatStartDate = (date: Date) => {
  return formatDate(startOfDay(date));
};

export const formatEndDate = (date: Date) => {
  return formatDate(endOfDay(date));
};

export const formatStartMonth = (date: Date) => {
  return formatDate(startOfMonth(date));
};

export const formatEndMonth = (date: Date) => {
  return formatDate(endOfMonth(date));
};

export const formatDDMMYYYY = (date: Date) => {
  return format(date, 'dd.MM.yyyy');
};

export const formatMMYYYY = (date: Date) => {
  return format(date, 'MM.yyyy');
};

export const formatDDMMYY = (date: Date) => {
  return format(date, 'dd.MM.yy');
};

export const addDaysFormatDDMMYYYY = (date: Date, days: number) => {
  return format(addDays(date, days), 'dd.MM.yyyy');
};

export const getDiffDaysFromNow = (date: Date) => {
  const now = new Date();

  return differenceInDays(date, now);
};

export const getDiffDays = (date1: Date, date2: Date) => {
  return differenceInDays(date1, date2);
};

export const getCurrentWeekDates = () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Неделя начинается с понедельника
  const end = endOfWeek(now, { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
}
