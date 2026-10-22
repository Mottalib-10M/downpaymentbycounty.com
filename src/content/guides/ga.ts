import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const g = K.prog('ga-dream');
const cap = g.amount.value!;
const ex = example({ st: 'GA', county: 'Fulton County', income: 95000, price: 350000, size: 3 });
const exS = example({ st: 'GA', county: 'Chatham County', income: 85000, price: 300000, size: 3 });
const AREAS = [
  { en: 'Atlanta metro', es: 'Área de Atlanta', i12: 120439, i3: 138505, price: 425000 },
  { en: 'Athens area', es: 'Área de Athens', i12: 101429, i3: 116644, price: 375000 },
  { en: 'All other counties', es: 'Resto de los condados', i12: 92000, i3: 105800, price: 360000 },
];
const atl = AREAS[0], oth = AREAS[2];
const ful = K.county('GA', 'Fulton County'), cha = K.county('GA', 'Chatham County'), cla = K.county('GA', 'Clarke County');
const COUNTIES = ['Fulton County', 'Gwinnett County', 'Cobb County', 'DeKalb County', 'Clayton County', 'Cherokee County', 'Chatham County', 'Clarke County', 'Richmond County', 'Bibb County', 'Muscogee County'];

export default defineGuide({
  id: 'ga', group: 'states', order: 5, state: 'GA', tool: 'dpa', toolArg: { st: 'GA', c: ful.id, i: 95000, p: 350000, h: 3 },
  related: ['first-time', 'requirements', 'income-limits', 'programs', 'fl', 'tn'],
  sources: ['agency-GA', 'prog-ga-dream', 'hud-il', 'fha-ml'],
  en: {
    slug: 'georgia-down-payment-assistance', nav: 'Georgia', card: 'Georgia Dream: up to $10,000 at 0%, deferred, with three area limits',
    title: 'Georgia Down Payment Assistance 2026: Georgia Dream $10,000',
    description: `Georgia down payment assistance in 2026: Georgia Dream lends up to ${E.m(cap)} at 0% with no payment, under three income and price limits covering 159 counties.`,
    h1: 'Georgia down payment assistance with Georgia Dream',
    intro: 'Pick your Georgia county, income and price: the Georgia Dream amount, the area limits that apply, and the cash you still need at closing.',
    resume: `Georgia's statewide help is the Georgia Dream Homeownership Program of the Department of Community Affairs (DCA). It lends up to ${E.m(cap)} for the down payment and closing costs as a second loan at 0% interest with no monthly payment, due when you sell, refinance or stop living in the home. It is for first-time buyers, with a 640 credit score, and asks for ${E.m(1000)} of your own money or a documented gift. Instead of 159 county tables, Georgia uses three areas: the Atlanta metro, with income limits of ${E.m(atl.i12)} for one or two people and ${E.m(atl.i3)} for three or more, and a ${E.m(atl.price)} price cap; the Athens area; and every other county at ${E.m(oth.i12)}, ${E.m(oth.i3)} and ${E.m(oth.price)}. DCA's table is dated July 8, 2024 and is the latest it shows. In Fulton County, a household of three earning ${E.m(95000)} buying at ${E.m(350000)} would get ${E.m(ex.sm.bestAmount)}, leaving ${E.m(ex.sm.cashWith)} of the down payment to bring.`,
    faqs: [
      { q: 'Is the Georgia Dream loan 3.5% or 5% of the price?', a: `DCA's own pages disagree: an announcement speaks of the lesser of 3.5% of the price or ${E.m(cap)}, and the loan program page of the lesser of 5% or ${E.m(cap)}. Both agree on the ${E.m(cap)} cap, which is the only figure the calculator uses. On most Georgia homes either percentage reaches the cap, so the difference rarely matters.` },
      { q: 'Do I need my own money for Georgia Dream?', a: `Yes, ${E.m(1000)} at least, from savings or a documented gift, according to DCA. Georgia Dream also limits the buyer's liquid assets, so a household with large savings may not qualify. The help then covers the rest of the down payment and closing costs up to ${E.m(cap)}.` },
      { q: 'What are Peach Plus and Peach Select in Georgia?', a: 'Two variants of Georgia Dream described by DCA. Peach Plus raises the income and price limits, which opens the program to more households in the Atlanta metro. Peach Select is the version for veterans and military buyers. Their rules are on the DCA pages; the calculator models the standard program only.' },
    ],
    body: (h) => `
<h2>Georgia Dream, in DCA's words</h2>
${stateProgTable(h, 'GA')}
<p>Georgia is simpler than most states because the help is a flat cap rather than a share of the loan: up to ${h.m(cap)}, whatever the price. On a modest home it covers the whole FHA minimum, on a larger one only part. We could not open the DCA site from our network; the terms above come from the indexed text of its official pages.</p>
<h2>The three Georgia Dream areas</h2>
${h.table([h.t('Area', 'Área'), h.t('Income limit, 1-2 people', 'Límite de ingresos, 1-2 personas'), h.t('Income limit, 3+ people', 'Límite de ingresos, 3 o más'), h.t('Price limit', 'Tope de precio')], AREAS.map((r) => [h.t(r.en, r.es), h.m(r.i12), h.m(r.i3), h.m(r.price)]), h.t('DCA Georgia Dream standard limits, table marked effective July 8, 2024, the latest shown by DCA in October 2026.', 'Límites estándar de Georgia Dream de DCA, tabla marcada vigente desde el 8 de julio de 2024, la última que mostraba DCA en octubre de 2026.'), ['l', 'r', 'r', 'r'])}
<p>The Atlanta figures apply to the counties of the Atlanta HUD metro, the Athens figures to Clarke and its neighbors, and the last row everywhere else, including Savannah, Augusta, Macon and Columbus. The calculator still marks the limits to confirm because DCA dates its table to 2024 and has not posted a newer one we could read.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'GA', c: cha.id, i: 85000, p: 300000, h: 3 }, t: 'Your Georgia county' })}
<h2>Fulton County, worked through</h2>
${exampleTable(h, { st: 'GA', county: 'Fulton County', income: 95000, price: 350000, size: 3 }, h.t(`Household of three, ${h.m(95000)}, ${h.m(350000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(95000)}, casa de ${h.m(350000)}, préstamo FHA, 680 puntos.`))}
<p>The FHA minimum here is ${h.m(ex.sm.down)}, so ${h.m(ex.sm.cashWith)} of it and the closing costs remain. In Chatham County, at ${h.m(85000)} and ${h.m(300000)}, the minimum is ${h.m(exS.sm.down)} and the gap after the loan is ${h.m(exS.sm.cashWith)}, but the ${h.m(1000)} own contribution is required anyway.</p>
<h2>HUD and FHA figures</h2>
${countyTable(h, 'GA', COUNTIES)}
<p>The metro counties share a HUD median of ${h.m(ful.m)} and an FHA limit of ${h.m(ful.fha ?? 0)}; Clarke County, home to Athens, sits at ${h.m(cla.m)}; Chatham at ${h.m(cha.m)}. The Georgia Dream price caps are well under the FHA limits everywhere, so in the Atlanta metro the price cap is often the rule that decides.</p>
<h2>Applying in Georgia</h2>
<p>Georgia Dream goes through DCA-approved lenders and requires a homebuyer education course. Ask the lender for the current limits table at the first meeting and whether Peach Plus applies to you. Atlanta, DeKalb and other local governments run their own programs that some lenders combine with Georgia Dream.</p>
<p>Two points deserve attention before an offer. The loan is due when you stop living in the home, not only when you sell, so turning it into a rental means repaying the ${h.m(cap)}. And because the help is a flat amount, a higher price does not bring more of it: on a ${h.m(atl.price)} home at the Atlanta cap, the FHA minimum is ${h.m(Math.round(atl.price * K.P.fha.minDown / 100))}, and Georgia Dream pays less than a third of it.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-georgia', nav: 'Georgia', card: 'Georgia Dream: hasta $10,000 al 0 %, diferido, con tres zonas de límites',
    title: 'Ayuda para el pago inicial en Georgia 2026: Georgia Dream',
    description: `Ayuda para el pago inicial en Georgia 2026: Georgia Dream presta hasta ${S.m(cap)} al 0 % sin cuota, con tres zonas de límites de ingreso y precio en 159 condados.`,
    h1: 'Ayuda para el pago inicial en Georgia con Georgia Dream',
    intro: 'Elija su condado de Georgia, su ingreso y el precio: el monto de Georgia Dream, los límites de su zona y el efectivo que aún necesita al cierre.',
    resume: `La ayuda estatal de Georgia es el Georgia Dream Homeownership Program del Departamento de Asuntos Comunitarios (DCA). Presta hasta ${S.m(cap)} para la entrada y los gastos de cierre como un segundo préstamo al 0 % de interés sin cuota mensual, que vence al vender, refinanciar o dejar de vivir en la casa. Es para compradores de primera vez, con 640 puntos de crédito, y pide ${S.m(1000)} de dinero propio o un regalo documentado. En lugar de 159 tablas por condado, Georgia usa tres zonas: el área de Atlanta, con límites de ingreso de ${S.m(atl.i12)} para una o dos personas y ${S.m(atl.i3)} para tres o más, y un tope de precio de ${S.m(atl.price)}; el área de Athens; y el resto de los condados, con ${S.m(oth.i12)}, ${S.m(oth.i3)} y ${S.m(oth.price)}. La tabla de DCA está fechada el 8 de julio de 2024 y es la última que muestra. En el condado de Fulton, un hogar de tres que gana ${S.m(95000)} y compra por ${S.m(350000)} recibiría ${S.m(ex.sm.bestAmount)} y le quedarían ${S.m(ex.sm.cashWith)} de la entrada por poner.`,
    faqs: [
      { q: '¿El préstamo Georgia Dream es del 3.5 % o del 5 % del precio?', a: `Las propias páginas de DCA no coinciden: un anuncio habla del menor entre el 3.5 % del precio y ${S.m(cap)}, y la página del programa del menor entre el 5 % y ${S.m(cap)}. Ambas coinciden en el tope de ${S.m(cap)}, la única cifra que usa la calculadora. En la mayoría de las casas de Georgia cualquiera de los dos porcentajes llega al tope, así que la diferencia rara vez importa.` },
      { q: '¿Necesito dinero propio para Georgia Dream?', a: `Sí, al menos ${S.m(1000)}, de ahorros o de un regalo documentado, según DCA. Georgia Dream también limita los activos líquidos del comprador, así que un hogar con muchos ahorros puede no calificar. La ayuda cubre entonces el resto de la entrada y de los gastos de cierre hasta ${S.m(cap)}.` },
      { q: '¿Qué son Peach Plus y Peach Select en Georgia?', a: 'Dos variantes de Georgia Dream descritas por DCA. Peach Plus sube los límites de ingreso y de precio, lo que abre el programa a más hogares del área de Atlanta. Peach Select es la versión para veteranos y militares. Sus reglas están en las páginas de DCA; la calculadora modela solo el programa estándar.' },
    ],
    body: (h) => `
<h2>Georgia Dream, en palabras de DCA</h2>
${stateProgTable(h, 'GA')}
<p>Georgia es más sencilla que la mayoría de los estados porque la ayuda es un tope fijo y no un porcentaje del préstamo: hasta ${h.m(cap)}, sea cual sea el precio. En una casa modesta cubre toda la entrada mínima FHA; en una más grande, solo una parte. No pudimos abrir el sitio de DCA desde nuestra red; las condiciones de arriba salen del texto indexado de sus páginas oficiales.</p>
<h2>Las tres zonas de Georgia Dream</h2>
${h.table([h.t('Area', 'Área'), h.t('Income limit, 1-2 people', 'Límite de ingresos, 1-2 personas'), h.t('Income limit, 3+ people', 'Límite de ingresos, 3 o más'), h.t('Price limit', 'Tope de precio')], AREAS.map((r) => [h.t(r.en, r.es), h.m(r.i12), h.m(r.i3), h.m(r.price)]), h.t('DCA Georgia Dream standard limits, table marked effective July 8, 2024, the latest shown by DCA in October 2026.', 'Límites estándar de Georgia Dream de DCA, tabla marcada vigente desde el 8 de julio de 2024, la última que mostraba DCA en octubre de 2026.'), ['l', 'r', 'r', 'r'])}
<p>Las cifras de Atlanta se aplican a los condados del área metropolitana de HUD de Atlanta, las de Athens a Clarke y sus vecinos, y la última fila a todos los demás, incluidos Savannah, Augusta, Macon y Columbus. La calculadora marca igual los límites para confirmar, porque DCA fecha su tabla en 2024 y no ha publicado una más reciente que pudiéramos leer.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'GA', c: cha.id, i: 85000, p: 300000, h: 3 }, t: 'Su condado de Georgia' })}
<h2>El condado de Fulton, paso a paso</h2>
${exampleTable(h, { st: 'GA', county: 'Fulton County', income: 95000, price: 350000, size: 3 }, h.t(`Household of three, ${h.m(95000)}, ${h.m(350000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(95000)}, casa de ${h.m(350000)}, préstamo FHA, 680 puntos.`))}
<p>La entrada mínima FHA aquí es de ${h.m(ex.sm.down)}, así que quedan ${h.m(ex.sm.cashWith)} de ella más los gastos de cierre. En el condado de Chatham, con ${h.m(85000)} y ${h.m(300000)}, la entrada mínima es de ${h.m(exS.sm.down)} y la diferencia tras el préstamo es de ${h.m(exS.sm.cashWith)}, pero el aporte propio de ${h.m(1000)} se exige de todos modos.</p>
<h2>Cifras de HUD y FHA</h2>
${countyTable(h, 'GA', COUNTIES)}
<p>Los condados del área de Atlanta comparten una mediana de HUD de ${h.m(ful.m)} y un límite FHA de ${h.m(ful.fha ?? 0)}; el condado de Clarke, sede de Athens, está en ${h.m(cla.m)}; Chatham en ${h.m(cha.m)}. Los topes de precio de Georgia Dream quedan muy por debajo de los límites FHA en todas partes, así que en el área de Atlanta el tope de precio suele ser la regla que decide.</p>
<h2>Cómo solicitarla en Georgia</h2>
<p>Georgia Dream se tramita con prestamistas aprobados por DCA y exige un curso para compradores. Pida al prestamista la tabla de límites vigente en la primera reunión y pregunte si Peach Plus le corresponde. Atlanta, DeKalb y otros gobiernos locales tienen sus propios programas, que algunos prestamistas combinan con Georgia Dream.</p>
<p>Dos puntos merecen atención antes de hacer una oferta. El préstamo vence cuando deja de vivir en la casa, no solo cuando la vende, así que convertirla en alquiler supone devolver los ${h.m(cap)}. Y como la ayuda es un monto fijo, un precio más alto no trae más ayuda: en una casa de ${h.m(atl.price)}, el tope de Atlanta, la entrada mínima FHA es de ${h.m(Math.round(atl.price * K.P.fha.minDown / 100))}, y Georgia Dream paga menos de un tercio.</p>
`,
  },
});
