import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const hp = K.prog('az-homeplus');
const cap = hp.incomeLimit!.value!;
const pct = hp.amount.value!;
const ex = example({ st: 'AZ', county: 'Maricopa County', income: 98000, price: 420000, size: 3 });
const exOver = example({ st: 'AZ', county: 'Maricopa County', income: 160000, price: 420000, size: 3 });
const pima = K.county('AZ', 'Pima County'), mar = K.county('AZ', 'Maricopa County');
const COUNTIES = ['Maricopa County', 'Pima County', 'Pinal County', 'Yavapai County', 'Coconino County', 'Yuma County', 'Mohave County', 'Cochise County'];
const local = K.state('AZ').local ?? [];
const aih = local.find((l) => l.name.startsWith('Arizona Is Home'));

export default defineGuide({
  id: 'az', group: 'states', order: 14, state: 'AZ', tool: 'dpa', toolArg: { st: 'AZ', c: ex.c.id, i: 98000, p: 420000, h: 3 },
  related: ['forgivable', 'income-limits', 'programs', 'requirements', 'co', 'ca'],
  sources: ['agency-AZ', 'prog-az-homeplus', 'hud-il', 'fha-ml'],
  en: {
    slug: 'arizona-down-payment-assistance', nav: 'Arizona', card: 'Home Plus, up to 4% forgiven after five years, one income cap statewide',
    title: 'Arizona Down Payment Assistance 2026: Home Plus Up to 4%',
    description: `Arizona down payment assistance in 2026: Home Plus pays up to 4% of the loan, forgiven after five years, with one ${E.m(cap)} income cap in all 15 counties.`,
    h1: 'Arizona down payment assistance with Home Plus',
    intro: 'Pick your Arizona county, your income and the price: what Home Plus pays you, and the cash and monthly payment with and without it.',
    resume: `Arizona's statewide help comes from the Arizona Industrial Development Authority through Home Plus, a program open to first-time and repeat buyers alike. It pays up to ${pct}% of the first mortgage for the down payment and closing costs, as a second mortgage with no interest and no payment that is forgiven in full after five years, or 60 months; sell or refinance before that and it is repaid. Its income cap is the same in every county, ${E.m(cap)} as of April 6, 2026, which makes Arizona one of the simplest states to read: there is no county table to look up. In Maricopa County, a household of three earning ${E.m(98000)} and buying at ${E.m(420000)} with an FHA loan receives ${E.m(ex.sm.bestAmount)}, and the cash for the down payment falls from ${E.m(ex.sm.down)} to ${E.m(ex.sm.cashWith)}. The second Arizona IDA program, Arizona Is Home, has used its 2026 funds.`,
    faqs: [
      { q: 'Do I have to be a first-time buyer for Home Plus in Arizona?', a: 'No. Home Plus is open to repeat buyers as well, as long as the household is under the income cap and the home will be the main residence. That is rarer than it sounds: most state programs we read reserve their help for buyers who have not owned a home in three years.' },
      { q: 'What happened to the Arizona Is Home program?', a: `The Arizona IDA announced on ${E.day('2026-10-06')} that the 2026 funds of Arizona Is Home were exhausted and the program retired for the rest of the year. The calculator therefore does not offer it. Home Plus, the other statewide program of the same authority, kept taking reservations when we checked.` },
      { q: 'Does Home Plus have a purchase price limit?', a: `The Home Plus page we read sets an income cap, not a price cap of its own. The price is limited in practice by the first mortgage: the FHA limit is ${E.m(mar.fha ?? 0)} in Maricopa County and ${E.m(pima.fha ?? 0)} in Pima County for one unit, and the conforming limit applies to conventional loans.` },
    ],
    body: (h) => `
<h2>Home Plus, in the authority's own words</h2>
${stateProgTable(h, 'AZ')}
<p>The amount is a share of the loan, so it moves with the loan type: on an FHA purchase with ${K.P.fha.minDown}% down, ${pct}% of the loan is a little more than the minimum down payment, and the surplus pays closing costs. Home Plus also exists in a version that is not forgiven; the lender explains which one comes with the rate it quotes you.</p>
<h2>One cap, very different counties</h2>
${countyTable(h, 'AZ', COUNTIES)}
<p>A single statewide figure means the same ${h.m(cap)} applies in Apache County, where the HUD median for four is ${h.m(K.county('AZ', 'Apache County').m)}, and in Maricopa, where it is ${h.m(mar.m)}. In rural counties nearly every buyer fits; in the Phoenix and Flagstaff areas a dual-income household can cross the line. Household size does not change the cap, unlike the bond programs of most other states.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'AZ', c: pima.id, i: 75000, p: 330000, h: 2 }, t: 'Your Arizona county' })}
<h2>A Phoenix-area purchase, worked through</h2>
${exampleTable(h, { st: 'AZ', county: 'Maricopa County', income: 98000, price: 420000, size: 3 }, h.t(`Maricopa County, household of three, ${h.m(98000)}, ${h.m(420000)} home, FHA loan, 680 score.`, `Condado de Maricopa, hogar de tres, ${h.m(98000)}, casa de ${h.m(420000)}, préstamo FHA, 680 puntos.`))}
<p>Raise the income to ${h.m(160000)} and the household is over the cap: ${exOver.sm.best ? `${exOver.sm.best.p.name} still shows, to confirm with the lender` : 'Home Plus no longer fits and no other statewide program remains'}. The five-year forgiveness is all or nothing: on the 59th month the full amount is still owed, which the forgivable loans page shows year by year.</p>
<h2>Before you sign in Arizona</h2>
<p>Home Plus is reserved by a participating lender together with the first mortgage, and the homebuyer course must be done before closing. Because the help is tied to the lender's rate, compare the Home Plus quote with a plain FHA or conventional quote on the same day. City and county programs are not in the calculator, since we only read the statewide authority; your city's housing department can tell you whether one can be added on top of Home Plus, and the lender whether it accepts the combination. Keep the closing date: it starts the 60 months that end the repayment.</p>
${aih ? `<p>${h.t('Arizona Is Home', 'Arizona Is Home')}: ${h.t('2026 funds exhausted, retired for the rest of the year according to the Arizona IDA notice of October 6, 2026.', 'fondos de 2026 agotados, retirado por el resto del año según el aviso del Arizona IDA del 6 de octubre de 2026.')}</p>` : ''}
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-arizona', nav: 'Arizona', card: 'Home Plus, hasta el 4 % perdonado a los cinco años, un solo tope de ingresos',
    title: 'Ayuda para el pago inicial en Arizona 2026: Home Plus 4 %',
    description: `Ayuda para el pago inicial en Arizona 2026: Home Plus paga hasta el 4 % del préstamo, perdonado a los cinco años, con un tope de ${S.m(cap)} en los 15 condados.`,
    h1: 'Ayuda para el pago inicial en Arizona con Home Plus',
    intro: 'Elija su condado de Arizona, su ingreso y el precio: lo que le paga Home Plus, y el efectivo y la cuota mensual con y sin la ayuda.',
    resume: `La ayuda estatal de Arizona la da la Arizona Industrial Development Authority con Home Plus, un programa abierto tanto a quien compra por primera vez como a quien ya tuvo casa. Paga hasta el ${pct} % de la primera hipoteca para la entrada y los gastos de cierre, como una segunda hipoteca sin interés ni cuota que se perdona por completo a los cinco años, es decir 60 meses; si vende o refinancia antes, se devuelve. Su tope de ingresos es igual en todos los condados, ${S.m(cap)} al 6 de abril de 2026, lo que hace de Arizona uno de los estados más fáciles de leer: no hay tabla por condado que consultar. En el condado de Maricopa, un hogar de tres que gana ${S.m(98000)} y compra por ${S.m(420000)} con un préstamo FHA recibe ${S.m(ex.sm.bestAmount)}, y el efectivo para la entrada baja de ${S.m(ex.sm.down)} a ${S.m(ex.sm.cashWith)}. El segundo programa del Arizona IDA, Arizona Is Home, ya usó sus fondos de 2026.`,
    faqs: [
      { q: '¿Hay que comprar por primera vez para Home Plus en Arizona?', a: 'No. Home Plus está abierto también a quien ya tuvo vivienda, siempre que el hogar esté bajo el tope de ingresos y la casa sea su residencia principal. Es menos común de lo que parece: la mayoría de los programas estatales que leímos reservan su ayuda a quien no ha sido dueño en tres años.' },
      { q: '¿Qué pasó con el programa Arizona Is Home?', a: `El Arizona IDA anunció el ${S.day('2026-10-06')} que los fondos de 2026 de Arizona Is Home se habían agotado y que el programa quedaba retirado el resto del año. Por eso la calculadora no lo ofrece. Home Plus, el otro programa estatal de la misma autoridad, seguía aceptando reservas cuando lo revisamos.` },
      { q: '¿Tiene Home Plus un tope de precio?', a: `La página de Home Plus que leímos fija un tope de ingresos, no un tope de precio propio. En la práctica el precio lo limita la primera hipoteca: el límite FHA es de ${S.m(mar.fha ?? 0)} en el condado de Maricopa y de ${S.m(pima.fha ?? 0)} en el de Pima para una vivienda, y el límite conforme rige para los préstamos convencionales.` },
    ],
    body: (h) => `
<h2>Home Plus, en palabras de la autoridad</h2>
${stateProgTable(h, 'AZ')}
<p>El monto es una parte del préstamo, así que cambia con el tipo de préstamo: en una compra FHA con el ${K.P.fha.minDown} % de entrada, el ${pct} % del préstamo es algo más que la entrada mínima, y el sobrante paga gastos de cierre. Home Plus existe también en una versión que no se perdona; el prestamista le explica cuál acompaña a la tasa que le ofrece.</p>
<h2>Un solo tope, condados muy distintos</h2>
${countyTable(h, 'AZ', COUNTIES)}
<p>Una cifra única para todo el estado significa que los mismos ${h.m(cap)} rigen en el condado de Apache, donde la mediana de HUD para cuatro es de ${h.m(K.county('AZ', 'Apache County').m)}, y en Maricopa, donde es de ${h.m(mar.m)}. En los condados rurales casi todos los compradores caben; en las zonas de Phoenix y Flagstaff un hogar con dos sueldos puede pasarse. El tamaño del hogar no cambia el tope, a diferencia de los programas con bonos de la mayoría de los estados.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'AZ', c: pima.id, i: 75000, p: 330000, h: 2 }, t: 'Su condado de Arizona' })}
<h2>Una compra en la zona de Phoenix, paso a paso</h2>
${exampleTable(h, { st: 'AZ', county: 'Maricopa County', income: 98000, price: 420000, size: 3 }, h.t(`Maricopa County, household of three, ${h.m(98000)}, ${h.m(420000)} home, FHA loan, 680 score.`, `Condado de Maricopa, hogar de tres, ${h.m(98000)}, casa de ${h.m(420000)}, préstamo FHA, 680 puntos.`))}
<p>Si el ingreso sube a ${h.m(160000)}, el hogar pasa el tope: ${exOver.sm.best ? `${exOver.sm.best.p.name} sigue apareciendo, a confirmar con el prestamista` : 'Home Plus ya no le corresponde y no queda otro programa estatal'}. El perdón a cinco años es todo o nada: en el mes 59 todavía se debe el monto completo, como muestra año por año la página de préstamos perdonables.</p>
<h2>Antes de firmar en Arizona</h2>
<p>Home Plus lo reserva un prestamista participante junto con la primera hipoteca, y el curso para compradores debe hacerse antes del cierre. Como la ayuda va ligada a la tasa del prestamista, compare la oferta con Home Plus con una oferta FHA o convencional sin ayuda el mismo día. Los programas de ciudades y condados no están en la calculadora, porque solo leímos la autoridad estatal; la oficina de vivienda de su ciudad puede decirle si alguno se suma a Home Plus, y el prestamista si acepta la combinación. Guarde la fecha de cierre: abre los 60 meses que ponen fin a la devolución.</p>
${aih ? `<p>${h.t('Arizona Is Home', 'Arizona Is Home')}: ${h.t('2026 funds exhausted, retired for the rest of the year according to the Arizona IDA notice of October 6, 2026.', 'fondos de 2026 agotados, retirado por el resto del año según el aviso del Arizona IDA del 6 de octubre de 2026.')}</p>` : ''}
`,
  },
});
