import { defineGuide } from '../../lib/page-types';
import type { Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.en, S = K.es, F = K.P.fha, H = K.P.fhfa;
const all = K.STATES.flatMap((s) => K.state(s.st).counties.map((c) => ({ st: s.st, c })));
const withFha = all.filter((x) => x.c.fha);
const atFloor = withFha.filter((x) => x.c.fha === F.floor).length;
const atCeil = withFha.filter((x) => (x.c.fha ?? 0) >= F.ceiling).length;
const aboveBase = all.filter((x) => (x.c.cll ?? 0) > H.baseline).length;
const BIG: Array<[string, string]> = [['CA', 'Los Angeles County'], ['CA', 'Santa Clara County'], ['NY', 'Kings County'], ['WA', 'King County'], ['CO', 'Denver County'], ['FL', 'Miami-Dade County'], ['MA', 'Boston city'], ['NJ', 'Bergen County'], ['TX', 'Travis County'], ['AZ', 'Maricopa County'], ['GA', 'Fulton County'], ['TX', 'Harris County'], ['OH', 'Cuyahoga County'], ['MI', 'Wayne County']];
const tableRows = BIG.flatMap(([st, n]) => { try { return [{ st, c: K.county(st, n) }]; } catch { return []; } });
const la = K.county('CA', 'Los Angeles County'), harris = K.county('TX', 'Harris County');

function table(h: Helpers) {
  const rows = tableRows.map(({ st, c }) => [`${K.countyLabel(c)}, ${st}`, c.fha ? h.m(c.fha) : '', c.cll ? h.m(c.cll) : '', c.fha ? h.m(c.fha / (1 - F.minDown / 100)) : '']);
  return h.table([h.t('County', 'Condado'), h.t('FHA limit', 'Límite FHA'), h.t('Conforming limit', 'Límite conforme'), h.t('Highest price with FHA at 3.5% down', 'Precio máximo con FHA y 3.5 % de entrada')], rows,
    h.t('One-unit limits for 2026: HUD Mortgagee Letter 2025-23 (FHA) and FHFA conforming loan limits.', 'Límites 2026 para una vivienda: carta 2025-23 de HUD (FHA) y límites conformes de FHFA.'), ['l', 'r', 'r', 'r']);
}

export default defineGuide({
  id: 'loan-limits', group: 'tools', order: 9, tool: 'limits', toolArg: { st: 'CA', c: la.id },
  related: ['how-much-down', 'income-limits', 'requirements', 'ca', 'wa', 'nj'],
  sources: ['fha-ml', 'fha-file', 'fhfa-cll', 'fha-handbook'],
  en: {
    slug: 'fha-loan-limits-by-county', nav: 'FHA loan limits by county', card: 'FHA and conforming limits of your county for 2026',
    title: 'FHA Loan Limits by County 2026 and Conforming Loan Limits',
    description: `FHA loan limits by county for 2026, from ${E.m(F.floor)} to ${E.m(F.ceiling)} for one unit, with the conforming limit and the highest price you can finance at 3.5% down.`,
    h1: 'FHA loan limits by county, with the conforming limit',
    intro: 'Pick your state and county: the FHA and conforming loan limits for 2026, and the highest price each one finances with the minimum down payment.',
    resume: `Most state down payment programs are paired with an FHA or a conventional first mortgage, so the loan limit of your county caps what you can buy with help. For 2026 the FHA limit for a one-unit home runs from a national floor of ${E.m(F.floor)}, which applies in ${E.n(atFloor)} of the ${E.n(withFha.length)} counties and towns in our file, to a ceiling of ${E.m(F.ceiling)}, reached in ${E.n(atCeil)} of them; Alaska and Hawaii can go to ${E.m(F.ceilingSpecial)}. The conforming limit for Fannie Mae and Freddie Mac loans is ${E.m(H.baseline)} in most of the country and higher in ${E.n(aboveBase)} high-cost areas, up to ${E.m(H.ceiling)}. In Los Angeles County both limits are ${E.m(la.fha ?? 0)}; in Harris County, Texas, FHA is ${E.m(harris.fha ?? 0)}. With 3.5% down, an FHA loan at the floor finances a price of about ${E.m(F.floor / (1 - F.minDown / 100))}.`,
    faqs: [
      { q: 'How are FHA loan limits set?', a: `By law, from area home prices. HUD sets the limit at 115% of the median price of the county or metropolitan area, never below the floor of 65% of the conforming baseline (${E.m(F.floor)}) and never above the ceiling of 150% (${E.m(F.ceiling)}). All counties of a metropolitan area share the limit of the highest-cost county.` },
      { q: 'Can I buy a home above the FHA limit with an FHA loan?', a: 'Yes, if you pay the difference. The limit caps the loan, not the price: a buyer can put down more than 3.5% to bring the loan under the limit. In practice, assisted buyers rarely can, so the limit works as a price cap. Some state programs also set their own, lower price limits.' },
      { q: 'Do loan limits change every year?', a: 'Yes. FHFA announces the conforming limits each November or December for the next calendar year, and HUD follows with FHA limits based on them. Both rose for 2026. The site reads the new files when they are published; the date of the figures is shown at the top of every page.' },
    ],
    body: (h) => `
<h2>The two limits in fourteen counties</h2>
${table(h)}
<p>In most counties the FHA limit sits below the conforming limit, so a buyer near the top of the market is better served by a 3% conventional loan, when the income allows it. In the most expensive areas the two meet at the ceiling. A few counties, Bergen in New Jersey among them, keep an FHA limit above the conforming one under an older rule that HUD still applies.</p>
<h2>Why the limit matters for assistance</h2>
<p>A down payment program does not lend above the first mortgage it is paired with. If the price you need is above the FHA limit and your income does not reach a conventional loan, no state help bridges that gap. The reverse also happens: an agency price limit can be far below the FHA limit, as in Texas and New Jersey, where the agency table for your county is the real cap. The main calculator applies both.</p>
${h.mini('limits', { p: ['st', 'c'], d: { st: 'WA', c: K.county('WA', 'King County').id }, t: 'Your county' })}
<h2>Multi-unit homes</h2>
<p>FHA and conforming limits are higher for two, three and four units, and several state programs accept them when the buyer lives in one of the units. The calculator gives the one-unit limit, the case of almost every assisted purchase; the HUD and FHFA files linked below list the others.</p>
<h2>Base loan and financed premium</h2>
<p>The FHA limit applies to the base loan amount. The upfront mortgage insurance premium financed on top can take the total above the limit without breaking the rule. A buyer at the limit therefore borrows a little more than the figure shown, and the monthly payment includes that premium.</p>
<h2>Why a rural county can have a city limit</h2>
<p>Limits are set by metropolitan area, not county by county, wherever a county belongs to one. A rural county on the edge of a large metro takes the metro's limit, which can be far above what its own prices would give. Counties outside any metro area get their own figure or the floor. The calculator shows the HUD area your county belongs to on the income page; the limit here follows the same map, which is why neighbours across a metro boundary can differ by tens of thousands of dollars.</p>
`,
  },
  es: {
    slug: 'limites-de-prestamos-fha-por-condado', nav: 'Límites FHA por condado', card: 'Límites FHA y conformes de su condado para 2026',
    title: 'Límites de préstamos FHA por condado 2026 y límite conforme',
    description: `Límites de préstamos FHA por condado 2026, de ${S.m(F.floor)} a ${S.m(F.ceiling)} por vivienda, con el límite conforme y el precio máximo que se financia con el 3.5 %.`,
    h1: 'Límites de préstamos FHA por condado, con el límite conforme',
    intro: 'Elija su estado y su condado: los límites FHA y conformes de 2026, y el precio más alto que financia cada uno con la entrada mínima.',
    resume: `La mayoría de los programas estatales de ayuda para el pago inicial se combinan con una primera hipoteca FHA o convencional, así que el límite de préstamo de su condado topa lo que puede comprar con ayuda. Para 2026, el límite FHA de una vivienda va de un piso nacional de ${S.m(F.floor)}, que se aplica en ${S.n(atFloor)} de los ${S.n(withFha.length)} condados y municipios de nuestro archivo, a un techo de ${S.m(F.ceiling)}, alcanzado en ${S.n(atCeil)} de ellos; Alaska y Hawái pueden llegar a ${S.m(F.ceilingSpecial)}. El límite conforme de los préstamos de Fannie Mae y Freddie Mac es de ${S.m(H.baseline)} en casi todo el país y más alto en ${S.n(aboveBase)} zonas de costo alto, hasta ${S.m(H.ceiling)}. En el condado de Los Ángeles ambos límites son de ${S.m(la.fha ?? 0)}; en el de Harris, Texas, el límite FHA es de ${S.m(harris.fha ?? 0)}. Con el 3.5 % de entrada, un préstamo FHA en el piso financia un precio de unos ${S.m(F.floor / (1 - F.minDown / 100))}.`,
    faqs: [
      { q: '¿Cómo se fijan los límites de préstamos FHA?', a: `Por ley, a partir de los precios de la zona. HUD fija el límite en el 115 % del precio medio del condado o del área metropolitana, nunca por debajo del piso del 65 % del límite conforme base (${S.m(F.floor)}) ni por encima del techo del 150 % (${S.m(F.ceiling)}). Todos los condados de un área metropolitana comparten el límite del condado más caro.` },
      { q: '¿Puedo comprar por encima del límite FHA con un préstamo FHA?', a: 'Sí, si paga la diferencia. El límite topa el préstamo, no el precio: un comprador puede dar más del 3.5 % para dejar el préstamo bajo el límite. En la práctica, los compradores con ayuda rara vez pueden, así que el límite funciona como tope de precio. Algunos programas estatales fijan además sus propios topes de precio, más bajos.' },
      { q: '¿Cambian los límites de préstamo cada año?', a: 'Sí. FHFA anuncia los límites conformes cada noviembre o diciembre para el año siguiente, y HUD publica después los límites FHA basados en ellos. Ambos subieron para 2026. El sitio lee los nuevos archivos cuando se publican; la fecha de las cifras aparece arriba en cada página.' },
    ],
    body: (h) => `
<h2>Los dos límites en catorce condados</h2>
${table(h)}
<p>En la mayoría de los condados el límite FHA está por debajo del conforme, así que a un comprador en la parte alta del mercado le conviene más un préstamo convencional al 3 %, si su ingreso lo permite. En las zonas más caras ambos se juntan en el techo. Algunos condados, como Bergen en Nueva Jersey, mantienen un límite FHA por encima del conforme por una regla antigua que HUD sigue aplicando.</p>
<h2>Por qué el límite importa para la ayuda</h2>
<p>Un programa de ayuda no presta por encima de la primera hipoteca con la que se combina. Si el precio que necesita supera el límite FHA y su ingreso no alcanza para un préstamo convencional, ninguna ayuda estatal salva la diferencia. También pasa lo contrario: un tope de precio de la agencia puede estar muy por debajo del límite FHA, como en Texas y Nueva Jersey, donde la tabla de la agencia para su condado es el tope real. La calculadora principal aplica los dos.</p>
${h.mini('limits', { p: ['st', 'c'], d: { st: 'WA', c: K.county('WA', 'King County').id }, t: 'Su condado' })}
<h2>Viviendas de varias unidades</h2>
<p>Los límites FHA y conformes son más altos para dos, tres y cuatro unidades, y varios programas estatales las aceptan si el comprador vive en una de ellas. La calculadora da el límite de una vivienda, el caso de casi todas las compras con ayuda; los archivos de HUD y FHFA enlazados abajo enumeran los demás.</p>
<h2>Préstamo base y prima financiada</h2>
<p>El límite FHA se aplica al monto base del préstamo. La prima inicial del seguro hipotecario financiada encima puede llevar el total por encima del límite sin romper la regla. Un comprador en el límite pide, por tanto, algo más que la cifra mostrada, y el pago mensual incluye esa prima.</p>
<h2>Por qué un condado rural puede tener un límite de ciudad</h2>
<p>Los límites se fijan por área metropolitana, no condado por condado, cuando un condado pertenece a una. Un condado rural en el borde de una gran área metropolitana toma el límite de esa área, que puede estar muy por encima de lo que darían sus propios precios. Los condados fuera de toda área metropolitana tienen su propia cifra o el piso. Por eso dos vecinos a ambos lados de una frontera metropolitana pueden diferir en decenas de miles de dólares.</p>
`,
  },
});
