import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const kf = K.prog('pa-kfit'), ka = K.prog('pa-kaal');
const kfPct = kf.amount.value!, kaPct = ka.amount.value!, kaMax = ka.amount.max!, yrs = kf.forgivenAfterYears!;
const ev = (x: ReturnType<typeof example>, id: string) => x.sm.evals.find((e) => e.p.id === id)!;
const ex = example({ st: 'PA', county: 'Philadelphia County', income: 80000, price: 280000, size: 3 });
const exA = example({ st: 'PA', county: 'Allegheny County', income: 75000, price: 230000, size: 3 });
const kfA = ev(ex, 'pa-kfit').amount ?? 0, kaA = ev(ex, 'pa-kaal').amount ?? 0, kaPay = ev(ex, 'pa-kaal').monthly;
const owed4 = K.owedAtSale(kfA, 'linear', 4, yrs);
const kaCapPrice = Math.round(kaMax / (kaPct / 100));
const phl = K.county('PA', 'Philadelphia County'), all = K.county('PA', 'Allegheny County'), lan = K.county('PA', 'Lancaster County');
const COUNTIES = ['Philadelphia County', 'Allegheny County', 'Montgomery County', 'Bucks County', 'Delaware County', 'Chester County', 'Lancaster County', 'York County', 'Berks County', 'Lehigh County', 'Dauphin County', 'Erie County'];

