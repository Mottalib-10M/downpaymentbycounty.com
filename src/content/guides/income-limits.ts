import { defineGuide } from '../../lib/page-types';
import type { Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const BIG: Array<[string, string]> = [['CA', 'Los Angeles County'], ['IL', 'Cook County'], ['TX', 'Harris County'], ['AZ', 'Maricopa County'], ['CA', 'San Diego County'], ['FL', 'Miami-Dade County'], ['TX', 'Dallas County'], ['NY', 'Kings County'], ['WA', 'King County'], ['NV', 'Clark County'], ['TX', 'Bexar County'], ['FL', 'Orange County'], ['GA', 'Fulton County'], ['CO', 'Denver County'], ['MI', 'Wayne County'], ['PA', 'Philadelphia County']];
const la = K.county('CA', 'Los Angeles County'), harris = K.county('TX', 'Harris County'), king = K.county('WA', 'King County');
const nAreas = K.STATES.reduce((a, s) => a + s.n, 0);
const all = K.STATES.flatMap((s) => K.state(s.st).counties.map((c) => ({ st: s.st, c })));
const lo = all.reduce((a, b) => (b.c.m < a.c.m ? b : a)), hi = all.reduce((a, b) => (b.c.m > a.c.m ? b : a));
const E = K.en, S = K.es, f = K.P.hud.sizeFactors;

function bigTable(h: Helpers) {
  const rows = BIG.map(([st, n]) => { const c = K.county(st, n); const a = K.ami(c, 3, 0); return [`${K.countyLabel(c)}, ${st}`, h.m(c.m), h.m(a.medianForSize), h.m(c.l80[2]), h.m(a.medianForSize * 1.2)]; });
  return h.table([h.t('County', 'Condado'), h.t('Median, 4 people', 'Mediana, 4 personas'), h.t('100%, 3 people', '100 %, 3 personas'), h.t('HUD 80% limit, 3 people', 'Límite 80 % de HUD, 3 personas'), h.t('120%, 3 people', '120 %, 3 personas')], rows,
    h.t(`HUD fiscal year 2026, effective ${h.day(K.P.hud.effective)}. 100% and 120% use HUD's 90% factor for three people.`, `HUD, año fiscal 2026, vigente desde el ${h.day(K.P.hud.effective)}. El 100 % y el 120 % usan el factor de HUD del 90 % para tres personas.`), ['l', 'r', 'r', 'r', 'r']);
}

export default defineGuide({
  id: 'income-limits', group: 'tools', order: 4, tool: 'ami', toolArg: { st: 'TX', c: harris.id, i: 85000, h: 3 },
  related: ['requirements', 'programs', 'first-time', 'loan-limits', 'tx', 'ca'],
  sources: ['hud-il', 'hud-il-file', 'limits-TX', 'limits-OH', 'limits-NJ'],
  en: {
    slug: 'income-limits-by-county', nav: 'Income limits by county', card: 'HUD area median income and the 80% limit for your household',
    title: 'Income Limits by County 2026: HUD Area Median Income',
    description: `Income limits by county for 2026: HUD area median income and 80% limits for ${E.n(nAreas)} counties and towns, adjusted to your household size, with your own percentage.`,
    h1: 'Income limits by county: your share of area median income',
    intro: 'Pick your county and household: your income as a percentage of the HUD median, and the 80%, 100% and 120% marks programs use.',
    resume: `Down payment programs set their income limits as a percentage of area median income (AMI), and the median they mean is HUD's, published every spring for each county or metropolitan area. For fiscal year 2026, effective ${E.day(K.P.hud.effective)}, the median for a family of four runs from ${E.m(lo.c.m)} in ${K.countyLabel(lo.c)}, ${lo.st}, to ${E.m(hi.c.m)} in ${K.countyLabel(hi.c)}, ${hi.st}. It is ${E.m(harris.m)} in Harris County, ${E.m(la.m)} in Los Angeles County and ${E.m(king.m)} in King County. For other household sizes HUD scales the median: ${Math.round(f[0] * 100)}% for one person, ${Math.round(f[1] * 100)}% for two, ${Math.round(f[2] * 100)}% for three, ${Math.round(f[4] * 100)}% for five. A household of three earning ${E.m(85000)} in Harris County is therefore at ${E.p(K.ami(harris, 3, 85000).pct)} of AMI, under a 100% cap but above HUD's 80% low-income limit of ${E.m(harris.l80[2])}. The calculator does this for any county and size.`,
    faqs: [
      { q: 'What is 80% of area median income in my county?', a: `HUD publishes it directly as the "low-income limit" for each household size. For three people it is ${E.m(harris.l80[2])} in Harris County, Texas, and ${E.m(la.l80[2])} in Los Angeles County. It is not always exactly 80% of the median: HUD caps it at the national median in high-income areas and raises it where housing costs are high.` },
      { q: 'Which income counts for down payment assistance limits?', a: 'It depends on the program. Many count the gross annual income of everyone on the loan; bond-financed programs count every household member 18 or older who will live in the home, including someone not on the loan. Overtime, bonuses and child support usually count. The lender computes it with the agency\'s worksheet.' },
      { q: 'When do HUD income limits change?', a: `Once a year. HUD publishes new limits in the spring, effective ${E.day(K.P.hud.effective)} for fiscal year 2026, and state agencies update their own tables a few weeks later: Texas on July 13, 2026, Ohio on July 1, New Jersey on June 17. The site reads the HUD file again when the next one comes out.` },
    ],
    body: (h) => `
<h2>Why HUD's median and not the census median</h2>
<p>HUD starts from American Community Survey incomes, then applies its own rules: metropolitan areas are drawn as HUD defines them, some counties are split into separate areas, and New England is measured town by town. The figure that results is "median family income", for families, not all households, which is why it sits above the census household median most people quote. It is the figure every federal program and almost every state agency uses, so it is the one the calculator reads, for all ${h.n(nAreas)} areas.</p>
${bigTable(h)}
<h2>From the median to the limit of a program</h2>
<p>Agencies use three families of limits. HUD's own low-income limit, 80% of median adjusted for household size and with HUD's caps, is used by programs funded with federal HOME money and by many city grants. Bond-financed programs follow the federal tax rules: 100% of median for one or two people and 115% for three or more, or 120% and 140% in targeted areas, which is how Texas and New Jersey build their county tables. Other programs pick their own share, 120% or 140% of median, or a single statewide figure. The tool shows your percentage so you can read any of them.</p>
${h.mini('dpa', { p: ['st', 'c', 'i'], d: { st: 'WA', c: king.id, i: 120000, p: 650000, h: 3 }, t: 'The programs at your income' })}
<h2>Household size changes more than you think</h2>
<p>Adding a person raises the limit by about a tenth of the four-person median. A couple earning ${h.m(95000)} in Harris County is at ${h.p(K.ami(harris, 2, 95000).pct)} of the median for two; with a child it drops to ${h.p(K.ami(harris, 3, 95000).pct)}. Bond programs jump at three people (from 100% to 115%), so a birth or an adult child moving in before closing can open a program that was closed. Agencies count the people who will live in the home, not dependents on a tax return.</p>
<h2>Where the agency table wins</h2>
<p>When a state agency publishes its own county table, the calculator uses it rather than HUD's median, because the lender applies the agency's figure. Texas, Ohio and New Jersey are transcribed in full. In other states, programs whose limits vary by county are flagged "check with the agency", with the link to the table.</p>
`,
  },
  es: {
    slug: 'limites-de-ingresos-por-condado', nav: 'Límites de ingresos por condado', card: 'Ingreso medio del área de HUD y límite del 80 % para su hogar',
    title: 'Límites de ingresos por condado 2026: ingreso medio de HUD',
    description: `Límites de ingresos por condado 2026: ingreso medio del área y límites del 80 % de HUD para ${S.n(nAreas)} condados y municipios, según su hogar, con su porcentaje.`,
    h1: 'Límites de ingresos por condado: su porcentaje del ingreso medio',
    intro: 'Elija su condado y su hogar: su ingreso como porcentaje de la mediana de HUD y las marcas del 80 %, 100 % y 120 % que usan los programas.',
    resume: `Los programas de ayuda para el pago inicial fijan sus límites como un porcentaje del ingreso medio del área (AMI), y la mediana de la que hablan es la de HUD, publicada cada primavera para cada condado o área metropolitana. Para el año fiscal 2026, vigente desde el ${S.day(K.P.hud.effective)}, la mediana para una familia de cuatro va de ${S.m(lo.c.m)} en ${K.countyLabel(lo.c)}, ${lo.st}, a ${S.m(hi.c.m)} en ${K.countyLabel(hi.c)}, ${hi.st}. Es de ${S.m(harris.m)} en el condado de Harris, ${S.m(la.m)} en el de Los Ángeles y ${S.m(king.m)} en el de King. Para otros tamaños de hogar, HUD ajusta la mediana: ${Math.round(f[0] * 100)} % para una persona, ${Math.round(f[1] * 100)} % para dos, ${Math.round(f[2] * 100)} % para tres, ${Math.round(f[4] * 100)} % para cinco. Un hogar de tres que gana ${S.m(85000)} en Harris está, por tanto, al ${S.p(K.ami(harris, 3, 85000).pct)} del AMI, bajo un tope del 100 % pero por encima del límite de bajos ingresos de HUD, ${S.m(harris.l80[2])}. La calculadora lo hace para cualquier condado y tamaño.`,
    faqs: [
      { q: '¿Cuánto es el 80 % del ingreso medio del área en mi condado?', a: `HUD lo publica directamente como "límite de bajos ingresos" para cada tamaño de hogar. Para tres personas es de ${S.m(harris.l80[2])} en el condado de Harris, Texas, y de ${S.m(la.l80[2])} en el de Los Ángeles. No siempre es exactamente el 80 % de la mediana: HUD lo topa en la mediana nacional en zonas de ingresos altos y lo sube donde la vivienda es cara.` },
      { q: '¿Qué ingreso cuenta para los límites de la ayuda?', a: 'Depende del programa. Muchos cuentan el ingreso bruto anual de todos los que firman el préstamo; los programas financiados con bonos cuentan a todos los mayores de 18 que vivirán en la casa, aunque no firmen. Las horas extra, los bonos y la manutención de hijos suelen contar. El prestamista lo calcula con la hoja de trabajo de la agencia.' },
      { q: '¿Cuándo cambian los límites de ingresos de HUD?', a: `Una vez al año. HUD publica los nuevos límites en primavera, vigentes desde el ${S.day(K.P.hud.effective)} para el año fiscal 2026, y las agencias estatales actualizan sus tablas unas semanas después: Texas el 13 de julio de 2026, Ohio el 1 de julio, Nueva Jersey el 17 de junio. El sitio vuelve a leer el archivo de HUD cuando sale el siguiente.` },
    ],
    body: (h) => `
<h2>Por qué la mediana de HUD y no la del censo</h2>
<p>HUD parte de los ingresos de la Encuesta sobre la Comunidad Estadounidense y aplica sus propias reglas: las áreas metropolitanas se trazan como HUD las define, algunos condados se dividen en áreas separadas y Nueva Inglaterra se mide municipio por municipio. La cifra que resulta es el "ingreso familiar medio", de familias y no de todos los hogares, por eso queda por encima de la mediana de hogares que cita casi todo el mundo. Es la cifra que usan todos los programas federales y casi todas las agencias estatales, así que es la que lee la calculadora para las ${h.n(nAreas)} áreas.</p>
${bigTable(h)}
<h2>De la mediana al límite de un programa</h2>
<p>Las agencias usan tres familias de límites. El límite de bajos ingresos de HUD, el 80 % de la mediana ajustado al tamaño del hogar y con los topes de HUD, lo usan los programas pagados con fondos federales HOME y muchas subvenciones municipales. Los programas financiados con bonos siguen las reglas fiscales federales: el 100 % de la mediana para una o dos personas y el 115 % para tres o más, o el 120 % y el 140 % en zonas prioritarias, que es como Texas y Nueva Jersey construyen sus tablas por condado. Otros programas eligen su propio porcentaje, el 120 % o el 140 %, o una sola cifra estatal. La herramienta muestra su porcentaje para que pueda leer cualquiera de ellos.</p>
${h.mini('dpa', { p: ['st', 'c', 'i'], d: { st: 'WA', c: king.id, i: 120000, p: 650000, h: 3 }, t: 'Los programas a su nivel de ingreso' })}
<h2>El tamaño del hogar cambia más de lo que parece</h2>
<p>Cada persona más sube el límite en una décima parte, más o menos, de la mediana para cuatro. Una pareja que gana ${h.m(95000)} en Harris está al ${h.p(K.ami(harris, 2, 95000).pct)} de la mediana para dos; con un hijo baja al ${h.p(K.ami(harris, 3, 95000).pct)}. Los programas de bonos saltan a partir de tres personas (del 100 % al 115 %), así que un nacimiento o un hijo adulto que se muda antes del cierre puede abrir un programa que estaba cerrado. Las agencias cuentan a quienes vivirán en la casa, no a los dependientes de la declaración de impuestos.</p>
<h2>Cuándo manda la tabla de la agencia</h2>
<p>Cuando una agencia estatal publica su propia tabla por condado, la calculadora la usa en lugar de la mediana de HUD, porque el prestamista aplica la cifra de la agencia. Texas, Ohio y Nueva Jersey están transcritos completos. En los demás estados, los programas cuyos límites cambian por condado se marcan "confirmar con la agencia", con el enlace a la tabla.</p>
`,
  },
});
