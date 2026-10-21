/** Every planned page (id = file name in src/content/guides). Content tests accept a link to these ids while pages
 *  are being written; the "every planned page exists" test fails until each file is there. */
export const PLANNED_TOOLS = ['programs', 'grants', 'first-time', 'income-limits', 'requirements', 'how-much-down', 'payment', 'forgivable', 'loan-limits', 'mcc'];
export const PLANNED_STATES = ['tx', 'ca', 'fl', 'ny', 'ga', 'oh', 'nc', 'wa', 'va', 'pa', 'il', 'mi', 'co', 'az', 'nj', 'md', 'ma', 'tn'];
export const PLANNED_GUIDES = [...PLANNED_TOOLS, ...PLANNED_STATES];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, 'home', 'method', 'about', 'widget', 'contact', 'editorial', 'privacy', 'terms', 'cookies']);
