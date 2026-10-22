import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const adv = K.prog('nc-homeadv'), first = K.prog('nc-1st');
const pct = adv.amount.value!, cap = adv.incomeLimit!.value!, fAmt = first.amount.value!;
const T = adv.forgivenAfterYears!;
const ev = (x: ReturnType<typeof example>, id: string) => x.sm.evals.find((e) => e.p.id === id)!;
const ex = example({ st: 'NC', county: 'Mecklenburg County', income: 95000, price: 380000, size: 3 });
const exW = example({ st: 'NC', county: 'Wake County', income: 120000, price: 450000, size: 3, firstTime: false });
const a = ev(ex, 'nc-homeadv').amount ?? 0;
const owedAfter12 = Math.round(a * (1 - 2 / 5));
const meck = K.county('NC', 'Mecklenburg County'), wake = K.county('NC', 'Wake County'), dur = K.county('NC', 'Durham County');
const COUNTIES = ['Mecklenburg County', 'Wake County', 'Guilford County', 'Forsyth County', 'Durham County', 'Cumberland County', 'Buncombe County', 'Union County', 'New Hanover County', 'Gaston County', 'Johnston County'];

export default defineGuide({
  id: 'nc', group: 'states', order: 7, state: 'NC', tool: 'dpa', toolArg: { st: 'NC', c: meck.id, i: 95000, p: 380000, h: 3 },
  related: ['forgivable', 'first-time', 'programs', 'requirements', 'va', 'ga'],
  sources: ['agency-NC', 'prog-nc-homeadv', 'prog-nc-1st', 'hud-il', 'fha-ml'],
  en: {
    slug: 'north-carolina-down-payment-assistance', nav: 'North Carolina', card: 'NC Home Advantage 3%, or $15,000 for first-time buyers, forgiven over 15 years',
    title: 'North Carolina Down Payment Assistance 2026: NCHFA 3%',
    description: `North Carolina down payment assistance in 2026: NC Home Advantage gives ${pct}% of the loan or ${E.m(fAmt)}, forgiven in years 11 to 15, under one ${E.m(cap)} income cap.`,
    h1: 'North Carolina down payment assistance with NCHFA',
    intro: 'Pick your North Carolina county, income and price: what NC Home Advantage pays, whether the $15,000 option fits, and the cash you still need.',
    resume: `The North Carolina Housing Finance Agency (NCHFA) attaches its help to the NC Home Advantage Mortgage. The standard option adds up to ${pct}% of the first mortgage as a 0% second lien, open to first-time and move-up buyers alike, with a single statewide income cap of ${E.m(cap)}, no maximum sales price, a 640 credit score and a 45% debt-to-income ceiling. The NC 1st Home Advantage option pays ${E.m(fAmt)} instead, for first-time buyers, qualifying veterans and buyers in Qualified Census Tracts, under county income limits. Both follow the same ${T}-year schedule: nothing is forgiven for ten years, then 20% at the end of each of years 11 to 15; sell or refinance before year 15 and the balance is due. In Mecklenburg County, a household of three earning ${E.m(95000)} buying at ${E.m(380000)} with FHA gets ${E.m(a)} from the ${pct}% option, against a ${E.m(ex.sm.down)} minimum down payment.`,
    faqs: [
      { q: 'Do I have to be a first-time buyer for NC Home Advantage?', a: `No, not for the ${pct}% option: it is open to move-up buyers, as long as the household is under the ${E.m(cap)} cap and meets the credit and debt rules. The ${E.m(fAmt)} NC 1st Home Advantage option is the one reserved for first-time buyers, qualifying veterans and buyers in Qualified Census Tracts.` },
      { q: 'What do I owe if I sell a North Carolina home after 12 years?', a: `Sixty percent of the assistance. Nothing is forgiven during the first ten years; then 20% goes at the end of year 11 and another 20% at the end of year 12. On the ${E.m(a)} Mecklenburg example that leaves about ${E.m(owedAfter12)} to repay from the sale. After year 15 the lien is gone entirely.` },
      { q: 'Is the $15,000 or the 3% option better in North Carolina?', a: `The ${E.m(fAmt)} option is larger on any first mortgage below ${E.m(Math.round(fAmt / (pct / 100)))}, which covers most first purchases in the state. But its income limits are set by county and family size and are usually lower than the ${E.m(cap)} statewide cap. A first-time buyer under both limits should compare them with the lender.` },
    ],
    body: (h) => `
<h2>NCHFA's two options</h2>
${stateProgTable(h, 'NC')}
<p>The agency's program guide for July 2026 sets a single income cap and no price cap for the ${pct}% option, which makes it one of the most open programs among the large states. Homebuyer education is required only when every borrower is a first-time buyer. The schedule is the unusual part: a ${T}-year term with forgiveness only in the last five years, so it rewards buyers who stay a long time.</p>
<h2>North Carolina counties at a glance</h2>
${countyTable(h, 'NC', COUNTIES)}
<p>The Raleigh and Durham areas have the highest HUD medians, ${h.m(wake.m)} in Wake and ${h.m(dur.m)} in Durham, against ${h.m(meck.m)} in Mecklenburg. With a statewide cap of ${h.m(cap)}, a household of three in any of them fits the ${pct}% option on most single incomes and many double ones. The ${h.m(fAmt)} option uses county limits that we link without transcribing, so the calculator marks it to confirm.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'NC', c: wake.id, i: 120000, p: 450000, h: 3 }, t: 'Your North Carolina county' })}
<h2>Mecklenburg County, worked through</h2>
${exampleTable(h, { st: 'NC', county: 'Mecklenburg County', income: 95000, price: 380000, size: 3 }, h.t(`Household of three, ${h.m(95000)}, ${h.m(380000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(95000)}, casa de ${h.m(380000)}, préstamo FHA, 680 puntos.`))}
<p>The ${pct}% option leaves ${h.m(ex.sm.cashWith)} of the down payment to bring; the ${h.m(fAmt)} option, if the household fits its Mecklenburg limit, would cover all of it and part of the closing costs. A move-up buyer in Wake County at ${h.m(120000)} and ${h.m(450000)} still gets ${h.m(ev(exW, 'nc-homeadv').amount ?? 0)} from the ${pct}% option, while the first-time option is out.</p>
<h2>Before you apply in North Carolina</h2>
<p>NC Home Advantage is reserved through NCHFA participating lenders together with the first mortgage, which can be FHA, VA, USDA or conventional. The 45% debt-to-income ceiling is stricter than what FHA alone allows, so a buyer with a car loan and student debt should ask the lender to check it first. Plan the timing of any refinance: before year 15 it makes the remaining balance due, and during the first ten years that is the whole amount.</p>
<p>Local programs add to the picture. Charlotte, Durham, Raleigh and several counties run their own down payment loans, often with lower income limits and a requirement to buy inside city limits. Some participating lenders layer them on top of NC Home Advantage, others do not; the city's housing office lists the lenders it works with. None of them is in the calculator, which reads the state agency only.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-carolina-del-norte', nav: 'Carolina del Norte', card: 'NC Home Advantage del 3 %, o $15,000 para primera vivienda, perdonado en 15 años',
    title: 'Ayuda pago inicial Carolina del Norte 2026: NCHFA 3 %',
    description: `Ayuda para el pago inicial en Carolina del Norte 2026: NC Home Advantage da el ${pct} % del préstamo o ${S.m(fAmt)}, perdonado del año 11 al 15, con tope de ${S.m(cap)}.`,
    h1: 'Ayuda para el pago inicial en Carolina del Norte con NCHFA',
    intro: 'Elija su condado de Carolina del Norte, su ingreso y el precio: lo que paga NC Home Advantage, si le corresponde la opción de $15,000 y el efectivo que aún necesita.',
    resume: `La North Carolina Housing Finance Agency (NCHFA) une su ayuda a la hipoteca NC Home Advantage. La opción estándar añade hasta el ${pct} % de la primera hipoteca como un segundo gravamen al 0 %, abierto tanto a quien compra por primera vez como a quien cambia de casa, con un único tope de ingresos de ${S.m(cap)} en todo el estado, sin precio máximo, 640 puntos de crédito y un límite de deuda-ingreso del 45 %. La opción NC 1st Home Advantage paga en cambio ${S.m(fAmt)}, para compradores de primera vez, veteranos que califican y compradores en Qualified Census Tracts, con límites de ingreso por condado. Ambas siguen el mismo calendario de ${T} años: nada se perdona durante diez años y luego un 20 % al final de cada año del 11 al 15; si vende o refinancia antes del año 15, se debe el saldo. En el condado de Mecklenburg, un hogar de tres que gana ${S.m(95000)} y compra por ${S.m(380000)} con FHA recibe ${S.m(a)} de la opción del ${pct} %, frente a una entrada mínima de ${S.m(ex.sm.down)}.`,
    faqs: [
      { q: '¿Tengo que comprar por primera vez para NC Home Advantage?', a: `No para la opción del ${pct} %: está abierta a quien cambia de casa, siempre que el hogar quede bajo el tope de ${S.m(cap)} y cumpla las reglas de crédito y de deuda. La opción NC 1st Home Advantage de ${S.m(fAmt)} es la reservada a compradores de primera vez, veteranos que califican y compradores en Qualified Census Tracts.` },
      { q: '¿Qué debo si vendo una casa en Carolina del Norte a los 12 años?', a: `El sesenta por ciento de la ayuda. Nada se perdona en los primeros diez años; luego se va un 20 % al final del año 11 y otro 20 % al final del año 12. En el ejemplo de Mecklenburg, de ${S.m(a)}, quedan unos ${S.m(owedAfter12)} por devolver con la venta. Pasado el año 15, el gravamen desaparece por completo.` },
      { q: '¿Conviene la opción de $15,000 o la del 3 % en Carolina del Norte?', a: `La opción de ${S.m(fAmt)} es mayor con cualquier primera hipoteca por debajo de ${S.m(Math.round(fAmt / (pct / 100)))}, lo que cubre la mayoría de las primeras compras del estado. Pero sus límites de ingreso se fijan por condado y tamaño de familia, y suelen ser más bajos que el tope estatal de ${S.m(cap)}. Quien cumple ambos límites debe compararlas con el prestamista.` },
    ],
    body: (h) => `
<h2>Las dos opciones de NCHFA</h2>
${stateProgTable(h, 'NC')}
<p>La guía del programa de julio de 2026 fija un único tope de ingresos y ningún tope de precio para la opción del ${pct} %, lo que la convierte en uno de los programas más abiertos entre los estados grandes. El curso para compradores solo se exige cuando todos los prestatarios compran por primera vez. Lo inusual es el calendario: un plazo de ${T} años con perdón solo en los últimos cinco, que premia a quien se queda mucho tiempo.</p>
<h2>Los condados de Carolina del Norte de un vistazo</h2>
${countyTable(h, 'NC', COUNTIES)}
<p>Las áreas de Raleigh y Durham tienen las medianas de HUD más altas, ${h.m(wake.m)} en Wake y ${h.m(dur.m)} en Durham, frente a ${h.m(meck.m)} en Mecklenburg. Con un tope estatal de ${h.m(cap)}, un hogar de tres en cualquiera de ellos cumple la opción del ${pct} % con la mayoría de los ingresos simples y muchos dobles. La opción de ${h.m(fAmt)} usa límites por condado que enlazamos sin transcribir, así que la calculadora la marca para confirmar.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'NC', c: wake.id, i: 120000, p: 450000, h: 3 }, t: 'Su condado de Carolina del Norte' })}
<h2>El condado de Mecklenburg, paso a paso</h2>
${exampleTable(h, { st: 'NC', county: 'Mecklenburg County', income: 95000, price: 380000, size: 3 }, h.t(`Household of three, ${h.m(95000)}, ${h.m(380000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(95000)}, casa de ${h.m(380000)}, préstamo FHA, 680 puntos.`))}
<p>La opción del ${pct} % deja ${h.m(ex.sm.cashWith)} de la entrada por poner; la de ${h.m(fAmt)}, si el hogar cumple su límite en Mecklenburg, la cubriría entera y parte de los gastos de cierre. Quien cambia de casa en el condado de Wake con ${h.m(120000)} y ${h.m(450000)} recibe igual ${h.m(ev(exW, 'nc-homeadv').amount ?? 0)} de la opción del ${pct} %, mientras que la de primera vivienda queda fuera.</p>
<h2>Antes de solicitarla en Carolina del Norte</h2>
<p>NC Home Advantage se reserva con prestamistas participantes de NCHFA junto con la primera hipoteca, que puede ser FHA, VA, USDA o convencional. El límite de deuda-ingreso del 45 % es más estricto que el que permite FHA por sí solo, así que quien tiene un préstamo de auto y deuda estudiantil debería pedir al prestamista que lo revise primero. Planee cualquier refinanciación: antes del año 15 hace exigible el saldo restante, y durante los primeros diez años ese saldo es el monto entero.</p>
<p>Los programas locales completan el panorama. Charlotte, Durham, Raleigh y varios condados tienen sus propios préstamos para la entrada, a menudo con límites de ingreso más bajos y la obligación de comprar dentro de la ciudad. Algunos prestamistas participantes los suman a NC Home Advantage y otros no; la oficina de vivienda de la ciudad publica los prestamistas con los que trabaja. Ninguno está en la calculadora, que solo lee la agencia estatal.</p>
`,
  },
});
