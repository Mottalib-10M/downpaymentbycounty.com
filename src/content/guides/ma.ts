import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const o1 = K.prog('ma-dpa1'), o2 = K.prog('ma-dpa2'), o3 = K.prog('ma-dpa3');
const max1 = o1.amount.value!, max2 = o2.amount.value!;
const r2 = o2.rate as number, r3 = o3.rate as number, term = o2.termYears!;
const pay2 = K.pmt(max2, r2, term), pay3 = K.pmt(max2, r3, term);
const n = term * 12;
const cost2 = Math.round(pay2 * n - max2), cost3 = Math.round(pay3 * n - max2);
const cents = (x: number, l: 'en' | 'es') => `$${x.toFixed(2)}`;
const ex = example({ st: 'MA', county: 'Worcester city', income: 110000, price: 420000, size: 3 });
const exB = example({ st: 'MA', county: 'Boston city', income: 140000, price: 650000, size: 3 });
const bos = K.county('MA', 'Boston city'), wor = K.county('MA', 'Worcester city'), spr = K.county('MA', 'Springfield city');
const TOWNS = ['Boston city', 'Cambridge city', 'Quincy city', 'Lowell city', 'Brockton city', 'Worcester city', 'Fall River city', 'New Bedford city', 'Springfield city', 'Pittsfield city'];

