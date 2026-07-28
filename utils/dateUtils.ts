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
