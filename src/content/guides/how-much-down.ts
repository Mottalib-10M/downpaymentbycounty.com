import { defineGuide } from '../../lib/page-types';
import type { Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.en, S = K.es, F = K.P.fha, C = K.P.conventional;
const PRICES = [200000, 300000, 400000, 500000, 650000];
const r30 = K.RATES.r30;
const d = (p: number, l: 'fha' | 'conv' | 'va', cs = 680) => p - K.loanAmount(p, l, cs);
const fhaMaxPrice = F.ceiling / (1 - F.minDown / 100);

function table(h: Helpers) {
  const rows = PRICES.map((p) => [h.m(p), h.m(d(p, 'fha')), h.m(d(p, 'fha', 560)), h.m(d(p, 'conv')), h.m(p * 0.2), h.m(K.pmt(K.loanAmount(p, 'fha'), r30, 30))]);
  return h.table([h.t('Home price', 'Precio'), h.t('FHA, score 580+', 'FHA, 580 o más'), h.t('FHA, score 500 to 579', 'FHA, 500 a 579'), h.t('Conventional 3%', 'Convencional 3 %'), h.t('20% (no mortgage insurance)', '20 % (sin seguro hipotecario)'), h.t('FHA principal and interest', 'Capital e intereses FHA')], rows,
    h.t(`Minimums set by HUD (Handbook 4000.1) and by Fannie Mae and Freddie Mac; payment at ${h.r(r30)}, Freddie Mac average of ${h.day(K.RATES.date)}.`, `Mínimos fijados por HUD (manual 4000.1) y por Fannie Mae y Freddie Mac; pago al ${h.r(r30)}, promedio de Freddie Mac del ${h.day(K.RATES.date)}.`), ['r', 'r', 'r', 'r', 'r', 'r']);
}

export default defineGuide({
  id: 'how-much-down', group: 'tools', order: 6, tool: 'down', toolArg: { p: 300000, l: 'fha', cs: 680 },
  related: ['payment', 'loan-limits', 'requirements', 'programs', 'grants', 'ca'],
  sources: ['fha-handbook', 'freddie-3', 'va-purchase', 'usda-3555', 'pmms', 'fha-ml'],
  en: {
    slug: 'how-much-down-payment-for-a-house', nav: 'How much down payment', card: 'The minimum by loan type, FHA, conventional, VA and USDA, in dollars',
    title: 'First-Time Home Buyer Down Payment 2026: How Much You Need',
    description: 'How much down payment for a house in 2026: 3.5% with FHA, 3% conventional, zero with VA or USDA, in dollars for your price, and what state assistance covers.',
    h1: 'How much down payment you need for a house',
    intro: 'Enter the price, the loan type and your credit score: the minimum down payment in dollars, for all four loan types, and the monthly payment.',
    resume: `The minimum down payment depends on the loan, not on a rule of 20%. An FHA loan asks for ${F.minDown}% of the price with a credit score of ${F.minScore35} or more and ${F.minDownLowScore}% from ${F.minScore} to ${F.minScore35 - 1}. A conventional loan through Fannie Mae or Freddie Mac low down payment programs asks for ${C.minDown}%. VA loans for eligible veterans and service members and USDA loans in eligible rural areas ask for nothing. On a ${E.m(300000)} home that is ${E.m(d(300000, 'fha'))} with FHA, ${E.m(d(300000, 'conv'))} conventional, against ${E.m(60000)} for 20%. Putting less than 20% down means mortgage insurance, but waiting years to save 20% often costs more than the insurance. State down payment assistance is sized to cover exactly these minimums: most programs pay 3% to 5% of the price or the loan, enough to bring an FHA or 3% buyer close to zero out of pocket.`,
    faqs: [
      { q: 'Is 20% down still necessary to buy a house?', a: 'No. Twenty percent is the level at which a conventional loan carries no private mortgage insurance, not a minimum. Most first-time buyers put down far less, using FHA at 3.5% or a conventional loan at 3%. The cost of putting less down is the monthly mortgage insurance, which the calculator does not include.' },
      { q: 'Can down payment assistance cover the whole down payment?', a: `Often, yes. Programs paying 3.5% to 5% of the price cover the FHA minimum entirely; Illinois Access Home pays 6% up to ${E.m(15000)}. The agency still usually asks a small contribution of your own, and closing costs come on top. The main calculator shows the cash left to bring.` },
      { q: 'Does a higher credit score lower the minimum down payment?', a: `For FHA, yes, once: from ${F.minScore35} the minimum falls from ${F.minDownLowScore}% to ${F.minDown}%. Above that the minimum does not change, but a higher score lowers the rate and the mortgage insurance, and opens the state programs, which ask for 620 to 660.` },
      { q: 'Can a first-time buyer get a loan with no down payment?', a: 'Yes, in three ways. A VA purchase loan needs no down payment as long as the price does not exceed the appraised value. A loan backed by a USDA guarantee can reach the appraised market value in eligible rural areas, under a moderate income limit. Otherwise an FHA or 3% loan paired with state assistance large enough to pay the minimum brings the cash close to zero.' },
    ],
    body: (h) => `
<h2>The minimum at five prices</h2>
${table(h)}
<p>The FHA column is what most assisted buyers pay, because most state programs pair their help with an FHA first mortgage. The cost of falling below a 580 score is visible in the third column: the minimum almost triples. The conventional 3% column applies to buyers who qualify for Fannie Mae HomeReady or Freddie Mac Home Possible, which have income limits, or for first-time buyers on standard 97% loans.</p>
<h2>What the minimum does not include</h2>
<p>Closing costs, usually a few percent of the price, are paid on top of the down payment: lender fees, title, appraisal, prepaid taxes and insurance. On an FHA loan the upfront mortgage insurance premium is normally financed into the loan, not paid in cash. Lenders may also ask for reserves, a cushion of a month or two of payments left in your account after closing. Many assistance programs can be used for closing costs as well, which is why the help often exceeds the down payment itself.</p>
${h.mini('down', { p: ['p', 'l'], d: { p: 400000, l: 'conv', cs: 720 }, t: 'Your price, your loan' })}
<h2>Limits that cap the loan</h2>
<p>An FHA loan cannot exceed the FHA limit of the county, ${h.m(F.floor)} in low-cost areas and up to ${h.m(F.ceiling)} in the most expensive; with ${F.minDown}% down the highest FHA-financed price in a ceiling county is therefore about ${h.m(fhaMaxPrice)}. A conventional loan above the conforming limit becomes a jumbo loan, which usually needs 10% or more down. The loan limits page gives both limits for every county.</p>
<h2>Gifts, the other source</h2>
<p>FHA and conventional loans accept gifts from family toward the down payment, documented by a gift letter and a paper trail of the transfer. A gift and state assistance can usually be combined. What lenders refuse is an undocumented deposit shortly before the application, so move the money early and keep the bank statements.</p>
<h2>Waiting to save more, in numbers</h2>
<p>Each extra year of saving is a year of rent paid and a year in which prices and rates can move either way. On a ${h.m(300000)} home, going from ${F.minDown}% to 20% down means saving ${h.m(60000 - d(300000, 'fha'))} more. The calculator above shows how the monthly payment changes with the loan type, so you can weigh that payment against the time it would take you to reach 20%. Assistance shortens the wait further, since it pays the minimum for you.</p>
<h2>A loan with no down payment</h2>
<p>Two federal loans ask for nothing down. VA states it plainly: ${h.src('va-purchase', 'no down payment as long as the sales price is not higher than the appraised value')}, for eligible veterans, service members and some surviving spouses, and without monthly mortgage insurance. A loan backed by a USDA guarantee may reach the appraised market value of the home under ${h.src('usda-3555', '7 CFR 3555.103')}, in areas USDA classes as rural and for households under its moderate income limit. For everyone else, zero down is built rather than given: an FHA loan at ${F.minDown}% or a conventional loan at ${C.minDown}% plus state help of 3% to 5% covers the minimum. On a ${h.m(300000)} home with FHA, help of ${h.m(d(300000, 'fha'))} or more leaves only closing costs to bring, and many programs cover part of those too.</p>
`,
  },
  es: {
    slug: 'cuanto-pago-inicial-para-una-casa', nav: 'Cuánto pago inicial', card: 'El mínimo por tipo de préstamo, FHA, convencional, VA y USDA, en dólares',
    title: 'Pago inicial para una casa 2026: cuánto necesita de verdad',
    description: 'Cuánto pago inicial para una casa en 2026: 3.5 % con FHA, 3 % convencional, cero con VA o USDA, en dólares para su precio, y lo que cubre la ayuda estatal.',
    h1: 'Cuánto pago inicial necesita para una casa',
    intro: 'Escriba el precio, el tipo de préstamo y su puntaje de crédito: el pago inicial mínimo en dólares, para los cuatro tipos de préstamo, y el pago mensual.',
    resume: `El pago inicial mínimo depende del préstamo, no de una regla del 20 %. Un préstamo FHA pide el ${F.minDown} % del precio con un puntaje de ${F.minScore35} o más y el ${F.minDownLowScore} % entre ${F.minScore} y ${F.minScore35 - 1}. Un préstamo convencional con los programas de entrada baja de Fannie Mae o Freddie Mac pide el ${C.minDown} %. Los préstamos VA para veteranos y militares elegibles y los USDA en zonas rurales elegibles no piden nada. En una casa de ${S.m(300000)} son ${S.m(d(300000, 'fha'))} con FHA y ${S.m(d(300000, 'conv'))} con un convencional, frente a ${S.m(60000)} para el 20 %. Dar menos del 20 % significa pagar seguro hipotecario, pero esperar años para ahorrar el 20 % suele costar más que ese seguro. La ayuda estatal para el pago inicial está pensada para cubrir justo estos mínimos: la mayoría de los programas paga del 3 % al 5 % del precio o del préstamo, lo bastante para dejar a un comprador FHA o del 3 % cerca de cero de su bolsillo.`,
    faqs: [
      { q: '¿Sigue siendo necesario el 20 % de entrada?', a: 'No. El 20 % es el nivel a partir del cual un préstamo convencional no lleva seguro hipotecario privado, no un mínimo. La mayoría de los compradores de primera vivienda da mucho menos, con FHA al 3.5 % o un convencional al 3 %. El costo de dar menos es el seguro hipotecario mensual, que la calculadora no incluye.' },
      { q: '¿Puede la ayuda cubrir todo el pago inicial?', a: `A menudo, sí. Los programas que pagan del 3.5 % al 5 % del precio cubren todo el mínimo de FHA; Access Home de Illinois paga el 6 % hasta ${S.m(15000)}. La agencia suele pedir igualmente un pequeño aporte propio, y los gastos de cierre se suman. La calculadora principal muestra el efectivo que le queda por llevar.` },
      { q: '¿Un mejor puntaje de crédito baja el pago inicial mínimo?', a: `En FHA, sí, una vez: desde ${F.minScore35} puntos el mínimo baja del ${F.minDownLowScore} % al ${F.minDown} %. Por encima ya no cambia, pero un puntaje más alto baja la tasa y el seguro hipotecario, y abre los programas estatales, que piden de 620 a 660 puntos.` },
      { q: '¿Puede un comprador de primera vez obtener un préstamo sin pago inicial?', a: 'Sí, de tres maneras. Un préstamo de compra VA no pide entrada mientras el precio no supere el valor tasado. Un préstamo garantizado de USDA puede llegar al valor de mercado tasado en zonas rurales elegibles, con un límite de ingresos moderados. Si no, un préstamo FHA o del 3 % combinado con una ayuda estatal que pague el mínimo deja el efectivo cerca de cero.' },
    ],
    body: (h) => `
<h2>El mínimo para cinco precios</h2>
${table(h)}
<p>La columna FHA es la que paga la mayoría de los compradores con ayuda, porque casi todos los programas estatales combinan su ayuda con una primera hipoteca FHA. El costo de bajar de 580 puntos se ve en la tercera columna: el mínimo casi se triplica. La columna del 3 % convencional vale para quien califica para HomeReady de Fannie Mae o Home Possible de Freddie Mac, que tienen límites de ingresos, o para compradores de primera vez con préstamos estándar al 97 %.</p>
<h2>Lo que el mínimo no incluye</h2>
<p>Los gastos de cierre, por lo general unos pocos puntos del precio, se pagan además de la entrada: comisiones del prestamista, título, tasación, impuestos y seguro prepagados. En un préstamo FHA la prima inicial del seguro hipotecario se suele financiar dentro del préstamo, no se paga en efectivo. Los prestamistas pueden pedir también reservas, un colchón de uno o dos pagos que queda en su cuenta tras el cierre. Muchos programas de ayuda sirven también para los gastos de cierre, por eso la ayuda supera a menudo la propia entrada.</p>
${h.mini('down', { p: ['p', 'l'], d: { p: 400000, l: 'conv', cs: 720 }, t: 'Su precio, su préstamo' })}
<h2>Los límites que topan el préstamo</h2>
<p>Un préstamo FHA no puede pasar del límite FHA del condado, ${h.m(F.floor)} en las zonas de costo bajo y hasta ${h.m(F.ceiling)} en las más caras; con el ${F.minDown} % de entrada, el precio más alto financiable con FHA en un condado en el techo ronda, por tanto, ${h.m(fhaMaxPrice)}. Un préstamo convencional por encima del límite conforme pasa a ser un préstamo jumbo, que suele pedir el 10 % o más de entrada. La página de límites de préstamo da ambos límites para cada condado.</p>
<h2>Los regalos, la otra fuente</h2>
<p>Los préstamos FHA y convencionales aceptan regalos de la familia para la entrada, justificados con una carta de regalo y el rastro de la transferencia. Un regalo y la ayuda estatal se pueden combinar por lo general. Lo que los prestamistas rechazan es un depósito sin justificar poco antes de la solicitud: mueva el dinero con tiempo y guarde los extractos.</p>
<h2>Un préstamo sin pago inicial</h2>
<p>Dos préstamos federales no piden nada de entrada. VA lo dice sin rodeos: ${h.src('va-purchase', 'sin pago inicial mientras el precio de venta no supere el valor tasado')}, para veteranos, militares y algunos cónyuges sobrevivientes elegibles, y sin seguro hipotecario mensual. El préstamo garantizado de USDA puede llegar al valor de mercado tasado de la vivienda según la ${h.src('usda-3555', 'norma 7 CFR 3555.103')}, en zonas que USDA clasifica como rurales y para hogares por debajo de su límite de ingresos moderados. Para los demás, la entrada cero se construye: un préstamo FHA al ${F.minDown} % o uno convencional al ${C.minDown} % más una ayuda estatal del 3 % al 5 % cubre el mínimo. En una casa de ${h.m(300000)} con FHA, una ayuda de ${h.m(d(300000, 'fha'))} o más deja solo los gastos de cierre por llevar, y muchos programas cubren también parte de ellos.</p>
`,
  },
});
