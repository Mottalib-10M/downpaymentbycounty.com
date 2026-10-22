import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable, agencyLimitsTable } from './_shared';

const E = K.en, S = K.es;
const cl = K.state('NJ').countyLimits!;
const rows = Object.entries(cl.rows);
const big = rows.filter(([, r]) => r.amt === 15000).length, small = rows.filter(([, r]) => r.amt === 10000).length;
const i3s = rows.map(([, r]) => r.i3 ?? 0), prices = rows.map(([, r]) => r.price ?? 0);
const i3min = Math.min(...i3s), i3max = Math.max(...i3s), pmin = Math.min(...prices), pmax = Math.max(...prices);
const dpa = K.prog('nj-dpa'), fg = K.prog('nj-firstgen');
const fgAmt = fg.amount.value!;
const amt = (x: ReturnType<typeof example>, id: string) => x.sm.evals.find((e) => e.p.id === id)?.amount ?? 0;
const ex = example({ st: 'NJ', county: 'Essex County', income: 120000, price: 450000, size: 3 });
const exS = example({ st: 'NJ', county: 'Camden County', income: 95000, price: 320000, size: 3 });
const exConv = example({ st: 'NJ', county: 'Essex County', income: 120000, price: 450000, size: 3, loan: 'conv' });
const COUNTIES = ['Bergen County', 'Middlesex County', 'Essex County', 'Hudson County', 'Monmouth County', 'Ocean County', 'Union County', 'Camden County', 'Passaic County', 'Morris County', 'Burlington County', 'Mercer County', 'Atlantic County', 'Cumberland County'];
const essex = K.county('NJ', 'Essex County'), camden = K.county('NJ', 'Camden County');

