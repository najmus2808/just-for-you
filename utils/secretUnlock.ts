import { APP_CONFIG } from '@/data/appConfig';
import { parseConfigDate } from '@/utils/dateUtils';

/**
 * Unlocks with the relationship start date, in any reasonable format
 * (digits only are compared, so "12-05-2020", "12/05/2020" all match).
 * Until that date is filled in (still a TODO_ placeholder), any non-empty
 * input unlocks it — so the feature stays fully testable before the real
 * date exists, and starts actually gating once it does (SPEC.md Section 28).
 */
export function checkSecretUnlock(input: string): boolean {
  const digitsOnly = input.replace(/\D/g, '');
  if (!digitsOnly) return false;

  const realDate = parseConfigDate(APP_CONFIG.relationshipStartDate);
  if (!realDate) {
    return true;
  }

  const configDigits = APP_CONFIG.relationshipStartDate.replace(/\D/g, '');
  return digitsOnly === configDigits;
}
