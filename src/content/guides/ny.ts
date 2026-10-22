import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const d = K.prog('ny-dpal');
const pct = d.amount.value!, mn = d.amount.min!, mx = d.amount.max!, add = d.rateAdd!, yrs = d.forgivenAfterYears!;
const ex = example({ st: 'NY', county: 'Erie County', income: 80000, price: 250000, size: 3 });
const exQ = example({ st: 'NY', county: 'Queens County', income: 120000, price: 600000, size: 3 });
const a = ex.sm.bestAmount, aQ = exQ.sm.bestAmount;
const extra = ex.sm.pAndIWith - ex.sm.pAndI, extraQ = exQ.sm.pAndIWith - exQ.sm.pAndI;
const owed5 = K.owedAtSale(a, 'linear', 5, yrs);
const lowPrice = Math.round(mn / (pct / 100)), capPrice = Math.round(mx / (pct / 100));
const erie = K.county('NY', 'Erie County'), kings = K.county('NY', 'Kings County'), alb = K.county('NY', 'Albany County');
const COUNTIES = ['Kings County', 'Queens County', 'New York County', 'Bronx County', 'Suffolk County', 'Nassau County', 'Westchester County', 'Erie County', 'Monroe County', 'Onondaga County', 'Albany County'];

export default defineGuide({
  id: 'ny', group: 'states', order: 4, state: 'NY', tool: 'dpa', toolArg: { st: 'NY', c: erie.id, i: 80000, p: 250000, h: 3 },
  related: ['forgivable', 'payment', 'programs', 'income-limits', 'nj', 'ma'],
  sources: ['agency-NY', 'prog-ny-dpal', 'hud-il', 'fha-ml'],
  en: {
    slug: 'new-york-down-payment-assistance', nav: 'New York', card: 'SONYMA DPAL: 3% of the price, up to $15,000, forgiven over 10 years',
    title: 'New York Down Payment Assistance 2026: SONYMA DPAL by County',
    description: `New York down payment assistance in 2026: the SONYMA DPAL lends ${pct}% of the price, ${E.m(mn)} to ${E.m(mx)}, forgiven over ten years, with the rate cost and 62 counties.`,
    h1: 'New York down payment assistance with SONYMA',
    intro: 'Pick your New York county, income and price: the SONYMA loan amount, the rate it adds to your mortgage, and what is left to bring.',
    resume: `New York's statewide help is the Down Payment Assistance Loan (DPAL) of the State of New York Mortgage Agency, SONYMA, part of Homes and Community Renewal. It pays the greater of ${E.m(mn)} or ${pct}% of the price, up to ${E.m(mx)}, as a 0% loan with no monthly payment that is forgiven after ${yrs} years: the amount you would repay falls by one 120th each month you live in the home. It comes only with a SONYMA first mortgage, such as Achieving the Dream or the Low Interest Rate program, for first-time buyers, with veterans and targeted areas exempt. The cost is in the rate: a first mortgage with a DPAL carries a rate ${add} point higher. In Erie County, a household of three earning ${E.m(80000)} buying at ${E.m(250000)} gets ${E.m(a)}, and pays about ${E.m(extra)} more a month for it. SONYMA's income and price limits vary by county; the calculator flags them to confirm.`,
    faqs: [
      { q: 'How much does the SONYMA DPAL really cost?', a: `Nothing in interest, but the first mortgage rate is ${add} point higher when you take it. On the Erie County example that is about ${E.m(extra)} a month, or ${E.m(extra * 12 * yrs)} over ${yrs} years, for ${E.m(a)} of help. In Queens, on a ${E.m(600000)} home, it is about ${E.m(extraQ)} a month for ${E.m(aQ)}. Compare with what you would pay to borrow that cash elsewhere.` },
      { q: 'What do I owe if I sell my New York home after five years?', a: `Half of the DPAL. The loan is forgiven in equal monthly parts over ${yrs} years, so after 60 months 60 of the 120 parts are gone. On the ${E.m(a)} Erie County example that leaves ${E.m(owed5)} to repay from the sale. After ten full years, nothing is owed.` },
      { q: 'Can I use the SONYMA DPAL with an FHA loan?', a: 'Only through SONYMA. The DPAL is a companion to SONYMA first mortgages, which include conventional and government-insured versions offered through SONYMA participating lenders. A plain FHA loan from a lender outside the program cannot carry it. Ask a participating lender which SONYMA products it offers in your county.' },
    ],
    body: (h) => `
<h2>The DPAL, as SONYMA describes it</h2>
${stateProgTable(h, 'NY')}
<p>The amount formula has a floor and a ceiling. Below a price of ${h.m(lowPrice)}, the ${h.m(mn)} floor applies; above ${h.m(capPrice)}, the ${h.m(mx)} cap does. In between it is ${pct}% of the price, which is a little less than the ${K.P.fha.minDown}% FHA minimum down payment. We could not read hcr.ny.gov directly, as it blocks scripted access; the terms come from the indexed text of its official pages.</p>
<h2>Upstate and downstate</h2>
${countyTable(h, 'NY', COUNTIES)}
<p>The five boroughs share one HUD area, with a median of ${h.m(kings.m)} and the FHA ceiling of ${h.m(kings.fha ?? 0)}. Upstate counties are a different market: Erie at ${h.m(erie.m)}, Albany at ${h.m(alb.m)}, both at the FHA floor. On a typical upstate home the DPAL covers most of the down payment; in the city it hits its cap well before that, so most buyers there still bring most of their own money.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'NY', c: kings.id, i: 120000, p: 600000, h: 3 }, t: 'Your New York county' })}
<h2>Erie County, worked through</h2>
${exampleTable(h, { st: 'NY', county: 'Erie County', income: 80000, price: 250000, size: 3 }, h.t(`Household of three, ${h.m(80000)}, ${h.m(250000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(80000)}, casa de ${h.m(250000)}, préstamo FHA, 680 puntos.`))}
<p>The monthly principal and interest goes from ${h.m(ex.sm.pAndI)} to ${h.m(ex.sm.pAndIWith)} with the rate increase. The cash for the down payment falls from ${h.m(ex.sm.down)} to ${h.m(ex.sm.cashWith)}. For a buyer who would otherwise wait two or three years to save ${h.m(a)}, the trade is usually worth it; for one who has the money, the higher rate is a cost for the life of the loan.</p>
<h2>Before you apply in New York</h2>
<p>SONYMA lends only through participating lenders, and its income and purchase price limits are set by county, with higher figures in targeted areas. Ask the lender for the limits that apply to your address and for two quotes, with and without the DPAL, so the rate difference is in writing. City and county programs in New York City, Buffalo and elsewhere can sometimes be added; the SONYMA lender knows which ones it accepts.</p>
<p>Keep the closing date and the 120-month schedule with your papers. If you plan to move within a few years, the share still owed is easy to work out: one 120th of the loan disappears for each month of occupancy, so the sooner you sell, the larger the payoff at the closing table. Renting the home out instead of living in it also ends the forgiveness, since it is tied to occupancy.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-nueva-york', nav: 'Nueva York', card: 'DPAL de SONYMA: el 3 % del precio, hasta $15,000, perdonado en 10 años',
    title: 'Ayuda para el pago inicial en Nueva York 2026: SONYMA',
    description: `Ayuda para el pago inicial en Nueva York 2026: el DPAL de SONYMA presta el ${pct} % del precio, de ${S.m(mn)} a ${S.m(mx)}, perdonado en diez años, en 62 condados.`,
    h1: 'Ayuda para el pago inicial en Nueva York con SONYMA',
    intro: 'Elija su condado de Nueva York, su ingreso y el precio: el monto del préstamo de SONYMA, lo que añade a la tasa de su hipoteca y lo que le queda por llevar.',
    resume: `La ayuda estatal de Nueva York es el Down Payment Assistance Loan (DPAL) de la State of New York Mortgage Agency, SONYMA, parte de Homes and Community Renewal. Paga la cifra mayor entre ${S.m(mn)} y el ${pct} % del precio, hasta ${S.m(mx)}, como un préstamo al 0 % sin cuota mensual que se perdona a los ${yrs} años: lo que tendría que devolver baja una ciento veinteava parte por cada mes que vive en la casa. Solo acompaña a una primera hipoteca de SONYMA, como Achieving the Dream o el programa Low Interest Rate, para compradores de primera vez, con excepción para veteranos y zonas prioritarias. El costo está en la tasa: una primera hipoteca con DPAL lleva una tasa ${S.n(add, 2)} puntos más alta. En el condado de Erie, un hogar de tres que gana ${S.m(80000)} y compra por ${S.m(250000)} recibe ${S.m(a)} y paga unos ${S.m(extra)} más al mes por ello. Los límites de ingreso y precio de SONYMA cambian por condado; la calculadora los marca para confirmar.`,
    faqs: [
      { q: '¿Cuánto cuesta en realidad el DPAL de SONYMA?', a: `Nada de interés, pero la tasa de la primera hipoteca sube ${S.n(add, 2)} puntos cuando lo toma. En el ejemplo de Erie son unos ${S.m(extra)} al mes, o ${S.m(extra * 12 * yrs)} en ${yrs} años, por ${S.m(a)} de ayuda. En Queens, con una casa de ${S.m(600000)}, son unos ${S.m(extraQ)} al mes por ${S.m(aQ)}. Compárelo con lo que pagaría por pedir prestado ese dinero en otro lado.` },
      { q: '¿Qué debo si vendo mi casa de Nueva York a los cinco años?', a: `La mitad del DPAL. El préstamo se perdona en partes mensuales iguales durante ${yrs} años, así que a los 60 meses ya desaparecieron 60 de las 120 partes. En el ejemplo de Erie, de ${S.m(a)}, quedan ${S.m(owed5)} por devolver con la venta. Pasados diez años completos, no se debe nada.` },
      { q: '¿Puedo usar el DPAL de SONYMA con un préstamo FHA?', a: 'Solo a través de SONYMA. El DPAL acompaña a las primeras hipotecas de SONYMA, que incluyen versiones convencionales y aseguradas por el gobierno ofrecidas por los prestamistas participantes. Un préstamo FHA común de un prestamista fuera del programa no puede llevarlo. Pregunte a un prestamista participante qué productos de SONYMA ofrece en su condado.' },
    ],
    body: (h) => `
<h2>El DPAL, tal como lo describe SONYMA</h2>
${stateProgTable(h, 'NY')}
<p>La fórmula del monto tiene un piso y un techo. Por debajo de un precio de ${h.m(lowPrice)} se aplica el piso de ${h.m(mn)}; por encima de ${h.m(capPrice)}, el tope de ${h.m(mx)}. Entre ambos es el ${pct} % del precio, algo menos que la entrada mínima FHA del ${K.P.fha.minDown} %. No pudimos leer hcr.ny.gov directamente, porque bloquea el acceso automatizado; las condiciones salen del texto indexado de sus páginas oficiales.</p>
<h2>El norte del estado y la ciudad</h2>
${countyTable(h, 'NY', COUNTIES)}
<p>Los cinco distritos de la ciudad comparten un área de HUD, con una mediana de ${h.m(kings.m)} y el techo FHA de ${h.m(kings.fha ?? 0)}. Los condados del norte son otro mercado: Erie con ${h.m(erie.m)}, Albany con ${h.m(alb.m)}, ambos en el piso FHA. En una casa típica del norte, el DPAL cubre la mayor parte de la entrada; en la ciudad llega a su tope mucho antes, así que la mayoría de los compradores siguen poniendo casi todo su propio dinero.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'NY', c: kings.id, i: 120000, p: 600000, h: 3 }, t: 'Su condado de Nueva York' })}
<h2>El condado de Erie, paso a paso</h2>
${exampleTable(h, { st: 'NY', county: 'Erie County', income: 80000, price: 250000, size: 3 }, h.t(`Household of three, ${h.m(80000)}, ${h.m(250000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(80000)}, casa de ${h.m(250000)}, préstamo FHA, 680 puntos.`))}
<p>La cuota mensual de capital e intereses pasa de ${h.m(ex.sm.pAndI)} a ${h.m(ex.sm.pAndIWith)} con el aumento de la tasa. El efectivo para la entrada baja de ${h.m(ex.sm.down)} a ${h.m(ex.sm.cashWith)}. Para quien de otro modo tardaría dos o tres años en ahorrar ${h.m(a)}, el cambio suele valer la pena; para quien ya tiene el dinero, la tasa más alta es un costo durante toda la vida del préstamo.</p>
<h2>Antes de solicitarla en Nueva York</h2>
<p>SONYMA presta solo a través de prestamistas participantes, y sus límites de ingreso y de precio se fijan por condado, con cifras más altas en las zonas prioritarias. Pida al prestamista los límites que aplican a su dirección y dos cotizaciones, con y sin el DPAL, para tener por escrito la diferencia de tasa. Los programas de la ciudad de Nueva York, de Buffalo y de otros condados a veces se pueden sumar; el prestamista de SONYMA sabe cuáles acepta.</p>
<p>Guarde la fecha de cierre y el calendario de 120 meses con sus documentos. Si piensa mudarse en pocos años, la parte que todavía debe es fácil de calcular: una ciento veinteava parte del préstamo desaparece por cada mes de ocupación, así que cuanto antes venda, mayor será el pago en el cierre. Alquilar la casa en vez de vivir en ella también corta el perdón, porque depende de la ocupación.</p>
`,
  },
});