export default defineGuide({
  id: 'nj', group: 'states', order: 15, state: 'NJ', tool: 'dpa', toolArg: { st: 'NJ', c: essex.id, i: 120000, p: 450000, h: 3 },
  related: ['forgivable', 'first-time', 'income-limits', 'loan-limits', 'ny', 'pa'],
  sources: ['agency-NJ', 'prog-nj-dpa', 'prog-nj-firstgen', 'limits-NJ', 'hud-il', 'fha-ml'],
  en: {
    slug: 'new-jersey-down-payment-assistance', nav: 'New Jersey', card: 'NJHMFA DPA of $10,000 or $15,000 by county, plus $7,000 for first-generation buyers',
    title: 'New Jersey Down Payment Assistance 2026: NJHMFA by County',
    description: `New Jersey down payment assistance in 2026: NJHMFA pays ${E.m(15000)} or ${E.m(10000)} by county, forgiven after five years, with income and price limits of 21 counties.`,
    h1: 'New Jersey down payment assistance, all 21 counties',
    intro: 'Choose your New Jersey county and household: the NJHMFA amount for that county, whether you fit its limits, and the cash left to bring.',
    resume: `New Jersey sets its help by county, and the amount is fixed rather than a percentage. The New Jersey Housing and Mortgage Finance Agency (NJHMFA) pairs its First-Time Homebuyer Mortgage with a second loan of ${E.m(15000)} in ${big} counties and ${E.m(10000)} in the other ${small}, with no interest and no payment, forgiven after ${dpa.forgivenAfterYears} years in the home. First-generation buyers, whose parents own no home, add ${E.m(fgAmt)} on top. The agency's table effective ${E.day(cl.effective)} caps income for three or more people between ${E.m(i3min)} and ${E.m(i3max)}, and the price between ${E.m(pmin)} and ${E.m(pmax)}. The first mortgage must be FHA, VA or USDA. In Essex County a household of three earning ${E.m(120000)} and buying at ${E.m(450000)} gets ${E.m(amt(ex, 'nj-dpa'))}, which covers almost all of the ${E.m(ex.sm.down)} FHA minimum down payment.`,
    faqs: [
      { q: 'Which New Jersey counties get $15,000 instead of $10,000?', a: `The agency's county table sets the amount: ${big} counties, mostly in the northern and central part of the state such as Bergen, Essex, Hudson, Middlesex and Monmouth, receive ${E.m(15000)}; ${small} counties, including Camden, Burlington, Atlantic, Cumberland and Sussex, receive ${E.m(10000)}. The calculator reads the figure for the county you choose.` },
      { q: 'What happens if I sell my New Jersey home before five years?', a: `The NJHMFA loan is forgiven only if you live in the home as your main residence for five full years from closing and do not refinance the first mortgage. Sell, refinance or move out before that and the whole ${E.m(15000)} or ${E.m(10000)} is due, since the agency does not reduce it year by year.` },
      { q: 'Who counts as a first-generation buyer in New Jersey?', a: `A first-time buyer whose parents or legal guardians own no residential property, according to the agency. That buyer adds ${E.m(fgAmt)} to the county amount, for a total of ${E.m(17000)} or ${E.m(22000)}. The calculator cannot verify the parents' situation, so it shows the extra loan as one to confirm with the lender.` },
    ],
    body: (h) => `
<h2>The two NJHMFA loans, in the agency's words</h2>
${stateProgTable(h, 'NJ')}
<p>Both are second loans that sit behind the agency's own first mortgage. The fact sheet names FHA, VA and USDA as the first mortgage types, so a buyer who wants a conventional loan falls outside the program: with the same Essex County figures on a conventional loan, the calculator ${exConv.sm.evals.find((e) => e.p.id === 'nj-dpa')?.verdict === 'no' ? 'marks the NJHMFA loan as not a fit' : 'still shows the loan'}. Homebuyer education is not named as a condition on the pages we read; lenders often ask for it anyway.</p>
<h2>The agency's county table</h2>
${agencyLimitsTable(h, 'NJ', COUNTIES)}
<p>The table follows the federal bond rules: 100% of area median income for one or two people and 115% for three or more. Prices fall into three bands: ${h.m(pmin)} in the cheapest counties, ${h.m(659386)} or ${h.m(764069)} in South Jersey and the shore, and ${h.m(pmax)} in the counties of the New York metro. Higher limits apply in Urban Target Areas, which the calculator does not model; if your town is one, the lender will use them.</p>
${h.mini('dpa', { p: ['c', 'i', 'h'], d: { st: 'NJ', c: camden.id, i: 95000, p: 320000, h: 3 }, t: 'Your New Jersey county' })}
<h2>Essex County, line by line</h2>
${exampleTable(h, { st: 'NJ', county: 'Essex County', income: 120000, price: 450000, size: 3 }, h.t(`Household of three, ${h.m(120000)}, ${h.m(450000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(120000)}, casa de ${h.m(450000)}, préstamo FHA, 680 puntos.`))}
<p>Move the same household to Camden County with ${h.m(95000)} and a ${h.m(320000)} home and the loan drops to ${h.m(amt(exS, 'nj-dpa'))}, while the FHA minimum down payment is ${h.m(exS.sm.down)}. The smaller amount in the south goes with lower prices, so it still covers most of the down payment; what it rarely covers on top is the closing costs, which the buyer then pays from savings, a gift or a seller credit.</p>
<h2>HUD and FHA figures for the same counties</h2>
${countyTable(h, 'NJ', ['Bergen County', 'Essex County', 'Hudson County', 'Middlesex County', 'Camden County', 'Atlantic County'])}
<p>Essex sits in the New York metro with an FHA limit of ${h.m(essex.fha ?? 0)}; Camden belongs to the Philadelphia metro at ${h.m(camden.fha ?? 0)}. The agency's own price cap is lower in some counties than the FHA limit, so check the column of the first table before you set a budget.</p>
<h2>How to use it in New Jersey</h2>
<p>NJHMFA lends only through participating lenders. Ask one for the First-Time Homebuyer Mortgage with the down payment assistance, and say at the start if you are a first-generation buyer, since the extra ${h.m(fgAmt)} has its own paperwork. Keep in mind the five-year clock: a refinance in year four, even to a lower rate, makes the whole loan due.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-nueva-jersey', nav: 'Nueva Jersey', card: 'Ayuda de NJHMFA de $10,000 o $15,000 por condado, y $7,000 para primera generación',
    title: 'Ayuda para el pago inicial en Nueva Jersey 2026: NJHMFA',
    description: `Ayuda para el pago inicial en Nueva Jersey 2026: NJHMFA da ${S.m(15000)} o ${S.m(10000)} según el condado, perdonados a los cinco años, con límites de los 21 condados.`,
    h1: 'Ayuda para el pago inicial en Nueva Jersey, en los 21 condados',
    intro: 'Elija su condado de Nueva Jersey y su hogar: el monto de NJHMFA para ese condado, si cumple sus límites y el efectivo que todavía debe llevar.',
    resume: `Nueva Jersey fija su ayuda por condado, y el monto es una cifra fija, no un porcentaje. La New Jersey Housing and Mortgage Finance Agency (NJHMFA) combina su hipoteca para compradores de primera vez con un segundo préstamo de ${S.m(15000)} en ${big} condados y de ${S.m(10000)} en los otros ${small}, sin interés ni cuota, perdonado a los ${dpa.forgivenAfterYears} años de vivir en la casa. Quien compra en primera generación, porque sus padres no tienen vivienda, suma ${S.m(fgAmt)}. La tabla de la agencia vigente desde el ${S.day(cl.effective)} limita el ingreso de un hogar de tres o más entre ${S.m(i3min)} y ${S.m(i3max)}, y el precio entre ${S.m(pmin)} y ${S.m(pmax)}. La primera hipoteca debe ser FHA, VA o USDA. En el condado de Essex, un hogar de tres que gana ${S.m(120000)} y compra por ${S.m(450000)} recibe ${S.m(amt(ex, 'nj-dpa'))}, casi toda la entrada mínima FHA de ${S.m(ex.sm.down)}.`,
    faqs: [
      { q: '¿Qué condados de Nueva Jersey reciben $15,000 y no $10,000?', a: `Lo fija la tabla de la agencia por condado: ${big} condados, sobre todo del norte y del centro del estado, como Bergen, Essex, Hudson, Middlesex y Monmouth, reciben ${S.m(15000)}; ${small} condados, entre ellos Camden, Burlington, Atlantic, Cumberland y Sussex, reciben ${S.m(10000)}. La calculadora toma la cifra del condado que usted elija.` },
      { q: '¿Qué pasa si vendo mi casa de Nueva Jersey antes de cinco años?', a: `El préstamo de NJHMFA solo se perdona si vive en la casa como residencia principal durante cinco años completos desde el cierre y no refinancia la primera hipoteca. Si vende, refinancia o se muda antes, se debe la totalidad de los ${S.m(15000)} o ${S.m(10000)}, porque la agencia no lo reduce año por año.` },
      { q: '¿Quién es comprador de primera generación en Nueva Jersey?', a: `Un comprador de primera vez cuyos padres o tutores legales no son dueños de ninguna vivienda, según la agencia. Ese comprador suma ${S.m(fgAmt)} al monto del condado, para un total de ${S.m(17000)} o ${S.m(22000)}. La calculadora no puede comprobar la situación de los padres, así que muestra el préstamo extra como pendiente de confirmar con el prestamista.` },
    ],
    body: (h) => `
<h2>Los dos préstamos de NJHMFA, en palabras de la agencia</h2>
${stateProgTable(h, 'NJ')}
<p>Ambos son segundos préstamos detrás de la primera hipoteca de la propia agencia. La hoja informativa nombra FHA, VA y USDA como tipos de primera hipoteca, así que quien quiere un préstamo convencional queda fuera del programa: con las mismas cifras de Essex y un préstamo convencional, la calculadora ${exConv.sm.evals.find((e) => e.p.id === 'nj-dpa')?.verdict === 'no' ? 'marca el préstamo de NJHMFA como no aplicable' : 'sigue mostrando el préstamo'}. Las páginas que leímos no nombran el curso para compradores como condición; muchos prestamistas lo piden igual.</p>
<h2>La tabla de la agencia por condado</h2>
${agencyLimitsTable(h, 'NJ', COUNTIES)}
<p>La tabla sigue las reglas federales de los bonos: el 100 % del ingreso medio del área para una o dos personas y el 115 % para tres o más. Los precios caen en tres franjas: ${h.m(pmin)} en los condados más baratos, ${h.m(659386)} o ${h.m(764069)} en el sur y la costa, y ${h.m(pmax)} en los condados del área de Nueva York. En las Urban Target Areas rigen límites más altos que la calculadora no modela; si su municipio es una de ellas, el prestamista los aplicará.</p>
${h.mini('dpa', { p: ['c', 'i', 'h'], d: { st: 'NJ', c: camden.id, i: 95000, p: 320000, h: 3 }, t: 'Su condado de Nueva Jersey' })}
<h2>El condado de Essex, línea por línea</h2>
${exampleTable(h, { st: 'NJ', county: 'Essex County', income: 120000, price: 450000, size: 3 }, h.t(`Household of three, ${h.m(120000)}, ${h.m(450000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(120000)}, casa de ${h.m(450000)}, préstamo FHA, 680 puntos.`))}
<p>Si el mismo hogar compra en el condado de Camden con ${h.m(95000)} y una casa de ${h.m(320000)}, el préstamo baja a ${h.m(amt(exS, 'nj-dpa'))}, mientras que la entrada mínima FHA es de ${h.m(exS.sm.down)}. El monto menor del sur va con precios más bajos, así que sigue cubriendo la mayor parte de la entrada; lo que casi nunca cubre además de eso son los gastos de cierre, que el comprador paga entonces con ahorros, un regalo o un crédito del vendedor.</p>
<h2>Cifras de HUD y FHA de los mismos condados</h2>
${countyTable(h, 'NJ', ['Bergen County', 'Essex County', 'Hudson County', 'Middlesex County', 'Camden County', 'Atlantic County'])}
<p>Essex pertenece al área de Nueva York, con un límite FHA de ${h.m(essex.fha ?? 0)}; Camden pertenece al área de Filadelfia, con ${h.m(camden.fha ?? 0)}. El tope de precio de la agencia es en algunos condados más bajo que el límite FHA, así que revise la columna de la primera tabla antes de fijar un presupuesto.</p>
<h2>Cómo usarla en Nueva Jersey</h2>
<p>NJHMFA presta solo a través de prestamistas participantes. Pida a uno la hipoteca para compradores de primera vez con la ayuda para la entrada, y diga desde el principio si es comprador de primera generación, porque los ${h.m(fgAmt)} extra llevan sus propios documentos. Tenga presente el plazo de cinco años: refinanciar en el cuarto año, aunque sea a una tasa menor, hace exigible todo el préstamo.</p>
`,
  },
});
