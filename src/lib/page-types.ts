/**
 * One page = ONE content file (CONTRIBUTING-PAGES.md): `src/content/guides/<id>.ts`, English (`en`) and Spanish (`es`)
 * side by side. Routes, menus, footer, sitemap, hreflang, schemas and internal links read these files and nothing else.
 */
import type { Kit } from './kit';
import type { Lang } from './format';

export interface FAQ { q: string; a: string }
export interface MiniOpts { /** title */ t?: string; /** fields shown */ p?: string[]; /** default values */ d?: Record<string, number | string>; /** link text */ c?: string }

export interface Helpers extends Kit {
  lang: Lang;
  /** Internal link by page id, in the page's language. Unknown id = failing test. */
  a: (id: string, text: string) => string;
  /** Table; numbers formatted in the language, strings inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to a source (params-2026.json or program-sources.json key). */
  src: (key: string, text?: string) => string;
  ext: (url: string, text: string) => string;
  box: (title: string, html: string) => string;
  /** Mini calculator built on a calculator of tool-specs.ts. */
  mini: (kind: string, opts?: MiniOpts) => string;
  /** Formats of the page's language: amount, share, number, rate, date. */
  m: (x: number) => string; p: (x: number, d?: number) => string; n: (x: number, d?: number) => string; r: (x: number) => string; day: (iso: string) => string;
  /** English or Spanish text, by the page's language. */
  t: (en: string, es: string) => string;
}

export type Group = 'tools' | 'states';

export interface LangPage {
  /** URL segment, lowercase and hyphens, no accent. */
  slug: string;
  nav: string; card: string;
  /** 50 to 60 characters, key term first, year included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, year included. */
  description: string;
  h1: string; intro: string;
  /** ONE paragraph of 120 words or more: the direct answer, with figures (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
}
export interface GuideDef {
  id: string; group: Group; order: number;
  /** Calculator at the top: a key of tool-specs.ts. */
  tool: string;
  toolArg?: Record<string, number | string>;
  related: string[];
  /** Keys of params-2026.json > sources or program-sources.json. */
  sources: string[];
  es?: LangPage; en: LangPage;
  /** State the page describes (state pages). */
  state?: string;
}
export const defineGuide = (p: GuideDef): GuideDef => p;
