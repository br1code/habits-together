import { DateTime } from 'luxon';
import { ARGENTINA_TIMEZONE } from 'src/constants';

export function getCurrentDate(): Date {
  return DateTime.now().setZone(ARGENTINA_TIMEZONE).toJSDate();
}

export function getCurrentDateISO(): string {
  return DateTime.now().setZone(ARGENTINA_TIMEZONE).toISODate();
}

export function parseDateISO(date: Date): string {
  return DateTime.fromJSDate(date).setZone(ARGENTINA_TIMEZONE).toISODate();
}

export function parseDate(date: Date): DateTime {
  return DateTime.fromJSDate(date).setZone(ARGENTINA_TIMEZONE);
}

export function formatDateForDisplay(date: Date): string {
  const formattedDate = DateTime.fromJSDate(date)
    .setZone(ARGENTINA_TIMEZONE)
    .toFormat('dd/MM/yyyy HH:mm');
  console.log(`Date: ${date}, Formatted: ${formattedDate}`);
  return formattedDate;
}
