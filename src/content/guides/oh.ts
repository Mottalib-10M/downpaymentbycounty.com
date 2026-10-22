import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable, agencyLimitsTable } from './_shared';

const E = K.en, S = K.es;
const cl = K.state('OH').countyLimits!;
const dpa = K.prog('oh-dpa'), gg = K.prog('oh-grads');
const conv = dpa.amount.conventional!, gov = dpa.amount.government!;
const yD = dpa.forgivenAfterYears!, yG = gg.forgivenAfterYears!;
const rows = Object.values(cl.rows);
const i3min = Math.min(...rows.map((r) => r.i3 ?? Infinity)), i3max = Math.max(...rows.map((r) => r.i3 ?? 0));
const pmin = Math.min(...rows.map((r) => r.price ?? Infinity)), pmax = Math.max(...rows.map((r) => r.price ?? 0));
const ev = (x: ReturnType<typeof example>, id: string) => x.sm.evals.find((e) => e.p.id === id)!;
const ex = example({ st: 'OH', county: 'Franklin County', income: 90000, price: 300000, size: 3 });
const exC = example({ st: 'OH', county: 'Cuyahoga County', income: 125000, price: 250000, size: 3 });
const cuyRow = cl.rows['Cuyahoga County'], frRow = cl.rows['Franklin County'];
const fr = K.county('OH', 'Franklin County'), cuy = K.county('OH', 'Cuyahoga County'), ham = K.county('OH', 'Hamilton County');
const COUNTIES = ['Franklin County', 'Cuyahoga County', 'Hamilton County', 'Summit County', 'Montgomery County', 'Lucas County', 'Butler County', 'Stark County', 'Lorain County', 'Delaware County', 'Warren County', 'Mahoning County'];

