/**
 * Down payment assistance engine (pure functions, tested in tests/engine.test.ts).
 *
 *   ami(c, size, income)        income against HUD's 4-person median and the HUD 80% limit for the household size
 *   programAmount(p, ctx)       dollars a state program lends or gives for this price and loan
 *   evaluate(p, st, ctx)        likely fits / check with the agency / does not fit, with the reasons
 *   pmt(principal, rate, years) monthly principal and interest
 *   owedAtSale(...)             what a deferred, forgivable or amortizing second loan costs when you sell
 *   mcc(...)                    first-year mortgage credit certificate value (IRS Form 8396 cap)
 *
 * Program terms come from research/programs/<ST>.json (read on each agency's own page); county limits from HUD,
 * FHFA and FHA files; nothing here is typed by hand except the rules each function names.
 */
import P from '../../data/params-2026.json';

export interface County { id: string; n: string; cn?: string; a: string; m: number; l80: number[]; cll: number | null; fha: number | null; metro: number }
export interface Amount { kind: string; value?: number; values?: number[]; min?: number; max?: number; conventional?: number; government?: number; text?: string }
export interface Limit { kind?: string; value?: number; text?: string; url?: string }
export interface Program {
  id: string; name: string; form: string; amount: Amount; repayment?: string; forgivenAfterYears?: number; forgiveSchedule?: string;
  firstTimeRequired?: boolean | null; firstTimeNote?: string; minCredit?: number | null; incomeLimit?: Limit | null; priceLimit?: Limit | null;
  firstMortgage?: string[]; status: string; sourceUrl: string; sourceTitle?: string; quote?: string; note?: string; rate?: number | string; termYears?: number;
  rateAdd?: number; condition?: string; stacksWith?: string; contribution?: string; education?: boolean;
}
export interface CountyRow { i12?: number; i3?: number; price?: number; amt?: number }
export interface CountyLimits { programs: string[]; title: string; effective: string; url: string; default: CountyRow | null; rows: Record<string, CountyRow> }
export interface StateData {
  st: string; name: string; counties: County[]; agency: { agency: string; agencyUrl: string } | null;
  programs: Program[]; local: Array<{ name: string; text: string; url: string }>; countyLimits: CountyLimits | null;
}
export type LoanType = 'fha' | 'conv' | 'va' | 'usda';
export interface Ctx { county: County; size: number; income: number; price: number; firstTime: boolean; credit: number; loan: LoanType; rate: number }

/** HUD's own household-size adjustment of the 4-person median (70% for 1 person … 132% for 8). */
export const sizeFactor = (size: number) => P.hud.sizeFactors[Math.min(8, Math.max(1, Math.round(size))) - 1];
export function ami(c: County, size: number, income: number) {
  const s = Math.min(8, Math.max(1, Math.round(size)));
  const adj = c.m * sizeFactor(s);
  return { median4: c.m, medianForSize: Math.round(adj / 50) * 50, l80: c.l80[s - 1], pct: income / adj, pctOf4: income / c.m };
}

/** Minimum down payment by loan type: FHA 3.5% (credit 580+) or 10% (500-579), conventional 3%, VA and USDA 0. */
export function minDownPct(loan: LoanType, credit = 700): number {
  if (loan === 'fha') return credit >= P.fha.minScore35 ? P.fha.minDown : P.fha.minDownLowScore;
  if (loan === 'conv') return P.conventional.minDown;
  return 0;
}
export const loanAmount = (price: number, loan: LoanType, credit = 700) => Math.round(price * (1 - minDownPct(loan, credit) / 100));

export function pmt(principal: number, ratePct: number, years: number): number {
  if (principal <= 0) return 0;
  const n = years * 12, r = ratePct / 100 / 12;
  return r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
}

const isGov = (l: LoanType) => l !== 'conv';
const MORTGAGE_TYPES = new Set(['FHA', 'VA', 'USDA', 'Conventional']);
const LOAN_NAME: Record<LoanType, string> = { fha: 'FHA', conv: 'Conventional', va: 'VA', usda: 'USDA' };

