import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { progTable, example, STATES_READ } from './_shared';

const fl = example({ st: 'FL', county: 'Miami-Dade County', income: 90000, price: 380000, size: 3 });
const oh = example({ st: 'OH', county: 'Franklin County', income: 90000, price: 280000, size: 3 });
const nOpen = STATES_READ.reduce((a, st) => a + K.state(st).programs.filter((p) => p.status === 'open').length, 0);
const nAll = STATES_READ.reduce((a, st) => a + K.state(st).programs.length, 0);
const E = K.en, S = K.es;

export default defineGuide({
  id: 'programs', group: 'tools', order: 1, tool: 'dpa', toolArg: { st: 'FL', c: fl.c.id, i: 90000, p: 380000 },
  related: ['grants', 'first-time', 'requirements', 'payment', 'tx', 'ca'],
  sources: ['hud-il', 'agency-FL', 'prog-fl-assist', 'prog-fl-hfa-plus', 'agency-OH', 'prog-oh-dpa'],
  en: {
    slug: 'down-payment-assistance-programs', nav: 'Assistance programs by state', card: 'Every state program we read, with amount, form and limits',
    title: 'Down Payment Assistance Programs by State: 2026 Terms',
    description: `Down payment assistance programs in 2026: ${nAll} state programs with amount, form, income limit and credit floor, checked against your own county and income.`,
    h1: 'Down payment assistance programs, state by state',
    intro: 'Choose a state and a county: each program of the state agency is checked against your income, price, credit and first-time status.',
    resume: `A down payment assistance program is a set of rules attached to money: an amount, often a percentage of the price or of the first mortgage, a form, grant, forgivable, deferred or repayable, and conditions on income, price, credit score and prior ownership. We read ${nAll} programs on the pages of ${STATES_READ.length} state housing finance agencies, ${nOpen} of them taking applications in October 2026. In Miami-Dade County, a household of three earning ${E.m(90000)} buying at ${E.m(380000)} with an FHA loan is at ${E.p(fl.ami.pct)} of the area median for its size; ${fl.sm.best ? `the largest help it likely fits is ${fl.sm.best.p.name}, ${E.m(fl.sm.bestAmount)}` : 'no Florida program fits it'}. In Franklin County, Ohio, the same household buying at ${E.m(280000)} ${oh.sm.best ? `can draw ${E.m(oh.sm.bestAmount)} from ${oh.sm.best.p.name}` : 'fits no program'}. The table below lists every program with the agency's own wording.`,
    faqs: [
      { q: 'Which state has the best down payment assistance program?', a: `No state wins on every count. Among the programs we read, Massachusetts lends up to ${E.m(K.prog('ma-dpa1').amount.value ?? 0)} deferred at 0%, Illinois gives 6% of the price up to ${E.m(K.prog('il-home').amount.max ?? 0)}, and Pennsylvania's K-FIT pays 5% of the price with no cap, forgiven over ten years. The best one is the one your income, county and price fit, which the calculator tells you.` },
      { q: 'Are down payment assistance programs only for low-income buyers?', a: 'No. Many programs reach well into middle incomes: 115% of area median for a family of three in Texas bond programs, a fixed $215,000 cap for Washington Home Advantage, $158,000 for North Carolina Home Advantage. The 80% low-income limit applies mainly to grants and to programs funded by the federal HOME program.' },
      { q: 'How do I apply for a state down payment assistance program?', a: 'Through a lender the agency has approved, not through the agency itself. The lender reserves the first mortgage and the assistance together, checks your income documents and credit, and books the homebuyer education course. Agencies publish their lists of approved lenders; this site does not recommend one and passes no details to anyone.' },
      { q: 'Why does a program show "check with the agency"?', a: 'Because one of its conditions depends on a table we have not transcribed, usually an income or price limit set county by county, or on a fact the calculator cannot know, such as being a first-generation buyer. The other conditions passed. Open the agency link in the table to read the limit for your county.' },
    ],
    body: (h) => `
<h2>What the ${nAll} programs have in common</h2>
<p>Almost all of them work the same way: the agency, or a lender on its behalf, makes a first mortgage at a fixed rate, FHA, VA, USDA or conventional, and adds a second lien that pays the down payment and part of the closing costs. The second lien is what people call down payment assistance. Its size is usually a percentage, between 3% and 6% of the first mortgage or of the price, sometimes a fixed sum. The agency keeps the right to recover it if you sell early, which is why the form matters as much as the amount.</p>
<p>What differs from state to state is the generosity and the conditions. Ohio pays ${K.prog('oh-dpa').amount.text}, forgiven after ${K.prog('oh-dpa').forgivenAfterYears} years. Florida's ${K.prog('fl-assist').name} is ${K.prog('fl-assist').amount.text}, deferred at 0% until you sell or refinance. Texas lends up to 5% of the first mortgage and lets you choose between a 30-year deferred loan and a 3-year forgivable one. New Jersey sets the amount by county, ${h.m(15000)} in its higher-cost northern counties and ${h.m(10000)} in the south.</p>
${progTable(h, STATES_READ)}
<h2>How to read the table against your own case</h2>
<p>Start with the column that eliminates the most people: the income limit. If it says "by county", the calculator uses the agency's county table when we transcribed it (Texas, Ohio, New Jersey) and otherwise flags the program for you to check on the agency's link. Then the price limit, which follows the county in bond programs and is often close to the FHA limit. Then the credit floor, then the first-time rule. The amount comes last, because a generous program you cannot enter is worth nothing.</p>
${h.mini('ami', { p: ['st', 'c', 'i'], d: { st: 'OH', c: oh.c.id, i: 90000, h: 3 }, t: 'Your share of area median income' })}
<h2>When a program says it is closed</h2>
<p>Agencies fund their programs year by year. When the money for the year is reserved, the program stops taking reservations until the next allocation, even though its page often stays online. We keep such programs in the table with their status in the agency's words, so you can see what existed and watch for its return, and the calculator never counts them in the amount you may get. In October 2026 that applies to Florida's Hometown Heroes and California's Dream For All.</p>
<h2>States not in the table yet</h2>
<p>For the other states, the calculator still gives your share of HUD area median income, the FHA and conforming limits of your county and your monthly payment, and the home page lists each one. We add a state once its agency's terms have been read on its own pages and its program pages answer; a state whose pages cannot be read is not filled in from secondary sites.</p>
`,
  },
  es: {
    slug: 'programas-de-ayuda-para-el-pago-inicial', nav: 'Programas de ayuda por estado', card: 'Cada programa estatal que leímos, con monto, forma y límites',
    title: 'Programas de ayuda para el pago inicial por estado, 2026',
    description: `Programas de ayuda para el pago inicial en 2026: ${nAll} programas estatales con monto, forma, límite de ingresos y crédito mínimo, según su condado e ingreso.`,
    h1: 'Programas de ayuda para el pago inicial, estado por estado',
    intro: 'Elija un estado y un condado: cada programa de la agencia estatal se compara con su ingreso, precio, crédito y si es su primera vivienda.',
    resume: `Un programa de ayuda para el pago inicial es un conjunto de reglas pegado a un dinero: un monto, a menudo un porcentaje del precio o de la primera hipoteca, una forma, subvención, perdonable, diferida o con cuota, y condiciones de ingreso, precio, puntaje de crédito y propiedad anterior. Leímos ${nAll} programas en las páginas de ${STATES_READ.length} agencias estatales de vivienda, ${nOpen} de ellos abiertos en octubre de 2026. En el condado de Miami-Dade, un hogar de tres personas que gana ${S.m(90000)} y compra por ${S.m(380000)} con préstamo FHA está al ${S.p(fl.ami.pct)} de la mediana del área para su tamaño; ${fl.sm.best ? `la mayor ayuda a la que probablemente tiene derecho es ${fl.sm.best.p.name}, ${S.m(fl.sm.bestAmount)}` : 'ningún programa de Florida le corresponde'}. En el condado de Franklin, Ohio, el mismo hogar que compra por ${S.m(280000)} ${oh.sm.best ? `puede recibir ${S.m(oh.sm.bestAmount)} de ${oh.sm.best.p.name}` : 'no entra en ningún programa'}. La tabla enumera cada programa con las palabras de la agencia.`,
    faqs: [
      { q: '¿Qué estado tiene el mejor programa de ayuda para el pago inicial?', a: `Ningún estado gana en todo. Entre los programas que leímos, Massachusetts presta hasta ${S.m(K.prog('ma-dpa1').amount.value ?? 0)} diferidos al 0 %, Illinois da el 6 % del precio hasta ${S.m(K.prog('il-home').amount.max ?? 0)} y K-FIT de Pensilvania paga el 5 % del precio sin tope, perdonado en diez años. El mejor es aquel al que su ingreso, condado y precio le dan acceso, y eso lo dice la calculadora.` },
      { q: '¿Los programas de ayuda son solo para personas de bajos ingresos?', a: 'No. Muchos llegan a ingresos medios: el 115 % de la mediana para una familia de tres en los programas de bonos de Texas, un tope fijo de $215,000 en Home Advantage de Washington, $158,000 en Home Advantage de Carolina del Norte. El límite de bajos ingresos del 80 % se aplica sobre todo a subvenciones y a programas pagados con fondos federales HOME.' },
      { q: '¿Cómo se solicita un programa estatal de ayuda?', a: 'A través de un prestamista aprobado por la agencia, no de la agencia misma. El prestamista reserva juntas la primera hipoteca y la ayuda, revisa sus comprobantes de ingresos y su crédito y le inscribe en el curso para compradores. Las agencias publican su lista de prestamistas aprobados; este sitio no recomienda ninguno ni pasa sus datos a nadie.' },
      { q: '¿Por qué un programa dice "confirmar con la agencia"?', a: 'Porque una de sus condiciones depende de una tabla que no transcribimos, casi siempre un límite de ingreso o de precio fijado por condado, o de un dato que la calculadora no puede saber, como ser comprador de primera generación. Las demás condiciones se cumplieron. Abra el enlace de la agencia en la tabla para leer el límite de su condado.' },
    ],
    body: (h) => `
<h2>Lo que tienen en común los ${nAll} programas</h2>
<p>Casi todos funcionan igual: la agencia, o un prestamista en su nombre, concede una primera hipoteca a tasa fija, FHA, VA, USDA o convencional, y añade un segundo gravamen que paga la entrada y parte de los gastos de cierre. Ese segundo gravamen es lo que se llama ayuda para el pago inicial. Su tamaño suele ser un porcentaje, entre el 3 % y el 6 % de la primera hipoteca o del precio, a veces una suma fija. La agencia se reserva el derecho de recuperarlo si usted vende pronto, y por eso la forma cuenta tanto como el monto.</p>
<p>Lo que cambia de un estado a otro es la generosidad y las condiciones. Ohio paga el 3 % del precio con préstamo convencional o el 3.5 % con FHA, VA o USDA, perdonado a los ${K.prog('oh-dpa').forgivenAfterYears} años. ${K.prog('fl-assist').name}, en Florida, da hasta $10,000 diferidos al 0 % hasta que venda o refinancie. Texas presta hasta el 5 % de la primera hipoteca y deja elegir entre un préstamo diferido a 30 años y uno perdonable a 3 años. Nueva Jersey fija el monto por condado: ${h.m(15000)} en sus condados del norte, más caros, y ${h.m(10000)} en el sur.</p>
${progTable(h, STATES_READ)}
<h2>Cómo leer la tabla para su propio caso</h2>
<p>Empiece por la columna que descarta a más gente: el límite de ingresos. Si dice "por condado", la calculadora usa la tabla de la agencia cuando la transcribimos (Texas, Ohio, Nueva Jersey) y si no marca el programa para que lo confirme en el enlace de la agencia. Luego el precio máximo, que en los programas de bonos sigue al condado y suele estar cerca del límite FHA. Después el crédito mínimo y la regla de primera vivienda. El monto va al final, porque un programa generoso al que no puede entrar no vale nada.</p>
${h.mini('ami', { p: ['st', 'c', 'i'], d: { st: 'OH', c: oh.c.id, i: 90000, h: 3 }, t: 'Su porcentaje del ingreso medio del área' })}
<h2>Cuando un programa está cerrado</h2>
<p>Las agencias financian sus programas año por año. Cuando se reserva el dinero del año, el programa deja de aceptar reservas hasta la siguiente asignación, aunque su página siga en línea. Dejamos esos programas en la tabla con su estado en palabras de la agencia, para que vea lo que existió y esté atento a su regreso, y la calculadora nunca los cuenta en el monto que podría recibir. En octubre de 2026 es el caso de Hometown Heroes en Florida y de Dream For All en California.</p>
<h2>Estados que aún no están en la tabla</h2>
<p>Para los demás estados, la calculadora da igualmente su porcentaje del ingreso medio de HUD, los límites FHA y conforme de su condado y su pago mensual, y la página de inicio los enumera. Añadimos un estado cuando las condiciones de su agencia se han leído en sus propias páginas; un estado cuyas páginas no se pueden leer no se completa con sitios de segunda mano.</p>
`,
  },
});
