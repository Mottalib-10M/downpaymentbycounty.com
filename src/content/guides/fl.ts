import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const hth = K.prog('fl-hth'), fa = K.prog('fl-assist'), plus = K.prog('fl-hfa-plus');
const hthMin = hth.amount.min!, hthMax = hth.amount.max!, hthPct = hth.amount.value!;
const faMax = fa.amount.value!;
const ev = (x: ReturnType<typeof example>, id: string) => x.sm.evals.find((e) => e.p.id === id)!;
const ex = example({ st: 'FL', county: 'Orange County', income: 85000, price: 360000, size: 3 });
const exC = example({ st: 'FL', county: 'Hillsborough County', income: 80000, price: 340000, size: 3, loan: 'conv' });
const plusC = ev(exC, 'fl-hfa-plus').amount ?? 0;
const plusLeft4 = K.owedAtSale(plusC, 'linear', 4, plus.forgivenAfterYears!);
const mia = K.county('FL', 'Miami-Dade County'), orange = K.county('FL', 'Orange County'), duval = K.county('FL', 'Duval County');
const COUNTIES = ['Miami-Dade County', 'Broward County', 'Palm Beach County', 'Hillsborough County', 'Orange County', 'Duval County', 'Pinellas County', 'Lee County', 'Polk County', 'Brevard County'];