export default defineGuide({
  id: 'ma', group: 'states', order: 17, state: 'MA', tool: 'dpa', toolArg: { st: 'MA', c: wor.id, i: 110000, p: 420000, h: 3 },
  related: ['payment', 'programs', 'how-much-down', 'loan-limits', 'ny', 'nj'],
  sources: ['agency-MA', 'prog-ma-dpa1', 'prog-ma-dpa2', 'prog-ma-dpa3', 'hud-il', 'fha-ml'],
  en: {
    slug: 'massachusetts-down-payment-assistance', nav: 'Massachusetts', card: 'MassHousing: up to $30,000 deferred, or $25,000 repaid over 15 years at 2% or 3%',
    title: 'Massachusetts Down Payment Assistance 2026: MassHousing Help',
    description: `Massachusetts down payment assistance in 2026: MassHousing lends up to ${E.m(max1)} deferred, or ${E.m(max2)} over 15 years at ${r2}% or ${r3}%, in all 351 cities and towns.`,
    h1: 'Massachusetts down payment assistance with MassHousing',
    intro: 'Choose your Massachusetts city or town, income and price: the three MassHousing options side by side, with the monthly cost of each.',
    resume: `In Massachusetts the statewide help comes from MassHousing, and it is a loan in every version, offered with a MassHousing first mortgage to income-eligible first-time buyers. Option 1 is a deferred second mortgage of up to ${E.m(max1)} with no interest and no payment, due in full when you sell, refinance or pay off the first loan. Options 2 and 3 lend up to ${E.m(max2)} that you repay every month over ${term} years at a fixed ${r2}% or ${r3}%: MassHousing's own example is 180 payments of ${cents(pay2, 'en')} or ${cents(pay3, 'en')}. The approved lender decides which option and amount you get. The calculator works out the three for your figures: in Worcester, a household of three earning ${E.m(110000)} buying at ${E.m(420000)} with FHA needs ${E.m(ex.sm.down)} down, which Option 1 would cover in full, if the household is under the MassHousing limit for the town.`,
    faqs: [
      { q: 'Why would anyone choose a MassHousing option with monthly payments?', a: `Because the lender, not the buyer, sets which option fits the file, and a repayable loan leaves nothing owed at sale after ${term} years. Over the full term, Option 2 costs about ${E.m(cost2)} in interest on ${E.m(max2)} and Option 3 about ${E.m(cost3)}, while Option 1 costs nothing in interest but takes the full balance out of the sale or the refinance.` },
      { q: 'Can I refinance a Massachusetts home that has a MassHousing deferred loan?', a: `Yes, but a refinance makes the deferred Option 1 balance due, so the new loan or your savings must repay it. For a buyer with ${E.m(max1)} deferred, that is a large share of the equity in the first years. If you expect to refinance when rates fall, compare that with one of the repayable options, whose balance shrinks each month.` },
      { q: 'Does MassHousing set limits by town or by county?', a: 'Its income limits are published by community, since Massachusetts HUD areas follow towns rather than counties. That is why the calculator here lists all 351 cities and towns. We link the MassHousing limits but have not transcribed them, so the calculator marks each option to confirm and shows your income against the HUD median.' },
    ],
    body: (h) => `
<h2>MassHousing's three options</h2>
${stateProgTable(h, 'MA')}
<p>The three options share the same buyer: a first-time buyer under the income limit of the community, with a MassHousing first mortgage and a homebuyer course. What changes is who pays for the money and when. Option 1 is free until the house changes hands. Options 2 and 3 are ordinary installment loans at a low fixed rate: ${h.m(max2)} at ${r2}% over ${term} years is ${cents(pay2, h.lang)} a month and ${h.m(Math.round(pay2 * n))} in total; at ${r3}% it is ${cents(pay3, h.lang)} a month and ${h.m(Math.round(pay3 * n))}.</p>
<h2>Prices in ten Massachusetts cities</h2>
${countyTable(h, 'MA', TOWNS)}
<p>Massachusetts is the one state on this site whose HUD areas follow cities and towns, so two neighbors can sit in different areas. Boston, Cambridge and Quincy share a median of ${h.m(bos.m)} and an FHA limit of ${h.m(bos.fha ?? 0)}; Worcester is at ${h.m(wor.m)} and ${h.m(wor.fha ?? 0)}; Springfield at ${h.m(spr.m)} and the FHA floor. A ${h.m(max1)} deferred loan covers the whole FHA down payment on a home up to about ${h.m(Math.round(max1 / (K.P.fha.minDown / 100)))}, which in western Massachusetts is most homes and in Boston few.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'MA', c: spr.id, i: 85000, p: 300000, h: 3 }, t: 'Your Massachusetts city or town' })}
<h2>Worcester, worked through</h2>
${exampleTable(h, { st: 'MA', county: 'Worcester city', income: 110000, price: 420000, size: 3 }, h.t(`Household of three, ${h.m(110000)}, ${h.m(420000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(110000)}, casa de ${h.m(420000)}, préstamo FHA, 680 puntos.`))}
<p>In Boston, at ${h.m(140000)} and ${h.m(650000)}, the FHA minimum is ${h.m(exB.sm.down)}; Option 1 covers ${h.m(Math.min(max1, exB.sm.down))} of it, and the household's income is at ${h.p(exB.ami.pct)} of the HUD median for three, so the MassHousing limit for Boston is the figure to check before anything else. The rest of the down payment and the closing costs come from savings or a gift.</p>
<h2>Choosing between deferred and repaid</h2>
<p>A buyer who plans to stay ten years or more and never refinance pays nothing for Option 1. A buyer who may move or refinance within a few years owes the whole Option 1 balance at that moment, while under Options 2 or 3 part of it is already repaid. The monthly cost of the repayable options counts in the debt-to-income ratio, which can lower the first mortgage you qualify for. Ask the MassHousing lender to run all three on your file, and ask your city's housing office about local grants that MassHousing lenders accept alongside them.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-massachusetts', nav: 'Massachusetts', card: 'MassHousing: hasta $30,000 diferidos, o $25,000 a 15 años al 2 % o al 3 %',
    title: 'Pago inicial en Massachusetts 2026: ayuda de MassHousing',
    description: `Ayuda para el pago inicial en Massachusetts 2026: MassHousing presta hasta ${S.m(max1)} diferidos, o ${S.m(max2)} a 15 años al ${r2} % o ${r3} %, en sus 351 municipios.`,
    h1: 'Ayuda para el pago inicial en Massachusetts con MassHousing',
    intro: 'Elija su ciudad o municipio de Massachusetts, su ingreso y el precio: las tres opciones de MassHousing lado a lado, con el costo mensual de cada una.',
    resume: `En Massachusetts la ayuda estatal viene de MassHousing, y es un préstamo en todas sus versiones, ofrecido con una primera hipoteca de MassHousing a compradores de primera vez que cumplen el límite de ingresos. La opción 1 es una segunda hipoteca diferida de hasta ${S.m(max1)}, sin interés ni cuota, que se devuelve completa al vender, refinanciar o liquidar el primer préstamo. Las opciones 2 y 3 prestan hasta ${S.m(max2)} que se devuelven cada mes durante ${term} años a una tasa fija del ${r2} % o del ${r3} %: el ejemplo de MassHousing son 180 pagos de ${cents(pay2, 'es')} o de ${cents(pay3, 'es')}. El prestamista aprobado decide la opción y el monto. La calculadora calcula las tres con sus cifras: en Worcester, un hogar de tres que gana ${S.m(110000)} y compra por ${S.m(420000)} con FHA necesita ${S.m(ex.sm.down)} de entrada, que la opción 1 cubriría por completo si el hogar está bajo el límite de MassHousing para el municipio.`,
    faqs: [
      { q: '¿Por qué alguien elegiría una opción de MassHousing con cuotas mensuales?', a: `Porque es el prestamista, no el comprador, quien decide qué opción corresponde al expediente, y un préstamo que se amortiza no deja nada pendiente al vender pasados ${term} años. En todo el plazo, la opción 2 cuesta unos ${S.m(cost2)} de interés sobre ${S.m(max2)} y la opción 3 unos ${S.m(cost3)}, mientras que la opción 1 no cuesta interés pero se lleva el saldo completo de la venta o la refinanciación.` },
      { q: '¿Puedo refinanciar una casa de Massachusetts con un préstamo diferido de MassHousing?', a: `Sí, pero la refinanciación hace exigible el saldo diferido de la opción 1, así que el nuevo préstamo o sus ahorros deben pagarlo. Para quien tiene ${S.m(max1)} diferidos, eso es una parte grande del capital acumulado en los primeros años. Si piensa refinanciar cuando bajen las tasas, compárelo con una de las opciones con cuota, cuyo saldo baja cada mes.` },
      { q: '¿MassHousing fija sus límites por municipio o por condado?', a: 'Publica sus límites de ingreso por comunidad, porque las áreas de HUD en Massachusetts siguen a los municipios y no a los condados. Por eso la calculadora de esta página enumera las 351 ciudades y municipios. Enlazamos los límites de MassHousing pero no los transcribimos, así que la calculadora marca cada opción para confirmar y compara su ingreso con la mediana de HUD.' },
    ],
    body: (h) => `
<h2>Las tres opciones de MassHousing</h2>
${stateProgTable(h, 'MA')}
<p>Las tres opciones se dirigen al mismo comprador: alguien que compra por primera vez, bajo el límite de ingresos de su comunidad, con una primera hipoteca de MassHousing y un curso para compradores. Lo que cambia es quién paga el dinero y cuándo. La opción 1 es gratuita hasta que la casa cambia de manos. Las opciones 2 y 3 son préstamos a plazos corrientes con una tasa fija baja: ${h.m(max2)} al ${r2} % a ${term} años son ${cents(pay2, h.lang)} al mes y ${h.m(Math.round(pay2 * n))} en total; al ${r3} % son ${cents(pay3, h.lang)} al mes y ${h.m(Math.round(pay3 * n))}.</p>
<h2>Precios en diez ciudades de Massachusetts</h2>
${countyTable(h, 'MA', TOWNS)}
<p>Massachusetts es el único estado de este sitio cuyas áreas de HUD siguen a las ciudades y los municipios, de modo que dos vecinos pueden quedar en áreas distintas. Boston, Cambridge y Quincy comparten una mediana de ${h.m(bos.m)} y un límite FHA de ${h.m(bos.fha ?? 0)}; Worcester está en ${h.m(wor.m)} y ${h.m(wor.fha ?? 0)}; Springfield en ${h.m(spr.m)} y el piso FHA. Un préstamo diferido de ${h.m(max1)} cubre toda la entrada FHA de una casa de hasta unos ${h.m(Math.round(max1 / (K.P.fha.minDown / 100)))}, lo que en el oeste del estado son casi todas las casas y en Boston muy pocas.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'MA', c: spr.id, i: 85000, p: 300000, h: 3 }, t: 'Su ciudad o municipio de Massachusetts' })}
<h2>Worcester, paso a paso</h2>
${exampleTable(h, { st: 'MA', county: 'Worcester city', income: 110000, price: 420000, size: 3 }, h.t(`Household of three, ${h.m(110000)}, ${h.m(420000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(110000)}, casa de ${h.m(420000)}, préstamo FHA, 680 puntos.`))}
<p>En Boston, con ${h.m(140000)} y ${h.m(650000)}, la entrada mínima FHA es de ${h.m(exB.sm.down)}; la opción 1 cubre ${h.m(Math.min(max1, exB.sm.down))}, y el ingreso del hogar está al ${h.p(exB.ami.pct)} de la mediana de HUD para tres, así que el límite de MassHousing para Boston es la cifra que hay que confirmar antes que nada.</p>
<h2>Elegir entre diferido y amortizado</h2>
<p>Quien piensa quedarse diez años o más sin refinanciar no paga nada por la opción 1. Quien puede mudarse o refinanciar en pocos años debe todo el saldo de la opción 1 en ese momento, mientras que con las opciones 2 o 3 una parte ya está devuelta. La cuota de las opciones amortizables cuenta en la relación deuda-ingreso, lo que puede reducir la primera hipoteca a la que tiene acceso. Pida al prestamista de MassHousing que calcule las tres con su expediente, y pregunte en la oficina de vivienda de su ciudad por las ayudas locales que esos prestamistas aceptan junto con ellas.</p>
`,
  },
});
