import type { Locale } from './routes';
const en = {
  updatedOn: 'Data read on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Keep going', sourcesTitle: 'Official sources for this page', writtenBy: 'Prepared by',
  asOf: 'Limits', lastUpdated: 'read from official sources on', footerValidated: 'Sources: HUD, FHFA, Freddie Mac and state housing finance agencies',
  footerBrowser: 'Every figure is computed in your browser · no account, no email, no phone number, no lender referral',
  footerDisclaimer: 'Independent site published by Radif Partners. Not affiliated with HUD, FHA, FHFA, any state housing finance agency or any lender. Estimates for information: this site does not replace the decision of the approved lender and the agency on eligibility and amounts.',
  footerPopular: 'Down payment assistance by state',
  notFound: 'Nothing lives at this address. The home page tells you, county by county, which state programs you may fit and how much they give or lend.',
  readMore: 'Read the full answer',
  moreOptions: 'More options', copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is computed', openFull: 'Open the full calculator',
};
const es: typeof en = {
  updatedOn: 'Datos leídos el', editorialPolicy: 'Política editorial', contactLabel: 'Contacto', reviewedBy: 'Preparado por',
  skipToContent: 'Ir al contenido', mainNav: 'Navegación principal', breadcrumbLabel: 'Ruta de navegación', breadcrumbHome: 'Inicio', menuOpen: 'Abrir el menú',
  faqTitle: 'Preguntas frecuentes', relatedCalculators: 'Para seguir', sourcesTitle: 'Fuentes oficiales de esta página', writtenBy: 'Preparado por',
  asOf: 'Límites', lastUpdated: 'leídos en las fuentes oficiales el', footerValidated: 'Fuentes: HUD, FHFA, Freddie Mac y agencias estatales de vivienda',
  footerBrowser: 'Cada cifra se calcula en su navegador · sin cuenta, sin correo, sin teléfono, sin enviarle a un prestamista',
  footerDisclaimer: 'Sitio independiente publicado por Radif Partners. Sin relación con HUD, FHA, FHFA, ninguna agencia estatal de vivienda ni ningún prestamista. Estimaciones informativas, que no sustituyen la decisión del prestamista aprobado y de la agencia sobre la elegibilidad y los montos.',
  footerPopular: 'Ayuda para el pago inicial por estado',
  notFound: 'No hay ninguna página en esta dirección. La página de inicio le dice, condado por condado, a qué programas estatales podría tener derecho y cuánto dan o prestan.',
  readMore: 'Leer la respuesta completa',
  moreOptions: 'Más opciones', copyLink: 'Copiar el enlace', copied: 'Enlace copiado', print: 'Imprimir', howComputed: 'Cómo se calcula', openFull: 'Abrir la calculadora completa',
};
export function t(lang: Locale) { return lang === 'es' ? es : en; }
