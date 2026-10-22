import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const adv = K.prog('wa-homeadv'), hk = K.prog('wa-housekey'), cov = K.prog('wa-covenant');
const advCap = adv.incomeLimit?.value ?? 0;
const king = K.county('WA', 'King County'), spokane = K.county('WA', 'Spokane County');
const ex = example({ st: 'WA', county: 'Spokane County', income: 90000, price: 380000, size: 3 });
const exKing = example({ st: 'WA', county: 'King County', income: 150000, price: 700000, size: 3 });
const COUNTIES = ['King County', 'Snohomish County', 'Pierce County', 'Clark County', 'Spokane County', 'Thurston County', 'Whatcom County', 'Kitsap County'];
const local = K.state('WA').local ?? [];

export default defineGuide({
  id: 'wa', group: 'states', order: 8, state: 'WA', tool: 'dpa', toolArg: { st: 'WA', c: spokane.id, i: 90000, p: 380000, h: 3 },
  related: ['programs', 'payment', 'income-limits', 'loan-limits', 'co', 'az'],
  sources: ['agency-WA', 'prog-wa-homeadv', 'prog-wa-needs', 'prog-wa-housekey', 'prog-wa-covenant', 'prog-wa-veterans', 'hud-il'],
  en: {
    slug: 'washington-down-payment-assistance', nav: 'Washington', card: 'Home Advantage, House Key, Covenant and the local loans, by county',
    title: 'Washington Down Payment Assistance 2026: Here to Home Loans',
    description: 'Washington down payment assistance in 2026: Home Advantage 3% to 5% of the loan, House Key, Covenant and veterans loans, with limits for all 39 counties.',
    h1: 'Washington down payment assistance, from King to Spokane',
    intro: 'Choose your Washington county and household: the Commission programs that fit, how much they lend, and your monthly payment with and without them.',
    resume: `In Washington the statewide help comes from the Washington State Housing Finance Commission, which markets its programs as Here to Home. The broadest is Home Advantage Downpayment Assistance: 3%, 4% or 5% of the first mortgage at 0% interest, no monthly payment, repaid when you sell, refinance or move out, with a single income cap of ${E.m(advCap)} in every county and no first-time rule. House Key Opportunity lends up to ${E.m(15000)} at 1% simple interest to first-time buyers, with lower limits by county group. Covenant Homeownership can reach 20% of the price, up to ${E.m(150000)}, for people affected by housing discrimination before 1968 and their descendants. A household of three earning ${E.m(90000)} buying at ${E.m(380000)} in Spokane County can draw ${E.m(ex.sm.bestAmount)}, cutting the cash for the down payment from ${E.m(ex.sm.down)} to ${E.m(ex.sm.cashWith)}. Every Washington loan here is deferred: none is a grant.`,
    faqs: [
      { q: 'Is Washington down payment assistance free money?', a: 'No. Every Commission program we read is a deferred loan: you make no monthly payment, but the balance is due when you sell, refinance, transfer the home, stop living in it or pay off the first mortgage. House Key and the needs-based loan also accrue 1% simple interest, the veterans loan 3%, which adds to what you repay.' },
      { q: 'Who qualifies for the Washington Covenant Homeownership Program?', a: 'People who lived in Washington before April 1968 and belonged to groups affected by discriminatory housing practices, and their descendants, according to the Commission page. It covers up to 20% of the cost of the home, capped at $150,000, plus closing costs. Income and other limits are set by the program; check them with an approved lender.' },
      { q: 'Why do two income limits appear for the needs-based loan?', a: `The Commission's own page shows two sets of figures for Home Advantage Needs-Based: one in the summary and a lower one in the eligibility section. We list both and the calculator flags the program as one to confirm. The lender applies the figure in the current program manual.` },
    ],
    body: (h) => `
<h2>The Commission programs and their terms</h2>
${stateProgTable(h, 'WA')}
<p>Two features stand out against other states. The main loan has no first-time requirement and a statewide income ceiling high enough for most two-earner households, so it is the default for repeat buyers too. And the interest on the smaller loans is simple, not compounded: ${h.m(15000)} at 1% for ten years adds about ${h.m(1500)} to the payoff, not more.</p>
<h2>Where Washington prices meet the limits</h2>
${countyTable(h, 'WA', COUNTIES)}
<p>King and Snohomish share one HUD area, which is why House Key and the veterans loan use a higher limit there. Spokane sits at the FHA floor, while the Seattle metro FHA limit is ${h.m(king.fha ?? 0)}. For a buyer in Seattle the binding limit is often not income but the price: the needs-based loan only applies to homes under ${h.m(250000)}, a rare figure in the metro.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'WA', c: king.id, i: 150000, p: 700000, h: 3 }, t: 'Your Washington county' })}
<h2>Spokane example</h2>
${exampleTable(h, { st: 'WA', county: 'Spokane County', income: 90000, price: 380000, size: 3 }, h.t(`Household of three, ${h.m(90000)}, ${h.m(380000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(90000)}, casa de ${h.m(380000)}, préstamo FHA, 680 puntos.`))}
<p>In King County a household of three at ${h.m(150000)} buying at ${h.m(700000)} still fits Home Advantage, worth ${h.m(exKing.sm.bestAmount)}, because the statewide cap of ${h.m(advCap)} is far above it. House Key is out of reach at that income.</p>
<h2>City and regional loans</h2>
<p>${local.map((l) => `${l.name}: ${l.text}.`).join(' ')} These local loans can be combined with a Commission first mortgage in their area, and their price limits are close to what a modest home costs there. They are not in the calculator; the Commission page links to each.</p>
<h2>Applying in Washington</h2>
<p>Every program goes through a lender approved by the Commission, not through the Commission itself. Home Advantage, the needs-based loan and House Key all require a homebuyer education seminar before closing; the Covenant and veterans pages we read do not state it, so ask the lender. Take the seminar before you shop, since its certificate is among the first documents the lender asks for. Then ask for the rate on the Commission first mortgage with and without the assistance: the help itself is the same with every lender, the first loan is priced by each.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-washington', nav: 'Washington', card: 'Home Advantage, House Key, Covenant y los préstamos locales, por condado',
    title: 'Ayuda para el pago inicial en Washington 2026: Here to Home',
    description: 'Ayuda para el pago inicial en Washington 2026: Home Advantage del 3 % al 5 % del préstamo, House Key, Covenant y veteranos, con límites en los 39 condados.',
    h1: 'Ayuda para el pago inicial en Washington, de King a Spokane',
    intro: 'Elija su condado de Washington y su hogar: los programas de la Comisión que le corresponden, cuánto prestan y su pago mensual con y sin ellos.',
    resume: `En Washington la ayuda estatal viene de la Washington State Housing Finance Commission, que presenta sus programas bajo el nombre Here to Home. El más amplio es Home Advantage Downpayment Assistance: el 3 %, 4 % o 5 % de la primera hipoteca al 0 %, sin cuota mensual, que se devuelve al vender, refinanciar o dejar de vivir en la casa, con un único tope de ingresos de ${S.m(advCap)} en todos los condados y sin requisito de primera vivienda. House Key Opportunity presta hasta ${S.m(15000)} al 1 % de interés simple a compradores de primera vez, con límites más bajos por grupo de condados. Covenant Homeownership puede llegar al 20 % del precio, hasta ${S.m(150000)}, para personas afectadas por la discriminación en la vivienda antes de 1968 y sus descendientes. Un hogar de tres que gana ${S.m(90000)} y compra por ${S.m(380000)} en el condado de Spokane puede obtener ${S.m(ex.sm.bestAmount)}, y el efectivo para la entrada baja de ${S.m(ex.sm.down)} a ${S.m(ex.sm.cashWith)}. Todos los préstamos de Washington de esta página son diferidos: ninguno es una subvención.`,
    faqs: [
      { q: '¿La ayuda de Washington es dinero que no se devuelve?', a: 'No. Todos los programas de la Comisión que leímos son préstamos diferidos: no paga cuota mensual, pero el saldo vence al vender, refinanciar, transferir la casa, dejar de vivir en ella o liquidar la primera hipoteca. House Key y el préstamo por necesidad acumulan además un 1 % de interés simple, el de veteranos un 3 %, que se suma a lo que devuelve.' },
      { q: '¿Quién puede recibir el programa Covenant de Washington?', a: 'Las personas que vivían en Washington antes de abril de 1968 y pertenecían a grupos afectados por prácticas discriminatorias de vivienda, y sus descendientes, según la página de la Comisión. Cubre hasta el 20 % del costo de la casa, con un tope de $150,000, más los gastos de cierre. Los límites de ingreso y demás los fija el programa; confírmelos con un prestamista aprobado.' },
      { q: '¿Por qué hay dos límites de ingreso para el préstamo por necesidad?', a: 'La propia página de la Comisión muestra dos juegos de cifras para Home Advantage Needs-Based: uno en el resumen y otro más bajo en la sección de requisitos. Mostramos ambos y la calculadora marca el programa como pendiente de confirmar. El prestamista aplica la cifra del manual vigente del programa.' },
    ],
    body: (h) => `
<h2>Los programas de la Comisión y sus condiciones</h2>
${stateProgTable(h, 'WA')}
<p>Dos rasgos destacan frente a otros estados. El préstamo principal no exige ser comprador de primera vez y tiene un tope estatal de ingresos lo bastante alto para la mayoría de los hogares con dos sueldos, así que es la opción por defecto también para quien ya tuvo casa. Y el interés de los préstamos pequeños es simple, no compuesto: ${h.m(15000)} al 1 % durante diez años añaden unos ${h.m(1500)} al saldo final, no más.</p>
<h2>Donde los precios de Washington tocan los límites</h2>
${countyTable(h, 'WA', COUNTIES)}
<p>King y Snohomish comparten una misma área de HUD, por eso House Key y el préstamo de veteranos usan allí un límite más alto. Spokane está en el piso FHA, mientras que el límite FHA del área de Seattle es de ${h.m(king.fha ?? 0)}. Para quien compra en Seattle, el límite que frena no suele ser el ingreso sino el precio: el préstamo por necesidad solo vale para casas de menos de ${h.m(250000)}, una cifra rara en esa zona.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'WA', c: king.id, i: 150000, p: 700000, h: 3 }, t: 'Su condado de Washington' })}
<h2>Ejemplo en Spokane</h2>
${exampleTable(h, { st: 'WA', county: 'Spokane County', income: 90000, price: 380000, size: 3 }, h.t(`Household of three, ${h.m(90000)}, ${h.m(380000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(90000)}, casa de ${h.m(380000)}, préstamo FHA, 680 puntos.`))}
<p>En el condado de King, un hogar de tres con ${h.m(150000)} que compra por ${h.m(700000)} sigue entrando en Home Advantage, que vale ${h.m(exKing.sm.bestAmount)}, porque el tope estatal de ${h.m(advCap)} queda muy por encima. House Key ya no está a su alcance con ese ingreso.</p>
<h2>Préstamos municipales y regionales</h2>
<p>${local.map((l) => `${l.name}: ${l.text}.`).join(' ')} Estos préstamos locales se combinan con una primera hipoteca de la Comisión en su zona, y sus topes de precio se acercan a lo que cuesta allí una vivienda modesta. No están en la calculadora; la página de la Comisión enlaza a cada uno. Las condiciones citadas quedan en inglés, como las publica la Comisión.</p>
<h2>Cómo solicitarla en Washington</h2>
<p>Todos los programas pasan por un prestamista aprobado por la Comisión, no por la propia Comisión. Home Advantage, el préstamo por necesidad y House Key exigen un seminario para compradores antes del cierre; las páginas de Covenant y de veteranos que leímos no lo indican, así que pregunte al prestamista. Haga el seminario antes de buscar casa, porque su certificado está entre los primeros documentos que pide el prestamista. Después pida la tasa de la primera hipoteca de la Comisión con y sin la ayuda: la ayuda es la misma con todos los prestamistas, la primera hipoteca la fija cada uno.</p>
`,
  },
});
