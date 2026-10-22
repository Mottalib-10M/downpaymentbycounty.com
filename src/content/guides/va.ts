import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const gr = K.prog('va-grant'), plus = K.prog('va-plus');
const gConv = gr.amount.conventional!, gGov = gr.amount.government!, pMax = plus.amount.value!;
const ev = (x: ReturnType<typeof example>, id: string) => x.sm.evals.find((e) => e.p.id === id)!;
const ex = example({ st: 'VA', county: 'Fairfax County', income: 120000, price: 500000, size: 3 });
const exR = example({ st: 'VA', county: 'Richmond city', income: 80000, price: 320000, size: 3, loan: 'conv' });
const g = ev(ex, 'va-grant').amount ?? 0, p = ev(ex, 'va-plus').amount ?? 0;
const plusPay = K.pmt(p, K.RATES.r30, 30);
const fx = K.county('VA', 'Fairfax County'), ric = K.county('VA', 'Richmond city'), vb = K.county('VA', 'Virginia Beach city'), roa = K.county('VA', 'Roanoke city');
const COUNTIES = ['Fairfax County', 'Prince William County', 'Loudoun County', 'Arlington County', 'Richmond city', 'Chesterfield County', 'Henrico County', 'Virginia Beach city', 'Norfolk city', 'Chesapeake city', 'Roanoke city'];

