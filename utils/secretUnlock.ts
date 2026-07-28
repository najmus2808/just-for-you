import { APP_CONFIG } from '@/data/appConfig';
import { parseConfigDate } from '@/utils/dateUtils';

/**
 * Unlocks with the relationship start date, entered as DD-MM-YYYY (the
 * on-screen hint) in any reasonable separator style — "12-08-2023",
 * "12/08/2023", "12.08.2023", or plain "12082023" all match. APP_CONFIG
 * stores dates as 'YYYY-MM-DD', so day/month/year are parsed and compared
 * as numbers rather than as a raw digit string — comparing digit strings
 * directly would compare "DDMMYYYY" against "YYYYMMDD" and never match.
 * Until that date is filled in (still a TODO_ placeholder), any non-empty
 * input unlocks it — so the feature stays fully testable before the real
 * date exists, and starts actually gating once it does (SPEC.md Section 28).
 */
export function checkSecretUnlock(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;

  const realDate = parseConfigDate(APP_CONFIG.relationshipStartDate);
  if (!realDate) {
    return trimmed.replace(/\D/g, '').length > 0;
  }

  const withSeparators = trimmed.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  const digitsOnly = trimmed.replace(/\D/g, '');
  const bare = digitsOnly.length === 8 ? digitsOnly.match(/^(\d{2})(\d{2})(\d{4})$/) : null;
  const match = withSeparators ?? bare;
  if (!match) return false;

  const [, day, month, year] = match;
  return (
    Number(day) === realDate.getDate() &&
    Number(month) === realDate.getMonth() + 1 &&
    Number(year) === realDate.getFullYear()
  );
}
