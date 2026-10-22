/**
 * Shared pieces of the content files (CONTRIBUTING-PAGES.md). Everything common to several pages is rendered as a
 * TABLE, which the uniqueness check sets apart; the prose of each page is written for that page.
 *   progTable(h, states)     every program of these states: amount, form, income limit, credit floor, status
 *   countyTable(h, st, ids)  HUD median, 80% limit for 3 people, FHA and conforming limits of chosen counties
 *   stateProgTable(h, st)    one state's programs with the quote from the agency's page
 *   example(st, county, …)   the main calculator on a worked example (same arithmetic as the page's calculator)
 */
import type { Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { formName, VERDICT, reasonText } from '../../lib/tool-specs';
import type { LoanType, Program } from '../../lib/engine/dpa';

const T = (h: Helpers, en: string, es: string) => (h.lang === 'es' ? es : en);
const statusText = (h: Helpers, p: Program) => (p.status === 'open' ? T(h, 'open', 'abierto') : T(h, 'not taking applications', 'sin solicitudes ahora'));
export function limitText(h: Helpers, p: Program): string {
  const il = p.incomeLimit;
  if (!il || !il.kind || il.kind === 'none') return T(h, 'none stated', 'no indicado');
  if (il.kind === 'fixed' && il.value) return h.m(il.value);
  return T(h, 'by county', 'por condado');
}

export function progTable(h: Helpers, states: string[], caption?: string): string {
  const rows = states.flatMap((st) => K.state(st).programs.map((p) => [
    K.stateName(st), `${h.ext(p.sourceUrl, p.name)}`, p.amount.text ?? (p.amount.value ? h.m(p.amount.value) : ''), formName({ p }, h.lang), limitText(h, p), p.minCredit ? String(p.minCredit) : T(h, 'per lender', 'según prestamista'), statusText(h, p),
  ]));
  return h.table([T(h, 'State', 'Estado'), T(h, 'Program', 'Programa'), T(h, 'Amount (agency wording)', 'Monto (texto de la agencia)'), T(h, 'Form', 'Forma'), T(h, 'Income limit', 'Límite de ingresos'), T(h, 'Min. credit', 'Crédito mín.'), T(h, 'Status', 'Estado actual')], rows,
    caption ?? T(h, `Terms read on each agency's pages, ${h.day(K.P.retrieved_at)}.`, `Condiciones leídas en las páginas de cada agencia, ${h.day(K.P.retrieved_at)}.`), ['l', 'l', 'l', 'l', 'r', 'r', 'l']);
}

export function countyTable(h: Helpers, st: string, names: string[], size = 3): string {
  const rows = names.map((n) => { const c = K.county(st, n); return [K.countyLabel(c), h.m(c.m), h.m(c.l80[size - 1]), c.fha ? h.m(c.fha) : '', c.cll ? h.m(c.cll) : '']; });
  return h.table([T(h, 'County', 'Condado'), T(h, 'HUD median (4 people)', 'Mediana de HUD (4 personas)'), T(h, `HUD 80% limit (${size} people)`, `Límite 80 % de HUD (${size} personas)`), T(h, 'FHA limit', 'Límite FHA'), T(h, 'Conforming limit', 'Límite conforme')], rows,
    T(h, `${K.stateName(st)}: HUD fiscal year 2026 (effective ${h.day(K.P.hud.effective)}), FHA and FHFA 2026 one-unit limits.`, `${K.stateName(st)}: HUD año fiscal 2026 (vigente desde el ${h.day(K.P.hud.effective)}), límites FHA y FHFA 2026 para una vivienda.`), ['l', 'r', 'r', 'r', 'r']);
}

/** One state's programs, each with its form, its repayment rule and the agency's own words. */
export function stateProgTable(h: Helpers, st: string): string {
  const rows = K.state(st).programs.map((p) => [h.ext(p.sourceUrl, p.name), p.amount.text ?? '', p.repayment ?? '', p.firstTimeRequired === true ? T(h, 'yes', 'sí') : p.firstTimeRequired === false ? 'no' : T(h, 'depends', 'depende'), p.minCredit ? String(p.minCredit) : '', statusText(h, p)]);
  return h.table([T(h, 'Program', 'Programa'), T(h, 'Amount', 'Monto'), T(h, 'Repayment (agency wording)', 'Devolución (texto de la agencia)'), T(h, 'First-time only', 'Solo primera vivienda'), T(h, 'Min. credit', 'Crédito mín.'), T(h, 'Status', 'Estado actual')], rows,
    T(h, `${K.state(st).agency?.agency}, terms read on ${h.day(K.P.retrieved_at)}. Quotes stay in English, as the agency wrote them.`, `${K.state(st).agency?.agency}, condiciones leídas el ${h.day(K.P.retrieved_at)}. Las citas quedan en inglés, como las escribió la agencia.`), ['l', 'l', 'l', 'l', 'r', 'l']);
}

export interface Example { st: string; county: string; size?: number; income: number; price: number; firstTime?: boolean; credit?: number; loan?: LoanType }
export function example(e: Example) {
  const c = K.county(e.st, e.county);
  const ctx = { county: c, size: e.size ?? 3, income: e.income, price: e.price, firstTime: e.firstTime ?? true, credit: e.credit ?? 680, loan: e.loan ?? 'fha', rate: K.RATES.r30 };
  return { c, ctx, sm: K.summarize(K.state(e.st), ctx), ami: K.ami(c, ctx.size, ctx.income) };
}
/** Programs of an example as table rows: name, verdict, amount, why. */
export function exampleTable(h: Helpers, e: Example, caption: string): string {
  const { sm } = example(e), V = VERDICT(h.lang);
  return h.table([T(h, 'Program', 'Programa'), T(h, 'Result', 'Resultado'), T(h, 'Amount', 'Monto'), T(h, 'Why', 'Motivo')],
    sm.evals.map((x) => [x.p.name, V[x.verdict], x.amount ? h.m(x.amount) : '', x.reasons.map((r) => reasonText(r, h.lang)).join('; ')]), caption, ['l', 'l', 'r', 'l']);
}
export const STATES_READ = K.STATES.filter((s) => s.programs > 0).map((s) => s.st);

/** The agency's own county table (TX, OH, NJ): income limits for 1-2 and 3+ people, price limit, amount. */
export function agencyLimitsTable(h: Helpers, st: string, names: string[]): string {
  const cl = K.state(st).countyLimits;
  if (!cl) return '';
  const hasAmt = names.some((n) => cl.rows[n]?.amt);
  const rows = names.map((n) => { const r = cl.rows[n] ?? cl.default ?? {}; return [n, r.i12 ? h.m(r.i12) : '', r.i3 ? h.m(r.i3) : '', r.price ? h.m(r.price) : '', ...(hasAmt ? [r.amt ? h.m(r.amt) : ''] : [])]; });
  return h.table([T(h, 'County', 'Condado'), T(h, 'Income limit, 1-2 people', 'Límite de ingresos, 1-2 personas'), T(h, 'Income limit, 3+ people', 'Límite de ingresos, 3 o más'), T(h, 'Price limit', 'Tope de precio'), ...(hasAmt ? [T(h, 'Assistance', 'Ayuda')] : [])], rows,
    T(h, `${cl.title}, effective ${h.day(cl.effective)}.`, `${cl.title}, vigente desde el ${h.day(cl.effective)}.`), ['l', 'r', 'r', 'r', 'r']);
}
