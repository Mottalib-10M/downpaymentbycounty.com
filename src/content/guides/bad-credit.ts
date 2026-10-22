import { defineGuide } from '../../lib/page-types';
import type { Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { STATES_READ } from './_shared';

const E = K.en, S = K.es, F = K.P.fha;
const PRICE = 280000;
const progs = STATES_READ.flatMap((st) => K.state(st).programs.filter((p) => p.form !== 'mcc').map((p) => ({ st, p })));
const floored = progs.filter((x) => x.p.minCredit);
const free = progs.length - floored.length;
const lowest = Math.min(...floored.map((x) => x.p.minCredit!));
const highest = Math.max(...floored.map((x) => x.p.minCredit!));
const reach = (cs: number) => floored.filter((x) => x.p.minCredit! <= cs).length;
const noFloorStates = STATES_READ.filter((st) => !K.state(st).programs.some((p) => p.form !== 'mcc' && p.minCredit));
const BANDS: Array<[number, number | null]> = [[F.minScore, F.minScore35 - 1], [F.minScore35, lowest - 1], [lowest, 639], [640, 659], [660, null]];
const downAt = (cs: number) => PRICE * K.minDownPct('fha', cs) / 100;
const gap = downAt(F.minScore) - downAt(F.minScore35);
const tx = K.tool('credit', 'en', { cs: 600, st: 'TX', p: PRICE });
const txEs = K.tool('credit', 'es', { cs: 600, st: 'TX', p: PRICE });
const oh = K.prog('oh-dpa'), va = K.prog('va-grant');
const names = (l: 'en' | 'es') => noFloorStates.map((st) => K.stateName(st)).join(l === 'es' ? ', ' : ', ');

function bandTable(h: Helpers) {
  const rows = BANDS.map(([a, b]) => [
    b ? `${a} ${h.t('to', 'a')} ${b}` : h.t(`${a} and above`, `${a} o más`),
    `${h.n(K.minDownPct('fha', a), 1)}${h.t('%', ' %')}`, h.m(downAt(a)),
    `${reach(a)} / ${floored.length}`,
  ]);
  return h.table([h.t('Credit score', 'Puntaje de crédito'), h.t('FHA minimum down', 'Entrada mínima FHA'), h.t(`On a ${h.m(PRICE)} home`, `En una casa de ${h.m(PRICE)}`), h.t('State programs whose floor it reaches', 'Programas estatales cuyo mínimo alcanza')], rows,
    h.t(`FHA rule of HUD Handbook 4000.1; floors published by the agencies of the ${STATES_READ.length} states we read. ${free} more programs publish no floor and leave the score to the lender.`, `Regla de FHA del manual 4000.1 de HUD; mínimos publicados por las agencias de los ${STATES_READ.length} estados leídos. Otros ${free} programas no publican mínimo y dejan el puntaje al prestamista.`), ['l', 'r', 'r', 'r']);
}

function stateTable(h: Helpers) {
  const rows = STATES_READ.map((st) => {
    const ps = K.state(st).programs.filter((p) => p.form !== 'mcc');
    const f = ps.filter((p) => p.minCredit).map((p) => p.minCredit!);
    return [K.stateName(st), f.length ? String(Math.min(...f)) : h.t('lender', 'prestamista'), String(f.length), String(ps.length - f.length)];
  });
  return h.table([h.t('State', 'Estado'), h.t('Lowest published floor', 'Mínimo publicado más bajo'), h.t('Programs with a floor', 'Programas con mínimo'), h.t('Programs left to the lender', 'Programas que deja al prestamista')], rows,
    h.t(`Read on each agency's pages, ${h.day(K.P.retrieved_at)}.`, `Leído en las páginas de cada agencia, ${h.day(K.P.retrieved_at)}.`), ['l', 'r', 'r', 'r']);
}

export default defineGuide({
  id: 'bad-credit', group: 'tools', order: 11, tool: 'credit', toolArg: { cs: 600, st: 'TX', p: PRICE },
  related: ['requirements', 'how-much-down', 'first-time', 'programs', 'tx', 'oh'],
  sources: ['fha-handbook', 'prog-tx-mfth', 'prog-oh-dpa', 'prog-va-grant', 'prog-pa-kfit'],
  en: {
    slug: 'first-time-home-buyer-loans-bad-credit', nav: 'Loans with bad credit', card: 'What a 500 to 660 score opens: FHA down payment and state floors',
    title: 'First-Time Home Buyer Loans for Bad Credit 2026: Score Rules',
    description: 'First-time home buyer loans for bad credit in 2026: FHA from a 500 score with 10% down, 3.5% from 580, and the credit floor of each state assistance program.',
    h1: 'First-time home buyer programs with a low credit score',
    intro: 'Enter your score, your state and the price: the FHA down payment at that score, and which state programs your score already reaches.',
    resume: `A low credit score narrows the choice but rarely closes the door. FHA, the loan most first-time buyers with damaged credit use, insures borrowers from a score of ${F.minScore}: from ${F.minScore} to ${F.minScore35 - 1} it asks ${F.minDownLowScore}% down, from ${F.minScore35} only ${F.minDown}%. On a ${E.m(PRICE)} home that step is worth ${E.m(gap)} of cash. State down payment assistance sits higher. Of the ${progs.length} state programs we read, ${floored.length} publish a credit floor, from ${lowest} to ${highest}, and ${free} leave the score to the approved lender. In Texas a ${600} score gets FHA at ${E.m(downAt(600))} down but misses My First Texas Home, which asks ${K.prog('tx-mfth').minCredit}: ${tx.rows[3]?.[1]} more points open the help. The calculator shows that distance for your own score and state, so you know whether to apply now or spend a few months on your credit first.`,
    faqs: [
      { q: 'Which first-time buyer programs accept a score under 620?', a: `None of the state programs we read publishes a floor below ${lowest}. The programs of ${names('en')} publish no floor at all and leave the score to the lender, who often applies the floor of the first mortgage. Below ${lowest}, FHA alone is the usual route, with city or nonprofit help where it exists.` },
      { q: 'How much more cash does FHA ask under a 580 score?', a: `The minimum rises from ${F.minDown}% to ${F.minDownLowScore}% of the price. On a ${E.m(PRICE)} home that is ${E.m(downAt(F.minScore))} instead of ${E.m(downAt(F.minScore35))}, a difference of ${E.m(gap)}. Since most assistance also needs a higher score, the buyer at 560 pays the larger amount without help, which is why a few points can matter more than a few months of saving.` },
      { q: 'Does Ohio ask the same score for FHA and conventional loans?', a: `No. ${oh.name} lists ${oh.minCreditNote}. Virginia Housing does the reverse split on its grant: ${va.minCreditNote}. The calculator uses the lowest published figure, so with a score between the two, check which first mortgage the lender plans before counting on the help.` },
      { q: 'Does using this calculator touch my credit report?', a: 'No. The page asks only for a number you type, and nothing leaves your browser: no name, no Social Security number, no e-mail. Only a lender pulling your report with your consent creates an inquiry. Use the result to decide when to apply, then let the approved lender confirm the score it actually reads.' },
    ],
    body: (h) => `
<h2>What each score band opens</h2>
${bandTable(h)}
<p>The table reads from the bottom up for most buyers. Below ${F.minScore}, no FHA loan and no state help: the work is on the credit file itself. Between ${F.minScore} and ${F.minScore35 - 1}, FHA is possible but costs ${h.m(gap)} more cash on this price, and no state program we read reaches you. From ${F.minScore35} the FHA minimum drops to ${F.minDown}%, yet the state floors still sit above. At ${lowest} the first programs open, at 640 most of them, and ${highest} is the highest published floor.</p>
<h2>State by state, the lowest door</h2>
${stateTable(h)}
<p>A state with no published floor is not a state without one. The agency lets its approved lenders apply their own rules, which usually follow the first mortgage and can be stricter than FHA. Ask the lender for its floor on the agency loan, not only on its ordinary FHA product. Where the table shows a floor, it is the agency's published minimum; a lender may still ask more, and the agency's figure is the one it cannot go under.</p>
${h.mini('credit', { p: ['cs', 'st'], d: { cs: 630, st: 'OH', p: 240000 }, t: 'Your score, another state' })}
<h2>Points or dollars: what to work on first</h2>
<p>When the score is ten or twenty points short of a floor, the cheapest move is often on the credit file rather than the savings account: lower card balances before the statement date, correct errors on the report, avoid new accounts in the months before applying. When the score is far from every floor, FHA without assistance may be the realistic plan, and the question becomes the cash. The calculator above gives both sides: the dollars FHA asks at your score and the points that separate you from the next state program.</p>
<h2>Texas, worked through</h2>
<p>With ${600} and a ${h.m(PRICE)} home in Texas, the FHA minimum is ${h.m(downAt(600))}. Both TDHCA programs ask ${K.prog('tx-mfth').minCredit}, so the help, up to ${K.prog('tx-mfth').amount.value}% of the loan, stays out of reach until the score moves ${tx.rows[3]?.[1]} points. The same household at ${K.prog('tx-mfth').minCredit} keeps the same FHA minimum and gains a 0% second loan that can pay it. The ${h.a('tx', 'Texas page')} gives the county income and price limits that apply once the score is there.</p>
`,
  },
  es: {
    slug: 'prestamos-primera-vivienda-mal-credito', nav: 'Préstamos con mal crédito', card: 'Lo que abre un puntaje de 500 a 660: entrada FHA y mínimos estatales',
    title: 'Préstamos para primera vivienda con mal crédito en 2026',
    description: 'Préstamos para primera vivienda con mal crédito en 2026: FHA desde 500 puntos con 10 % de entrada, 3.5 % desde 580 y el mínimo de cada programa de ayuda estatal',
    h1: 'Programas para comprar su primera vivienda con un puntaje de crédito bajo',
    intro: 'Escriba su puntaje, su estado y el precio: la entrada FHA con ese puntaje y los programas estatales que su puntaje ya alcanza.',
    resume: `Un puntaje de crédito bajo reduce las opciones, pero rara vez cierra la puerta. FHA, el préstamo que usa la mayoría de los compradores de primera vez con crédito dañado, asegura a partir de ${F.minScore} puntos: de ${F.minScore} a ${F.minScore35 - 1} pide el ${F.minDownLowScore} % de entrada, desde ${F.minScore35} solo el ${F.minDown} %. En una casa de ${S.m(PRICE)} ese escalón vale ${S.m(gap)} en efectivo. La ayuda estatal para el pago inicial está más arriba. De los ${progs.length} programas estatales leídos, ${floored.length} publican un mínimo de crédito, de ${lowest} a ${highest}, y ${free} dejan el puntaje al prestamista aprobado. En Texas, con 600 puntos se obtiene FHA con ${S.m(downAt(600))} de entrada, pero no My First Texas Home, que pide ${K.prog('tx-mfth').minCredit}: faltan ${txEs.rows[3]?.[1]} puntos para abrir la ayuda. La calculadora muestra esa distancia para su puntaje y su estado, para decidir si solicitar ya o dedicar unos meses a su crédito.`,
    faqs: [
      { q: '¿Qué programas aceptan un puntaje menor que 620?', a: `Ninguno de los programas estatales leídos publica un mínimo inferior a ${lowest}. Los programas de ${names('es')} no publican ningún mínimo y dejan el puntaje al prestamista, que suele aplicar el de la primera hipoteca. Por debajo de ${lowest}, la vía habitual es FHA sola, con ayuda municipal o de una organización sin fines de lucro donde exista.` },
      { q: '¿Cuánto efectivo más pide FHA con menos de 580 puntos?', a: `El mínimo sube del ${F.minDown} % al ${F.minDownLowScore} % del precio. En una casa de ${S.m(PRICE)} son ${S.m(downAt(F.minScore))} en lugar de ${S.m(downAt(F.minScore35))}, una diferencia de ${S.m(gap)}. Como casi toda la ayuda pide además un puntaje más alto, quien tiene 560 paga el monto mayor sin ayuda: por eso unos puntos pueden pesar más que unos meses de ahorro.` },
      { q: '¿Ohio pide el mismo puntaje para FHA y para un convencional?', a: `No. ${oh.name} indica ${oh.minCreditNote} (texto de la agencia). Virginia Housing hace la división inversa en su subvención: ${va.minCreditNote}. La calculadora usa la cifra publicada más baja; con un puntaje entre ambas, confirme qué primera hipoteca prevé el prestamista antes de contar con la ayuda.` },
      { q: '¿Usar esta calculadora afecta mi reporte de crédito?', a: 'No. La página solo pide un número que usted escribe, y nada sale de su navegador: ni nombre, ni número de Seguro Social, ni correo. Solo un prestamista que consulta su reporte con su permiso genera una consulta. Use el resultado para decidir cuándo solicitar y deje que el prestamista aprobado confirme el puntaje que realmente lee.' },
    ],
    body: (h) => `
<h2>Lo que abre cada tramo de puntaje</h2>
${bandTable(h)}
<p>Para la mayoría, la tabla se lee de abajo arriba. Por debajo de ${F.minScore}, ni préstamo FHA ni ayuda estatal: el trabajo está en el propio historial de crédito. Entre ${F.minScore} y ${F.minScore35 - 1}, FHA es posible pero cuesta ${h.m(gap)} más de efectivo en este precio, y ningún programa estatal leído le llega. Desde ${F.minScore35} el mínimo de FHA baja al ${F.minDown} %, pero los mínimos estatales siguen más arriba. Con ${lowest} se abren los primeros programas, con 640 la mayoría, y ${highest} es el mínimo publicado más alto.</p>
<h2>Estado por estado, la puerta más baja</h2>
${stateTable(h)}
<p>Un estado sin mínimo publicado no es un estado sin mínimo. La agencia deja que sus prestamistas aprobados apliquen sus propias reglas, que suelen seguir a la primera hipoteca y pueden ser más estrictas que FHA. Pida al prestamista su mínimo para el préstamo de la agencia, no solo para su FHA habitual. Donde la tabla muestra un mínimo, es el publicado por la agencia; el prestamista puede pedir más, pero no menos que esa cifra.</p>
${h.mini('credit', { p: ['cs', 'st'], d: { cs: 630, st: 'OH', p: 240000 }, t: 'Su puntaje, otro estado' })}
<h2>Puntos o dólares: por dónde empezar</h2>
<p>Cuando al puntaje le faltan diez o veinte puntos para un mínimo, lo más barato suele estar en el historial y no en la cuenta de ahorro: bajar los saldos de las tarjetas antes de la fecha de corte, corregir los errores del reporte y no abrir cuentas nuevas en los meses previos a la solicitud. Cuando el puntaje está lejos de todos los mínimos, FHA sin ayuda puede ser el plan realista, y la pregunta pasa a ser el efectivo. La calculadora de arriba da los dos lados: los dólares que pide FHA con su puntaje y los puntos que lo separan del siguiente programa estatal.</p>
<h2>Texas, paso a paso</h2>
<p>Con 600 puntos y una casa de ${h.m(PRICE)} en Texas, el mínimo de FHA es ${h.m(downAt(600))}. Los dos programas de TDHCA piden ${K.prog('tx-mfth').minCredit}, así que la ayuda, de hasta el ${K.prog('tx-mfth').amount.value} % del préstamo, queda fuera de alcance hasta que el puntaje suba ${txEs.rows[3]?.[1]} puntos. El mismo hogar con ${K.prog('tx-mfth').minCredit} mantiene el mismo mínimo de FHA y gana un segundo préstamo al 0 % que puede pagarlo. La ${h.a('tx', 'página de Texas')} da los límites de ingreso y precio por condado que se aplican una vez alcanzado el puntaje.</p>
`,
  },
});
