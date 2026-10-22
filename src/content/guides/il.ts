import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const ho = K.prog('il-home'), fo = K.prog('il-forgivable'), de = K.prog('il-deferred'), re = K.prog('il-repayable');
const cap = (p: typeof ho) => p.amount.max!, pc = (p: typeof ho) => p.amount.value!;
const ev = (x: ReturnType<typeof example>, id: string) => x.sm.evals.find((e) => e.p.id === id)!;
const ex = example({ st: 'IL', county: 'Cook County', income: 90000, price: 320000, size: 3 });
const exS = example({ st: 'IL', county: 'Sangamon County', income: 70000, price: 200000, size: 3 });
const rePay = ev(ex, 'il-repayable').monthly;
const contrib = Math.max(1000, 320000 * 0.01);
const cook = K.county('IL', 'Cook County'), sang = K.county('IL', 'Sangamon County'), win = K.county('IL', 'Winnebago County');
const COUNTIES = ['Cook County', 'DuPage County', 'Lake County', 'Will County', 'Kane County', 'McHenry County', 'Winnebago County', 'Madison County', 'St. Clair County', 'Champaign County', 'Sangamon County', 'Peoria County'];
const capPrice = (p: typeof ho) => Math.round(cap(p) / (pc(p) / 100));

export default defineGuide({
  id: 'il', group: 'states', order: 11, state: 'IL', tool: 'dpa', toolArg: { st: 'IL', c: cook.id, i: 90000, p: 320000, h: 3 },
  related: ['requirements', 'forgivable', 'payment', 'programs', 'mi', 'oh'],
  sources: ['agency-IL', 'prog-il-home', 'prog-il-forgivable', 'prog-il-deferred', 'prog-il-repayable', 'hud-il'],
  en: {
    slug: 'illinois-down-payment-assistance', nav: 'Illinois', card: 'IHDA Access Home, Forgivable, Deferred and Repayable: four loans up to $15,000',
    title: 'Illinois Down Payment Assistance 2026: IHDA Access Loans',
    description: `Illinois down payment assistance in 2026: IHDA Access Home up to ${E.m(cap(ho))}, plus Forgivable, Deferred and Repayable options, with limits for all 102 counties.`,
    h1: 'Illinois down payment assistance with IHDA',
    intro: 'Choose your Illinois county, income and price: the four IHDA Access options side by side, their amount and monthly cost, and the cash left.',
    resume: `The Illinois Housing Development Authority (IHDA) offers four second loans with its first mortgages, each a share of the price with a dollar cap. Access Home pays ${pc(ho)}% of the price up to ${E.m(cap(ho))}, interest-free and deferred for the life of the mortgage, to first-time buyers, veterans and buyers in targeted areas. The other three are open to repeat buyers too: Access Forgivable pays ${pc(fo)}% up to ${E.m(cap(fo))}, forgiven monthly over ten years; Access Deferred pays ${pc(de)}% up to ${E.m(cap(de))}, repaid on sale or refinance; Access Repayable pays ${pc(re)}% up to ${E.m(cap(re))}, repaid monthly over ten years at 0%. All need a 640 credit score, a homebuyer course and a contribution of ${E.m(1000)} or 1% of the price, whichever is greater. IHDA's county limits apply to reservations from July 1, 2026. In Cook County, a household of three earning ${E.m(90000)} buying at ${E.m(320000)} could draw ${E.m(ev(ex, 'il-home').amount ?? 0)} from Access Home, more than the ${E.m(ex.sm.down)} FHA minimum.`,
    faqs: [
      { q: 'Which IHDA Access option should I pick in Illinois?', a: `If you are a first-time buyer, Access Home gives the most, up to ${E.m(cap(ho))}, but it stays owed until you sell or refinance. A repeat buyer chooses among the other three: Forgivable is the cheapest if you stay ten years, Deferred gives more but is never forgiven, and Repayable gives the most of the three at about ${E.m(rePay)} a month in the Cook County example.` },
      { q: 'How much of my own money does IHDA require?', a: `${E.m(1000)} or 1% of the price, whichever is greater, according to IHDA. On a ${E.m(320000)} home that is ${E.m(contrib)}. The lender checks where the money comes from and asks for bank statements showing it. It counts toward the down payment or closing costs, not on top of them.` },
      { q: 'Does Access Forgivable shrink every month in Illinois?', a: `Yes. IHDA forgives it monthly over ten years, so each month in the home erases one 120th of the ${E.m(cap(fo))} maximum. After five years half is gone. A sale or refinance before ten years repays only what is left, unlike the cliff schedules of several other states.` },
    ],
    body: (h) => `
<h2>IHDA's four Access options</h2>
${stateProgTable(h, 'IL')}
<p>The caps are reached at modest prices: ${h.m(cap(ho))} for Access Home at a ${h.m(capPrice(ho))} home, ${h.m(cap(de))} for Deferred at ${h.m(capPrice(de))}, ${h.m(cap(fo))} for Forgivable at ${h.m(capPrice(fo))}, and ${h.m(cap(re))} for Repayable at only ${h.m(capPrice(re))}. Above those prices the help is a fixed sum, so in the Chicago suburbs it covers a smaller share of the down payment than downstate.</p>
<p>The four options also treat time differently. Access Home and Access Deferred never shrink: whether you sell after two years or twenty, the full sum comes back out of the sale. Access Forgivable fades month by month and is gone after ten years. Access Repayable is paid off by the buyer over the same ten years, so it adds to the monthly budget and to the debt ratio the lender checks, but leaves nothing behind at a sale after that.</p>
<h2>Chicago and downstate</h2>
${countyTable(h, 'IL', COUNTIES)}
<p>Cook and the collar counties share a HUD median of ${h.m(cook.m)}; Sangamon, home to Springfield, is at ${h.m(sang.m)}; Winnebago, around Rockford, at ${h.m(win.m)}. Every county sits at the FHA floor of ${h.m(K.P.fha.floor)}. IHDA publishes its own income and purchase price limits by county, which we link; the calculator marks them to confirm and shows your income against the HUD median as a guide.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'IL', c: sang.id, i: 70000, p: 200000, h: 3 }, t: 'Your Illinois county' })}
<h2>Cook County, worked through</h2>
${exampleTable(h, { st: 'IL', county: 'Cook County', income: 90000, price: 320000, size: 3 }, h.t(`Household of three, ${h.m(90000)}, ${h.m(320000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(90000)}, casa de ${h.m(320000)}, préstamo FHA, 680 puntos.`))}
<p>The FHA minimum here is ${h.m(ex.sm.down)}, and the buyer's required contribution of ${h.m(contrib)} counts toward it. Access Home covers the rest and part of the closing costs. In Sangamon County, at ${h.m(200000)}, Access Home is ${h.m(ev(exS, 'il-home').amount ?? 0)} against a ${h.m(exS.sm.down)} minimum, and Access Repayable at its full ${h.m(cap(re))} would add about ${h.m(ev(exS, 'il-repayable').monthly)} a month.</p>
<h2>Applying in Illinois</h2>
<p>IHDA loans are reserved by participating lenders, and the homebuyer course must be done before closing. Ask the lender to price at least two Access options: the first mortgage rate differs from one to the other, and a cheaper second loan can come with a dearer first. Chicago and several counties run their own purchase assistance, which some IHDA lenders combine with Access loans. Keep the reservation date in mind as well, since the county limits that apply are the ones in force on that day.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-illinois', nav: 'Illinois', card: 'IHDA Access Home, Forgivable, Deferred y Repayable: cuatro préstamos de hasta $15,000',
    title: 'Ayuda para el pago inicial en Illinois 2026: préstamos IHDA',
    description: `Ayuda para el pago inicial en Illinois 2026: IHDA Access Home hasta ${S.m(cap(ho))}, más las opciones Forgivable, Deferred y Repayable, en los 102 condados del estado.`,
    h1: 'Ayuda para el pago inicial en Illinois con IHDA',
    intro: 'Elija su condado de Illinois, su ingreso y el precio: las cuatro opciones Access de IHDA lado a lado, su monto, su costo mensual y el efectivo que queda.',
    resume: `La Illinois Housing Development Authority (IHDA) ofrece cuatro segundos préstamos con sus primeras hipotecas, cada uno un porcentaje del precio con un tope en dólares. Access Home paga el ${pc(ho)} % del precio hasta ${S.m(cap(ho))}, sin interés y diferido durante toda la hipoteca, a compradores de primera vez, veteranos y compradores en zonas prioritarias. Las otras tres están abiertas también a quien ya tuvo casa: Access Forgivable paga el ${pc(fo)} % hasta ${S.m(cap(fo))}, perdonado mes a mes durante diez años; Access Deferred paga el ${pc(de)} % hasta ${S.m(cap(de))}, devuelto al vender o refinanciar; Access Repayable paga el ${pc(re)} % hasta ${S.m(cap(re))}, devuelto cada mes durante diez años al 0 %. Todas piden 640 puntos, un curso para compradores y un aporte de ${S.m(1000)} o el 1 % del precio, lo que sea mayor. Los límites de IHDA por condado se aplican a las reservas desde el 1 de julio de 2026. En el condado de Cook, un hogar de tres que gana ${S.m(90000)} y compra por ${S.m(320000)} podría obtener ${S.m(ev(ex, 'il-home').amount ?? 0)} de Access Home, más que la entrada mínima FHA de ${S.m(ex.sm.down)}.`,
    faqs: [
      { q: '¿Qué opción Access de IHDA conviene elegir en Illinois?', a: `Si compra por primera vez, Access Home da más, hasta ${S.m(cap(ho))}, pero se sigue debiendo hasta que vende o refinancia. Quien ya tuvo casa elige entre las otras tres: Forgivable es la más barata si se queda diez años, Deferred da más pero nunca se perdona, y Repayable es la mayor de las tres, con unos ${S.m(rePay)} al mes en el ejemplo de Cook.` },
      { q: '¿Cuánto dinero propio exige IHDA?', a: `${S.m(1000)} o el 1 % del precio, lo que sea mayor, según IHDA. En una casa de ${S.m(320000)} son ${S.m(contrib)}. El prestamista revisa el origen del dinero y pide estados de cuenta que lo muestren. Cuenta para la entrada o los gastos de cierre, no se suma a ellos.` },
      { q: '¿Access Forgivable baja cada mes en Illinois?', a: `Sí. IHDA lo perdona mes a mes durante diez años, así que cada mes en la casa borra una ciento veinteava parte del máximo de ${S.m(cap(fo))}. A los cinco años desapareció la mitad. Vender o refinanciar antes de los diez años solo obliga a devolver lo que queda, a diferencia de los calendarios de todo o nada de otros estados.` },
    ],
    body: (h) => `
<h2>Las cuatro opciones Access de IHDA</h2>
${stateProgTable(h, 'IL')}
<p>Los topes se alcanzan con precios modestos: ${h.m(cap(ho))} para Access Home con una casa de ${h.m(capPrice(ho))}, ${h.m(cap(de))} para Deferred con ${h.m(capPrice(de))}, ${h.m(cap(fo))} para Forgivable con ${h.m(capPrice(fo))} y ${h.m(cap(re))} para Repayable con apenas ${h.m(capPrice(re))}. Por encima de esos precios la ayuda es una suma fija, así que en los suburbios de Chicago cubre una parte menor de la entrada que en el resto del estado.</p>
<p>Las cuatro opciones tratan además el tiempo de forma distinta. Access Home y Access Deferred nunca bajan: venda a los dos años o a los veinte, la suma completa sale de la venta. Access Forgivable se va borrando mes a mes y desaparece a los diez años. Access Repayable lo paga el comprador en esos mismos diez años, así que pesa en el presupuesto mensual y en la relación de deuda que revisa el prestamista, pero no deja nada pendiente en una venta posterior.</p>
<h2>Chicago y el resto del estado</h2>
${countyTable(h, 'IL', COUNTIES)}
<p>Cook y los condados vecinos comparten una mediana de HUD de ${h.m(cook.m)}; Sangamon, sede de Springfield, está en ${h.m(sang.m)}; Winnebago, alrededor de Rockford, en ${h.m(win.m)}. Todos los condados están en el piso FHA de ${h.m(K.P.fha.floor)}. IHDA publica sus propios límites de ingreso y de precio por condado, que enlazamos; la calculadora los marca para confirmar y muestra su ingreso frente a la mediana de HUD como guía.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'IL', c: sang.id, i: 70000, p: 200000, h: 3 }, t: 'Su condado de Illinois' })}
<h2>El condado de Cook, paso a paso</h2>
${exampleTable(h, { st: 'IL', county: 'Cook County', income: 90000, price: 320000, size: 3 }, h.t(`Household of three, ${h.m(90000)}, ${h.m(320000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(90000)}, casa de ${h.m(320000)}, préstamo FHA, 680 puntos.`))}
<p>La entrada mínima FHA aquí es de ${h.m(ex.sm.down)}, y el aporte obligatorio del comprador, ${h.m(contrib)}, cuenta para ella. Access Home cubre el resto y parte de los gastos de cierre. En el condado de Sangamon, con ${h.m(200000)}, Access Home es de ${h.m(ev(exS, 'il-home').amount ?? 0)} frente a una entrada mínima de ${h.m(exS.sm.down)}, y Access Repayable, con sus ${h.m(cap(re))} completos, añadiría unos ${h.m(ev(exS, 'il-repayable').monthly)} al mes.</p>
<h2>Cómo solicitarla en Illinois</h2>
<p>Los préstamos de IHDA los reservan prestamistas participantes, y el curso para compradores debe hacerse antes del cierre. Pida al prestamista que cotice al menos dos opciones Access: la tasa de la primera hipoteca cambia de una a otra, y un segundo préstamo más barato puede venir con una primera hipoteca más cara. Chicago y varios condados tienen su propia ayuda para la compra, que algunos prestamistas de IHDA combinan con los préstamos Access. Tenga presente también la fecha de reserva, porque los límites del condado que se aplican son los vigentes ese día.</p>
`,
  },
});