/** Row of the state agency's county table that applies to this program, if we transcribed one. */
export function countyRow(st: StateData, p: Program, c: County): CountyRow | null {
  const t = st.countyLimits;
  if (!t || !t.programs.includes(p.id)) return null;
  const name = c.cn ?? c.n;
  return t.rows[name] ?? t.default ?? null;
}

export function programAmount(p: Program, st: StateData, ctx: Ctx): number | null {
  const a = p.amount, price = ctx.price, loan = loanAmount(price, ctx.loan, ctx.credit);
  const clamp = (x: number) => Math.min(a.max ?? Infinity, Math.max(a.min ?? 0, x));
  switch (a.kind) {
    case 'upToPctLoan': return Math.round(clamp((loan * (a.value ?? 0)) / 100));
    case 'upToPctPrice': return Math.round(clamp((price * (a.value ?? 0)) / 100));
    case 'choicePctLoan': return Math.round((loan * Math.max(...(a.values ?? [0]))) / 100);
    case 'pctPriceMinMax': return Math.round(Math.min(a.max ?? Infinity, Math.max(a.min ?? 0, (price * (a.value ?? 0)) / 100)));
    case 'pctPriceByLoan': return Math.round((price * ((isGov(ctx.loan) ? a.government : a.conventional) ?? 0)) / 100);
    case 'upTo': case 'fixed': return a.value ?? null;
    case 'byCounty': return countyRow(st, p, ctx.county)?.amt ?? null;
    default: return null;
  }
}

export type Verdict = 'yes' | 'check' | 'no' | 'closed';
export interface Reason { code: string; value?: number }
export interface Eval { p: Program; verdict: Verdict; amount: number | null; reasons: Reason[]; monthly: number; monthlyUnknown: boolean; incomeLimit: number | null; priceLimit: number | null }

export function evaluate(p: Program, st: StateData, ctx: Ctx): Eval {
  const reasons: Reason[] = [];
  let verdict: Verdict = 'yes';
  const no = (code: string, value?: number) => { reasons.push({ code, value }); verdict = 'no'; };
  const check = (code: string, value?: number) => { reasons.push({ code, value }); if (verdict === 'yes') verdict = 'check'; };
  const row = countyRow(st, p, ctx.county);
  // Income limit
  let incomeLimit: number | null = null;
  const il = p.incomeLimit;
  if (il?.kind === 'fixed' && il.value) incomeLimit = il.value;
  else if (il?.kind === 'countyTable' && row && (row.i12 || row.i3)) incomeLimit = (ctx.size <= 2 ? row.i12 : row.i3) ?? null;
  if (incomeLimit !== null) { if (ctx.income > incomeLimit) no('income', incomeLimit); }
  else if (il && il.kind && il.kind !== 'none') check('incomeUnknown');
  // Price limit
  let priceLimit: number | null = null;
  const pl = p.priceLimit;
  if (pl?.kind === 'fixed' && pl.value) priceLimit = pl.value;
  else if (pl?.kind === 'countyTable' && row?.price) priceLimit = row.price;
  if (priceLimit !== null) { if (ctx.price > priceLimit) no('price', priceLimit); }
  else if (pl?.kind === 'countyTable' || pl?.kind === 'areaTable') check('priceUnknown');
  // Buyer
  if (p.firstTimeRequired === true && !ctx.firstTime) no('firstTime');
  else if (p.firstTimeRequired == null && !ctx.firstTime) check('firstTimeDepends');
  if (p.minCredit && ctx.credit < p.minCredit) no('credit', p.minCredit);
  const types = (p.firstMortgage ?? []).filter((x) => MORTGAGE_TYPES.has(x));
  if (types.length && types.length === (p.firstMortgage ?? []).length && !types.includes(LOAN_NAME[ctx.loan])) no('loanType');
  if (p.condition) check('condition');
  if (p.status !== 'open') { reasons.unshift({ code: 'closed' }); verdict = 'closed'; }
  const amount = programAmount(p, st, ctx);
  if (amount === null && verdict === 'yes' && p.form !== 'mcc') check('amountUnknown');
  const known = p.rate === 'first' || typeof p.rate === 'number';
  const rate = p.rate === 'first' ? ctx.rate : typeof p.rate === 'number' ? p.rate : 0;
  const monthly = p.form === 'amortizing' && amount && known ? pmt(amount, rate, p.termYears ?? 30) : 0;
  return { p, verdict, amount, reasons, monthly, monthlyUnknown: p.form === 'amortizing' && !known, incomeLimit, priceLimit };
}

