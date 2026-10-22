import { defineGuide } from '../../lib/page-types';
import type { Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Form2 } from '../../lib/engine/dpa';

const E = K.en, S = K.es;
/** Forgiveness periods as each agency states them in the program's repayment text (quoted in the table). */
const SCHED: Array<[string, Form2 | 'deferThenLinear', number]> = [
  ['az-homeplus', 'cliff', 5], ['nj-dpa', 'cliff', 5], ['oh-dpa', 'cliff', 7], ['tn-deferred', 'cliff', 10],
  ['fl-hfa-plus', 'linear', 5], ['il-forgivable', 'linear', 10], ['ny-dpal', 'linear', 10], ['pa-kfit', 'linear', 10], ['nc-homeadv', 'deferThenLinear', 15],
];
const owed = (k: Form2 | 'deferThenLinear', y: number, t: number, a = 10000) =>
  k === 'deferThenLinear' ? (y < t - 5 ? a : Math.max(0, a * (1 - (Math.floor(y) - (t - 5)) / 5))) : K.owedAtSale(a, k, y, t);
const YEARS = [2, 4, 6, 8, 11];

function table(h: Helpers) {
  const rows = SCHED.map(([id, k, t]) => { const p = K.prog(id); return [`${p.name} (${p.id.slice(0, 2).toUpperCase()})`, p.repayment ?? '', ...YEARS.map((y) => h.m(owed(k, y, t)))]; });
  return h.table([h.t('Program', 'Programa'), h.t('Rule (agency wording)', 'Regla (texto de la agencia)'), ...YEARS.map((y) => h.t(`Sale in year ${y}`, `Venta en el año ${y}`))], rows,
    h.t(`Amount still owed on ${h.m(10000)} of help if you sell or refinance after the number of full years shown. Terms read on ${h.day(K.P.retrieved_at)}.`, `Monto que aún se debe sobre ${h.m(10000)} de ayuda si vende o refinancia tras los años completos indicados. Condiciones leídas el ${h.day(K.P.retrieved_at)}.`), ['l', 'l', 'r', 'r', 'r', 'r', 'r']);
}
const oh = K.owedAtSale(15000, 'cliff', 6, 7), ny = K.owedAtSale(15000, 'linear', 6, 10);

