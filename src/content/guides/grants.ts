import { defineGuide } from '../../lib/page-types';
import type { Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { formName } from '../../lib/tool-specs';
import { example, STATES_READ } from './_shared';

const va = example({ st: 'VA', county: 'Fairfax County', income: 110000, price: 450000, size: 3 });
const vaG = K.prog('va-grant'), coG = K.prog('co-grant');
const giftLike = STATES_READ.flatMap((st) => K.state(st).programs.filter((p) => p.form === 'grant' || p.form === 'forgivable').map((p) => ({ st, p })));
const nGrant = giftLike.filter((x) => x.p.form === 'grant').length, nForg = giftLike.length - nGrant;
const E = K.en, S = K.es;

function table(h: Helpers) {
  const rows = [...giftLike].sort((a, b) => (a.p.forgivenAfterYears ?? 0) - (b.p.forgivenAfterYears ?? 0)).map(({ st, p }) => [K.stateName(st), h.ext(p.sourceUrl, p.name), p.amount.text ?? '', formName({ p }, h.lang), p.form === 'grant' ? h.t('at closing', 'al cierre') : p.forgivenAfterYears ? h.t(`${p.forgivenAfterYears} years`, `${p.forgivenAfterYears} años`) : '', p.status === 'open' ? h.t('open', 'abierto') : h.t('closed', 'cerrado')]);
  return h.table([h.t('State', 'Estado'), h.t('Program', 'Programa'), h.t('Amount', 'Monto'), h.t('Form', 'Forma'), h.t('Yours for good after', 'Suyo para siempre tras'), h.t('Status', 'Estado actual')], rows,
    h.t(`Grants and forgivable loans among the state programs read on ${h.day(K.P.retrieved_at)}, shortest wait first.`, `Subvenciones y préstamos perdonables entre los programas estatales leídos el ${h.day(K.P.retrieved_at)}, de la espera más corta a la más larga.`), ['l', 'l', 'l', 'l', 'r', 'l']);
}

export default defineGuide({
  id: 'grants', group: 'tools', order: 2, tool: 'dpa', toolArg: { st: 'VA', c: va.c.id, i: 110000, p: 450000, l: 'conv' },
  related: ['programs', 'forgivable', 'first-time', 'va', 'co', 'nj'],
  sources: ['prog-va-grant', 'prog-co-grant', 'prog-nj-dpa', 'prog-pa-kfit', 'prog-az-homeplus'],
  en: {
    slug: 'down-payment-grants', nav: 'Down payment grants', card: 'Which programs are true grants, which are forgiven loans',
    title: 'Down Payment Grants 2026: Real Grants vs Forgiven Loans',
    description: `Down payment grants in 2026: ${nGrant} true grants and ${nForg} forgivable loans among state programs, how many years you must stay, and what you owe if you sell early.`,
    h1: 'Down payment grants: which ones you never repay',
    intro: 'The calculator separates true grants from loans that are only forgiven if you keep the home long enough.',
    resume: `A down payment grant is money you never repay, whatever you do with the home. Very few state programs are grants in that strict sense: among the ${giftLike.length} grant-like programs we read, ${nGrant} are true grants and ${nForg} are forgivable loans, recorded as a lien and cancelled only after a set number of years in the home. Virginia Housing's grant pays ${vaG.amount.text}, and Colorado's CHFA grant up to ${coG.amount.value}% of the first mortgage. A forgivable loan behaves like a grant only if you stay: New Jersey forgives its assistance after five years in one step, Pennsylvania's K-FIT 10% a year over ten years. For a Fairfax County household of three earning ${E.m(110000)} buying at ${E.m(450000)} with a conventional loan, the calculator ${va.sm.best ? `finds ${E.m(va.sm.bestAmount)} with ${va.sm.best.p.name}` : 'finds no Virginia program'}, and the table below shows when each kind of help becomes yours.`,
    faqs: [
      { q: 'Is there a $25,000 grant for first-time home buyers?', a: 'No federal $25,000 grant was in force when we checked in October 2026. Bills with that idea have been introduced in Congress without becoming law, and pages that promise the money usually collect contact details. Real help comes from state agencies, counties and cities, mostly as forgivable or deferred loans, sometimes as grants of 2% to 3% of the price or loan.' },
      { q: 'Do I pay taxes on a down payment grant?', a: 'Assistance from a state housing finance agency is generally not taxed as income to the buyer, but the rules differ for employer programs and for some grants. The forgiveness of a forgivable loan can raise the question again in the year it is forgiven. Ask the agency or a tax preparer before filing.' },
      { q: 'What happens to a forgivable down payment loan if I refinance?', a: 'Most agencies treat a refinance like a sale: the unforgiven balance becomes due. New Jersey says so for its five-year loan, and Arizona Home Plus for refinances in the first 60 months. A refinance after the forgiveness date costs nothing. The repayment calculator shows the balance year by year.' },
    ],
    body: (h) => `
<h2>Grant or forgivable loan: the difference that matters</h2>
<p>Advertising calls almost everything a grant. The legal paperwork does not. A forgivable loan is a second mortgage recorded on your home; while it exists, the agency is a creditor, and if you sell, refinance or stop living in the home before the forgiveness date, you repay what is left. A grant creates no lien: once it has paid your down payment at closing, you owe nothing to anyone. Both cost you nothing as long as you stay, so the question is how sure you are about staying.</p>
<p>The forgiveness schedule is the second question. Some programs forgive nothing until the last day and then everything, a "cliff": New Jersey after five years, Arizona's Home Plus after 60 months, Ohio after ${K.prog('oh-dpa').forgivenAfterYears} years. Others forgive a slice each month or year, so leaving early costs only part of the help: New York's SONYMA loan by 1/120 a month over ten years, Florida's HFA Preferred PLUS by 20% a year over five, Pennsylvania's K-FIT by 10% a year over ten. North Carolina's Home Advantage waits ten years and then forgives 20% a year.</p>
${table(h)}
<h2>Why so few true grants</h2>
<p>A housing agency that lends recovers money from buyers who sell early and can recycle it into the next buyer's down payment. A grant is spent once. Agencies therefore keep grants small, a few percent of the price, and often tie them to a first mortgage at a slightly higher rate that pays for them. Virginia's grant is limited to its bond-financed loans and to buyers under the agency's income and price limits; Colorado's is paired with CHFA first mortgages.</p>
${h.mini('repay', { p: ['a', 'y', 'k'], d: { a: 15000, y: 3, k: 'linear', t: 10 }, t: 'What you owe if you sell early' })}
<h2>What the calculator counts as a grant</h2>
<p>It labels each program with the agency's own form: grant, forgivable loan with its period, deferred loan, or monthly-payment loan. The amount at the top of the result is the largest help you likely fit, whatever its form, because a deferred loan of ${h.m(15000)} still lowers your cash at closing by ${h.m(15000)}. Read the "Form" column before choosing: two programs with the same amount can leave you with very different bills when you sell.</p>
<p>County and city programs funded by the federal HOME program are often true grants or loans forgiven after five to fifteen years, with an income limit of 80% of area median. They are not in the calculator; state pages name those the agency's guides point to.</p>
`,
  },
  es: {
    slug: 'subvenciones-para-el-pago-inicial', nav: 'Subvenciones para la entrada', card: 'Qué programas son subvenciones y cuáles préstamos perdonados',
    title: 'Subvenciones para el pago inicial 2026: regalo o préstamo',
    description: `Subvenciones para el pago inicial 2026: ${nGrant} subvenciones reales y ${nForg} préstamos perdonables estatales, cuántos años hay que quedarse y qué se debe al vender antes.`,
    h1: 'Subvenciones para el pago inicial: cuáles no se devuelven',
    intro: 'La calculadora separa las subvenciones de verdad de los préstamos que solo se perdonan si conserva la casa el tiempo suficiente.',
    resume: `Una subvención para el pago inicial es dinero que no se devuelve nunca, haga lo que haga con la casa. Muy pocos programas estatales son subvenciones en ese sentido estricto: de los ${giftLike.length} programas parecidos a una subvención que leímos, ${nGrant} son subvenciones reales y ${nForg} son préstamos perdonables, inscritos como gravamen y cancelados solo después de cierto número de años en la vivienda. La subvención de Virginia Housing paga el 2 % del precio con préstamo convencional o el 2.5 % con FHA, y la de CHFA en Colorado hasta el ${coG.amount.value} % de la primera hipoteca. Un préstamo perdonable solo se comporta como subvención si usted se queda: Nueva Jersey perdona su ayuda a los cinco años de una vez, K-FIT de Pensilvania un 10 % por año durante diez años. Para un hogar de tres en el condado de Fairfax que gana ${S.m(110000)} y compra por ${S.m(450000)} con préstamo convencional, la calculadora ${va.sm.best ? `encuentra ${S.m(va.sm.bestAmount)} con ${va.sm.best.p.name}` : 'no encuentra ningún programa de Virginia'}, y la tabla muestra cuándo cada ayuda pasa a ser suya.`,
    faqs: [
      { q: '¿Existe una subvención de $25,000 para compradores de primera vivienda?', a: 'Ninguna subvención federal de $25,000 estaba en vigor cuando revisamos en octubre de 2026. Se han presentado proyectos de ley con esa idea en el Congreso sin que se aprobaran, y las páginas que prometen ese dinero suelen recoger datos de contacto. La ayuda real viene de agencias estatales, condados y ciudades, casi siempre como préstamos perdonables o diferidos y a veces como subvenciones del 2 % al 3 %.' },
      { q: '¿Se pagan impuestos por una subvención para el pago inicial?', a: 'La ayuda de una agencia estatal de vivienda en general no se grava como ingreso del comprador, pero las reglas cambian en los programas de empleadores y en algunas subvenciones. El perdón de un préstamo perdonable puede volver a plantear la pregunta el año en que se perdona. Consulte a la agencia o a un preparador de impuestos antes de declarar.' },
      { q: '¿Qué pasa con un préstamo perdonable si refinancio?', a: 'La mayoría de las agencias trata el refinanciamiento como una venta: el saldo no perdonado se vuelve exigible. Nueva Jersey lo dice para su préstamo a cinco años y Home Plus de Arizona para los refinanciamientos en los primeros 60 meses. Refinanciar después de la fecha de perdón no cuesta nada. La calculadora de devolución muestra el saldo año por año.' },
    ],
    body: (h) => `
<h2>Subvención o préstamo perdonable: la diferencia que importa</h2>
<p>La publicidad llama subvención a casi todo. Los documentos legales no. Un préstamo perdonable es una segunda hipoteca inscrita sobre su vivienda; mientras existe, la agencia es acreedora, y si usted vende, refinancia o deja de vivir allí antes de la fecha de perdón, devuelve lo que queda. Una subvención no crea ningún gravamen: una vez que pagó su entrada en el cierre, no le debe nada a nadie. Las dos no le cuestan nada mientras se quede, así que la pregunta es qué tan seguro está de quedarse.</p>
<p>El calendario de perdón es la segunda pregunta. Algunos programas no perdonan nada hasta el último día y entonces todo, un "acantilado": Nueva Jersey a los cinco años, Home Plus de Arizona a los 60 meses, Ohio a los ${K.prog('oh-dpa').forgivenAfterYears} años. Otros perdonan una parte cada mes o cada año, de modo que irse antes cuesta solo una parte: SONYMA en Nueva York 1/120 por mes durante diez años, HFA Preferred PLUS de Florida un 20 % por año durante cinco, K-FIT de Pensilvania un 10 % por año durante diez. Home Advantage de Carolina del Norte espera diez años y luego perdona un 20 % por año.</p>
${table(h)}
<h2>Por qué hay tan pocas subvenciones de verdad</h2>
<p>Una agencia que presta recupera dinero de quienes venden pronto y puede reutilizarlo para la entrada del siguiente comprador. Una subvención se gasta una sola vez. Por eso las agencias la mantienen pequeña, unos pocos puntos del precio, y a menudo la atan a una primera hipoteca con una tasa algo más alta que la paga. La de Virginia se limita a sus préstamos financiados con bonos y a compradores bajo sus límites de ingreso y precio; la de Colorado va con las hipotecas de CHFA.</p>
${h.mini('repay', { p: ['a', 'y', 'k'], d: { a: 15000, y: 3, k: 'linear', t: 10 }, t: 'Lo que debe si vende antes' })}
<h2>Qué cuenta la calculadora como subvención</h2>
<p>Etiqueta cada programa con la forma que usa la agencia: subvención, préstamo perdonable con su plazo, préstamo diferido o préstamo con cuota. El monto que aparece arriba es la mayor ayuda a la que probablemente tiene derecho, sea cual sea su forma, porque un préstamo diferido de ${h.m(15000)} también baja en ${h.m(15000)} el efectivo que lleva al cierre. Lea la columna "Forma" antes de elegir: dos programas con el mismo monto pueden dejarle cuentas muy distintas al vender.</p>
<p>Los programas de condados y ciudades pagados con el programa federal HOME son a menudo subvenciones reales o préstamos perdonados a los cinco o quince años, con un límite de ingresos del 80 % de la mediana. No están en la calculadora; las páginas de estado nombran los que mencionan las guías de la agencia.</p>
`,
  },
});
