import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const la = example({ st: 'CA', county: 'Los Angeles County', income: 110000, price: 650000, size: 3 });
const fresno = example({ st: 'CA', county: 'Fresno County', income: 80000, price: 380000, size: 3 });
const COUNTIES = ['Los Angeles County', 'San Diego County', 'Orange County', 'Riverside County', 'Santa Clara County', 'Alameda County', 'Sacramento County', 'Fresno County', 'Kern County'];
const my = K.prog('ca-myhome'), dfa = K.prog('ca-dfa');
const sc = K.county('CA', 'Santa Clara County'), kern = K.county('CA', 'Kern County');
const dfaMax = dfa.amount.max ?? 0;

export default defineGuide({
  id: 'ca', group: 'states', order: 2, state: 'CA', tool: 'dpa', toolArg: { st: 'CA', c: la.c.id, i: 110000, p: 650000, h: 3 },
  related: ['programs', 'first-time', 'loan-limits', 'income-limits', 'wa', 'az'],
  sources: ['agency-CA', 'prog-ca-myhome', 'prog-ca-dfa', 'hud-il', 'fha-ml'],
  en: {
    slug: 'california-down-payment-assistance', nav: 'California', card: 'CalHFA MyHome and the Dream For All loan, county by county',
    title: 'California First-Time Buyer Down Payment Assistance 2026',
    description: 'California down payment assistance in 2026: CalHFA MyHome up to 3.5% of the price, the status of Dream For All, and HUD and FHA limits for all 58 counties.',
    h1: 'California down payment assistance: CalHFA, county by county',
    intro: 'Pick your California county, income and price: what MyHome would pay, the cash you still bring, and why Dream For All is not an option right now.',
    resume: `The California Housing Finance Agency (CalHFA) offers two kinds of statewide help. MyHome Assistance is a deferred junior loan of up to ${my.amount.value}% of the price with a CalHFA FHA first loan, or 3% with a conventional, USDA or VA loan; nothing is paid monthly, and the balance is due when you sell, refinance or pay off the first loan. Dream For All, a shared appreciation loan of up to 20% of the price capped at ${E.m(dfaMax)}, was closed to new applications when we read it: its portal closed on March 16, 2026 and vouchers were drawn at random. Both are for first-time buyers. On a ${E.m(650000)} home in Los Angeles County, MyHome would cover ${E.m(la.sm.bestAmount)}, the whole FHA minimum down payment, if the household of three earning ${E.m(110000)} is under CalHFA's county income limit; at ${E.p(la.ami.pct)} of the HUD median for its size, that check is the one to make. The calculator flags it.`,
    faqs: [
      { q: 'How does the California Dream For All loan get repaid?', a: `When you sell, transfer or refinance, you repay the amount borrowed plus a share of the home's gain in value: 20%, or 15% for borrowers at or below 80% of area median income, with the share capped at 2.5 times the loan. It has no monthly payment. The program was not taking applications in October 2026.` },
      { q: 'Can MyHome cover closing costs in California?', a: `Yes. MyHome can pay the down payment, closing costs or both, up to ${my.amount.value}% of the price or appraised value, whichever is less, with an FHA first loan. On a ${E.m(500000)} home that is ${E.m(500000 * my.amount.value! / 100)}, enough to cover the FHA minimum with nothing left for fees.` },
      { q: 'Why is MyHome marked "Check with the agency" in my county?', a: 'CalHFA publishes its income and sales price limits per county in its own tables, which we link but have not transcribed figure by figure. The calculator therefore computes the MyHome amount exactly and marks the eligibility to confirm, with your income as a share of the HUD median as a guide.' },
    ],
    body: (h) => `
<h2>CalHFA's two programs, in the agency's words</h2>
${stateProgTable(h, 'CA')}
<p>We could not open the CalHFA pages directly from our network; the terms above come from the agency's indexed page text and its MyHome handbook. MyHome is the program that matters today. It is sized on the price, not on the loan, so with an FHA first mortgage it equals the ${K.P.fha.minDown}% minimum down payment almost to the dollar. Fees and prepaid items then come from your savings, a gift or a seller credit.</p>
<h2>A state of two price levels</h2>
${countyTable(h, 'CA', COUNTIES)}
<p>The coastal counties reach the national FHA ceiling of ${h.m(K.P.fha.ceiling)}, while the Central Valley sits near the floor: Kern County is at ${h.m(kern.fha ?? 0)}. The HUD median follows the same split, from ${h.m(kern.m)} in Kern to ${h.m(sc.m)} in Santa Clara for four people. A 3.5% MyHome loan on a median coastal home is worth three times what it is worth inland, but it covers the same share of the purchase.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'CA', c: fresno.c.id, i: 80000, p: 380000, h: 3 }, t: 'Your California county' })}
<h2>Los Angeles County, worked through</h2>
${exampleTable(h, { st: 'CA', county: 'Los Angeles County', income: 110000, price: 650000, size: 3 }, h.t(`Household of three, ${h.m(110000)}, ${h.m(650000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(110000)}, casa de ${h.m(650000)}, préstamo FHA, 680 puntos.`))}
<p>In Fresno County the same reasoning on a ${h.m(380000)} home gives ${h.m(fresno.sm.bestAmount)} of MyHome help, with the income at ${h.p(fresno.ami.pct)} of the local median. The monthly payment does not change with MyHome, ${h.m(la.sm.pAndI)} in principal and interest in the Los Angeles case, because the help sits in a deferred second loan.</p>
<h2>What to plan for in California</h2>
<p>A deferred loan stays on the title until you sell or refinance, so a refinance when rates fall means paying it back from the new loan or asking CalHFA to subordinate. Cities and counties run their own programs too, often larger than MyHome but with lower income limits and waiting lists; they are not in the calculator. Ask a CalHFA-approved lender which local help it can layer with MyHome in your county before you make an offer. Keep the Dream For All page in your bookmarks as well: when CalHFA opens a new round, the dates and the drawing rules are posted there first, and the window has been short.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-california', nav: 'California', card: 'MyHome de CalHFA y el préstamo Dream For All, condado por condado',
    title: 'Ayuda para el pago inicial en California 2026: CalHFA MyHome',
    description: 'Ayuda para el pago inicial en California 2026: MyHome de CalHFA hasta el 3.5 % del precio, el estado de Dream For All, límites HUD y FHA de los 58 condados.',
    h1: 'Ayuda para el pago inicial en California: CalHFA, condado por condado',
    intro: 'Elija su condado de California, su ingreso y el precio: lo que pagaría MyHome, el efectivo que aún lleva y por qué Dream For All no está disponible ahora.',
    resume: `La Agencia de Financiamiento de Vivienda de California (CalHFA) ofrece dos tipos de ayuda estatal. MyHome Assistance es un préstamo subordinado diferido de hasta el ${my.amount.value} % del precio con una primera hipoteca FHA de CalHFA, o el 3 % con un préstamo convencional, USDA o VA; no se paga nada al mes y el saldo vence al vender, refinanciar o liquidar el primer préstamo. Dream For All, un préstamo de plusvalía compartida de hasta el 20 % del precio con un tope de ${S.m(dfaMax)}, estaba cerrado a nuevas solicitudes cuando lo leímos: su portal cerró el 16 de marzo de 2026 y los vales se sortearon. Ambos son para compradores de primera vez. En una casa de ${S.m(650000)} en el condado de Los Ángeles, MyHome cubriría ${S.m(la.sm.bestAmount)}, toda la entrada mínima FHA, si el hogar de tres que gana ${S.m(110000)} está bajo el límite de ingresos de CalHFA para el condado; al ${S.p(la.ami.pct)} de la mediana de HUD para su tamaño, esa es la comprobación pendiente. La calculadora la señala.`,
    faqs: [
      { q: '¿Cómo se devuelve el préstamo Dream For All de California?', a: 'Al vender, transferir o refinanciar se devuelve lo prestado más una parte de la plusvalía de la casa: el 20 %, o el 15 % para quienes están en el 80 % del ingreso medio del área o por debajo, con esa parte limitada a 2.5 veces el préstamo. No tiene cuota mensual. El programa no aceptaba solicitudes en octubre de 2026.' },
      { q: '¿MyHome puede cubrir los gastos de cierre en California?', a: `Sí. MyHome puede pagar la entrada, los gastos de cierre o ambos, hasta el ${my.amount.value} % del precio o del valor de tasación, el menor de los dos, con una primera hipoteca FHA. En una casa de ${S.m(500000)} son ${S.m(500000 * my.amount.value! / 100)}, lo justo para la entrada mínima FHA sin sobrante para comisiones.` },
      { q: '¿Por qué MyHome aparece como "Confirmar con la agencia" en mi condado?', a: 'CalHFA publica sus límites de ingresos y de precio por condado en sus propias tablas, que enlazamos pero no hemos transcrito cifra por cifra. Por eso la calculadora calcula con exactitud el monto de MyHome y marca la elegibilidad para confirmar, con su ingreso como porcentaje de la mediana de HUD como guía.' },
    ],
    body: (h) => `
<h2>Los dos programas de CalHFA, en palabras de la agencia</h2>
${stateProgTable(h, 'CA')}
<p>No pudimos abrir las páginas de CalHFA directamente desde nuestra red; las condiciones de arriba salen del texto indexado de la agencia y de su manual de MyHome. MyHome es el programa que cuenta hoy. Se calcula sobre el precio, no sobre el préstamo, así que con una primera hipoteca FHA equivale casi al dólar a la entrada mínima del ${K.P.fha.minDown} %. Las comisiones y los prepagos salen entonces de sus ahorros, de un regalo o de un crédito del vendedor.</p>
<h2>Un estado con dos niveles de precios</h2>
${countyTable(h, 'CA', COUNTIES)}
<p>Los condados de la costa llegan al techo nacional FHA de ${h.m(K.P.fha.ceiling)}, mientras que el Valle Central está cerca del piso: el condado de Kern está en ${h.m(kern.fha ?? 0)}. La mediana de HUD sigue la misma división, de ${h.m(kern.m)} en Kern a ${h.m(sc.m)} en Santa Clara para cuatro personas. Un préstamo MyHome del 3.5 % sobre una casa mediana de la costa vale el triple que en el interior, pero cubre la misma parte de la compra.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'CA', c: fresno.c.id, i: 80000, p: 380000, h: 3 }, t: 'Su condado de California' })}
<h2>El condado de Los Ángeles, paso a paso</h2>
${exampleTable(h, { st: 'CA', county: 'Los Angeles County', income: 110000, price: 650000, size: 3 }, h.t(`Household of three, ${h.m(110000)}, ${h.m(650000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(110000)}, casa de ${h.m(650000)}, préstamo FHA, 680 puntos.`))}
<p>En el condado de Fresno, el mismo razonamiento sobre una casa de ${h.m(380000)} da ${h.m(fresno.sm.bestAmount)} de ayuda MyHome, con un ingreso al ${h.p(fresno.ami.pct)} de la mediana local. El pago mensual no cambia con MyHome, ${h.m(la.sm.pAndI)} de capital e intereses en el caso de Los Ángeles, porque la ayuda va en un segundo préstamo diferido.</p>
<h2>Qué prever en California</h2>
<p>Un préstamo diferido sigue inscrito en el título hasta que vende o refinancia, así que refinanciar cuando bajen las tasas supone devolverlo con el nuevo préstamo o pedir a CalHFA que lo subordine. Las ciudades y los condados tienen también sus propios programas, a menudo más grandes que MyHome pero con límites de ingresos más bajos y listas de espera; no están en la calculadora. Pregunte a un prestamista aprobado por CalHFA qué ayuda local puede sumar a MyHome en su condado antes de hacer una oferta.</p>
`,
  },
});
