import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const m = K.prog('mi-10k');
const amt = m.amount.value!, pcap = m.priceLimit!.value!;
const ex = example({ st: 'MI', county: 'Wayne County', income: 75000, price: 220000, size: 3 });
const exK = example({ st: 'MI', county: 'Kent County', income: 85000, price: 330000, size: 3 });
const fullAt = Math.round(amt / (K.P.fha.minDown / 100));
const way = K.county('MI', 'Wayne County'), kent = K.county('MI', 'Kent County'), wash = K.county('MI', 'Washtenaw County'), gen = K.county('MI', 'Genesee County');
const COUNTIES = ['Wayne County', 'Oakland County', 'Macomb County', 'Kent County', 'Genesee County', 'Washtenaw County', 'Ingham County', 'Ottawa County', 'Kalamazoo County', 'Saginaw County'];

export default defineGuide({
  id: 'mi', group: 'states', order: 12, state: 'MI', tool: 'dpa', toolArg: { st: 'MI', c: way.id, i: 75000, p: 220000, h: 3 },
  related: ['programs', 'how-much-down', 'income-limits', 'requirements', 'oh', 'il'],
  sources: ['agency-MI', 'prog-mi-10k', 'hud-il', 'fha-ml'],
  en: {
    slug: 'michigan-down-payment-assistance', nav: 'Michigan', card: 'MSHDA MI 10K: up to $10,000 at 0%, due on sale, with the MI Home Loan',
    title: 'Michigan Down Payment Assistance 2026: MSHDA MI 10K Loan',
    description: `Michigan down payment assistance in 2026: the MSHDA MI 10K loan gives up to ${E.m(amt)} at 0% with no payment, under a ${E.m(pcap)} price limit, in all 83 counties.`,
    h1: 'Michigan down payment assistance with MSHDA',
    intro: 'Pick your Michigan county, income and price: whether the MI 10K loan fits, what it covers of the down payment, and the cash left to bring.',
    resume: `The Michigan State Housing Development Authority (MSHDA) offers one statewide down payment loan, the MI 10K DPA Loan, with its MI Home Loan first mortgage. It lends up to ${E.m(amt)} for the down payment and closing costs at 0% interest, with no monthly payment, and is due when you sell or transfer the property. It is not forgiven. The first-time rule follows the MI Home Loan, with different rules in targeted areas, and the program asks for a 640 credit score and a homebuyer course. MSHDA's sheet effective June 1, 2026 sets the sales price limit at ${E.m(pcap)} in every county, and household income limits by county and family size, which we link. Because the help is a flat amount, it covers the whole FHA minimum on any home up to about ${E.m(fullAt)}: in Wayne County, a household of three earning ${E.m(75000)} buying at ${E.m(220000)} needs ${E.m(ex.sm.down)} down and gets up to ${E.m(ex.sm.bestAmount)}.`,
    faqs: [
      { q: 'Is the Michigan MI 10K loan forgiven?', a: `No. MSHDA describes it as a 0% non-amortizing loan due when the property is sold or transferred. You make no payment and pay no interest, but the full ${E.m(amt)} comes back out of the sale, whether that is in two years or twenty. On the other hand it does not grow, so its weight falls as the home's value rises.` },
      { q: 'What is the price limit for MSHDA loans in Michigan?', a: `${E.m(pcap)} on the MSHDA sheet effective June 1, 2026, the same in every county. Almost every Michigan home sits below it, so the income limit, set by county and household size, is the rule that matters. The calculator marks it to confirm since we have linked the sheet rather than transcribed it.` },
      { q: 'Can I use the MI 10K loan with a conventional mortgage?', a: 'It comes with the MSHDA MI Home Loan, which MSHDA offers through participating lenders in several versions. A conventional or FHA loan from outside the program cannot carry it. Ask a participating lender which MI Home Loan versions it offers and how the rate compares with its own loans.' },
    ],
    body: (h) => `
<h2>The MI 10K loan, in MSHDA's words</h2>
${stateProgTable(h, 'MI')}
<p>Michigan keeps it simple: one amount, one statewide price cap, one first mortgage. The ${h.m(amt)} figure is a maximum; the lender sizes the loan to what the down payment and closing costs need. We could not open michigan.gov directly from our network; the terms come from the indexed text of MSHDA's official pages and its June 2026 limits sheet.</p>
<h2>Detroit, Grand Rapids and Ann Arbor</h2>
${countyTable(h, 'MI', COUNTIES)}
<p>All of Michigan sits at the FHA floor of ${h.m(K.P.fha.floor)}, but HUD medians vary widely: ${h.m(way.m)} in Wayne County, ${h.m(kent.m)} in Kent, ${h.m(wash.m)} in Washtenaw, home to Ann Arbor, and ${h.m(gen.m)} in Genesee, around Flint. A buyer in Washtenaw has more room under the income limit; a buyer in Genesee has lower prices, so the ${h.m(amt)} goes further.</p>
<p>A flat amount behaves differently from a percentage. On a ${h.m(150000)} home in Genesee County the FHA minimum is ${h.m(Math.round(150000 * K.P.fha.minDown / 100))}, and the MI 10K loan can pay all of it plus most of the closing costs. On a ${h.m(400000)} home in Oakland County the minimum is ${h.m(Math.round(400000 * K.P.fha.minDown / 100))}, and the same loan covers about two thirds of it. Buyers in the higher-priced suburbs should count on bringing more of their own money, or look at what their city adds.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'MI', c: kent.id, i: 85000, p: 330000, h: 3 }, t: 'Your Michigan county' })}
<h2>Wayne County, worked through</h2>
${exampleTable(h, { st: 'MI', county: 'Wayne County', income: 75000, price: 220000, size: 3 }, h.t(`Household of three, ${h.m(75000)}, ${h.m(220000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(75000)}, casa de ${h.m(220000)}, préstamo FHA, 680 puntos.`))}
<p>Here the loan covers the ${h.m(ex.sm.down)} minimum and leaves up to ${h.m(amt - ex.sm.down)} for closing costs. In Kent County at ${h.m(330000)}, the minimum is ${h.m(exK.sm.down)}, so ${h.m(exK.sm.cashWith)} of it and the closing costs remain. The monthly payment does not change with the MI 10K loan, ${h.m(ex.sm.pAndI)} of principal and interest in the Wayne example at the market average rate.</p>
<h2>Applying in Michigan</h2>
<p>MSHDA works through participating lenders, who reserve the MI 10K loan with the MI Home Loan and send you to an approved homebuyer course. Detroit, Grand Rapids and other cities run their own grants that some lenders add on top; the city's housing department lists them. Ask for the rate on the MI Home Loan with and without the 10K loan, and plan for its repayment the day you sell.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-michigan', nav: 'Michigan', card: 'MI 10K de MSHDA: hasta $10,000 al 0 %, devueltos al vender, con el MI Home Loan',
    title: 'Ayuda para el pago inicial en Michigan 2026: MSHDA MI 10K',
    description: `Ayuda para el pago inicial en Michigan 2026: el préstamo MI 10K de MSHDA da hasta ${S.m(amt)} al 0 % sin cuota, con un tope de precio de ${S.m(pcap)}, en 83 condados.`,
    h1: 'Ayuda para el pago inicial en Michigan con MSHDA',
    intro: 'Elija su condado de Michigan, su ingreso y el precio: si le corresponde el préstamo MI 10K, cuánto cubre de la entrada y el efectivo que le queda por llevar.',
    resume: `La Michigan State Housing Development Authority (MSHDA) ofrece un préstamo estatal para la entrada, el MI 10K DPA Loan, junto con su primera hipoteca MI Home Loan. Presta hasta ${S.m(amt)} para la entrada y los gastos de cierre al 0 % de interés, sin cuota mensual, y vence cuando se vende o se transfiere la propiedad. No se perdona. La regla de primera vivienda sigue al MI Home Loan, con reglas distintas en las zonas prioritarias, y el programa pide 640 puntos de crédito y un curso para compradores. La hoja de MSHDA vigente desde el 1 de junio de 2026 fija el tope de precio en ${S.m(pcap)} en todos los condados, y límites de ingreso por condado y tamaño de familia, que enlazamos. Como la ayuda es un monto fijo, cubre toda la entrada mínima FHA de cualquier casa de hasta unos ${S.m(fullAt)}: en el condado de Wayne, un hogar de tres que gana ${S.m(75000)} y compra por ${S.m(220000)} necesita ${S.m(ex.sm.down)} de entrada y recibe hasta ${S.m(ex.sm.bestAmount)}.`,
    faqs: [
      { q: '¿El préstamo MI 10K de Michigan se perdona?', a: `No. MSHDA lo describe como un préstamo al 0 % sin amortización que vence cuando la propiedad se vende o se transfiere. No paga cuota ni interés, pero los ${S.m(amt)} completos salen de la venta, sea a los dos años o a los veinte. A cambio no crece, así que su peso baja a medida que sube el valor de la casa.` },
      { q: '¿Cuál es el tope de precio de los préstamos de MSHDA en Michigan?', a: `${S.m(pcap)} en la hoja de MSHDA vigente desde el 1 de junio de 2026, igual en todos los condados. Casi todas las casas de Michigan quedan por debajo, así que el límite de ingresos, fijado por condado y tamaño del hogar, es la regla que cuenta. La calculadora lo marca para confirmar porque enlazamos la hoja en lugar de transcribirla.` },
      { q: '¿Puedo usar el préstamo MI 10K con una hipoteca convencional?', a: 'Acompaña al MI Home Loan de MSHDA, que la autoridad ofrece a través de prestamistas participantes en varias versiones. Un préstamo convencional o FHA de fuera del programa no puede llevarlo. Pregunte a un prestamista participante qué versiones del MI Home Loan ofrece y cómo se compara su tasa con la de sus propios préstamos.' },
    ],
    body: (h) => `
<h2>El préstamo MI 10K, en palabras de MSHDA</h2>
${stateProgTable(h, 'MI')}
<p>Michigan lo mantiene simple: un monto, un tope de precio estatal, una primera hipoteca. La cifra de ${h.m(amt)} es un máximo; el prestamista ajusta el préstamo a lo que necesitan la entrada y los gastos de cierre. No pudimos abrir michigan.gov directamente desde nuestra red; las condiciones salen del texto indexado de las páginas oficiales de MSHDA y de su hoja de límites de junio de 2026.</p>
<h2>Detroit, Grand Rapids y Ann Arbor</h2>
${countyTable(h, 'MI', COUNTIES)}
<p>Todo Michigan está en el piso FHA de ${h.m(K.P.fha.floor)}, pero las medianas de HUD varían mucho: ${h.m(way.m)} en el condado de Wayne, ${h.m(kent.m)} en Kent, ${h.m(wash.m)} en Washtenaw, sede de Ann Arbor, y ${h.m(gen.m)} en Genesee, alrededor de Flint. Quien compra en Washtenaw tiene más margen bajo el límite de ingresos; quien compra en Genesee tiene precios más bajos, así que los ${h.m(amt)} rinden más.</p>
<p>Un monto fijo se comporta de otra manera que un porcentaje. En una casa de ${h.m(150000)} en el condado de Genesee la entrada mínima FHA es de ${h.m(Math.round(150000 * K.P.fha.minDown / 100))}, y el préstamo MI 10K puede pagarla entera y la mayor parte de los gastos de cierre. En una casa de ${h.m(400000)} en el condado de Oakland el mínimo es de ${h.m(Math.round(400000 * K.P.fha.minDown / 100))}, y el mismo préstamo cubre unos dos tercios. Quien compra en los suburbios más caros debe contar con poner más dinero propio, o mirar lo que añade su ciudad. El resto del estado queda entre esos dos casos.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'MI', c: kent.id, i: 85000, p: 330000, h: 3 }, t: 'Su condado de Michigan' })}
<h2>El condado de Wayne, paso a paso</h2>
${exampleTable(h, { st: 'MI', county: 'Wayne County', income: 75000, price: 220000, size: 3 }, h.t(`Household of three, ${h.m(75000)}, ${h.m(220000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(75000)}, casa de ${h.m(220000)}, préstamo FHA, 680 puntos.`))}
<p>Aquí el préstamo cubre la entrada mínima de ${h.m(ex.sm.down)} y deja hasta ${h.m(amt - ex.sm.down)} para los gastos de cierre. En el condado de Kent, con ${h.m(330000)}, la entrada mínima es de ${h.m(exK.sm.down)}, así que quedan ${h.m(exK.sm.cashWith)} de ella más los gastos de cierre. La cuota mensual no cambia con el préstamo MI 10K: ${h.m(ex.sm.pAndI)} de capital e intereses en el ejemplo de Wayne, a la tasa promedio del mercado.</p>
<h2>Cómo solicitarla en Michigan</h2>
<p>MSHDA trabaja con prestamistas participantes, que reservan el préstamo MI 10K junto con el MI Home Loan y le envían a un curso aprobado para compradores. Detroit, Grand Rapids y otras ciudades tienen sus propias subvenciones, que algunos prestamistas suman; el departamento de vivienda de la ciudad las enumera. Pida la tasa del MI Home Loan con y sin el préstamo 10K, y prevea su devolución el día que venda.</p>
`,
  },
});
