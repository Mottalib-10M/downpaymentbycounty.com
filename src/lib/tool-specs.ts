/**
 * The site's calculators, in English and Spanish. Figures come from the state chunks (HUD, FHFA, FHA, state
 * agencies; src/lib/states.ts), params-2026.json and rates.json (Freddie Mac PMMS); arithmetic from
 * src/lib/engine/dpa.ts. A spec lists its fields (visible first, `adv` folded) and a pure `run` that returns the
 * result card. `needs` names the state chunk the values require: until it arrives, `run` says it is loading.
 */
import type { ToolSpec, V, Input, Opt, ToolOut } from './tool-types';
import { formatMoney, formatPercent, formatDecimal, displayDate, type Lang } from './format';
import { STATES, getState, defaultCounty, countyLabel, stateName } from './states';
import { ami, summarize, minDownPct, loanAmount, pmt, owedAtSale, mcc, type LoanType, type Eval, type Form2, type Reason } from './engine/dpa';
import P from '../data/params-2026.json';
import RATES from '../data/rates.json';

export type Args = Record<string, number | string>;
const T = (l: Lang, en: string, es: string) => (l === 'es' ? es : en);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);
const m = (x: number, l: Lang) => formatMoney(Math.round(x), 0, l);
const pc = (x: number, l: Lang, d = 0) => formatPercent(x, d, l);
const r2 = (x: number, l: Lang) => `${formatDecimal(x, 2, l)}${l === 'es' ? ' ' : ''}%`;
const tag = (l: Lang) => (l === 'es' ? 'es-US' : 'en-US');
export const RATE30 = RATES.r30;
export const RATE_DATE = RATES.date;

/* ---------- shared fields ---------- */
const stateOpts: Opt[] = STATES.map((x) => ({ value: x.st, label: x.name }));
const stateField = (l: Lang, def: string): Input => ({ kind: 'select', id: 'st', label: T(l, 'State', 'Estado'), def, options: stateOpts });
const countyField = (l: Lang, def: string): Input => ({
  kind: 'select', id: 'c', label: T(l, 'County or town', 'Condado o municipio'), def,
  options: (v: V) => (getState(s(v, 'st'))?.counties ?? []).map((c) => ({ value: c.id, label: countyLabel(c) })),
  fallback: (v: V) => defaultCounty(s(v, 'st')),
});
const incomeField = (l: Lang, def: number, adv = false): Input => ({ id: 'i', label: T(l, 'Household income, before tax', 'Ingreso del hogar, antes de impuestos'), def, unit: T(l, '$/yr', '$/año'), max: 2_000_000, help: T(l, 'Everyone 18+ who will live in the home', 'Todos los mayores de 18 que vivirán en la casa'), adv });
const sizeField = (l: Lang, def: number, adv = false): Input => ({ id: 'h', label: T(l, 'People in the household', 'Personas en el hogar'), def, max: 8, adv });
const priceField = (l: Lang, def: number, adv = false): Input => ({ id: 'p', label: T(l, 'Home price', 'Precio de la vivienda'), def, unit: '$', max: 5_000_000, adv });
const rateField = (l: Lang, adv = true): Input => ({ id: 'r', label: T(l, 'Mortgage rate', 'Tasa de la hipoteca'), def: RATE30, unit: '%', max: 20, decimals: 2, help: T(l, `Freddie Mac 30-year average, week of ${displayDate(RATE_DATE, 'en-US')}`, `Promedio a 30 años de Freddie Mac, semana del ${displayDate(RATE_DATE, 'es-US')}`), adv });
const loanField = (l: Lang, def = 'fha', adv = true): Input => ({ kind: 'choice', id: 'l', label: T(l, 'First mortgage', 'Primera hipoteca'), def, options: [{ value: 'fha', label: 'FHA' }, { value: 'conv', label: T(l, 'Conv.', 'Conv.') }, { value: 'va', label: 'VA' }, { value: 'usda', label: 'USDA' }], adv });
const loading = (l: Lang): ToolOut => ({ label: T(l, 'Loading the county figures', 'Cargando los datos del condado'), value: '…', rows: [] });

