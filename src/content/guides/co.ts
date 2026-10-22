import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const gr = K.prog('co-grant'), se = K.prog('co-second');
const gP = gr.amount.value!, sP = se.amount.value!;
const ev = (x: ReturnType<typeof example>, id: string) => x.sm.evals.find((e) => e.p.id === id)!;
const ex = example({ st: 'CO', county: 'Denver County', income: 100000, price: 520000, size: 3 });
const exE = example({ st: 'CO', county: 'El Paso County', income: 90000, price: 430000, size: 3 });
const g = ev(ex, 'co-grant').amount ?? 0, s2 = ev(ex, 'co-second').amount ?? 0;
const den = K.county('CO', 'Denver County'), elp = K.county('CO', 'El Paso County'), bou = K.county('CO', 'Boulder County'), pue = K.county('CO', 'Pueblo County');
const COUNTIES = ['Denver County', 'El Paso County', 'Arapahoe County', 'Jefferson County', 'Adams County', 'Douglas County', 'Larimer County', 'Boulder County', 'Weld County', 'Pueblo County', 'Mesa County'];

export default defineGuide({
  id: 'co', group: 'states', order: 13, state: 'CO', tool: 'dpa', toolArg: { st: 'CO', c: den.id, i: 100000, p: 520000, h: 3 },
  related: ['grants', 'programs', 'loan-limits', 'how-much-down', 'az', 'wa'],
  sources: ['agency-CO', 'prog-co-grant', 'prog-co-second', 'hud-il', 'fha-ml'],
  en: {
    slug: 'colorado-down-payment-assistance', nav: 'Colorado', card: 'CHFA grant up to 3% never repaid, or a deferred second up to 4% of the loan',
    title: 'Colorado Down Payment Assistance 2026: CHFA Grant or Second',
    description: `Colorado down payment assistance in 2026: a CHFA grant up to ${gP}% of the loan that is never repaid, or a deferred second up to ${sP}%, with figures for 64 counties.`,
    h1: 'Colorado down payment assistance with CHFA',
    intro: 'Choose your Colorado county, income and price: the CHFA grant and the deferred second side by side, and the cash each one leaves you to bring.',
    resume: `The Colorado Housing and Finance Authority (CHFA) offers two kinds of help with its first mortgages. The Down Payment Assistance Grant pays up to ${gP}% of the first mortgage and does not have to be repaid; it goes with the CHFA SmartStep and Preferred loans. The Down Payment Assistance Second Mortgage Loan pays up to ${sP}% of the first mortgage, with repayment deferred until you sell, refinance or stop living in the home; it also works with CHFA FirstStep. Both need a 620 credit score, a homebuyer course and a Minimum Financial Investment of ${E.m(1000)} from the buyer. Whether you must be a first-time buyer depends on the CHFA first mortgage. Income limits are set by program, county, household size and targeted area, which we link. In Denver, a household of three earning ${E.m(100000)} buying at ${E.m(520000)} with FHA could get a grant of ${E.m(g)} or a second of ${E.m(s2)}, against an ${E.m(ex.sm.down)} minimum down payment.`,
    faqs: [
      { q: 'Is the CHFA down payment grant really free?', a: `It does not have to be repaid, according to CHFA. The cost is elsewhere: the grant is smaller than the second mortgage, up to ${gP}% of the loan against ${sP}%, and the CHFA first mortgage that carries it may be priced differently. Ask the lender for both versions and compare the rate as well as the cash at closing.` },
      { q: 'When is the CHFA second mortgage repaid in Colorado?', a: 'When you sell, refinance or no longer use the home as your primary residence. Until then there is no payment. It is not forgiven over time, so the full amount comes back out of the sale or the new loan, which matters for a buyer who expects to refinance once rates fall.' },
      { q: 'What is the CHFA Minimum Financial Investment?', a: `${E.m(1000)} that the buyer must put into the purchase from their own funds, on top of what the grant or the second covers. It can go toward the down payment, the closing costs or prepaid items. The lender documents where it comes from with bank statements.` },
    ],
    body: (h) => `
<h2>CHFA's grant and second mortgage</h2>
${stateProgTable(h, 'CO')}
<p>Both are shares of the first mortgage, so they grow with the loan. On the Denver example the gap between them is ${h.m(s2 - g)}: the second covers the whole FHA minimum and more, the grant falls short of it. CHFA's site refuses scripted connections; the terms come from the indexed text of its official pages.</p>
<h2>The Front Range and beyond</h2>
${countyTable(h, 'CO', COUNTIES)}
<p>The Denver metro counties share a HUD median of ${h.m(den.m)} and an FHA limit of ${h.m(den.fha ?? 0)}; Boulder is higher, at ${h.m(bou.m)} and ${h.m(bou.fha ?? 0)}; El Paso, around Colorado Springs, at ${h.m(elp.m)} and ${h.m(elp.fha ?? 0)}; Pueblo at ${h.m(pue.m)} and the floor. CHFA's income limits follow the same geography with their own figures; the calculator marks them to confirm. Because both kinds of help are a share of the loan, a buyer in Boulder or Douglas County draws more dollars than one in Pueblo, but covers about the same share of the purchase. What changes is how much of the closing costs is left, since those do not scale with the price in the same way.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'CO', c: elp.id, i: 90000, p: 430000, h: 3 }, t: 'Your Colorado county' })}
<h2>Denver, worked through</h2>
${exampleTable(h, { st: 'CO', county: 'Denver County', income: 100000, price: 520000, size: 3 }, h.t(`Household of three, ${h.m(100000)}, ${h.m(520000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(100000)}, casa de ${h.m(520000)}, préstamo FHA, 680 puntos.`))}
<p>With the grant, ${h.m(Math.max(0, ex.sm.down - g))} of the down payment remains, plus closing costs. With the second, the down payment is covered and ${h.m(Math.max(0, s2 - ex.sm.down))} goes to closing costs, but ${h.m(s2)} is owed on the day you sell. In El Paso County at ${h.m(430000)}, the grant would be ${h.m(ev(exE, 'co-grant').amount ?? 0)} and the second ${h.m(ev(exE, 'co-second').amount ?? 0)}.</p>
<h2>Choosing and applying in Colorado</h2>
<p>A buyer who has saved part of the down payment and wants nothing owed later should take the grant. A buyer with little saved can take the second and plan to repay it from the sale. Either way the ${h.m(1000)} investment and the homebuyer course come first, and the help is reserved by a CHFA participating lender with the first mortgage. Denver, Boulder and other cities run their own programs, often with lower income limits, which some lenders layer on top. Ask the lender which CHFA first mortgage it recommends for your file, since FirstStep, SmartStep and Preferred do not carry the same help: only the second mortgage works with FirstStep.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-colorado', nav: 'Colorado', card: 'Subvención de CHFA de hasta el 3 % que no se devuelve, o una segunda diferida de hasta el 4 %',
    title: 'Ayuda para el pago inicial en Colorado 2026: CHFA 3 %',
    description: `Ayuda para el pago inicial en Colorado 2026: una subvención de CHFA de hasta el ${gP} % del préstamo que no se devuelve, o una segunda diferida de hasta el ${sP} %.`,
    h1: 'Ayuda para el pago inicial en Colorado con CHFA',
    intro: 'Elija su condado de Colorado, su ingreso y el precio: la subvención de CHFA y la segunda diferida lado a lado, y el efectivo que cada una le deja por poner.',
    resume: `La Colorado Housing and Finance Authority (CHFA) ofrece dos tipos de ayuda con sus primeras hipotecas. La Down Payment Assistance Grant paga hasta el ${gP} % de la primera hipoteca y no hay que devolverla; acompaña a los préstamos SmartStep y Preferred de CHFA. La Down Payment Assistance Second Mortgage Loan paga hasta el ${sP} % de la primera hipoteca, con la devolución diferida hasta que vende, refinancia o deja de vivir en la casa; funciona también con CHFA FirstStep. Ambas piden 620 puntos de crédito, un curso para compradores y una Minimum Financial Investment de ${S.m(1000)} del comprador. Si hay que comprar por primera vez depende de la primera hipoteca de CHFA. Los límites de ingreso se fijan por programa, condado, tamaño del hogar y zona prioritaria, y los enlazamos. En Denver, un hogar de tres que gana ${S.m(100000)} y compra por ${S.m(520000)} con FHA podría recibir una subvención de ${S.m(g)} o una segunda de ${S.m(s2)}, frente a una entrada mínima de ${S.m(ex.sm.down)}.`,
    faqs: [
      { q: '¿La subvención de CHFA para la entrada es realmente gratis?', a: `No hay que devolverla, según CHFA. El costo está en otra parte: la subvención es menor que la segunda hipoteca, hasta el ${gP} % del préstamo frente al ${sP} %, y la primera hipoteca de CHFA que la lleva puede tener otra tasa. Pida al prestamista las dos versiones y compare la tasa además del efectivo al cierre.` },
      { q: '¿Cuándo se devuelve la segunda hipoteca de CHFA en Colorado?', a: 'Cuando vende, refinancia o deja de usar la casa como residencia principal. Hasta entonces no hay cuota. No se perdona con el tiempo, así que el monto completo sale de la venta o del nuevo préstamo, lo que importa a quien espera refinanciar cuando bajen las tasas.' },
      { q: '¿Qué es la Minimum Financial Investment de CHFA?', a: `${S.m(1000)} que el comprador debe poner en la compra con sus propios fondos, además de lo que cubre la subvención o la segunda. Puede ir a la entrada, a los gastos de cierre o a los prepagos. El prestamista documenta su origen con estados de cuenta bancarios.` },
    ],
    body: (h) => `
<h2>La subvención y la segunda hipoteca de CHFA</h2>
${stateProgTable(h, 'CO')}
<p>Ambas son un porcentaje de la primera hipoteca, así que crecen con el préstamo. En el ejemplo de Denver la diferencia entre las dos es de ${h.m(s2 - g)}: la segunda cubre toda la entrada mínima FHA y algo más, la subvención no llega. El sitio de CHFA rechaza las conexiones automatizadas; las condiciones salen del texto indexado de sus páginas oficiales.</p>
<h2>El Front Range y el resto del estado</h2>
${countyTable(h, 'CO', COUNTIES)}
<p>Los condados del área de Denver comparten una mediana de HUD de ${h.m(den.m)} y un límite FHA de ${h.m(den.fha ?? 0)}; Boulder está más arriba, con ${h.m(bou.m)} y ${h.m(bou.fha ?? 0)}; El Paso, alrededor de Colorado Springs, con ${h.m(elp.m)} y ${h.m(elp.fha ?? 0)}; Pueblo con ${h.m(pue.m)} y el piso. Los límites de ingreso de CHFA siguen la misma geografía con cifras propias; la calculadora los marca para confirmar. Como las dos ayudas son un porcentaje del préstamo, quien compra en Boulder o Douglas recibe más dólares que quien compra en Pueblo, pero cubre más o menos la misma parte de la compra. Lo que cambia es cuánto queda de los gastos de cierre, que no crecen con el precio de la misma manera.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'CO', c: elp.id, i: 90000, p: 430000, h: 3 }, t: 'Su condado de Colorado' })}
<h2>Denver, paso a paso</h2>
${exampleTable(h, { st: 'CO', county: 'Denver County', income: 100000, price: 520000, size: 3 }, h.t(`Household of three, ${h.m(100000)}, ${h.m(520000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(100000)}, casa de ${h.m(520000)}, préstamo FHA, 680 puntos.`))}
<p>Con la subvención quedan ${h.m(Math.max(0, ex.sm.down - g))} de la entrada, más los gastos de cierre. Con la segunda, la entrada queda cubierta y ${h.m(Math.max(0, s2 - ex.sm.down))} van a los gastos de cierre, pero se deben ${h.m(s2)} el día que venda. En el condado de El Paso, con ${h.m(430000)}, la subvención sería de ${h.m(ev(exE, 'co-grant').amount ?? 0)} y la segunda de ${h.m(ev(exE, 'co-second').amount ?? 0)}.</p>
<h2>Elegir y solicitar en Colorado</h2>
<p>Quien ya ahorró parte de la entrada y no quiere deber nada después debería tomar la subvención. Quien ha ahorrado poco puede tomar la segunda y prever devolverla con la venta. En ambos casos la inversión de ${h.m(1000)} y el curso para compradores van primero, y la ayuda la reserva un prestamista participante de CHFA junto con la primera hipoteca. Denver, Boulder y otras ciudades tienen sus propios programas, a menudo con límites de ingreso más bajos, que algunos prestamistas suman. Pregunte al prestamista qué primera hipoteca de CHFA recomienda para su expediente, porque FirstStep, SmartStep y Preferred no llevan la misma ayuda: solo la segunda hipoteca funciona con FirstStep.</p>
`,
  },
});