export interface Summary {
  evals: Eval[]; best: Eval | null; bestAmount: number; yes: number; check: number;
  loan: number; down: number; pAndI: number; pAndIWith: number; cashWithout: number; cashWith: number;
}
/** All programs of the state for this buyer, the largest likely help (with a program it may be stacked with),
 *  and the first-mortgage payment with and without that help. */
export function summarize(st: StateData, ctx: Ctx, closing = 0): Summary {
  const evals = st.programs.map((p) => evaluate(p, st, ctx));
  const order: Record<Verdict, number> = { yes: 0, check: 1, no: 2, closed: 3 };
  evals.sort((a, b) => order[a.verdict] - order[b.verdict] || (b.amount ?? 0) - (a.amount ?? 0));
  const pool = evals.filter((e) => e.verdict === 'yes' && e.amount);
  const pool2 = pool.length ? pool : evals.filter((e) => e.verdict === 'check' && e.amount);
  const best = pool2[0] ?? null;
  const stack = best ? evals.find((e) => e.p.stacksWith === best.p.id && e.verdict !== 'no' && e.verdict !== 'closed') : undefined;
  const bestAmount = (best?.amount ?? 0) + (stack?.amount ?? 0);
  const loan = loanAmount(ctx.price, ctx.loan, ctx.credit), down = ctx.price - loan;
  const pAndI = pmt(loan, ctx.rate, 30);
  const pAndIWith = best ? pmt(loan, ctx.rate + (best.p.rateAdd ?? 0), 30) + best.monthly : pAndI;
  const cashWithout = down + closing, cashWith = Math.max(0, cashWithout - bestAmount);
  return { evals, best, bestAmount, yes: evals.filter((e) => e.verdict === 'yes').length, check: evals.filter((e) => e.verdict === 'check').length, loan, down, pAndI, pAndIWith, cashWithout, cashWith };
}

/** What a second loan costs you when you sell or refinance after `years`. */
export type Form2 = 'deferred' | 'cliff' | 'linear' | 'amortizing' | 'grant';
export function owedAtSale(amount: number, form: Form2, years: number, term: number, ratePct = 0): number {
  if (form === 'grant') return 0;
  if (form === 'deferred') return amount;
  if (form === 'cliff') return years >= term ? 0 : amount;
  if (form === 'linear') return Math.max(0, amount * (1 - Math.min(years, term) / term));
  // amortizing: remaining balance after `years` of payments
  const n = term * 12, k = Math.min(n, Math.round(years * 12)), r = ratePct / 100 / 12;
  if (k >= n) return 0;
  if (r === 0) return amount * (1 - k / n);
  const m = pmt(amount, ratePct, term);
  return amount * Math.pow(1 + r, k) - (m * (Math.pow(1 + r, k) - 1)) / r;
}

/** Mortgage credit certificate, first year: interest paid × certificate rate, at most $2,000 when the rate is
 *  above 20% (IRS Form 8396, line 3). */
export function mcc(loan: number, ratePct: number, certPct: number) {
  const r = ratePct / 100 / 12, m = pmt(loan, ratePct, 30);
  let bal = loan, interest = 0;
  for (let i = 0; i < 12; i++) { const it = bal * r; interest += it; bal -= m - it; }
  const cp = Math.min(P.mcc.maxRate, Math.max(10, certPct));
  const raw = (interest * cp) / 100;
  const credit = cp > 20 ? Math.min(P.mcc.capAbove20, raw) : raw;
  return { interest, credit, capped: cp > 20 && raw > P.mcc.capAbove20 };
}
