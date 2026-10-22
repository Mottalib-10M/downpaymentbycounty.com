import { defineGuide } from '../../lib/page-types';
import type { Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.en, S = K.es, r30 = K.RATES.r30, r15 = K.RATES.r15;
const price = 300000, loan = K.loanAmount(price, 'fha'), base = K.pmt(loan, r30, 30);
const ny = K.prog('ny-dpal'), ma2 = K.prog('ma-dpa2'), il = K.prog('il-repayable');
const nyAdd = ny.rateAdd ?? 0;
const nyPay = K.pmt(loan, r30 + nyAdd, 30);
const maPay = K.pmt(25000, Number(ma2.rate), Number(ma2.termYears));
const ilPay = K.pmt(10000, Number(il.rate ?? 0), Number(il.termYears));

function table(h: Helpers) {
  const rows: string[][] = [
    [h.t('No assistance', 'Sin ayuda'), h.m(base), h.m(0), h.m(base)],
    [h.t('Deferred or forgivable second loan', 'Segundo préstamo diferido o perdonable'), h.m(base), h.m(0), h.m(base)],
    [h.t(`Help paid through a higher rate (+${h.n(nyAdd, 2)} point, as in New York)`, `Ayuda pagada con una tasa más alta (+${h.n(nyAdd, 2)} punto, como en Nueva York)`), h.m(nyPay), h.m(0), h.m(nyPay)],
    [h.t(`${h.m(10000)} repaid over ${il.termYears} years at ${il.rate ?? 0}% (Illinois Access Repayable)`, `${h.m(10000)} devueltos en ${il.termYears} años al ${il.rate ?? 0} % (Access Repayable de Illinois)`), h.m(base), h.m(ilPay), h.m(base + ilPay)],
    [h.t(`${h.m(25000)} at ${ma2.rate}% over ${ma2.termYears} years (MassHousing option 2)`, `${h.m(25000)} al ${ma2.rate} % en ${ma2.termYears} años (opción 2 de MassHousing)`), h.m(base), h.m(maPay), h.m(base + maPay)],
  ];
  return h.table([h.t('Kind of help', 'Tipo de ayuda'), h.t('First mortgage', 'Primera hipoteca'), h.t('Second loan', 'Segundo préstamo'), h.t('Total a month', 'Total al mes')], rows,
    h.t(`${h.m(price)} home, FHA loan of ${h.m(loan)}, 30 years at ${h.r(r30)} (Freddie Mac, ${h.day(K.RATES.date)}). Principal and interest only.`, `Casa de ${h.m(price)}, préstamo FHA de ${h.m(loan)}, 30 años al ${h.r(r30)} (Freddie Mac, ${h.day(K.RATES.date)}). Solo capital e intereses.`), ['l', 'r', 'r', 'r']);
}

export default defineGuide({
  id: 'payment', group: 'tools', order: 7, tool: 'payment', toolArg: { p: 300000, a: 10000, k: 'deferred' },
  related: ['how-much-down', 'forgivable', 'programs', 'mcc', 'ny', 'ma'],
  sources: ['pmms', 'prog-ny-dpal', 'prog-ma-dpa2', 'prog-il-repayable', 'fha-handbook'],
  en: {
    slug: 'mortgage-payment-with-down-payment-assistance', nav: 'Payment with assistance', card: 'Monthly payment and cash to close, with and without the help',
    title: 'Mortgage Payment With Down Payment Assistance 2026: Compare',
    description: 'Mortgage payment with down payment assistance in 2026: monthly payment and cash to close with and without help, for deferred, forgivable and repayable programs.',
    h1: 'Mortgage payment with down payment assistance',
    intro: 'Enter the price, the help and how it is repaid: the monthly payment with and without it, and the cash you still bring to the table.',
    resume: `Down payment assistance changes the cash you bring far more than your monthly payment. With a deferred or forgivable second loan, the most common form, the payment on a ${E.m(price)} home with an FHA loan stays at ${E.m(base)} a month in principal and interest at ${E.r(r30)}, the Freddie Mac average of ${E.day(K.RATES.date)}, while the cash needed falls by the amount of the help. Two forms do raise the payment. Some agencies fund the help through a higher rate on the first mortgage: New York's SONYMA adds ${E.n(nyAdd, 2)} point, which brings the same loan to ${E.m(nyPay)}. Others lend the help with monthly payments: ${E.m(25000)} from MassHousing at ${ma2.rate}% over ${ma2.termYears} years adds ${E.m(maPay)} a month. The calculator shows all three numbers side by side for your price and your help.`,
    faqs: [
      { q: 'Does down payment assistance raise my interest rate?', a: `Sometimes. Assistance tied to an agency first mortgage often comes with a rate slightly above the best market rate, because the agency recovers part of the cost through the rate. New York adds ${E.n(nyAdd, 2)} point when you take its assistance loan. Ask the lender for the rate with and without the program on the same day.` },
      { q: 'Should I use the help for a smaller loan instead of a lower down payment?', a: 'Most programs do not let you choose: they require the minimum down payment of the first mortgage and let the help pay it and closing costs, so the loan stays the same. Where a program allows a larger down payment, the last line of the calculator shows the lower payment you would get.' },
      { q: 'Do taxes and insurance change with down payment assistance?', a: 'Property tax and homeowners insurance depend on the home, not on how you pay for it, so they stay the same. FHA mortgage insurance depends on the first loan amount, which the help usually leaves unchanged. The calculator gives principal and interest only; your Loan Estimate gives the full monthly payment.' },
    ],
    body: (h) => `
<h2>Five ways to pay for the same home</h2>
${table(h)}
<p>The two lines that cost nothing a month, deferred and forgivable loans, are where most state help sits. They are not free: a deferred loan is repaid when you sell or refinance, and a forgivable loan is repaid in part if you leave before the end of its period. The payment is the same, the exit cost is not. The repayment page computes what you would owe at each year of sale.</p>
<h2>When the rate is the price</h2>
<p>A higher rate looks small, but it runs for the life of the loan. On the example above, ${h.n(nyAdd, 2)} point adds ${h.m(nyPay - base)} a month, about ${h.m((nyPay - base) * 12)} a year. If you plan to refinance once rates fall, the extra cost is limited, and the help received up front may be worth more. If you plan to keep the loan for decades, compare the total with what saving the down payment yourself would take.</p>
${h.mini('payment', { p: ['p', 'a', 'k'], d: { p: 250000, a: 7500, k: 'amortizing', ar: 0, at: 10 }, t: 'A loan you repay monthly' })}
<h2>Fifteen or thirty years</h2>
<p>Almost every agency first mortgage is a 30-year fixed loan, because the agencies aim at the lowest payment. The Freddie Mac average for 15-year loans was ${h.r(r15)} the same week, and a 15-year loan on ${h.m(loan)} would cost ${h.m(K.pmt(loan, r15, 15))} a month: affordable for few assisted buyers. Paying extra on a 30-year loan later achieves part of the same saving without the commitment.</p>
<h2>What the lender adds</h2>
<p>Your real payment adds property tax, homeowners insurance, mortgage insurance and any association dues. These can add several hundred dollars a month and vary widely by county. The calculator keeps to principal and interest so the effect of the help is clear; the lender's Loan Estimate gives the full figure within three business days of your application.</p>
<h2>Reading the result</h2>
<p>The big figure is the payment with the help as you described it. The lines below give the first mortgage, the payment without help, the payment on the assistance loan if it has one, and the cash for the down payment with and without the help. If the cash with help reaches zero, the program pays your whole minimum and the rest of the help, where allowed, goes to closing costs. Change the repayment type to see why a monthly assistance loan, even at zero percent, weighs on the budget for years.</p>
`
  },
  es: {
    slug: 'pago-de-hipoteca-con-ayuda-para-el-pago-inicial', nav: 'Pago con ayuda', card: 'Pago mensual y efectivo al cierre, con y sin la ayuda',
    title: 'Pago de hipoteca con ayuda para el pago inicial 2026: cifras',
    description: 'Pago de hipoteca con ayuda para el pago inicial en 2026: cuota mensual y efectivo al cierre con y sin ayuda, para programas diferidos, perdonables o con cuota.',
    h1: 'Pago de hipoteca con ayuda para el pago inicial',
    intro: 'Escriba el precio, la ayuda y cómo se devuelve: el pago mensual con y sin ella, y el efectivo que aún debe llevar al cierre.',
    resume: `La ayuda para el pago inicial cambia mucho más el efectivo que lleva que su pago mensual. Con un segundo préstamo diferido o perdonable, la forma más común, el pago de una casa de ${S.m(price)} con un préstamo FHA se queda en ${S.m(base)} al mes de capital e intereses al ${S.r(r30)}, el promedio de Freddie Mac del ${S.day(K.RATES.date)}, mientras que el efectivo necesario baja en el monto de la ayuda. Dos formas sí suben el pago. Algunas agencias financian la ayuda con una tasa más alta en la primera hipoteca: SONYMA, en Nueva York, añade ${S.n(nyAdd, 2)} punto, lo que lleva el mismo préstamo a ${S.m(nyPay)}. Otras prestan la ayuda con cuotas mensuales: ${S.m(25000)} de MassHousing al ${ma2.rate} % en ${ma2.termYears} años suman ${S.m(maPay)} al mes. La calculadora muestra las tres cifras juntas para su precio y su ayuda.`,
    faqs: [
      { q: '¿La ayuda para el pago inicial sube mi tasa de interés?', a: `A veces. La ayuda ligada a una primera hipoteca de la agencia suele venir con una tasa algo superior a la mejor del mercado, porque la agencia recupera parte del costo con la tasa. Nueva York añade ${S.n(nyAdd, 2)} punto cuando toma su préstamo de ayuda. Pida al prestamista la tasa con y sin el programa el mismo día.` },
      { q: '¿Conviene usar la ayuda para un préstamo más pequeño?', a: 'La mayoría de los programas no le deja elegir: exigen la entrada mínima de la primera hipoteca y dejan que la ayuda la pague junto con los gastos de cierre, así que el préstamo no cambia. Si un programa permite una entrada mayor, la última línea de la calculadora muestra el pago más bajo que tendría.' },
      { q: '¿Cambian los impuestos y el seguro con la ayuda?', a: 'El impuesto a la propiedad y el seguro de la vivienda dependen de la casa, no de cómo la paga, así que no cambian. El seguro hipotecario de FHA depende del monto del primer préstamo, que la ayuda suele dejar igual. La calculadora da solo capital e intereses; su Loan Estimate da el pago mensual completo.' },
    ],
    body: (h) => `
<h2>Cinco maneras de pagar la misma casa</h2>
${table(h)}
<p>Las dos líneas que no cuestan nada al mes, los préstamos diferidos y perdonables, son donde está la mayor parte de la ayuda estatal. No son gratis: un préstamo diferido se devuelve al vender o refinanciar, y uno perdonable se devuelve en parte si se va antes del fin de su periodo. El pago es igual; el costo de salida, no. La página de devolución calcula lo que debería según el año de venta.</p>
<h2>Cuando la tasa es el precio</h2>
<p>Una tasa más alta parece poca cosa, pero corre durante toda la vida del préstamo. En el ejemplo de arriba, ${h.n(nyAdd, 2)} punto añade ${h.m(nyPay - base)} al mes, unos ${h.m((nyPay - base) * 12)} al año. Si piensa refinanciar cuando bajen las tasas, el sobrecosto queda limitado y la ayuda recibida al inicio puede valer más. Si piensa mantener el préstamo décadas, compare el total con lo que tardaría en ahorrar la entrada por su cuenta.</p>
${h.mini('payment', { p: ['p', 'a', 'k'], d: { p: 250000, a: 7500, k: 'amortizing', ar: 0, at: 10 }, t: 'Un préstamo con cuota mensual' })}
<h2>Quince o treinta años</h2>
<p>Casi todas las primeras hipotecas de las agencias son préstamos fijos a 30 años, porque las agencias buscan el pago más bajo. El promedio de Freddie Mac a 15 años era del ${h.r(r15)} esa misma semana, y un préstamo a 15 años de ${h.m(loan)} costaría ${h.m(K.pmt(loan, r15, 15))} al mes: algo que pocos compradores con ayuda pueden asumir. Pagar de más en un préstamo a 30 años logra después parte del mismo ahorro sin el compromiso.</p>
<h2>Lo que añade el prestamista</h2>
<p>Su pago real suma el impuesto a la propiedad, el seguro de la vivienda, el seguro hipotecario y las cuotas de la asociación si las hay. Pueden sumar varios cientos de dólares al mes y varían mucho según el condado. La calculadora se limita a capital e intereses para que el efecto de la ayuda se vea claro; el Loan Estimate del prestamista da la cifra completa dentro de los tres días hábiles siguientes a su solicitud.</p>
<h2>Cómo leer el resultado</h2>
<p>La cifra grande es el pago con la ayuda tal como la describió. Las líneas de abajo dan la primera hipoteca, el pago sin ayuda, la cuota del préstamo de ayuda si la tiene y el efectivo para la entrada con y sin la ayuda. Si el efectivo con ayuda llega a cero, el programa paga todo su mínimo y el resto, cuando se permite, va a los gastos de cierre. Cambie el tipo de devolución para ver por qué un préstamo de ayuda con cuota, aun al cero por ciento, pesa en el presupuesto durante años.</p>
`
  },
});