/* ---------- words ---------- */
export const VERDICT = (l: Lang): Record<Eval['verdict'], string> => ({
  yes: T(l, 'Likely fits', 'Probablemente sí'), check: T(l, 'Check with the agency', 'Confirmar con la agencia'),
  no: T(l, 'Does not fit', 'No cumple'), closed: T(l, 'Not taking applications', 'Sin solicitudes ahora'),
});
export function formName(e: { p: Eval['p'] }, l: Lang): string {
  const p = e.p, y = p.forgivenAfterYears;
  switch (p.form) {
    case 'grant': return T(l, 'Grant, never repaid', 'Subvención, no se devuelve');
    case 'forgivable': return T(l, `Forgivable loan${y ? `, ${y} years` : ''}`, `Préstamo perdonable${y ? `, ${y} años` : ''}`);
    case 'deferred': return T(l, 'Deferred loan, repaid when you sell or refinance', 'Préstamo diferido, se paga al vender o refinanciar');
    case 'amortizing': return T(l, `Monthly-payment loan${p.termYears ? `, ${p.termYears} years` : ''}${typeof p.rate === 'number' ? ` at ${p.rate}%` : ''}`, `Préstamo con cuota mensual${p.termYears ? `, ${p.termYears} años` : ''}${typeof p.rate === 'number' ? ` al ${p.rate} %` : ''}`);
    case 'shared-appreciation': return T(l, 'Shared-appreciation loan', 'Préstamo de plusvalía compartida');
    case 'mcc': return T(l, 'Federal tax credit', 'Crédito fiscal federal');
    default: return p.form;
  }
}
export function reasonText(r: Reason, l: Lang): string {
  switch (r.code) {
    case 'income': return T(l, `income above ${m(r.value!, l)}`, `ingreso mayor que ${m(r.value!, l)}`);
    case 'price': return T(l, `price above ${m(r.value!, l)}`, `precio mayor que ${m(r.value!, l)}`);
    case 'firstTime': return T(l, 'first-time buyers (3 years without owning), veterans and targeted areas', 'compradores de primera vez (3 años sin ser dueño), veteranos y zonas prioritarias');
    case 'firstTimeDepends': return T(l, 'first-time rule depends on the first mortgage', 'la regla de primera vez depende de la hipoteca');
    case 'credit': return T(l, `credit score below ${r.value}`, `puntaje de crédito menor que ${r.value}`);
    case 'loanType': return T(l, 'not offered with this type of first mortgage', 'no se ofrece con este tipo de hipoteca');
    case 'incomeUnknown': return T(l, 'county income limit not transcribed: see the agency table', 'límite de ingresos del condado no transcrito: vea la tabla de la agencia');
    case 'priceUnknown': return T(l, 'price limit by county: see the agency table', 'límite de precio por condado: vea la tabla de la agencia');
    case 'condition': return T(l, 'extra condition the calculator cannot check', 'condición adicional que la calculadora no puede verificar');
    case 'closed': return T(l, 'funds reserved or portal closed', 'fondos agotados o portal cerrado');
    case 'amountUnknown': return T(l, 'amount set by the lender', 'monto fijado por el prestamista');
    default: return r.code;
  }
}
const amountText = (e: Eval, l: Lang) => (e.amount ? m(e.amount, l) : e.p.form === 'mcc' ? T(l, 'tax credit', 'crédito fiscal') : '…');

