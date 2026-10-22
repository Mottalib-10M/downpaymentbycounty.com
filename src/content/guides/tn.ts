import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const def = K.prog('tn-deferred'), am = K.prog('tn-amortizing');
const defMax = def.amount.value!, amPct = am.amount.value!, amMax = am.amount.max!;
const ev = (x: ReturnType<typeof example>, id: string) => x.sm.evals.find((e) => e.p.id === id)!;
const ex = example({ st: 'TN', county: 'Davidson County', income: 85000, price: 380000, size: 3 });
const exM = example({ st: 'TN', county: 'Shelby County', income: 70000, price: 240000, size: 3 });
const newc = (K.state('TN').local ?? []).find((l) => l.name.includes('new construction'));
const NC_MAX = 25000, NC_TERM = 15;
const ncPay = K.pmt(NC_MAX, 0, NC_TERM);
const dav = K.county('TN', 'Davidson County'), she = K.county('TN', 'Shelby County');
const COUNTIES = ['Davidson County', 'Shelby County', 'Knox County', 'Hamilton County', 'Rutherford County', 'Williamson County', 'Montgomery County', 'Sumner County', 'Wilson County', 'Sullivan County'];
const capPrice = Math.round(amMax / (amPct / 100));

export default defineGuide({
  id: 'tn', group: 'states', order: 18, state: 'TN', tool: 'dpa', toolArg: { st: 'TN', c: dav.id, i: 85000, p: 380000, h: 3 },
  related: ['payment', 'forgivable', 'requirements', 'programs', 'ga', 'nc'],
  sources: ['agency-TN', 'prog-tn-deferred', 'prog-tn-amortizing', 'hud-il', 'fha-ml'],
  en: {
    slug: 'tennessee-down-payment-assistance', nav: 'Tennessee', card: 'THDA Great Choice Plus: up to $10,000 forgiven, or 5% repaid over 30 years',
    title: 'Tennessee Down Payment Assistance 2026: THDA Up to $15,000',
    description: `Tennessee down payment assistance in 2026: THDA Great Choice Plus gives up to ${E.m(defMax)} forgiven after 10 years, or ${amPct}% up to ${E.m(amMax)} repaid, in all 95 counties.`,
    h1: 'Tennessee down payment assistance with THDA',
    intro: 'Pick your Tennessee county, income and price: the THDA second loan that fits, what it costs each month, and the cash you still bring.',
    resume: `The Tennessee Housing Development Agency (THDA) attaches its help to the Great Choice Home Loan, as a second mortgage called Great Choice Plus, in three versions. The deferred version lends up to ${E.m(6000)} or up to ${E.m(defMax)} at 0% with no payment, forgiven at the end of a ${def.forgivenAfterYears}-year term, and due in full if you sell or refinance before then. The amortizing version lends up to ${amPct}% of the price, capped at ${E.m(amMax)}, repaid over 30 years at the same rate as the first mortgage. A third version, for newly built or proposed homes, lends up to ${E.m(NC_MAX)} at 0% over ${NC_TERM} years. All need a 640 credit score and THDA's county income and price limits. In Davidson County, a household of three earning ${E.m(85000)} buying at ${E.m(380000)} could take ${E.m(ev(ex, 'tn-amortizing').amount ?? 0)} for about ${E.m(ev(ex, 'tn-amortizing').monthly)} a month, or ${E.m(ev(ex, 'tn-deferred').amount ?? 0)} with no payment.`,
    faqs: [
      { q: 'Which THDA option costs less over time, deferred or amortizing?', a: `The deferred one, if you keep the home ${def.forgivenAfterYears} years: it is forgiven and costs nothing. The amortizing loan gives more money, up to ${E.m(amMax)}, but you pay it back at the first mortgage rate, about ${E.m(ev(ex, 'tn-amortizing').monthly)} a month in the Davidson example. Choose the larger loan only if the extra cash is what makes the purchase possible.` },
      { q: 'Can repeat buyers use THDA in Tennessee?', a: 'In some cases. The Great Choice Home Loan is for first-time buyers, veterans and, in a list of targeted counties, repeat buyers too, according to THDA. The calculator marks the first-time rule as one to confirm when you say you have owned a home, since it depends on the county of the purchase.' },
      { q: 'How does the THDA new construction loan work?', a: `For a home newly built or still to be built, THDA lends up to ${E.m(NC_MAX)} as a second mortgage at 0% interest, repaid monthly over ${NC_TERM} years. On the full amount that is about ${E.m(ncPay)} a month, all of it principal. It is not in the calculator, which covers the two options for existing homes.` },
    ],
    body: (h) => `
<h2>Great Choice Plus, in THDA's words</h2>
${stateProgTable(h, 'TN')}
<p>The two options split the same need in opposite ways. The deferred loan is small and free if you stay. The amortizing loan grows with the price up to ${h.m(amMax)}, reached at a ${h.m(capPrice)} home, and adds a second monthly payment at the first mortgage rate, currently near ${h.r(K.RATES.r30)} on the market average. A buyer who can cover the gap with ${h.m(defMax)} should take the deferred one.</p>
<h2>Middle Tennessee and Memphis, side by side</h2>
${countyTable(h, 'TN', COUNTIES)}
<p>Nashville's growth shows in the numbers: Davidson County has a HUD median of ${h.m(dav.m)} and an FHA limit of ${h.m(dav.fha ?? 0)}, while Shelby County sits at ${h.m(she.m)} and the FHA floor. THDA's own income and price limits are set by county and household size; we link them, and the calculator marks them to confirm while showing your income against the HUD median.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'TN', c: she.id, i: 70000, p: 240000, h: 3 }, t: 'Your Tennessee county' })}
<h2>Davidson County, line by line</h2>
${exampleTable(h, { st: 'TN', county: 'Davidson County', income: 85000, price: 380000, size: 3 }, h.t(`Household of three, ${h.m(85000)}, ${h.m(380000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(85000)}, casa de ${h.m(380000)}, préstamo FHA, 680 puntos.`))}
<p>The FHA minimum here is ${h.m(ex.sm.down)}. The amortizing loan covers it and leaves ${h.m(Math.max(0, (ev(ex, 'tn-amortizing').amount ?? 0) - ex.sm.down))} for closing costs; the deferred loan leaves ${h.m(Math.max(0, ex.sm.down - (ev(ex, 'tn-deferred').amount ?? 0)))} of the down payment to find. In Shelby County, at ${h.m(240000)}, the amortizing loan is ${h.m(ev(exM, 'tn-amortizing').amount ?? 0)} for about ${h.m(ev(exM, 'tn-amortizing').monthly)} a month, and the deferred loan nearly matches the ${h.m(exM.sm.down)} minimum on its own.</p>
${newc ? `<h2>${h.t('Newly built homes', 'Casas de construcción nueva')}</h2>` : ''}
<p>The new construction version raises the ceiling to ${h.m(NC_MAX)} and keeps the rate at zero, so every payment of about ${h.m(ncPay)} reduces the balance. It suits buyers of homes in new subdivisions around Nashville, Knoxville and Chattanooga, where a builder's price often exceeds what the smaller loans can bridge.</p>
<h2>Applying in Tennessee</h2>
<p>THDA lends through participating lenders and requires a homebuyer education course before closing. The help is reserved with the first mortgage; ask the lender to price the Great Choice loan with each option, because the first rate is the same but the total monthly payment is not. Bring the course certificate early, and keep the closing date: it starts the ten years that end the deferred loan.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-tennessee', nav: 'Tennessee', card: 'THDA Great Choice Plus: hasta $10,000 perdonados, o el 5 % a 30 años',
    title: 'Ayuda para el pago inicial en Tennessee 2026: THDA',
    description: `Ayuda para el pago inicial en Tennessee 2026: THDA Great Choice Plus da hasta ${S.m(defMax)} perdonados a 10 años, o el ${amPct} % hasta ${S.m(amMax)}, en los 95 condados.`,
    h1: 'Ayuda para el pago inicial en Tennessee con THDA',
    intro: 'Elija su condado de Tennessee, su ingreso y el precio: el segundo préstamo de THDA que le corresponde, su costo mensual y el efectivo que aún lleva.',
    resume: `La Tennessee Housing Development Agency (THDA) une su ayuda al préstamo Great Choice Home Loan, como una segunda hipoteca llamada Great Choice Plus, en tres versiones. La versión diferida presta hasta ${S.m(6000)} o hasta ${S.m(defMax)} al 0 % sin cuota, perdonados al final de un plazo de ${def.forgivenAfterYears} años, y exigibles por completo si vende o refinancia antes. La versión amortizable presta hasta el ${amPct} % del precio, con un tope de ${S.m(amMax)}, que se devuelve en 30 años a la misma tasa de la primera hipoteca. Una tercera versión, para casas nuevas o por construir, presta hasta ${S.m(NC_MAX)} al 0 % en ${NC_TERM} años. Todas exigen 640 puntos de crédito y los límites de ingreso y precio de THDA por condado. En el condado de Davidson, un hogar de tres que gana ${S.m(85000)} y compra por ${S.m(380000)} podría tomar ${S.m(ev(ex, 'tn-amortizing').amount ?? 0)} por unos ${S.m(ev(ex, 'tn-amortizing').monthly)} al mes, o ${S.m(ev(ex, 'tn-deferred').amount ?? 0)} sin cuota.`,
    faqs: [
      { q: '¿Qué opción de THDA cuesta menos con el tiempo, la diferida o la amortizable?', a: `La diferida, si conserva la casa ${def.forgivenAfterYears} años: se perdona y no cuesta nada. El préstamo amortizable da más dinero, hasta ${S.m(amMax)}, pero se devuelve a la tasa de la primera hipoteca, unos ${S.m(ev(ex, 'tn-amortizing').monthly)} al mes en el ejemplo de Davidson. Elija el préstamo mayor solo si ese efectivo extra es lo que hace posible la compra.` },
      { q: '¿Quien ya tuvo casa puede usar THDA en Tennessee?', a: 'En algunos casos. El Great Choice Home Loan es para compradores de primera vez, veteranos y, en una lista de condados prioritarios, también para quien ya tuvo vivienda, según THDA. La calculadora marca la regla de primera vivienda como pendiente de confirmar cuando indica que ya fue propietario, porque depende del condado de la compra.' },
      { q: '¿Cómo funciona el préstamo de THDA para construcción nueva?', a: `Para una casa recién construida o por construir, THDA presta hasta ${S.m(NC_MAX)} como segunda hipoteca al 0 % de interés, que se devuelve cada mes durante ${NC_TERM} años. Sobre el monto completo son unos ${S.m(ncPay)} al mes, todo capital. No está en la calculadora, que cubre las dos opciones para casas existentes.` },
    ],
    body: (h) => `
<h2>Great Choice Plus, en palabras de THDA</h2>
${stateProgTable(h, 'TN')}
<p>Las dos opciones resuelven la misma necesidad de formas opuestas. El préstamo diferido es pequeño y gratuito si se queda. El amortizable crece con el precio hasta ${h.m(amMax)}, que se alcanza con una casa de ${h.m(capPrice)}, y añade una segunda cuota mensual a la tasa de la primera hipoteca, hoy cerca del ${h.r(K.RATES.r30)} en el promedio del mercado. Quien puede cubrir la diferencia con ${h.m(defMax)} debería tomar el diferido.</p>
<h2>El centro de Tennessee y Memphis, lado a lado</h2>
${countyTable(h, 'TN', COUNTIES)}
<p>El crecimiento de Nashville se ve en las cifras: el condado de Davidson tiene una mediana de HUD de ${h.m(dav.m)} y un límite FHA de ${h.m(dav.fha ?? 0)}, mientras que el condado de Shelby está en ${h.m(she.m)} y en el piso FHA. Los límites propios de THDA se fijan por condado y tamaño del hogar; los enlazamos, y la calculadora los marca para confirmar mientras muestra su ingreso frente a la mediana de HUD.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'TN', c: she.id, i: 70000, p: 240000, h: 3 }, t: 'Su condado de Tennessee' })}
<h2>El condado de Davidson, línea por línea</h2>
${exampleTable(h, { st: 'TN', county: 'Davidson County', income: 85000, price: 380000, size: 3 }, h.t(`Household of three, ${h.m(85000)}, ${h.m(380000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(85000)}, casa de ${h.m(380000)}, préstamo FHA, 680 puntos.`))}
<p>La entrada mínima FHA aquí es de ${h.m(ex.sm.down)}. El préstamo amortizable la cubre y deja ${h.m(Math.max(0, (ev(ex, 'tn-amortizing').amount ?? 0) - ex.sm.down))} para los gastos de cierre; el diferido deja ${h.m(Math.max(0, ex.sm.down - (ev(ex, 'tn-deferred').amount ?? 0)))} de la entrada por conseguir. En el condado de Shelby, con ${h.m(240000)}, el amortizable es de ${h.m(ev(exM, 'tn-amortizing').amount ?? 0)} por unos ${h.m(ev(exM, 'tn-amortizing').monthly)} al mes, y el diferido casi iguala por sí solo la entrada mínima de ${h.m(exM.sm.down)}.</p>
${newc ? `<h2>${h.t('Newly built homes', 'Casas de construcción nueva')}</h2>` : ''}
<p>La versión para construcción nueva sube el tope a ${h.m(NC_MAX)} y mantiene la tasa en cero, así que cada pago de unos ${h.m(ncPay)} reduce el saldo. Conviene a quien compra en urbanizaciones nuevas alrededor de Nashville, Knoxville y Chattanooga, donde el precio del constructor suele superar lo que los préstamos menores pueden cubrir.</p>
<h2>Cómo solicitarla en Tennessee</h2>
<p>THDA presta a través de prestamistas participantes y exige un curso para compradores antes del cierre. La ayuda se reserva junto con la primera hipoteca; pida al prestamista que cotice el préstamo Great Choice con cada opción, porque la primera tasa es la misma pero la cuota mensual total no. Lleve pronto el certificado del curso y guarde la fecha de cierre: con ella empiezan los diez años que terminan el préstamo diferido.</p>
`,
  },
});
