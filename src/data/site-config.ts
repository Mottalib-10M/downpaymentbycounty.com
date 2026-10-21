/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://us-down-payment-assistance.example";
export const SITE_NAMES: Record<string, string> = {"en": "Down Payment Aid by County", "es": "Ayuda para el Pago Inicial por Condado"};
export const LANG_TAGS: Record<string, string> = {"en": "en-US", "es": "es-US"};
export const OG_LOCALES: Record<string, string> = {"en": "en_US", "es": "es_US"};
export const LOCALE_TAG = 'en-US';
export const CURRENCY = 'USD';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-22';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"en": "Independent publisher of county-level down payment assistance calculations built from HUD income limits and state housing finance agency program guides", "es": "Editor independiente de cálculos de ayuda para el pago inicial por condado, hechos con los límites de ingresos de HUD y las guías de las agencias estatales de vivienda"};
export const AUTHOR_DESC: Record<string, string> = {"en": "Radif Partners loads the HUD fiscal year 2026 income limits for every county and New England town, the FHFA 2026 conforming loan limits, and the program guides of state housing finance agencies, then turns them into one answer: what share of your area median income you earn, which state programs you may fit, how much they lend or give, on what terms, and what your monthly payment looks like with and without the help. No email, no phone number and no lender referral are asked for or offered; the arithmetic runs in your browser.", "es": "Radif Partners carga los límites de ingresos de HUD del año fiscal 2026 de cada condado, los límites de préstamo conforme de FHFA para 2026 y las guías de los programas de las agencias estatales de vivienda, y los convierte en una sola respuesta: qué porcentaje del ingreso medio de su zona gana, a qué programas estatales podría tener derecho, cuánto prestan o regalan, con qué condiciones y cómo queda su pago mensual con y sin la ayuda. No pedimos correo ni teléfono ni le enviamos a un prestamista; el cálculo se hace en su navegador."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"en": ["HUD area median family income and income limits by county", "State housing finance agency down payment assistance programs", "Forgivable, deferred and amortizing second mortgages", "FHFA conforming loan limits", "First-time homebuyer definition and requirements", "Mortgage credit certificates"], "es": ["Ingreso familiar medio del área y límites de ingresos de HUD por condado", "Programas de ayuda para el pago inicial de las agencias estatales de vivienda", "Segundas hipotecas perdonables, diferidas y amortizables", "Límites de préstamo conforme de FHFA", "Definición y requisitos de comprador de vivienda por primera vez", "Certificados de crédito hipotecario"]};
export const CONTACT_EMAIL = "contact@us-down-payment-assistance.example";
export const THEME_COLOR = '#1D5C4D';
export const LOGO_SYMBOL = 'DP';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = '13723665942e47e7b167ecb87b5a391c';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme sur les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "TVA",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'legalForm', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