export default defineGuide({
  id: 'pa', group: 'states', order: 10, state: 'PA', tool: 'dpa', toolArg: { st: 'PA', c: phl.id, i: 80000, p: 280000, h: 3 },
  related: ['forgivable', 'payment', 'requirements', 'income-limits', 'nj', 'oh'],
  sources: ['agency-PA', 'prog-pa-kfit', 'prog-pa-kaal', 'hud-il', 'fha-ml'],
  en: {
    slug: 'pennsylvania-down-payment-assistance', nav: 'Pennsylvania', card: 'PHFA K-FIT 5% forgiven over ten years, or the Keystone Advantage loan at 0%',
    title: 'Pennsylvania Down Payment Assistance 2026: PHFA K-FIT 5%',
    description: `Pennsylvania down payment assistance in 2026: PHFA K-FIT pays ${kfPct}% of the price, forgiven over ten years, or Keystone Advantage, up to ${E.m(kaMax)} at 0% interest.`,
    h1: 'Pennsylvania down payment assistance with PHFA',
    intro: 'Choose your Pennsylvania county, income and price: what K-FIT and Keystone Advantage would lend, the monthly cost, and the cash still needed.',
    resume: `The Pennsylvania Housing Finance Agency (PHFA) offers two kinds of help. K-FIT, short for Keystone Forgivable in Ten Years, pays ${kfPct}% of the lesser of the price or appraised value, with no dollar cap, as a second loan with no payment that is forgiven 10% a year over ten years. It goes with a PHFA first mortgage, whose first-time rule it follows: the Keystone Home Loan requires that you have not owned a main residence in three years. The Keystone Advantage Assistance Loan pays ${kaPct}% of the price or ${E.m(kaMax)}, whichever is less, at 0% interest, repaid monthly over ten years, with any first mortgage type and no first-time rule, but liquid assets capped at ${E.m(50000)} after closing. Both ask for a 660 credit score and a homebuyer course. In Philadelphia, a household of three earning ${E.m(80000)} buying at ${E.m(280000)} could get ${E.m(kfA)} from K-FIT, more than the ${E.m(ex.sm.down)} FHA minimum down payment.`,
    faqs: [
      { q: 'How much of a PHFA K-FIT loan is left after four years?', a: `Sixty percent. K-FIT is forgiven 10% a year over ten years, so after four full years four tenths are gone. On the Philadelphia example of ${E.m(kfA)}, a sale or refinance at that point means repaying about ${E.m(owed4)}. After ten years nothing is owed, and there is never a monthly payment or interest.` },
      { q: 'Who should take Keystone Advantage instead of K-FIT in Pennsylvania?', a: `A buyer who has owned a home before, or who wants a first mortgage that is not a PHFA Keystone loan. Keystone Advantage has no first-time rule and works with conventional, FHA, VA and USDA loans. It is smaller, ${E.m(kaMax)} at most, and repaid at about ${E.m(kaPay)} a month for ten years.` },
      { q: 'Does K-FIT have a maximum amount in Pennsylvania?', a: `No dollar maximum, according to PHFA: it is ${kfPct}% of the lesser of the price or appraised value. The price is limited instead by PHFA's purchase price limits by county, and by the income limits of the Keystone Home Loan. On a ${E.m(400000)} home that would be ${E.m(400000 * kfPct / 100)}.` },
    ],
    body: (h) => `
<h2>PHFA's two programs</h2>
${stateProgTable(h, 'PA')}
<p>K-FIT is the larger and cheaper of the two: ${kfPct}% of the price is more than the FHA minimum down payment, so it reaches into closing costs, and it costs nothing if you stay ten years. Its catch is the first mortgage: the rate of a PHFA loan carrying K-FIT is set by the agency and is not always the lowest available. Keystone Advantage is a modest loan that any first mortgage can carry; its cap of ${h.m(kaMax)} is reached at a price of ${h.m(kaCapPrice)}. PHFA's site refuses scripted connections; the terms come from the indexed text of its official pages.</p>
<h2>Pennsylvania's counties</h2>
${countyTable(h, 'PA', COUNTIES)}
<p>The Philadelphia area counties share a HUD median of ${h.m(phl.m)} and an FHA limit of ${h.m(phl.fha ?? 0)}; Allegheny, home to Pittsburgh, is at ${h.m(all.m)} and the floor; Lancaster at ${h.m(lan.m)}. PHFA's income and purchase price limits, in Appendix A of its seller's guide, vary by county; we link them, and the calculator marks them to confirm.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'PA', c: all.id, i: 75000, p: 230000, h: 3 }, t: 'Your Pennsylvania county' })}
<h2>Philadelphia, worked through</h2>
${exampleTable(h, { st: 'PA', county: 'Philadelphia County', income: 80000, price: 280000, size: 3 }, h.t(`Household of three, ${h.m(80000)}, ${h.m(280000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(80000)}, casa de ${h.m(280000)}, préstamo FHA, 680 puntos.`))}
<p>K-FIT leaves ${h.m(Math.max(0, kfA - ex.sm.down))} after the down payment for closing costs. Keystone Advantage at ${h.m(kaA)} covers most of the down payment and adds about ${h.m(kaPay)} a month for ten years. In Allegheny County, at ${h.m(230000)}, K-FIT is ${h.m(ev(exA, 'pa-kfit').amount ?? 0)} and the FHA minimum ${h.m(exA.sm.down)}.</p>
<p>The asset rule of Keystone Advantage deserves a look before you apply: liquid assets above ${h.m(50000)} left after closing rule it out, which can surprise buyers who sold stock or received an inheritance. K-FIT's forgiveness, on the other hand, rewards time in the home, so a buyer expecting a job move within three or four years should count the balance that would still be owed.</p>
<h2>Applying in Pennsylvania</h2>
<p>PHFA works through participating lenders and requires homebuyer education before closing. The credit floor of 660 is higher than in most states on this site, so check your score before you shop. Philadelphia and several counties add their own grants, which PHFA lenders often combine with Keystone loans; ask the lender which ones it handles for your address, and get the K-FIT quote side by side with a plain FHA quote.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-pensilvania', nav: 'Pensilvania', card: 'K-FIT de PHFA del 5 % perdonado en diez años, o el préstamo Keystone Advantage al 0 %',
    title: 'Ayuda para el pago inicial en Pensilvania 2026: PHFA K-FIT',
    description: `Ayuda para el pago inicial en Pensilvania 2026: K-FIT de PHFA da el ${kfPct} % del precio, perdonado en diez años, o Keystone Advantage hasta ${S.m(kaMax)} al 0 % de interés.`,
    h1: 'Ayuda para el pago inicial en Pensilvania con PHFA',
    intro: 'Elija su condado de Pensilvania, su ingreso y el precio: lo que prestarían K-FIT y Keystone Advantage, el costo mensual y el efectivo que aún necesita.',
    resume: `La Pennsylvania Housing Finance Agency (PHFA) ofrece dos tipos de ayuda. K-FIT, abreviatura de Keystone Forgivable in Ten Years, paga el ${kfPct} % del menor entre el precio y el valor de tasación, sin tope en dólares, como un segundo préstamo sin cuota que se perdona un 10 % por año durante diez años. Acompaña a una primera hipoteca de PHFA, cuya regla de primera vivienda sigue: el Keystone Home Loan exige no haber tenido residencia principal en tres años. El Keystone Advantage Assistance Loan paga el ${kaPct} % del precio o ${S.m(kaMax)}, lo que sea menor, al 0 % de interés, devuelto cada mes durante diez años, con cualquier tipo de primera hipoteca y sin regla de primera vivienda, pero con activos líquidos limitados a ${S.m(50000)} después del cierre. Ambos piden 660 puntos de crédito y un curso para compradores. En Filadelfia, un hogar de tres que gana ${S.m(80000)} y compra por ${S.m(280000)} podría recibir ${S.m(kfA)} de K-FIT, más que la entrada mínima FHA de ${S.m(ex.sm.down)}.`,
    faqs: [
      { q: '¿Cuánto queda de un préstamo K-FIT de PHFA a los cuatro años?', a: `El sesenta por ciento. K-FIT se perdona un 10 % por año durante diez años, así que tras cuatro años completos desaparecieron cuatro décimas. En el ejemplo de Filadelfia, de ${S.m(kfA)}, vender o refinanciar en ese momento supone devolver unos ${S.m(owed4)}. Pasados diez años no se debe nada, y nunca hay cuota mensual ni interés.` },
      { q: '¿Quién debería tomar Keystone Advantage en lugar de K-FIT en Pensilvania?', a: `Quien ya tuvo casa, o quien quiere una primera hipoteca que no sea un préstamo Keystone de PHFA. Keystone Advantage no tiene regla de primera vivienda y funciona con préstamos convencionales, FHA, VA y USDA. Es más pequeño, ${S.m(kaMax)} como máximo, y se devuelve con unos ${S.m(kaPay)} al mes durante diez años.` },
      { q: '¿K-FIT tiene un monto máximo en Pensilvania?', a: `No tiene máximo en dólares, según PHFA: es el ${kfPct} % del menor entre el precio y el valor de tasación. El precio lo limitan en cambio los topes de precio de PHFA por condado y los límites de ingreso del Keystone Home Loan. En una casa de ${S.m(400000)} serían ${S.m(400000 * kfPct / 100)}.` },
    ],
    body: (h) => `
<h2>Los dos programas de PHFA</h2>
${stateProgTable(h, 'PA')}
<p>K-FIT es el mayor y el más barato de los dos: el ${kfPct} % del precio supera la entrada mínima FHA, así que llega a los gastos de cierre, y no cuesta nada si se queda diez años. Su condición es la primera hipoteca: la tasa de un préstamo de PHFA con K-FIT la fija la agencia y no siempre es la más baja disponible. Keystone Advantage es un préstamo modesto que cualquier primera hipoteca puede llevar; su tope de ${h.m(kaMax)} se alcanza con un precio de ${h.m(kaCapPrice)}. El sitio de PHFA rechaza las conexiones automatizadas; las condiciones salen del texto indexado de sus páginas oficiales.</p>
<h2>Los condados de Pensilvania</h2>
${countyTable(h, 'PA', COUNTIES)}
<p>Los condados del área de Filadelfia comparten una mediana de HUD de ${h.m(phl.m)} y un límite FHA de ${h.m(phl.fha ?? 0)}; Allegheny, sede de Pittsburgh, está en ${h.m(all.m)} y en el piso; Lancaster en ${h.m(lan.m)}. Los límites de ingreso y de precio de PHFA, en el Apéndice A de su guía para prestamistas, cambian por condado; los enlazamos y la calculadora los marca para confirmar.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'PA', c: all.id, i: 75000, p: 230000, h: 3 }, t: 'Su condado de Pensilvania' })}
<h2>Filadelfia, paso a paso</h2>
${exampleTable(h, { st: 'PA', county: 'Philadelphia County', income: 80000, price: 280000, size: 3 }, h.t(`Household of three, ${h.m(80000)}, ${h.m(280000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(80000)}, casa de ${h.m(280000)}, préstamo FHA, 680 puntos.`))}
<p>K-FIT deja ${h.m(Math.max(0, kfA - ex.sm.down))} después de la entrada para los gastos de cierre. Keystone Advantage, con ${h.m(kaA)}, cubre la mayor parte de la entrada y añade unos ${h.m(kaPay)} al mes durante diez años. En el condado de Allegheny, con ${h.m(230000)}, K-FIT es de ${h.m(ev(exA, 'pa-kfit').amount ?? 0)} y la entrada mínima FHA de ${h.m(exA.sm.down)}.</p>
<p>La regla de activos de Keystone Advantage merece una mirada antes de solicitarla: más de ${h.m(50000)} en activos líquidos después del cierre la excluyen, algo que sorprende a quien vendió acciones o recibió una herencia. El perdón de K-FIT, en cambio, premia el tiempo en la casa, así que quien espera un traslado de trabajo en tres o cuatro años debería contar el saldo que todavía debería.</p>
<h2>Cómo solicitarla en Pensilvania</h2>
<p>PHFA trabaja con prestamistas participantes y exige un curso para compradores antes del cierre. El puntaje mínimo de 660 es más alto que en la mayoría de los estados de este sitio, así que revise el suyo antes de buscar casa. Filadelfia y varios condados suman sus propias subvenciones, que los prestamistas de PHFA suelen combinar con los préstamos Keystone; pregunte al prestamista cuáles maneja para su dirección y pida la cotización con K-FIT junto a una cotización FHA simple.</p>
`,
  },
});
