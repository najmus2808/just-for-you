import type { AppConfig } from '@/types';

/**
 * The single source of truth for who this app is for.
 * Every other data file and screen reads from here — never hardcode
 * names or dates elsewhere.
 *
 * anniversaryDate is the real wedding date. relationshipStartDate (the
 * family-arranged meeting) is still a DEMO placeholder — replace it with
 * the real date whenever ready (format 'YYYY-MM-DD').
 * The Secret Letter unlocks with `relationshipStartDate`.
 */
export const APP_CONFIG: AppConfig = {
  wifeName: 'Nabila',
  husbandName: 'Sakib',
  relationshipStartDate: '2023-08-12',
  anniversaryDate: '2023-10-20',
};
