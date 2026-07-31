/**
 * All date parsing here is defensive on purpose — APP_CONFIG's dates start
 * out as TODO_ placeholders (not valid dates), and SPEC.md Section 28
 * requires the app to degrade gracefully rather than crash when that's true.
 */

export function parseConfigDate(value: string): Date | null {
  if (!value || value.startsWith('TODO_')) {
    return null;
  }
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDisplayDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

/**
 * A compact human date for cards ("12 August 2023") instead of a raw
 * 'YYYY-MM-DD' string — falls back to a friendly note when the date is
 * still a TODO_ placeholder or otherwise unparseable.
 */
export function formatShortDate(value: string): string {
  const parsed = parseConfigDate(value);
  if (!parsed) return 'Date coming soon';
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();
  if (hour < 5) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

const GREETINGS: Record<TimeOfDay, string> = {
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
  night: 'Good night',
};

export function getGreeting(date: Date = new Date()): string {
  return GREETINGS[getTimeOfDay(date)];
}

/** Whole-day difference, ignoring time-of-day, so "today" is always 0 regardless of the hour. */
export function daysBetween(from: Date, to: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((end - start) / msPerDay);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** The next occurrence of `anniversary`'s month/day, on or after `today`. */
export function getNextAnniversary(anniversary: Date, today: Date = new Date()): Date {
  const candidate = new Date(today.getFullYear(), anniversary.getMonth(), anniversary.getDate());
  if (daysBetween(today, candidate) < 0) {
    candidate.setFullYear(candidate.getFullYear() + 1);
  }
  return candidate;
}

export type ElapsedDuration = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * Calendar-accurate elapsed time between two dates — carries borrows across
 * seconds→minutes→hours→days→months→years the same way you'd count on a
 * calendar, not just a raw millisecond division (which would give
 * misleading "months" for anything other than exactly-30-day months).
 */
export function getElapsedDuration(from: Date, to: Date): ElapsedDuration {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const daysInPrevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += daysInPrevMonth;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return {
    years: Math.max(years, 0),
    months: Math.max(months, 0),
    days: Math.max(days, 0),
    hours: Math.max(hours, 0),
    minutes: Math.max(minutes, 0),
    seconds: Math.max(seconds, 0),
  };
}
