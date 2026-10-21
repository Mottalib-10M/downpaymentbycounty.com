import { makeRouter, type RouteDef } from './routes-core';
import { GUIDES } from '../lib/pages';
/** English first (most searches), Spanish for the 40 million Spanish-speaking households of the United States:
 *  every page exists in both languages, hreflang en-US / es-US. */
export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
const R = (id: string, es: string, en: string, noindex = false) => ({ id, paths: { es: `/es/${es}/`, en: `/en/${en}/` }, ...(noindex ? { noindex } : {}) });
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { es: '/es/', en: '/en/' } },
  R('method', 'metodo', 'method'),
  R('about', 'acerca-de', 'about'),
  R('widget', 'widget', 'widget', true),
  R('contact', 'contacto', 'contact', true),
  R('editorial', 'politica-editorial', 'editorial-policy', true),
  R('privacy', 'privacidad', 'privacy', true),
  R('terms', 'aviso-legal', 'legal-notice', true),
  R('cookies', 'cookies', 'cookies', true),
];
const G = (g: (typeof GUIDES)[number]): RouteDef<Locale> => ({ id: g.id, paths: { en: `/en/${g.en.slug}/`, ...(g.es ? { es: `/es/${g.es.slug}/` } : {}) } });
export const ROUTES: RouteDef<Locale>[] = [CORE[0], ...GUIDES.map(G), ...CORE.slice(1)];
export const { NOINDEX_PATHS, route, hasRoute, altPaths } = makeRouter(LOCALES, ROUTES);