/* ---------- calculators ---------- */
export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = {
  /** The main calculator: county, household, price → programs, amounts, payment with and without help. */
  dpa: (l, arg = {}) => {
    const st0 = String(arg.st ?? 'TX');
    return {
      needs: (v) => s(v, 'st'),
      inputs: [
        stateField(l, st0), countyField(l, String(arg.c ?? defaultCounty(st0))),
        incomeField(l, Number(arg.i ?? 85000)), priceField(l, Number(arg.p ?? 300000)),
        sizeField(l, Number(arg.h ?? 3)),
        { kind: 'choice', id: 'f', label: T(l, 'First-time buyer?', '¿Primera vivienda?'), def: String(arg.f ?? 'yes'), options: [{ value: 'yes', label: T(l, 'Yes', 'Sí') }, { value: 'no', label: 'No' }] },
        { id: 'cs', label: T(l, 'Credit score', 'Puntaje de crédito'), def: Number(arg.cs ?? 680), max: 850, adv: true },
        loanField(l, String(arg.l ?? 'fha')), rateField(l),
        { id: 'cc', label: T(l, 'Closing costs on your Loan Estimate', 'Gastos de cierre de su Loan Estimate'), def: 0, unit: '$', max: 200000, adv: true, help: T(l, 'Leave 0 if you do not have the figure yet', 'Deje 0 si aún no tiene la cifra') },
      ],
      run: (v) => {
        const st = getState(s(v, 'st'));
        const c = st?.counties.find((x) => x.id === s(v, 'c'));
        if (!st || !c) return loading(l);
        const ctx = { county: c, size: n(v, 'h') || 1, income: n(v, 'i'), price: n(v, 'p'), firstTime: s(v, 'f') === 'yes', credit: n(v, 'cs'), loan: s(v, 'l') as LoanType, rate: n(v, 'r') };
        const a = ami(c, ctx.size, ctx.income), sm = summarize(st, ctx, n(v, 'cc'));
        const V = VERDICT(l), place = countyLabel(c);
        const rows: Array<[string, string, number?]> = [
          [T(l, `Your income vs. area median for ${ctx.size} ${ctx.size > 1 ? 'people' : 'person'}`, `Su ingreso frente a la mediana de la zona, ${ctx.size} ${ctx.size > 1 ? 'personas' : 'persona'}`), pc(a.pct, l)],
          [T(l, `HUD 80% income limit, ${ctx.size} ${ctx.size > 1 ? 'people' : 'person'}`, `Límite de HUD al 80 %, ${ctx.size} ${ctx.size > 1 ? 'personas' : 'persona'}`), m(a.l80, l)],
          [T(l, `Down payment at ${formatDecimal(minDownPct(ctx.loan, ctx.credit), 1, l)}%`, `Pago inicial al ${formatDecimal(minDownPct(ctx.loan, ctx.credit), 1, l)} %`), m(sm.down, l), sm.down],
          [T(l, 'Cash still needed with the help', 'Efectivo que aún necesita con la ayuda'), m(sm.cashWith, l), sm.cashWith],
          [T(l, 'Monthly payment, no help', 'Pago mensual sin ayuda'), m(sm.pAndI, l)],
          [T(l, 'Monthly payment, with the help', 'Pago mensual con la ayuda'), m(sm.pAndIWith, l)],
          [T(l, 'FHA limit · conforming limit', 'Límite FHA · límite conforme'), `${c.fha ? m(c.fha, l) : '…'} · ${c.cll ? m(c.cll, l) : '…'}`],
        ];
        if (!st.programs.length) {
          return {
            label: T(l, `Your income vs. the ${place} median`, `Su ingreso frente a la mediana de ${place}`), value: pc(a.pct, l),
            sub: T(l, `We have not yet read the ${st.name} agency's programs: county limits below are HUD's, FHFA's and FHA's.`, `Aún no hemos leído los programas de la agencia de ${st.name}: los límites de abajo son los de HUD, FHFA y FHA.`),
            rows: rows.filter((_, i) => i !== 3 && i !== 5),
            note: T(l, `HUD FY 2026 limits (effective May 1, 2026). Payment: principal and interest over 30 years at ${r2(ctx.rate, l)}.`, `Límites de HUD del año fiscal 2026 (vigentes desde el 1 de mayo de 2026). Pago: capital e intereses a 30 años al ${r2(ctx.rate, l)}.`),
          };
        }
        const table = {
          caption: T(l, `${st.name} programs for these figures`, `Programas de ${st.name} para estas cifras`),
          headers: [T(l, 'Program', 'Programa'), T(l, 'Fit', 'Resultado'), T(l, 'Amount', 'Monto'), T(l, 'Form', 'Forma'), T(l, 'Why', 'Motivo')],
          rows: sm.evals.map((e) => [e.p.name, V[e.verdict], amountText(e, l), formName(e, l), e.reasons.map((r) => reasonText(r, l)).join('; ') || T(l, 'income, price and buyer fit', 'ingreso, precio y comprador cumplen')]),
          align: ['l', 'l', 'r', 'l', 'l'] as Array<'l' | 'r'>,
        };
        return {
          label: T(l, `Help you may get in ${place}`, `Ayuda que podría recibir en ${place}`),
          value: m(sm.bestAmount, l),
          sub: sm.best
            ? T(l, `${sm.best.p.name}: ${formName(sm.best, l).toLowerCase()}. ${sm.yes} program${sm.yes === 1 ? '' : 's'} likely fit, ${sm.check} to check.`, `${sm.best.p.name}: ${formName(sm.best, l).toLowerCase()}. ${sm.yes} programa${sm.yes === 1 ? '' : 's'} probablemente sí, ${sm.check} por confirmar.`)
            : T(l, 'No state program fits these figures: the table says why.', 'Ningún programa estatal encaja con estas cifras: la tabla dice por qué.'),
          rows, table,
          note: T(l, `Programs read on the ${st.agency?.agency ?? 'state agency'} pages; HUD FY 2026 limits; payment = principal and interest over 30 years at ${r2(ctx.rate, l)} (Freddie Mac, ${displayDate(RATE_DATE, 'en-US')}). The approved lender confirms eligibility.`, `Programas leídos en las páginas de ${st.agency?.agency ?? 'la agencia estatal'}; límites de HUD 2026; pago = capital e intereses a 30 años al ${r2(ctx.rate, l)} (Freddie Mac, ${displayDate(RATE_DATE, 'es-US')}). El prestamista aprobado confirma la elegibilidad.`),
        };
      },
    };
  },

  /** Income against the HUD area median of a county. */
  ami: (l, arg = {}) => {
    const st0 = String(arg.st ?? 'TX');
    return {
      needs: (v) => s(v, 'st'),
      inputs: [stateField(l, st0), countyField(l, String(arg.c ?? defaultCounty(st0))), incomeField(l, Number(arg.i ?? 85000)), sizeField(l, Number(arg.h ?? 3))],
      run: (v) => {
        const st = getState(s(v, 'st')), c = st?.counties.find((x) => x.id === s(v, 'c'));
        if (!st || !c) return loading(l);
        const h = Math.min(8, Math.max(1, n(v, 'h') || 1)), a = ami(c, h, n(v, 'i'));
        return {
          label: T(l, `Your income as a share of the ${countyLabel(c)} median`, `Su ingreso como porcentaje de la mediana de ${countyLabel(c)}`), value: pc(a.pct, l),
          sub: T(l, `For ${h} ${h > 1 ? 'people' : 'person'}: 100% of median = ${m(a.medianForSize, l)}.`, `Para ${h} ${h > 1 ? 'personas' : 'persona'}: 100 % de la mediana = ${m(a.medianForSize, l)}.`),
          rows: [
            [T(l, 'HUD median family income (4 people)', 'Ingreso familiar medio de HUD (4 personas)'), m(a.median4, l), a.median4],
            [T(l, `100% of median, ${h} ${h > 1 ? 'people' : 'person'}`, `100 % de la mediana, ${h} ${h > 1 ? 'personas' : 'persona'}`), m(a.medianForSize, l), a.medianForSize],
            [T(l, `HUD 80% low-income limit, ${h} ${h > 1 ? 'people' : 'person'}`, `Límite de bajos ingresos de HUD (80 %), ${h} ${h > 1 ? 'personas' : 'persona'}`), m(a.l80, l), a.l80],
            [T(l, '120% of median (common program cap)', '120 % de la mediana (tope frecuente)'), m(a.medianForSize * 1.2, l), a.medianForSize * 1.2],
            [T(l, 'HUD area', 'Área de HUD'), c.a],
          ],
          note: T(l, 'HUD FY 2026 income limits, effective May 1, 2026. Household sizes other than 4 use HUD\'s factors (70% for 1 person, 80% for 2, 90% for 3, 108% for 5…). HUD\'s own 80% limit can differ from 80% of the median where HUD caps or raises it.', 'Límites de ingresos de HUD del año fiscal 2026, vigentes desde el 1 de mayo de 2026. Para hogares de otro tamaño se usan los factores de HUD (70 % para 1 persona, 80 % para 2, 90 % para 3, 108 % para 5…). El límite del 80 % de HUD puede diferir del 80 % de la mediana cuando HUD lo topa o lo sube.'),
        };
      },
    };
  },

  /** FHA and conforming loan limits of a county. */
  limits: (l, arg = {}) => {
    const st0 = String(arg.st ?? 'CA');
    return {
      needs: (v) => s(v, 'st'),
      inputs: [stateField(l, st0), countyField(l, String(arg.c ?? defaultCounty(st0)))],
      run: (v) => {
        const st = getState(s(v, 'st')), c = st?.counties.find((x) => x.id === s(v, 'c'));
        if (!st || !c) return loading(l);
        const fha = c.fha ?? 0, cll = c.cll ?? 0;
        return {
          label: T(l, `FHA loan limit in ${countyLabel(c)}, one unit`, `Límite FHA en ${countyLabel(c)}, una vivienda`), value: fha ? m(fha, l) : '…',
          sub: fha === P.fha.floor ? T(l, 'The national FHA floor: a low-cost area.', 'El piso nacional de FHA: zona de costo bajo.') : fha >= P.fha.ceiling ? T(l, 'The national FHA ceiling: a high-cost area.', 'El techo nacional de FHA: zona de costo alto.') : T(l, 'Between the national floor and ceiling.', 'Entre el piso y el techo nacionales.'),
          rows: [
            [T(l, 'Conforming loan limit (FHFA)', 'Límite de préstamo conforme (FHFA)'), cll ? m(cll, l) : '…', cll],
            [T(l, 'FHA limit', 'Límite FHA'), fha ? m(fha, l) : '…', fha],
            [T(l, 'Highest price an FHA loan covers at 3.5% down', 'Precio máximo con FHA y 3.5 % de entrada'), m(fha / (1 - P.fha.minDown / 100), l)],
            [T(l, 'Highest price a conforming loan covers at 3% down', 'Precio máximo con préstamo conforme y 3 % de entrada'), m(cll / (1 - P.conventional.minDown / 100), l)],
            [T(l, 'National FHA floor · ceiling', 'Piso · techo nacional FHA'), `${m(P.fha.floor, l)} · ${m(P.fha.ceiling, l)}`],
          ],
          note: T(l, 'FHFA 2026 conforming limits; HUD FHA forward limits for calendar year 2026 (Mortgagee Letter 2025-23). Base loan amount, before any financed FHA premium.', 'Límites conformes 2026 de FHFA; límites FHA de HUD para 2026 (carta 2025-23). Monto base del préstamo, sin la prima de FHA financiada.'),
        };
      },
    };
  },

  /** Monthly payment and cash to close with and without a second loan. */
  payment: (l, arg = {}) => ({
    inputs: [
      priceField(l, Number(arg.p ?? 300000)),
      { id: 'a', label: T(l, 'Assistance amount', 'Monto de la ayuda'), def: Number(arg.a ?? 10000), unit: '$', max: 500000 },
      { kind: 'choice', id: 'k', label: T(l, 'How it is repaid', 'Cómo se devuelve'), def: String(arg.k ?? 'deferred'), options: [{ value: 'deferred', label: T(l, 'Deferred', 'Diferido') }, { value: 'grant', label: T(l, 'Forgiven', 'Perdón') }, { value: 'amortizing', label: T(l, 'Monthly', 'Mensual') }] },
      rateField(l, false),
      { id: 'd', label: T(l, 'Down payment', 'Pago inicial'), def: Number(arg.d ?? 3.5), unit: '%', max: 100, decimals: 1, adv: true },
      { id: 'ar', label: T(l, 'Rate of the assistance loan', 'Tasa del préstamo de ayuda'), def: Number(arg.ar ?? 0), unit: '%', max: 20, decimals: 2, adv: true },
      { id: 'at', label: T(l, 'Term of the assistance loan', 'Plazo del préstamo de ayuda'), def: Number(arg.at ?? 10), unit: T(l, 'years', 'años'), max: 40, adv: true },
    ],
    run: (v) => {
      const price = n(v, 'p'), a = n(v, 'a'), dp = n(v, 'd'), r = n(v, 'r');
      const loan = price * (1 - dp / 100), down = price - loan;
      const first = pmt(loan, r, 30), second = s(v, 'k') === 'amortizing' ? pmt(a, n(v, 'ar'), n(v, 'at') || 1) : 0;
      const bigger = pmt(Math.max(0, loan - a), r, 30);
      return {
        label: T(l, 'Monthly payment with the help', 'Pago mensual con la ayuda'), value: m(first + second, l),
        sub: T(l, `Principal and interest, 30 years at ${r2(r, l)}; taxes and insurance not included.`, `Capital e intereses, 30 años al ${r2(r, l)}; sin impuestos ni seguro.`),
        rows: [
          [T(l, 'First mortgage', 'Primera hipoteca'), m(loan, l), loan],
          [T(l, 'Monthly payment without help', 'Pago mensual sin ayuda'), m(first, l)],
          [T(l, 'Payment on the assistance loan', 'Cuota del préstamo de ayuda'), m(second, l)],
          [T(l, 'Cash for the down payment, without help', 'Efectivo para la entrada, sin ayuda'), m(down, l), down],
          [T(l, 'Cash for the down payment, with help', 'Efectivo para la entrada, con ayuda'), m(Math.max(0, down - a), l), Math.max(0, down - a)],
          [T(l, 'If the help went to a smaller loan instead', 'Si la ayuda redujera el préstamo'), m(bigger + second, l)],
        ],
        note: T(l, 'Most programs require the minimum down payment of the first mortgage and let the help cover it and closing costs; the last line shows the payment if a program let you add the help on top of your own down payment.', 'La mayoría de los programas exigen la entrada mínima de la hipoteca y dejan que la ayuda la cubra junto con los gastos de cierre; la última línea muestra el pago si un programa permitiera sumar la ayuda a su propia entrada.'),
      };
    },
  }),

  /** What a second loan costs when you sell or refinance. */
  repay: (l, arg = {}) => ({
    inputs: [
      { id: 'a', label: T(l, 'Assistance amount', 'Monto de la ayuda'), def: Number(arg.a ?? 15000), unit: '$', max: 500000 },
      { id: 'y', label: T(l, 'You sell or refinance after', 'Vende o refinancia después de'), def: Number(arg.y ?? 4), unit: T(l, 'years', 'años'), max: 40 },
      { kind: 'select', id: 'k', label: T(l, 'Type of assistance', 'Tipo de ayuda'), def: String(arg.k ?? 'cliff'), options: [
        { value: 'cliff', label: T(l, 'Forgiven all at once after the term', 'Perdonada de una vez al final del plazo') },
        { value: 'linear', label: T(l, 'Forgiven a little each year or month', 'Perdonada poco a poco cada año o mes') },
        { value: 'deferred', label: T(l, 'Deferred 0%, repaid in full', 'Diferida al 0 %, se devuelve completa') },
        { value: 'amortizing', label: T(l, 'Repaid monthly', 'Se paga cada mes') },
        { value: 'grant', label: T(l, 'Grant', 'Subvención') },
      ] },
      { id: 't', label: T(l, 'Term or forgiveness period', 'Plazo o periodo de perdón'), def: Number(arg.t ?? 5), unit: T(l, 'years', 'años'), max: 40 },
      { id: 'ar', label: T(l, 'Rate (monthly-payment loans)', 'Tasa (préstamos con cuota)'), def: Number(arg.ar ?? 0), unit: '%', max: 20, decimals: 2, adv: true },
    ],
    run: (v) => {
      const a = n(v, 'a'), y = n(v, 'y'), t = Math.max(1, n(v, 't')), k = s(v, 'k') as Form2, ar = n(v, 'ar');
      const owed = owedAtSale(a, k, y, t, ar);
      const years = Array.from({ length: Math.min(t, 15) + 1 }, (_, i) => i);
      return {
        label: T(l, `Owed if you sell after ${y} years`, `Lo que debe si vende tras ${y} años`), value: m(owed, l),
        sub: owed === 0 ? T(l, 'Nothing to repay at that point.', 'Nada que devolver en ese momento.') : T(l, `${pc(owed / (a || 1), l)} of the help is still owed.`, `Aún debe el ${pc(owed / (a || 1), l)} de la ayuda.`),
        rows: [
          [T(l, 'Assistance received', 'Ayuda recibida'), m(a, l), a],
          [T(l, 'Repaid at the sale', 'Devuelto al vender'), m(owed, l), owed],
          [T(l, 'Kept for good', 'Se queda con usted'), m(a - owed, l), a - owed],
          ...(k === 'amortizing' ? [[T(l, 'Monthly payment meanwhile', 'Cuota mensual mientras tanto'), m(pmt(a, ar, t), l)] as [string, string]] : []),
        ],
        table: { caption: T(l, 'Balance owed by year of sale', 'Saldo adeudado según el año de venta'), headers: [T(l, 'Sale after', 'Venta tras'), T(l, 'Owed', 'Debe')], rows: years.map((i) => [T(l, `${i} years`, `${i} años`), m(owedAtSale(a, k, i, t, ar), l)]), align: ['l', 'r'] },
        note: T(l, 'A refinance usually counts as a sale. Some deferred loans carry simple interest (Washington State Housing Finance Commission 1% and 3% loans): add it to the amount owed.', 'Un refinanciamiento suele contar como venta. Algunos préstamos diferidos tienen interés simple (préstamos al 1 % y 3 % de Washington): súmelo a lo adeudado.'),
      };
    },
  }),

  /** Minimum down payment by loan type. */
  down: (l, arg = {}) => ({
    inputs: [
      priceField(l, Number(arg.p ?? 350000)), loanField(l, String(arg.l ?? 'fha'), false),
      { id: 'cs', label: T(l, 'Credit score', 'Puntaje de crédito'), def: Number(arg.cs ?? 680), max: 850 },
      rateField(l),
    ],
    run: (v) => {
      const price = n(v, 'p'), lt = s(v, 'l') as LoanType, cs = n(v, 'cs');
      const pct = minDownPct(lt, cs), loan = loanAmount(price, lt, cs);
      const tooLow = lt === 'fha' && cs < P.fha.minScore;
      const all: Array<[string, LoanType]> = [['FHA', 'fha'], [T(l, 'Conventional', 'Convencional'), 'conv'], ['VA', 'va'], ['USDA', 'usda']];
      return {
        label: T(l, 'Minimum down payment', 'Pago inicial mínimo'), value: m(price - loan, l),
        sub: tooLow ? T(l, `FHA does not insure scores below ${P.fha.minScore}.`, `FHA no asegura puntajes menores que ${P.fha.minScore}.`) : T(l, `${formatDecimal(pct, 1, l)}% of the price; the loan is ${m(loan, l)}.`, `${formatDecimal(pct, 1, 'es')} % del precio; el préstamo es de ${m(loan, l)}.`),
        rows: [
          ...all.map(([name, k]) => [`${name}: ${formatDecimal(minDownPct(k, cs), 1, l)}${l === 'es' ? ' ' : ''}%`, m(price * minDownPct(k, cs) / 100, l), price * minDownPct(k, cs) / 100] as [string, string, number]),
          [T(l, 'Monthly principal and interest', 'Capital e intereses al mes'), m(pmt(loan, n(v, 'r'), 30), l)],
        ],
        note: T(l, 'FHA: 3.5% with a score of 580 or more, 10% from 500 to 579 (HUD Handbook 4000.1). Conventional: 3% with Fannie Mae and Freddie Mac low down payment loans. VA and USDA: no minimum down payment. Closing costs come on top.', 'FHA: 3.5 % con puntaje de 580 o más, 10 % de 500 a 579 (manual 4000.1 de HUD). Convencional: 3 % con los préstamos de entrada baja de Fannie Mae y Freddie Mac. VA y USDA: sin entrada mínima. Los gastos de cierre van aparte.'),
      };
    },
  }),

  /** Credit score → FHA minimum down payment and the state programs whose published floor the score reaches. */
  credit: (l, arg = {}) => {
    const st0 = String(arg.st ?? 'TX');
    return {
      needs: (v) => s(v, 'st'),
      inputs: [
        { id: 'cs', label: T(l, 'Credit score', 'Puntaje de crédito'), def: Number(arg.cs ?? 600), max: 850 },
        stateField(l, st0),
        priceField(l, Number(arg.p ?? 280000)),
      ],
      run: (v) => {
        const st = getState(s(v, 'st'));
        if (!st) return loading(l);
        const cs = n(v, 'cs'), price = n(v, 'p');
        const insured = cs >= P.fha.minScore;
        const pct = minDownPct('fha', cs), down = price * pct / 100;
        const at580 = price * P.fha.minDown / 100;
        const progs = st.programs.filter((p) => p.form !== 'mcc');
        const floors = progs.filter((p) => p.minCredit);
        const reached = floors.filter((p) => cs >= (p.minCredit ?? 0));
        const next = floors.filter((p) => cs < (p.minCredit ?? 0)).map((p) => p.minCredit ?? 0).sort((a, b) => a - b)[0];
        const open = progs.filter((p) => p.status === 'open');
        const rows: Array<[string, string, number?]> = [
          [T(l, 'FHA minimum down payment', 'Pago inicial mínimo de FHA'), insured ? `${formatDecimal(pct, 1, l)}${l === 'es' ? ' ' : ''}%` : T(l, 'not insured', 'no asegurado')],
          [T(l, `Down payment at ${P.fha.minScore35} or more`, `Pago inicial con ${P.fha.minScore35} o más`), m(at580, l), at580],
          [T(l, `${st.name} programs whose floor you reach`, `Programas de ${st.name} cuyo mínimo alcanza`), `${reached.length} / ${floors.length}`],
          [T(l, 'Points to the next state floor', 'Puntos hasta el siguiente mínimo estatal'), next ? String(next - cs) : T(l, 'none left', 'ninguno')],
          [T(l, 'Programs with no published floor (lender decides)', 'Programas sin mínimo publicado (decide el prestamista)'), String(progs.length - floors.length)],
        ];
        const word = (p: (typeof progs)[number]) => p.status !== 'open' ? T(l, 'not taking applications', 'sin solicitudes ahora') : !p.minCredit ? T(l, 'no floor published: lender decides', 'sin mínimo publicado: decide el prestamista') : cs >= p.minCredit ? T(l, 'your score reaches the floor', 'su puntaje alcanza el mínimo') : T(l, `${p.minCredit - cs} points short`, `faltan ${p.minCredit - cs} puntos`);
        return {
          label: insured ? T(l, `FHA down payment with a ${cs} score`, `Pago inicial FHA con ${cs} puntos`) : T(l, 'FHA down payment', 'Pago inicial FHA'),
          value: insured ? m(down, l) : '…',
          sub: !insured
            ? T(l, `FHA does not insure scores below ${P.fha.minScore}, and no state program we read starts that low.`, `FHA no asegura puntajes menores que ${P.fha.minScore}, y ningún programa estatal leído empieza tan bajo.`)
            : !progs.length
              ? T(l, `We have not yet read the ${st.name} agency's programs: only the FHA rule applies here.`, `Aún no hemos leído los programas de la agencia de ${st.name}: aquí solo vale la regla de FHA.`)
              : T(l, `${reached.length} of the ${floors.length} ${st.name} programs with a published floor accept ${cs}; ${open.length} of ${progs.length} programs are open.`, `${reached.length} de los ${floors.length} programas de ${st.name} con mínimo publicado aceptan ${cs}; ${open.length} de ${progs.length} programas están abiertos.`),
          rows,
          ...(progs.length ? { table: {
            caption: T(l, `${st.name} programs and your score`, `Programas de ${st.name} y su puntaje`),
            headers: [T(l, 'Program', 'Programa'), T(l, 'Published floor', 'Mínimo publicado'), T(l, 'For you', 'Para usted')],
            rows: progs.map((p) => [p.name, p.minCredit ? String(p.minCredit) : T(l, 'lender', 'prestamista'), word(p)]),
            align: ['l', 'r', 'l'] as Array<'l' | 'r'>,
          } } : {}),
          note: T(l, `FHA: ${P.fha.minDown}% down from a ${P.fha.minScore35} score, ${P.fha.minDownLowScore}% from ${P.fha.minScore} to ${P.fha.minScore35 - 1} (HUD Handbook 4000.1). State floors as published by each agency; the approved lender can ask a higher score.`, `FHA: ${P.fha.minDown} % de entrada desde ${P.fha.minScore35} puntos, ${P.fha.minDownLowScore} % de ${P.fha.minScore} a ${P.fha.minScore35 - 1} (manual 4000.1 de HUD). Mínimos estatales tal como los publica cada agencia; el prestamista aprobado puede pedir más.`),
        };
      },
    };
  },

  /** Mortgage credit certificate, first year. */
  mcc: (l, arg = {}) => ({
    inputs: [
      { id: 'b', label: T(l, 'Mortgage amount', 'Monto de la hipoteca'), def: Number(arg.b ?? 280000), unit: '$', max: 3_000_000 },
      { id: 'q', label: T(l, 'Certificate credit rate', 'Tasa del certificado'), def: Number(arg.q ?? 20), unit: '%', max: 50, help: T(l, 'Set by your state agency, from 10% to 50%', 'La fija su agencia estatal, de 10 % a 50 %') },
      rateField(l, false),
    ],
    run: (v) => {
      const r = mcc(n(v, 'b'), n(v, 'r'), n(v, 'q'));
      return {
        label: T(l, 'Mortgage interest credit, first year', 'Crédito por intereses, primer año'), value: m(r.credit, l),
        sub: r.capped ? T(l, 'Capped at $2,000 because the certificate rate is above 20%.', 'Limitado a $2,000 porque la tasa del certificado pasa del 20 %.') : T(l, `About ${m(r.credit / 12, l)} a month, taken on your federal tax return.`, `Unos ${m(r.credit / 12, l)} al mes, en su declaración federal.`),
        rows: [
          [T(l, 'Interest paid in year one', 'Intereses pagados el primer año'), m(r.interest, l), r.interest],
          [T(l, 'Credit before the cap', 'Crédito antes del tope'), m(r.interest * Math.min(50, Math.max(10, n(v, 'q'))) / 100, l)],
          [T(l, 'Credit you claim', 'Crédito que reclama'), m(r.credit, l), r.credit],
        ],
        note: T(l, 'IRS Form 8396: the certificate rate is 10% to 50%; above 20% the credit cannot exceed $2,000 a year. The credit cannot exceed your tax; unused credit carries forward 3 years. Interest left after the credit stays deductible if you itemize.', 'Formulario 8396 del IRS: la tasa del certificado va de 10 % a 50 %; por encima del 20 % el crédito no pasa de $2,000 al año. El crédito no puede superar su impuesto; lo no usado se arrastra 3 años. El interés restante sigue deducible si detalla deducciones.'),
      };
    },
  }),
};

export const TOOL_KINDS = Object.keys(SPECS);
export const getTool = (kind: string, l: Lang, arg?: Args): ToolSpec => (SPECS[kind] ?? SPECS.dpa)(l, arg);
/** Run a calculator on given values (pages quote its result with the same arithmetic). */
export function runTool(kind: string, l: Lang, values: Args = {}): ToolOut {
  const spec = getTool(kind, l, values);
  const v: V = Object.fromEntries(spec.inputs.map((i) => [i.id, values[i.id] ?? i.def]));
  return spec.run(v);
}
export { tag as langTag };