export default defineGuide({
  id: 'forgivable', group: 'tools', order: 8, tool: 'repay', toolArg: { a: 15000, y: 4, k: 'cliff', t: 5 },
  related: ['grants', 'payment', 'programs', 'oh', 'ny', 'nc'],
  sources: ['prog-oh-dpa', 'prog-ny-dpal', 'prog-nc-homeadv', 'prog-pa-kfit', 'prog-il-forgivable', 'prog-az-homeplus'],
  en: {
    slug: 'forgivable-down-payment-assistance-loans', nav: 'Forgivable loans', card: 'What you repay if you sell or refinance early, year by year',
    title: 'Forgivable Down Payment Assistance Loans 2026: What You Owe',
    description: 'Forgivable down payment assistance loans in 2026: what you still owe if you sell or refinance after 2, 4, 6 or 8 years, program by program, with a calculator.',
    h1: 'Forgivable down payment assistance: what you owe if you leave early',
    intro: 'Enter the help, its type and its term, then the year you might sell: the amount you would repay and the balance year by year.',
    resume: `A forgivable down payment loan is erased only if you keep the home as your main residence for the whole period the agency sets, and the way it is erased matters as much as the length. Some loans are forgiven all at once at the end: Ohio's assistance after seven years, New Jersey's and Arizona's after five, Tennessee's deferred loan after ten. Sell or refinance one day early and you repay everything. Others shrink every month or year: New York's SONYMA loan by 1/120 a month over ten years, Pennsylvania's K-FIT by 10% a year, Florida's HFA Plus by 20% a year. On ${E.m(15000)} of help, selling after six years leaves ${E.m(oh)} to repay in Ohio and ${E.m(ny)} in New York. North Carolina defers for ten years, then forgives 20% a year. The calculator gives the amount owed for any year and any schedule.`,
    faqs: [
      { q: 'Is a forgivable loan taxable income when it is forgiven?', a: 'Generally not for down payment help tied to a home purchase, because it is treated as a reduction of the price or a gift, not as income. The agencies we read do not issue a tax form for it. Your situation can differ, so check with a tax professional if you received a large amount.' },
      { q: 'Does refinancing count as selling for a forgivable loan?', a: 'In almost every program, yes: the repayment text names sale, refinance and transfer together. Some agencies allow a refinance that lowers your rate without cash out if you ask for a subordination, keeping the second loan in place. Without that agreement, the balance is paid from the new loan.' },
      { q: 'What happens to a forgivable loan if I rent the home out?', a: 'It becomes due. The forgiveness is a reward for living in the home: moving out and renting it, even while still owning it, ends the occupancy that the agency requires. Agencies check occupancy with tax bills, mail returned or insurance records, and a few ask for a yearly certification.' },
      { q: 'Is a loan forgiven all at once better than one forgiven each year?', a: 'Only if you are certain to stay past the date. Both reach zero at the end, but before that the one forgiven all at once leaves the full amount owed, while the one forgiven monthly or yearly has already shrunk. For an equal amount and period, the yearly or monthly schedule never costs more at any date of sale.' },
    ],
    body: (h) => `
<h2>Nine schedules side by side</h2>
${table(h)}
<p>Two rows can hold the same amount for years and then part ways overnight. That is the difference between a cliff and a slope: a cliff loan costs you the full amount on the last day before forgiveness, while a slope loan has already shrunk. If you are not sure you will stay, the slope is safer; if you are sure, both end at zero.</p>
<h2>Deferred loans are not forgivable</h2>
<p>Many programs advertised as "no payment" are deferred, not forgivable: Illinois Access Home, Michigan MI 10K, Massachusetts option 1, Maryland and Florida's main assistance. They are repaid in full whenever you sell, refinance or pay off the first loan, at any point, even after thirty years. They cost nothing a month but are a debt you carry. The calculator's "deferred" option shows the full amount owed at any year.</p>
${h.mini('repay', { p: ['a', 'y', 'k'], d: { a: 10000, y: 6, k: 'linear', t: 10 }, t: 'Your sale year' })}
<h2>Planning around the date</h2>
<p>Note the closing date and the forgiveness date in your files. If a move becomes likely, compare the cost of waiting a few months with the balance due: on a cliff loan it can be worth staying until the date passes. A job transfer, divorce or death in the family is not usually treated as an exception, though some agencies review hardship cases. Ask before you list the home, not after.</p>
<h2>Recapture tax, a separate question</h2>
<p>Loans funded by tax-exempt bonds can trigger a federal recapture tax when you sell within nine years with a large gain and an income well above the limit. It is not the repayment of the assistance; it is capped at a share of the gain, and several agencies reimburse it. Your lender gives you a notice at closing with the figures that apply.</p>
<h2>How to find your own schedule</h2>
<p>The schedule is written in the second mortgage note and the deed of trust you sign at closing, and summarized on the agency's program page linked in the table. Look for three things: the length of the period, whether the amount drops gradually or all at once, and the list of events that make it due. Then enter them in the calculator above with the year you might move: the result is the figure to set aside from a future sale.</p>
`,
  },
  es: {
    slug: 'prestamos-perdonables-para-el-pago-inicial', nav: 'Préstamos perdonables', card: 'Lo que devuelve si vende o refinancia antes, año por año',
    title: 'Préstamos perdonables para el pago inicial 2026: lo que debe',
    description: 'Préstamos perdonables para el pago inicial 2026: lo que aún debe si vende o refinancia tras 2, 4, 6 u 8 años, programa por programa, con una calculadora.',
    h1: 'Ayuda perdonable para el pago inicial: lo que debe si se va antes',
    intro: 'Escriba la ayuda, su tipo y su plazo, y luego el año en que podría vender: el monto que devolvería y el saldo año por año.',
    resume: `Un préstamo perdonable para el pago inicial solo se borra si mantiene la casa como residencia principal durante todo el periodo que fija la agencia, y la forma en que se borra importa tanto como la duración. Algunos préstamos se perdonan de una vez al final: la ayuda de Ohio a los siete años, la de Nueva Jersey y la de Arizona a los cinco, el préstamo diferido de Tennessee a los diez. Si vende o refinancia un día antes, devuelve todo. Otros se reducen cada mes o cada año: el préstamo de SONYMA en Nueva York en 1/120 al mes durante diez años, K-FIT de Pensilvania un 10 % al año, HFA Plus de Florida un 20 % al año. Sobre ${S.m(15000)} de ayuda, vender a los seis años deja ${S.m(oh)} por devolver en Ohio y ${S.m(ny)} en Nueva York. Carolina del Norte difiere diez años y luego perdona un 20 % al año. La calculadora da lo adeudado para cualquier año y cualquier calendario.`,
    faqs: [
      { q: '¿Es ingreso imponible un préstamo perdonado?', a: 'En general no para la ayuda ligada a la compra de una vivienda, porque se trata como una rebaja del precio o un regalo, no como ingreso. Las agencias que leímos no emiten formulario fiscal por ella. Su caso puede ser distinto: consulte a un profesional de impuestos si recibió un monto grande.' },
      { q: '¿Refinanciar cuenta como vender en un préstamo perdonable?', a: 'En casi todos los programas, sí: el texto de devolución nombra juntos la venta, el refinanciamiento y la transferencia. Algunas agencias permiten un refinanciamiento que baja la tasa sin sacar efectivo si se pide una subordinación, que mantiene el segundo préstamo. Sin ese acuerdo, el saldo se paga con el nuevo préstamo.' },
      { q: '¿Qué pasa con el préstamo perdonable si alquilo la casa?', a: 'Se vuelve exigible. El perdón premia vivir en la casa: mudarse y alquilarla, aunque siga siendo suya, pone fin a la ocupación que exige la agencia. Las agencias la comprueban con recibos de impuestos, correo devuelto o registros del seguro, y algunas piden una certificación anual.' },
      { q: '¿Es mejor un préstamo perdonado de una vez que uno perdonado cada año?', a: 'Solo si está seguro de quedarse más allá de la fecha. Ambos llegan a cero al final, pero antes el perdonado de una vez deja todo el monto adeudado, mientras que el perdonado cada mes o cada año ya se ha reducido. Con igual monto y periodo, el calendario anual o mensual nunca cuesta más, sea cual sea la fecha de venta.' },
    ],
    body: (h) => `
<h2>Nueve calendarios lado a lado</h2>
${table(h)}
<p>Dos filas pueden mostrar el mismo monto durante años y separarse de un día para otro. Es la diferencia entre un escalón y una pendiente: un préstamo con escalón le cuesta el monto completo el último día antes del perdón, mientras que uno en pendiente ya se ha reducido. Si no está seguro de quedarse, la pendiente es más segura; si lo está, ambos terminan en cero.</p>
<h2>Los préstamos diferidos no son perdonables</h2>
<p>Muchos programas anunciados como "sin cuota" son diferidos, no perdonables: Access Home de Illinois, MI 10K de Míchigan, la opción 1 de Massachusetts, Maryland y la ayuda principal de Florida. Se devuelven completos al vender, refinanciar o liquidar el primer préstamo, en cualquier momento, incluso tras treinta años. No cuestan nada al mes, pero son una deuda que lleva consigo. La opción "diferida" de la calculadora muestra el monto completo adeudado en cualquier año.</p>
${h.mini('repay', { p: ['a', 'y', 'k'], d: { a: 10000, y: 6, k: 'linear', t: 10 }, t: 'Su año de venta' })}
<h2>Planificar en torno a la fecha</h2>
<p>Anote la fecha de cierre y la fecha de perdón en sus papeles. Si una mudanza se vuelve probable, compare el costo de esperar unos meses con el saldo exigible: en un préstamo con escalón puede valer la pena quedarse hasta que pase la fecha. Un traslado laboral, un divorcio o un fallecimiento en la familia no suelen tratarse como excepción, aunque algunas agencias revisan casos de dificultad. Pregunte antes de poner la casa en venta, no después.</p>
<h2>El impuesto de recuperación, otra cuestión</h2>
<p>Los préstamos financiados con bonos exentos de impuestos pueden generar un impuesto federal de recuperación si vende dentro de nueve años con una ganancia grande y un ingreso muy por encima del límite. No es la devolución de la ayuda; tiene un tope sobre una parte de la ganancia, y varias agencias lo reembolsan. Su prestamista le entrega al cierre un aviso con las cifras que se aplican.</p>
<h2>Cómo encontrar su propio calendario</h2>
<p>El calendario está escrito en el pagaré del segundo préstamo y en la escritura de garantía que firma al cierre, y resumido en la página del programa de la agencia enlazada en la tabla. Busque tres cosas: la duración del periodo, si el monto baja poco a poco o de una vez, y la lista de hechos que lo hacen exigible. Luego escríbalos en la calculadora con el año en que podría mudarse.</p>
`,
  },
});
