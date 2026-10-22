import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable, agencyLimitsTable } from './_shared';

const E = K.en, S = K.es;
const cl = K.state('TX').countyLimits!;
const def = cl.default!, harrisRow = cl.rows['Harris County'] ?? def, travisRow = cl.rows['Travis County'] ?? def;
const ex = example({ st: 'TX', county: 'Harris County', income: 85000, price: 300000, size: 3 });
const exHigh = example({ st: 'TX', county: 'Harris County', income: 130000, price: 300000, size: 3 });
const COUNTIES = ['Harris County', 'Dallas County', 'Tarrant County', 'Bexar County', 'Travis County', 'Collin County', 'El Paso County', 'Hidalgo County', 'Lubbock County'];
const mfth = K.prog('tx-mfth');

export default defineGuide({
  id: 'tx', group: 'states', order: 1, state: 'TX', tool: 'dpa', toolArg: { st: 'TX', c: ex.c.id, i: 85000, p: 300000, h: 3 },
  related: ['programs', 'income-limits', 'forgivable', 'mcc', 'ca', 'fl'],
  sources: ['agency-TX', 'prog-tx-mfth', 'prog-tx-mcth', 'limits-TX', 'hud-il'],
  en: {
    slug: 'texas-down-payment-assistance', nav: 'Texas', card: 'My First Texas Home, My Choice Texas Home and the MCC, by county',
    title: 'Texas Down Payment Assistance 2026: TDHCA Limits by County',
    description: 'Texas down payment assistance in 2026: My First Texas Home and My Choice Texas Home up to 5% of the loan, TDHCA income and price limits for all 254 counties.',
    h1: 'Texas down payment assistance, county by county',
    intro: 'Pick your Texas county and household: the TDHCA programs you fit, the amount, and the monthly payment with and without the help.',
    resume: `Texas runs its statewide help through the Texas Department of Housing and Community Affairs (TDHCA). My First Texas Home pairs a 30-year first mortgage with up to 5% of the loan amount for the down payment and closing costs, as a 0% second lien repaid on sale or refinance, or as a version forgiven after three years. It is for first-time buyers, veterans and buyers in targeted areas, with a 620 credit score. My Choice Texas Home offers the same help to repeat buyers, with higher income limits and no price cap. Income limits come from the TDHCA county table effective ${E.day(cl.effective)}: ${E.m(def.i12!)} for one or two people and ${E.m(def.i3!)} for three or more in most counties, ${E.m(harrisRow.i3!)} for three or more in Harris County. A household of three earning ${E.m(85000)} buying at ${E.m(300000)} in Harris County gets ${E.m(ex.sm.bestAmount)}, and the cash needed falls from ${E.m(ex.sm.down)} to ${E.m(ex.sm.cashWith)}.`,
    faqs: [
      { q: 'Is the Texas down payment help a grant or a loan?', a: `A loan, in two versions you choose at closing. The repayable version is a 0% second lien due when you sell, refinance or pay off the first mortgage, with no monthly payment. The forgivable version is erased after ${mfth.forgivenAfterYears} years if you still live in the home and the loan is current; the lender may price the first mortgage differently for each.` },
      { q: 'What credit score does TDHCA require?', a: 'At least 620 for My First Texas Home and My Choice Texas Home. The lender can ask more. Debt-to-income follows the automated underwriting findings, with a 45% cap for files underwritten by hand. Homebuyer education is required before closing for both programs.' },
      { q: 'Are there other Texas programs besides TDHCA?', a: 'Yes. The Texas State Affordable Housing Corporation runs its own statewide loans, and some counties and cities add gift funds usable with a TDHCA loan: Harris County, the Capital Area Housing Finance Corporation and the City of McKinney among them. We could not read the TSAHC site, so its programs are not in the calculator.' },
    ],
    body: (h) => `
<h2>The TDHCA programs, as the agency words them</h2>
${stateProgTable(h, 'TX')}
<p>Both loans pay a share of the first mortgage, not of the price, so on an FHA loan with ${K.P.fha.minDown}% down the help can exceed the minimum down payment; the remainder goes to closing costs. The certificate, listed third, is a tax credit rather than cash and can be combined with My First Texas Home.</p>
<h2>Income and price limits in the large counties</h2>
${agencyLimitsTable(h, 'TX', COUNTIES)}
<p>The agency's table follows the federal bond rules: 100% of area median for one or two people and 115% for three or more, with higher limits in targeted areas. That is why the jump between the two columns matters: a third person in the household can open the program. Travis County sits at ${h.m(travisRow.i3!)} for three or more, the highest of the large counties above.</p>
${h.mini('dpa', { p: ['c', 'i', 'h'], d: { st: 'TX', c: K.county('TX', 'Travis County').id, i: 120000, p: 420000, h: 3 }, t: 'Your Texas county' })}
<h2>The Harris County example, line by line</h2>
${exampleTable(h, { st: 'TX', county: 'Harris County', income: 85000, price: 300000, size: 3 }, h.t(`Household of three, ${h.m(85000)}, ${h.m(300000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(85000)}, casa de ${h.m(300000)}, préstamo FHA, 680 puntos.`))}
<p>At ${h.m(130000)} the same household is above the My First Texas Home limit for Harris County, and ${exHigh.sm.best ? `${exHigh.sm.best.p.name} remains, with ${h.m(exHigh.sm.bestAmount)}` : 'no TDHCA program fits'}. The difference shows why a repeat-buyer program exists: it is the fallback for households just above the first-time limits.</p>
<h2>HUD figures for the same counties</h2>
${countyTable(h, 'TX', COUNTIES.slice(0, 6))}
<p>The HUD median and the FHA limit set the frame; the TDHCA table above is what the lender applies. Prices in most of Texas sit well below the FHA floor of ${h.m(K.P.fha.floor)}, so the agency's price limit of ${h.m(def.price!)} rarely binds outside the largest metros. In practice the income limit decides, and the household-size jump is the lever to watch.</p>
<h2>How to apply in Texas</h2>
<p>You apply through a lender approved by TDHCA, not through the agency. The lender reserves the help with the first mortgage, checks the income with the agency's own rules, and sends you to an approved homebuyer course. Ask two or three approved lenders for a Loan Estimate on the same day, with and without the program, and compare the rate and fees: the help is the same everywhere, the first mortgage is not.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-texas', nav: 'Texas', card: 'My First Texas Home, My Choice Texas Home y el MCC, por condado',
    title: 'Ayuda para el pago inicial en Texas 2026: TDHCA por condado',
    description: 'Ayuda para el pago inicial en Texas 2026: My First Texas Home y My Choice Texas Home hasta el 5 % del préstamo, con los límites de TDHCA en los 254 condados.',
    h1: 'Ayuda para el pago inicial en Texas, condado por condado',
    intro: 'Elija su condado de Texas y su hogar: los programas de TDHCA que le corresponden, el monto y el pago mensual con y sin la ayuda.',
    resume: `Texas canaliza su ayuda estatal a través del Departamento de Vivienda y Asuntos Comunitarios de Texas (TDHCA). My First Texas Home combina una primera hipoteca a 30 años con hasta el 5 % del monto del préstamo para la entrada y los gastos de cierre, como un segundo gravamen al 0 % que se devuelve al vender o refinanciar, o en una versión perdonada a los tres años. Es para compradores de primera vez, veteranos y compradores en zonas prioritarias, con 620 puntos de crédito. My Choice Texas Home ofrece la misma ayuda a quien ya tuvo vivienda, con límites de ingreso más altos y sin tope de precio. Los límites salen de la tabla de TDHCA por condado vigente desde el ${S.day(cl.effective)}: ${S.m(def.i12!)} para una o dos personas y ${S.m(def.i3!)} para tres o más en la mayoría de los condados, ${S.m(harrisRow.i3!)} para tres o más en Harris. Un hogar de tres que gana ${S.m(85000)} y compra por ${S.m(300000)} en Harris recibe ${S.m(ex.sm.bestAmount)}, y el efectivo necesario baja de ${S.m(ex.sm.down)} a ${S.m(ex.sm.cashWith)}.`,
    faqs: [
      { q: '¿La ayuda de Texas es una subvención o un préstamo?', a: `Un préstamo, en dos versiones que se eligen al cierre. La versión reembolsable es un segundo gravamen al 0 % exigible al vender, refinanciar o liquidar la primera hipoteca, sin cuota mensual. La versión perdonable se borra a los ${mfth.forgivenAfterYears} años si sigue viviendo en la casa y el préstamo está al día; el prestamista puede fijar la primera hipoteca de otra manera según la versión.` },
      { q: '¿Qué puntaje de crédito pide TDHCA?', a: 'Al menos 620 para My First Texas Home y My Choice Texas Home. El prestamista puede pedir más. La relación deuda-ingreso sigue la evaluación automática, con un tope del 45 % en los expedientes evaluados a mano. El curso para compradores es obligatorio antes del cierre en ambos programas.' },
      { q: '¿Hay otros programas en Texas además de TDHCA?', a: 'Sí. La Texas State Affordable Housing Corporation tiene sus propios préstamos estatales, y algunos condados y ciudades añaden fondos de regalo combinables con un préstamo de TDHCA: el condado de Harris, la Capital Area Housing Finance Corporation y la ciudad de McKinney, entre otros. No pudimos leer el sitio de TSAHC, así que sus programas no están en la calculadora.' },
    ],
    body: (h) => `
<h2>Los programas de TDHCA, en palabras de la agencia</h2>
${stateProgTable(h, 'TX')}
<p>Los dos préstamos pagan una parte de la primera hipoteca, no del precio, así que con un préstamo FHA al ${K.P.fha.minDown} % de entrada la ayuda puede superar la entrada mínima; el resto va a los gastos de cierre. El certificado, en tercera línea, es un crédito fiscal y no dinero en efectivo, y se puede combinar con My First Texas Home.</p>
<h2>Límites de ingreso y precio en los condados grandes</h2>
${agencyLimitsTable(h, 'TX', COUNTIES)}
<p>La tabla de la agencia sigue las reglas federales de los bonos: el 100 % de la mediana del área para una o dos personas y el 115 % para tres o más, con límites más altos en las zonas prioritarias. Por eso importa el salto entre las dos columnas: una tercera persona en el hogar puede abrir el programa. El condado de Travis está en ${h.m(travisRow.i3!)} para tres o más, el más alto de los condados grandes de arriba.</p>
${h.mini('dpa', { p: ['c', 'i', 'h'], d: { st: 'TX', c: K.county('TX', 'Travis County').id, i: 120000, p: 420000, h: 3 }, t: 'Su condado de Texas' })}
<h2>El ejemplo de Harris, línea por línea</h2>
${exampleTable(h, { st: 'TX', county: 'Harris County', income: 85000, price: 300000, size: 3 }, h.t(`Household of three, ${h.m(85000)}, ${h.m(300000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(85000)}, casa de ${h.m(300000)}, préstamo FHA, 680 puntos.`))}
<p>Con ${h.m(130000)}, el mismo hogar supera el límite de My First Texas Home en Harris, y ${exHigh.sm.best ? `queda ${exHigh.sm.best.p.name}, con ${h.m(exHigh.sm.bestAmount)}` : 'ningún programa de TDHCA le corresponde'}. La diferencia muestra para qué existe un programa sin requisito de primera vivienda: es la salida para los hogares justo por encima de los límites.</p>
<h2>Las cifras de HUD para los mismos condados</h2>
${countyTable(h, 'TX', COUNTIES.slice(0, 6))}
<p>La mediana de HUD y el límite FHA fijan el marco; la tabla de TDHCA de arriba es la que aplica el prestamista. Los precios de la mayor parte de Texas están muy por debajo del piso FHA de ${h.m(K.P.fha.floor)}, así que el tope de precio de la agencia, ${h.m(def.price!)}, rara vez limita fuera de las grandes áreas metropolitanas. En la práctica decide el límite de ingresos, y el salto por tamaño del hogar es la palanca que hay que mirar.</p>
<h2>Cómo solicitarla en Texas</h2>
<p>Se solicita a través de un prestamista aprobado por TDHCA, no a la agencia. El prestamista reserva la ayuda junto con la primera hipoteca, revisa el ingreso con las reglas de la agencia y le envía a un curso aprobado para compradores. Pida a dos o tres prestamistas aprobados un Loan Estimate el mismo día, con y sin el programa, y compare la tasa y las comisiones: la ayuda es la misma en todas partes, la primera hipoteca no.</p>
`,
  },
});