export default defineGuide({
  id: 'fl', group: 'states', order: 3, state: 'FL', tool: 'dpa', toolArg: { st: 'FL', c: orange.id, i: 85000, p: 360000, h: 3 },
  related: ['programs', 'forgivable', 'first-time', 'loan-limits', 'ga', 'tx'],
  sources: ['agency-FL', 'prog-fl-hth', 'prog-fl-assist', 'prog-fl-hfa-plus', 'hud-il', 'fha-ml'],
  en: {
    slug: 'florida-down-payment-assistance', nav: 'Florida', card: 'Hometown Heroes, FL Assist and the HFA PLUS second, county by county',
    title: 'Florida Down Payment Assistance 2026: Three State Loans',
    description: `Florida down payment assistance in 2026: Hometown Heroes up to ${E.m(hthMax)}, FL Assist up to ${E.m(faMax)} and HFA PLUS 3% to 5%, with the status of each in 67 counties.`,
    h1: 'Florida down payment assistance, from Miami to Jacksonville',
    intro: 'Choose your Florida county, income, price and loan type: which Florida Housing second mortgage fits, how much, and what you still bring.',
    resume: `Florida Housing Finance Corporation offers three kinds of help, each tied to its own first mortgages. Hometown Heroes lends ${hthPct}% of the first mortgage, at least ${E.m(hthMin)} and at most ${E.m(hthMax)}, as a 0% deferred second that is never forgiven, to full-time workers of Florida employers in listed occupations such as health care, schools, public safety and child care. Its 2025-2026 money was fully committed in February 2026; Florida Housing has since posted a 2026 lender guide, without saying how much remains, so the calculator marks it to confirm. FL Assist lends up to ${E.m(faMax)}, also deferred at 0% and repaid on sale or refinance. The HFA PLUS second gives 3%, 4% or 5% of a conventional loan, forgiven 20% a year over five years. In Orange County a household of three earning ${E.m(85000)} buying at ${E.m(360000)} with FHA could get ${E.m(ev(ex, 'fl-assist').amount ?? 0)} from FL Assist, against a ${E.m(ex.sm.down)} minimum down payment.`,
    faqs: [
      { q: 'Who qualifies as a Florida Hometown Hero?', a: 'A full-time worker of a Florida-based employer in one of the occupations listed by Florida Housing: health care, school staff, first responders, public safety, courts and child care among them. The buyer must also meet the program income limit for the county and use a participating lender. The calculator cannot verify the job, so it flags the program to confirm.' },
      { q: 'Is Florida Assist forgiven after a few years?', a: `No. FL Assist is a deferred loan at 0% that you repay in full when you sell, refinance, transfer the home or pay off the first mortgage. Nothing is due monthly and the ${E.m(faMax)} does not grow, but it never shrinks either. The HFA PLUS second is the Florida loan that is forgiven, at 20% a year.` },
      { q: 'Why does the HFA PLUS loan not show with an FHA mortgage in Florida?', a: 'Because Florida Housing offers it only with its conventional first mortgages, HFA Preferred and HFA Advantage. With an FHA, VA or USDA loan the calculator marks it as not a fit. Switch the loan type to conventional and it appears, usually as the largest amount, since it is a share of the whole loan.' },
    ],
    body: (h) => `
<h2>The three Florida Housing seconds</h2>
${stateProgTable(h, 'FL')}
<p>The choice of first mortgage decides which help you can draw. With FHA, VA or USDA, FL Assist is the general option and Hometown Heroes the larger one for eligible workers. With a conventional loan the HFA PLUS second opens, and on a ${h.m(340000)} home in Hillsborough County at 5% it reaches ${h.m(plusC)}, more than FL Assist's cap. Florida Housing publishes income and price limits by county for all of these, which we link without transcribing them.</p>
<h2>The status of Hometown Heroes</h2>
<p>Hometown Heroes is funded one year at a time and closes when the year's money is committed. Florida Housing said in February 2026 that it had committed all of the 2025-2026 funding. A 2026 lender guide has since appeared on its site, with income limits effective for reservations from ${h.day('2026-05-06')}, but no notice of the remaining balance. That is why the calculator keeps the program visible and marks it "Check with the agency": only a participating lender can tell you, on the day, whether a reservation is still possible.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'FL', c: mia.id, i: 90000, p: 450000, h: 3 }, t: 'Your Florida county' })}
<h2>Orange County with an FHA loan</h2>
${exampleTable(h, { st: 'FL', county: 'Orange County', income: 85000, price: 360000, size: 3 }, h.t(`Household of three, ${h.m(85000)}, ${h.m(360000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(85000)}, casa de ${h.m(360000)}, préstamo FHA, 680 puntos.`))}
<p>FL Assist covers ${h.m(ev(ex, 'fl-assist').amount ?? 0)} of the ${h.m(ex.sm.down)} minimum, leaving ${h.m(ex.sm.down - (ev(ex, 'fl-assist').amount ?? 0))} plus closing costs. If the buyer is a nurse or a teacher, Hometown Heroes would be ${h.m(ev(ex, 'fl-hth').amount ?? 0)} instead, enough for both. With the conventional HFA PLUS second, four years after closing ${h.m(plusLeft4)} of the Hillsborough example would still be owed on a sale; after five, nothing.</p>
<h2>County figures</h2>
${countyTable(h, 'FL', COUNTIES)}
<p>The South Florida counties share a higher FHA limit, ${h.m(mia.fha ?? 0)} in Miami-Dade, while Orlando and Tampa sit at the floor and Jacksonville at ${h.m(duval.fha ?? 0)}. HUD's median in Miami-Dade, ${h.m(mia.m)}, is lower than in Orange County at ${h.m(orange.m)}, though prices are higher: the income limit there binds sooner than the price limit.</p>
<h2>Applying in Florida</h2>
<p>All three are reserved by a Florida Housing participating lender with the first mortgage, after a homebuyer course. Ask the lender to quote both an FHA file with FL Assist and a conventional file with HFA PLUS: the larger second does not always give the lower total cost once the rate and mortgage insurance are counted.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-florida', nav: 'Florida', card: 'Hometown Heroes, FL Assist y la segunda HFA PLUS, condado por condado',
    title: 'Ayuda para el pago inicial en Florida 2026: Hometown Heroes',
    description: `Ayuda para el pago inicial en Florida 2026: Hometown Heroes hasta ${S.m(hthMax)}, FL Assist hasta ${S.m(faMax)} y HFA PLUS del 3 % al 5 %, en los 67 condados del estado.`,
    h1: 'Ayuda para el pago inicial en Florida, de Miami a Jacksonville',
    intro: 'Elija su condado de Florida, su ingreso, el precio y el tipo de préstamo: qué segunda hipoteca de Florida Housing le corresponde, cuánto y qué le queda por pagar.',
    resume: `Florida Housing Finance Corporation ofrece tres tipos de ayuda, cada uno ligado a sus propias primeras hipotecas. Hometown Heroes presta el ${hthPct} % de la primera hipoteca, como mínimo ${S.m(hthMin)} y como máximo ${S.m(hthMax)}, en una segunda hipoteca diferida al 0 % que nunca se perdona, a trabajadores a tiempo completo de empleadores de Florida en ocupaciones de una lista: salud, escuelas, seguridad pública y cuidado infantil, entre otras. Su dinero de 2025-2026 quedó comprometido en febrero de 2026; desde entonces Florida Housing publicó una guía de 2026 para prestamistas sin decir cuánto queda, así que la calculadora lo marca para confirmar. FL Assist presta hasta ${S.m(faMax)}, también diferido al 0 % y devuelto al vender o refinanciar. La segunda HFA PLUS da el 3 %, 4 % o 5 % de un préstamo convencional, perdonado un 20 % por año durante cinco años. En el condado de Orange, un hogar de tres que gana ${S.m(85000)} y compra por ${S.m(360000)} con FHA podría recibir ${S.m(ev(ex, 'fl-assist').amount ?? 0)} de FL Assist, frente a una entrada mínima de ${S.m(ex.sm.down)}.`,
    faqs: [
      { q: '¿Quién califica como Hometown Hero en Florida?', a: 'Un trabajador a tiempo completo de un empleador con sede en Florida en una de las ocupaciones de la lista de Florida Housing: salud, personal escolar, primeros auxilios, seguridad pública, tribunales y cuidado infantil, entre otras. También debe cumplir el límite de ingresos del programa en su condado y usar un prestamista participante. La calculadora no puede verificar el empleo y lo marca para confirmar.' },
      { q: '¿Florida Assist se perdona después de unos años?', a: `No. FL Assist es un préstamo diferido al 0 % que se devuelve completo al vender, refinanciar, transferir la casa o liquidar la primera hipoteca. No hay cuota mensual y los ${S.m(faMax)} no crecen, pero tampoco bajan. La segunda HFA PLUS es el préstamo de Florida que sí se perdona, a razón de un 20 % por año.` },
      { q: '¿Por qué el préstamo HFA PLUS no aparece con una hipoteca FHA en Florida?', a: 'Porque Florida Housing solo lo ofrece con sus primeras hipotecas convencionales, HFA Preferred y HFA Advantage. Con un préstamo FHA, VA o USDA la calculadora lo marca como no aplicable. Cambie el tipo de préstamo a convencional y aparece, casi siempre como el monto mayor, porque es un porcentaje de todo el préstamo.' },
    ],
    body: (h) => `
<h2>Las tres segundas hipotecas de Florida Housing</h2>
${stateProgTable(h, 'FL')}
<p>La primera hipoteca decide qué ayuda puede usar. Con FHA, VA o USDA, FL Assist es la opción general y Hometown Heroes la mayor para los trabajadores que califican. Con un préstamo convencional se abre la segunda HFA PLUS, que en una casa de ${h.m(340000)} en el condado de Hillsborough al 5 % llega a ${h.m(plusC)}, más que el tope de FL Assist. Florida Housing publica límites de ingreso y de precio por condado para todas ellas, que enlazamos sin transcribirlos.</p>
<h2>El estado de Hometown Heroes</h2>
<p>Hometown Heroes se financia año por año y se cierra cuando el dinero del año queda comprometido. Florida Housing dijo en febrero de 2026 que había comprometido todos los fondos de 2025-2026. Desde entonces apareció en su sitio una guía de 2026 para prestamistas, con límites de ingreso vigentes para reservas desde el ${h.day('2026-05-06')}, pero ningún aviso sobre el saldo restante. Por eso la calculadora mantiene el programa a la vista y lo marca "Confirmar con la agencia": solo un prestamista participante puede decirle, ese día, si todavía es posible reservar.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'FL', c: mia.id, i: 90000, p: 450000, h: 3 }, t: 'Su condado de Florida' })}
<h2>El condado de Orange con un préstamo FHA</h2>
${exampleTable(h, { st: 'FL', county: 'Orange County', income: 85000, price: 360000, size: 3 }, h.t(`Household of three, ${h.m(85000)}, ${h.m(360000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(85000)}, casa de ${h.m(360000)}, préstamo FHA, 680 puntos.`))}
<p>FL Assist cubre ${h.m(ev(ex, 'fl-assist').amount ?? 0)} de la entrada mínima de ${h.m(ex.sm.down)} y deja ${h.m(ex.sm.down - (ev(ex, 'fl-assist').amount ?? 0))} más los gastos de cierre. Si quien compra es enfermera o maestro, Hometown Heroes sería de ${h.m(ev(ex, 'fl-hth').amount ?? 0)}, suficiente para ambos. Con la segunda HFA PLUS convencional, cuatro años después del cierre todavía se deberían ${h.m(plusLeft4)} del ejemplo de Hillsborough en caso de venta; a los cinco, nada.</p>
<h2>Cifras por condado</h2>
${countyTable(h, 'FL', COUNTIES)}
<p>Los condados del sur de Florida comparten un límite FHA más alto, ${h.m(mia.fha ?? 0)} en Miami-Dade, mientras que Orlando y Tampa están en el piso y Jacksonville en ${h.m(duval.fha ?? 0)}. La mediana de HUD en Miami-Dade, ${h.m(mia.m)}, es menor que en el condado de Orange, con ${h.m(orange.m)}, aunque los precios son más altos: allí el límite de ingresos aprieta antes que el de precio.</p>
<h2>Cómo solicitarla en Florida</h2>
<p>Las tres se reservan con un prestamista participante de Florida Housing junto con la primera hipoteca, después de un curso para compradores. Pida al prestamista una cotización FHA con FL Assist y otra convencional con HFA PLUS: la segunda más grande no siempre da el costo total más bajo una vez contados la tasa y el seguro hipotecario.</p>
`,
  },
});