export default defineGuide({
  id: 'oh', group: 'states', order: 6, state: 'OH', tool: 'dpa', toolArg: { st: 'OH', c: fr.id, i: 90000, p: 300000, h: 3 },
  related: ['forgivable', 'mcc', 'income-limits', 'requirements', 'mi', 'pa'],
  sources: ['agency-OH', 'prog-oh-dpa', 'prog-oh-grads', 'prog-oh-mtc', 'limits-OH', 'hud-il'],
  en: {
    slug: 'ohio-down-payment-assistance', nav: 'Ohio', card: 'OHFA 3% or 3.5% forgiven after 7 years, Grants for Grads and the tax credit',
    title: 'Ohio Down Payment Assistance 2026: OHFA Limits by County',
    description: `Ohio down payment assistance in 2026: OHFA pays ${conv}% or ${gov}% of the price, forgiven after seven years, plus Grants for Grads, with limits for all 88 counties.`,
    h1: 'Ohio down payment assistance, all 88 counties',
    intro: 'Choose your Ohio county and household: whether OHFA fits under its county limit, the amount for your loan type, and the cash and payment left.',
    resume: `The Ohio Housing Finance Agency (OHFA) pays ${conv}% of the purchase price with a conventional loan or ${gov}% with an FHA, VA or USDA loan, as assistance that is forgiven after ${yD} years. Sell within the seven years and you repay all of it; there is no partial forgiveness. It goes with an OHFA first mortgage for first-time buyers, and the Next Home version serves repeat buyers. Grants for Grads pays the same percentages to buyers who earned a degree in the last 48 months, forgiven after ${yG} years if they stay in Ohio. OHFA's county table effective ${E.day(cl.effective)} sets the income limit for three or more people between ${E.m(i3min)} and ${E.m(i3max)} and the price limit between ${E.m(pmin)} and ${E.m(pmax)}. In Franklin County a household of three earning ${E.m(90000)} buying at ${E.m(300000)} with FHA receives ${E.m(ev(ex, 'oh-dpa').amount ?? 0)}, the whole minimum down payment.`,
    faqs: [
      { q: 'What happens to Ohio down payment assistance if I sell after six years?', a: `You repay all of it. OHFA forgives the assistance only at the end of the ${yD}th year: before that, the full amount is due on a sale or refinance. On the Franklin County example that is ${E.m(ev(ex, 'oh-dpa').amount ?? 0)} in year six and nothing in year eight. Grants for Grads works the same way over ${yG} years, with the added condition of staying in Ohio.` },
      { q: 'Who counts as a recent graduate for Ohio Grants for Grads?', a: 'A buyer who earned a degree within the 48 months before the loan, according to OHFA, and who agrees to stay in Ohio for the five years of forgiveness. Leaving the state earlier makes the help repayable. The calculator cannot check the date of the degree, so it shows Grants for Grads as one to confirm with an OHFA lender.' },
      { q: 'Can I combine OHFA assistance with the Ohio mortgage tax credit?', a: 'Yes, that is common. The OHFA Mortgage Tax Credit is a federal tax credit on part of the mortgage interest, up to $2,000 a year, and it sits on top of the down payment help. It lowers your income tax rather than the cash at closing. The tax credit page shows the yearly value for your loan.' },
    ],
    body: (h) => `
<h2>OHFA's programs and their terms</h2>
${stateProgTable(h, 'OH')}
<p>The percentage follows the loan type, not the buyer: ${gov}% with a government-insured loan matches the FHA minimum down payment exactly, while ${conv}% with a conventional loan matches the usual 3% conventional minimum. Either way the down payment is covered and closing costs remain. The credit floor is 640 for conventional, USDA and VA loans and 650 for FHA.</p>
<h2>OHFA's county table</h2>
${agencyLimitsTable(h, 'OH', COUNTIES)}
<p>Most rural counties share the lowest limit. The Columbus area has the highest limits of the large metros: Franklin County is at ${h.m(frRow.i3 ?? 0)} for three or more and a price limit of ${h.m(frRow.price ?? 0)}, against ${h.m(cuyRow.i3 ?? 0)} and ${h.m(cuyRow.price ?? 0)} in Cuyahoga County. Union County, northwest of Columbus, stands apart at ${h.m(cl.rows['Union County'].i3 ?? 0)} for three or more, the highest in the table, because HUD sets its own median for it. Higher limits also apply in targeted census tracts, which the calculator does not model. A household that sits just above its county line can check the neighboring county: the limit follows the address of the home, not where you live today.</p>
${h.mini('dpa', { p: ['c', 'i', 'h'], d: { st: 'OH', c: cuy.id, i: 110000, p: 250000, h: 3 }, t: 'Your Ohio county' })}
<h2>Franklin County, line by line</h2>
${exampleTable(h, { st: 'OH', county: 'Franklin County', income: 90000, price: 300000, size: 3 }, h.t(`Household of three, ${h.m(90000)}, ${h.m(300000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(90000)}, casa de ${h.m(300000)}, préstamo FHA, 680 puntos.`))}
<p>In Cuyahoga County the same household with ${h.m(125000)} is over the ${h.m(cuyRow.i3 ?? 0)} limit, so OHFA assistance ${ev(exC, 'oh-dpa').verdict === 'no' ? 'does not fit' : 'still shows'}; a recent graduate could still use Grants for Grads, worth ${h.m(ev(exC, 'oh-grads').amount ?? 0)} on a ${h.m(250000)} home, since the calculator only flags its degree condition.</p>
<h2>HUD figures in the large counties</h2>
${countyTable(h, 'OH', ['Franklin County', 'Cuyahoga County', 'Hamilton County', 'Summit County', 'Montgomery County', 'Lucas County'])}
<p>Ohio prices sit mostly at the FHA floor; only the Columbus metro rises above it, to ${h.m(fr.fha ?? 0)}. HUD's median ranges from ${h.m(cuy.m)} in Cuyahoga to ${h.m(fr.m)} in Franklin, with Hamilton County, home to Cincinnati, at ${h.m(ham.m)}. OHFA's price limits are far above typical prices, so in Ohio the income limit is almost always the one that matters.</p>
<h2>Applying in Ohio</h2>
<p>OHFA lends through participating lenders and requires homebuyer education. Tell the lender at the start if you hold a recent degree or have owned a home before, since that decides between the standard program, Grants for Grads and Next Home. Keep the closing date: it starts the ${yD} years that end the repayment.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-ohio', nav: 'Ohio', card: 'OHFA del 3 % o 3.5 % perdonado a los 7 años, Grants for Grads y el crédito fiscal',
    title: 'Ayuda para el pago inicial en Ohio 2026: OHFA por condado',
    description: `Ayuda para el pago inicial en Ohio 2026: OHFA paga el ${conv} % o el ${gov} % del precio, perdonado a los siete años, más Grants for Grads, en los 88 condados.`,
    h1: 'Ayuda para el pago inicial en Ohio, en los 88 condados',
    intro: 'Elija su condado de Ohio y su hogar: si cumple el límite de OHFA del condado, el monto según su préstamo y el efectivo y la cuota que quedan.',
    resume: `La Ohio Housing Finance Agency (OHFA) paga el ${conv} % del precio de compra con un préstamo convencional o el ${gov} % con un préstamo FHA, VA o USDA, como una ayuda que se perdona a los ${yD} años. Si vende antes de los siete años, la devuelve completa; no hay perdón parcial. Acompaña a una primera hipoteca de OHFA para compradores de primera vez, y la versión Next Home atiende a quien ya tuvo casa. Grants for Grads paga los mismos porcentajes a quien obtuvo un título en los últimos 48 meses, perdonado a los ${yG} años si se queda en Ohio. La tabla de OHFA por condado vigente desde el ${S.day(cl.effective)} fija el límite de ingreso para tres o más personas entre ${S.m(i3min)} y ${S.m(i3max)} y el tope de precio entre ${S.m(pmin)} y ${S.m(pmax)}. En el condado de Franklin, un hogar de tres que gana ${S.m(90000)} y compra por ${S.m(300000)} con FHA recibe ${S.m(ev(ex, 'oh-dpa').amount ?? 0)}, toda la entrada mínima.`,
    faqs: [
      { q: '¿Qué pasa con la ayuda de Ohio si vendo a los seis años?', a: `La devuelve completa. OHFA perdona la ayuda solo al final del año ${yD}: antes, el monto entero vence con una venta o una refinanciación. En el ejemplo de Franklin son ${S.m(ev(ex, 'oh-dpa').amount ?? 0)} en el sexto año y nada en el octavo. Grants for Grads funciona igual a ${yG} años, con la condición adicional de quedarse en Ohio.` },
      { q: '¿Quién cuenta como recién graduado para Grants for Grads en Ohio?', a: 'Quien obtuvo un título en los 48 meses anteriores al préstamo, según OHFA, y se compromete a quedarse en Ohio durante los cinco años del perdón. Irse antes del estado hace que la ayuda deba devolverse. La calculadora no puede comprobar la fecha del título, así que muestra Grants for Grads como pendiente de confirmar con un prestamista de OHFA.' },
      { q: '¿Puedo combinar la ayuda de OHFA con el crédito fiscal hipotecario de Ohio?', a: 'Sí, es habitual. El OHFA Mortgage Tax Credit es un crédito fiscal federal sobre parte de los intereses de la hipoteca, de hasta $2,000 al año, que se suma a la ayuda para la entrada. Reduce su impuesto sobre la renta, no el efectivo al cierre. La página del crédito fiscal muestra el valor anual para su préstamo.' },
    ],
    body: (h) => `
<h2>Los programas de OHFA y sus condiciones</h2>
${stateProgTable(h, 'OH')}
<p>El porcentaje sigue al tipo de préstamo, no al comprador: el ${gov} % con un préstamo asegurado por el gobierno iguala exactamente la entrada mínima FHA, y el ${conv} % con un préstamo convencional iguala el mínimo convencional habitual del 3 %. En ambos casos la entrada queda cubierta y quedan los gastos de cierre. El puntaje mínimo es 640 para préstamos convencionales, USDA y VA, y 650 para FHA.</p>
<h2>La tabla de OHFA por condado</h2>
${agencyLimitsTable(h, 'OH', COUNTIES)}
<p>La mayoría de los condados rurales comparten el límite más bajo. El área de Columbus es la más alta de las grandes áreas: el condado de Franklin está en ${h.m(frRow.i3 ?? 0)} para tres o más y un tope de precio de ${h.m(frRow.price ?? 0)}, frente a ${h.m(cuyRow.i3 ?? 0)} y ${h.m(cuyRow.price ?? 0)} en el condado de Cuyahoga. El condado de Union, al noroeste de Columbus, se aparta con ${h.m(cl.rows['Union County'].i3 ?? 0)} para tres o más, el más alto de la tabla, porque HUD le fija una mediana propia. En los distritos censales prioritarios rigen además límites más altos, que la calculadora no modela. Un hogar que queda justo por encima del límite de su condado puede mirar el condado vecino: el límite sigue a la dirección de la casa, no al lugar donde vive hoy.</p>
${h.mini('dpa', { p: ['c', 'i', 'h'], d: { st: 'OH', c: cuy.id, i: 110000, p: 250000, h: 3 }, t: 'Su condado de Ohio' })}
<h2>El condado de Franklin, línea por línea</h2>
${exampleTable(h, { st: 'OH', county: 'Franklin County', income: 90000, price: 300000, size: 3 }, h.t(`Household of three, ${h.m(90000)}, ${h.m(300000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(90000)}, casa de ${h.m(300000)}, préstamo FHA, 680 puntos.`))}
<p>En el condado de Cuyahoga, el mismo hogar con ${h.m(125000)} supera el límite de ${h.m(cuyRow.i3 ?? 0)}, así que la ayuda de OHFA ${ev(exC, 'oh-dpa').verdict === 'no' ? 'no le corresponde' : 'sigue apareciendo'}; un recién graduado todavía podría usar Grants for Grads, de ${h.m(ev(exC, 'oh-grads').amount ?? 0)} en una casa de ${h.m(250000)}, porque la calculadora solo marca su condición del título.</p>
<h2>Cifras de HUD en los condados grandes</h2>
${countyTable(h, 'OH', ['Franklin County', 'Cuyahoga County', 'Hamilton County', 'Summit County', 'Montgomery County', 'Lucas County'])}
<p>Los precios de Ohio están casi todos en el piso FHA; solo el área de Columbus lo supera, con ${h.m(fr.fha ?? 0)}. La mediana de HUD va de ${h.m(cuy.m)} en Cuyahoga a ${h.m(fr.m)} en Franklin, con el condado de Hamilton, sede de Cincinnati, en ${h.m(ham.m)}. Los topes de precio de OHFA quedan muy por encima de los precios típicos, así que en Ohio el límite de ingresos es casi siempre el que cuenta.</p>
<h2>Cómo solicitarla en Ohio</h2>
<p>OHFA presta a través de prestamistas participantes y exige un curso para compradores. Diga al prestamista desde el principio si tiene un título reciente o si ya fue propietario, porque eso decide entre el programa estándar, Grants for Grads y Next Home. Guarde la fecha de cierre: con ella empiezan los ${yD} años que terminan la devolución.</p>
`,
  },
});