export default defineGuide({
  id: 'va', group: 'states', order: 9, state: 'VA', tool: 'dpa', toolArg: { st: 'VA', c: fx.id, i: 120000, p: 500000, h: 3 },
  related: ['grants', 'payment', 'first-time', 'programs', 'md', 'nc'],
  sources: ['agency-VA', 'prog-va-grant', 'prog-va-plus', 'hud-il', 'fha-ml'],
  en: {
    slug: 'virginia-down-payment-assistance', nav: 'Virginia', card: 'A true grant of 2% or 2.5%, or the Plus second up to 5%, from Virginia Housing',
    title: 'Virginia Down Payment Assistance 2026: A Grant Never Repaid',
    description: `Virginia down payment assistance in 2026: a Virginia Housing grant of ${gConv}% or ${gGov}% that is never repaid, or a Plus second up to ${pMax}%, for all 133 localities.`,
    h1: 'Virginia down payment assistance: the grant or the Plus loan',
    intro: 'Choose your Virginia county or city, your income and price: the Virginia Housing grant, the Plus second mortgage, and what each leaves you to pay.',
    resume: `Virginia is one of the few states where the main help is a real grant. The Virginia Housing Down Payment Assistance Grant pays ${gConv}% of the lesser of the price or appraised value with a conventional Virginia Housing loan, or ${gGov}% with an FHA loan, and it is never repaid. It covers the down payment only, not closing costs, and is for first-time buyers, or repeat buyers in Areas of Economic Opportunity, with a 620 score for FHA and 640 for conventional. The alternative is the Virginia Housing Plus Second Mortgage: up to ${pMax}% of the price, depending on credit and loan type, repaid monthly over 30 years at a fixed rate, with no first-time rule. The two cannot be combined. In Fairfax County a household of three earning ${E.m(120000)} buying at ${E.m(500000)} with FHA could take a grant of ${E.m(g)} or a Plus loan of ${E.m(p)}, against a ${E.m(ex.sm.down)} minimum down payment.`,
    faqs: [
      { q: 'Do I ever repay the Virginia Housing grant?', a: 'No. Virginia Housing calls it a true grant: there is no lien, no forgiveness schedule and nothing due if you sell or refinance the next year. The trade-off is its size, 2% or 2.5% of the price, and its use: it pays the down payment only, so closing costs come from your own funds, a gift or a seller credit.' },
      { q: 'Can I use both the Virginia grant and the Plus second mortgage?', a: `No. Virginia Housing says the Plus second cannot be combined with the grant, so you choose one. The grant costs nothing but covers less. The Plus loan covers up to ${pMax}% of the price, enough for the down payment and part of the closing costs, but it adds a monthly payment for 30 years.` },
      { q: 'What is an Area of Economic Opportunity in Virginia?', a: 'A census tract designated by Virginia Housing where buyers who have owned a home before can still use the down payment grant, which elsewhere is for first-time buyers only. Virginia Housing publishes the map of these areas. The calculator cannot check a tract, so it treats repeat buyers as not eligible for the grant unless you confirm it.' },
    ],
    body: (h) => `
<h2>Virginia Housing's two kinds of help</h2>
${stateProgTable(h, 'VA')}
<p>The grant percentages are set to match the minimum down payment of each loan type: ${gGov}% on FHA covers most of the ${K.P.fha.minDown}% minimum, ${gConv}% on a conventional loan covers most of a 3% minimum. The remainder and the closing costs are yours. The Plus second is a different tool: it can fund the whole down payment, but at the cost of a second loan with its own rate, which the lender quotes with the first mortgage.</p>
<h2>Northern Virginia, Richmond and Hampton Roads</h2>
${countyTable(h, 'VA', COUNTIES)}
<p>Virginia lists 133 counties and independent cities, and HUD groups them by metro. Fairfax, Loudoun, Prince William and Arlington share the Washington median of ${h.m(fx.m)} and the FHA ceiling of ${h.m(fx.fha ?? 0)}. The Richmond area sits at ${h.m(ric.m)} and ${h.m(ric.fha ?? 0)}, Hampton Roads at ${h.m(vb.m)} and ${h.m(vb.fha ?? 0)}, Roanoke at the floor. Virginia Housing sets its own income and price limits by locality; we link them, and the calculator marks them to confirm.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'VA', c: ric.id, i: 80000, p: 320000, h: 3 }, t: 'Your Virginia county or city' })}
<h2>Fairfax County, worked through</h2>
${exampleTable(h, { st: 'VA', county: 'Fairfax County', income: 120000, price: 500000, size: 3 }, h.t(`Household of three, ${h.m(120000)}, ${h.m(500000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(120000)}, casa de ${h.m(500000)}, préstamo FHA, 680 puntos.`))}
<p>The grant leaves ${h.m(Math.max(0, ex.sm.down - g))} of the down payment to bring. The Plus loan of ${h.m(p)} would cover it all, at about ${h.m(plusPay)} a month if its rate matched the market average of ${h.r(K.RATES.r30)}; the real Plus rate is set by Virginia Housing and the lender. In Richmond, with a conventional loan at ${h.m(320000)}, the grant is ${h.m(ev(exR, 'va-grant').amount ?? 0)} and the 3% minimum is ${h.m(exR.sm.down)}.</p>
<h2>Choosing in Virginia</h2>
<p>For a buyer who has most of the down payment, the grant is the clear choice: it is free and leaves no lien. For a buyer with little saved, the Plus loan is the way to buy now rather than later, and the monthly cost should be weighed against the rent paid while saving. Remember that the Plus payment counts in the debt ratio the lender checks. Both go through Virginia Housing approved lenders with a Virginia Housing first mortgage, and the lender will say whether the agency's free homebuyer class is required for your file.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-virginia', nav: 'Virginia', card: 'Una subvención real del 2 % o 2.5 %, o la segunda Plus hasta el 5 %, de Virginia Housing',
    title: 'Ayuda para el pago inicial en Virginia 2026: subvención',
    description: `Ayuda para el pago inicial en Virginia 2026: una subvención de Virginia Housing del ${gConv} % o ${gGov} % que no se devuelve, o una segunda hipoteca Plus de hasta el ${pMax} %.`,
    h1: 'Ayuda para el pago inicial en Virginia: la subvención o el préstamo Plus',
    intro: 'Elija su condado o ciudad de Virginia, su ingreso y el precio: la subvención de Virginia Housing, la segunda hipoteca Plus y lo que cada una le deja por pagar.',
    resume: `Virginia es uno de los pocos estados donde la ayuda principal es una subvención de verdad. La Down Payment Assistance Grant de Virginia Housing paga el ${gConv} % del menor entre el precio y el valor de tasación con un préstamo convencional de Virginia Housing, o el ${gGov} % con un préstamo FHA, y nunca se devuelve. Cubre solo la entrada, no los gastos de cierre, y es para compradores de primera vez, o para quien ya tuvo casa en las Areas of Economic Opportunity, con 620 puntos para FHA y 640 para convencional. La alternativa es la Virginia Housing Plus Second Mortgage: hasta el ${pMax} % del precio, según el crédito y el tipo de préstamo, que se devuelve cada mes durante 30 años a tasa fija, sin requisito de primera vivienda. Las dos no se pueden combinar. En el condado de Fairfax, un hogar de tres que gana ${S.m(120000)} y compra por ${S.m(500000)} con FHA podría tomar una subvención de ${S.m(g)} o un préstamo Plus de ${S.m(p)}, frente a una entrada mínima de ${S.m(ex.sm.down)}.`,
    faqs: [
      { q: '¿Alguna vez se devuelve la subvención de Virginia Housing?', a: 'No. Virginia Housing la llama una subvención real: no hay gravamen, ni calendario de perdón, ni nada que pagar si vende o refinancia al año siguiente. La contrapartida es su tamaño, el 2 % o el 2.5 % del precio, y su uso: solo paga la entrada, así que los gastos de cierre salen de sus fondos, de un regalo o de un crédito del vendedor.' },
      { q: '¿Puedo usar a la vez la subvención de Virginia y la segunda hipoteca Plus?', a: `No. Virginia Housing indica que la segunda Plus no se combina con la subvención, así que hay que elegir una. La subvención no cuesta nada pero cubre menos. El préstamo Plus cubre hasta el ${pMax} % del precio, suficiente para la entrada y parte de los gastos de cierre, pero añade una cuota mensual durante 30 años.` },
      { q: '¿Qué es un Area of Economic Opportunity en Virginia?', a: 'Un distrito censal designado por Virginia Housing donde quien ya tuvo casa puede usar igual la subvención para la entrada, que en el resto del estado es solo para compradores de primera vez. Virginia Housing publica el mapa de estas zonas. La calculadora no puede comprobar el distrito, así que trata a quien ya tuvo casa como no elegible para la subvención salvo que usted lo confirme.' },
    ],
    body: (h) => `
<h2>Los dos tipos de ayuda de Virginia Housing</h2>
${stateProgTable(h, 'VA')}
<p>Los porcentajes de la subvención están pensados para la entrada mínima de cada tipo de préstamo: el ${gGov} % con FHA cubre casi todo el mínimo del ${K.P.fha.minDown} %, y el ${gConv} % con un préstamo convencional cubre casi todo un mínimo del 3 %. El resto y los gastos de cierre corren por su cuenta. La segunda Plus es otra herramienta: puede financiar toda la entrada, pero al costo de un segundo préstamo con su propia tasa, que el prestamista cotiza junto con la primera hipoteca.</p>
<h2>El norte de Virginia, Richmond y Hampton Roads</h2>
${countyTable(h, 'VA', COUNTIES)}
<p>Virginia cuenta 133 condados y ciudades independientes, y HUD los agrupa por área metropolitana. Fairfax, Loudoun, Prince William y Arlington comparten la mediana de Washington, ${h.m(fx.m)}, y el techo FHA de ${h.m(fx.fha ?? 0)}. El área de Richmond está en ${h.m(ric.m)} y ${h.m(ric.fha ?? 0)}, Hampton Roads en ${h.m(vb.m)} y ${h.m(vb.fha ?? 0)}, Roanoke en el piso. Virginia Housing fija sus propios límites de ingreso y precio por localidad; los enlazamos y la calculadora los marca para confirmar.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'VA', c: ric.id, i: 80000, p: 320000, h: 3 }, t: 'Su condado o ciudad de Virginia' })}
<h2>El condado de Fairfax, paso a paso</h2>
${exampleTable(h, { st: 'VA', county: 'Fairfax County', income: 120000, price: 500000, size: 3 }, h.t(`Household of three, ${h.m(120000)}, ${h.m(500000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(120000)}, casa de ${h.m(500000)}, préstamo FHA, 680 puntos.`))}
<p>La subvención deja ${h.m(Math.max(0, ex.sm.down - g))} de la entrada por poner. El préstamo Plus de ${h.m(p)} la cubriría entera, con unos ${h.m(plusPay)} al mes si su tasa igualara el promedio del mercado, ${h.r(K.RATES.r30)}; la tasa real de Plus la fijan Virginia Housing y el prestamista. En Richmond, con un préstamo convencional de ${h.m(320000)}, la subvención es de ${h.m(ev(exR, 'va-grant').amount ?? 0)} y el mínimo del 3 % es de ${h.m(exR.sm.down)}.</p>
<h2>Cómo elegir en Virginia</h2>
<p>Para quien ya tiene casi toda la entrada, la subvención es la opción clara: es gratuita y no deja gravamen. Para quien ha ahorrado poco, el préstamo Plus es la forma de comprar ahora y no más tarde, y su costo mensual se compara con el alquiler que pagaría mientras ahorra. Recuerde que la cuota de Plus cuenta en la relación de deuda que revisa el prestamista. Ambas pasan por prestamistas aprobados por Virginia Housing con una primera hipoteca de Virginia Housing, y el prestamista le dirá si su expediente exige la clase gratuita para compradores de la agencia.</p>
`,
  },
});
