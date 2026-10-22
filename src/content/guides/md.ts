import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, exampleTable, stateProgTable, countyTable } from './_shared';

const E = K.en, S = K.es;
const pct = K.prog('md-pct'), six = K.prog('md-6000');
const vals = pct.amount.values!;
const top = Math.max(...vals), low = Math.min(...vals);
const sixAmt = six.amount.value!;
const amt = (x: ReturnType<typeof example>, id: string) => x.sm.evals.find((e) => e.p.id === id)?.amount ?? 0;
const ex = example({ st: 'MD', county: 'Baltimore city', income: 90000, price: 280000, size: 3 });
const exMo = example({ st: 'MD', county: 'Montgomery County', income: 130000, price: 520000, size: 3 });
const balt = K.county('MD', 'Baltimore city'), mont = K.county('MD', 'Montgomery County'), pg = K.county('MD', "Prince George's County");
const COUNTIES = ['Baltimore city', 'Baltimore County', 'Montgomery County', "Prince George's County", 'Anne Arundel County', 'Howard County', 'Frederick County', 'Harford County', 'Washington County', 'Wicomico County'];
const local = K.state('MD').local ?? [];
const fhft = local.find((l) => l.name.startsWith('First Homes'));
const loanAt = (x: ReturnType<typeof example>, p: number) => Math.round(x.sm.loan * p / 100);

export default defineGuide({
  id: 'md', group: 'states', order: 16, state: 'MD', tool: 'dpa', toolArg: { st: 'MD', c: balt.id, i: 90000, p: 280000, h: 3 },
  related: ['programs', 'payment', 'first-time', 'requirements', 'va', 'pa'],
  sources: ['agency-MD', 'prog-md-pct', 'prog-md-6000', 'hud-il', 'fha-ml'],
  en: {
    slug: 'maryland-down-payment-assistance', nav: 'Maryland', card: 'MMP 1st Time Advantage: 3% to 5% of the loan, or $6,000, deferred',
    title: 'Maryland Down Payment Assistance 2026: MMP Up to 5% at 0%',
    description: `Maryland down payment assistance in 2026: the Maryland Mortgage Program lends ${low}% to ${top}% of the first mortgage or ${E.m(sixAmt)}, at 0% and deferred, in 24 jurisdictions.`,
    h1: 'Maryland down payment assistance with the Maryland Mortgage Program',
    intro: 'Pick your Maryland county or Baltimore City, your income and the price: the MMP loan you could draw, and the cash and payment that remain.',
    resume: `Maryland runs its help through the Maryland Mortgage Program (MMP) of the Department of Housing and Community Development. The 1st Time Advantage loans come in two shapes. The percentage version adds a second loan equal to ${low}%, 4% or ${top}% of the first mortgage, depending on the product the lender chooses; the fixed version, 1st Time Advantage ${E.n(sixAmt)}, adds ${E.m(sixAmt)}, and a Partner Match where an approved employer or partner contributes. Both carry 0% interest and no payment, and are due only when the first mortgage ends: sale, refinance, transfer or payoff. They are for first-time buyers, with the usual exceptions for veterans and targeted areas, and require a homebuyer course. In Baltimore City a household of three earning ${E.m(90000)} buying at ${E.m(280000)} with FHA could draw up to ${E.m(amt(ex, 'md-pct'))} at ${top}%, more than the ${E.m(ex.sm.down)} minimum down payment. MMP's income and price limits are set by county, so the calculator flags them to confirm.`,
    faqs: [
      { q: 'Should I take the 5% Maryland loan or the $6,000 one?', a: `On most loans above ${E.m(120000)}, ${top}% of the first mortgage is the larger sum. The trade-off is in the rate: the lender prices the first mortgage of each 1st Time Advantage product differently, and a larger second loan can come with a higher first rate. Ask for both quotes on the same day and compare the cash at closing with the monthly payment over the years you expect to stay.` },
      { q: 'When is the Maryland DPA loan repaid?', a: 'When the first mortgage ends, whatever the reason: you sell the home, refinance, transfer the title or pay the first loan off. It is never forgiven, so the full amount comes out of the sale or the new loan. There is no interest, which means the sum owed does not grow while you live in the home.' },
      { q: 'Is there a Maryland program for teachers and first responders?', a: 'Yes. First Homes for First Responders and Teachers gives first-time buyers employed full time as teachers or by public safety agencies, fire departments, ambulance services or hospitals a 5% loan of the first mortgage as a 0% deferred second lien, according to the MMP page. The calculator does not test the employment condition.' },
    ],
    body: (h) => `
<h2>The MMP loans and how they are repaid</h2>
${stateProgTable(h, 'MD')}
<p>The amount follows the first mortgage, not the price. On an FHA loan of ${h.m(ex.sm.loan)} in the Baltimore example, ${low}% is ${h.m(loanAt(ex, low))}, 4% is ${h.m(loanAt(ex, 4))} and ${top}% is ${h.m(loanAt(ex, top))}. The fixed ${h.m(sixAmt)} loan wins only on small mortgages, below ${h.m(120000)} at the ${top}% level, but its first mortgage rate can be lower; that is the reason both exist.</p>
<h2>Prices and federal limits across Maryland</h2>
${countyTable(h, 'MD', COUNTIES)}
<p>Maryland splits between the Washington metro, where Montgomery and Prince George's share a HUD median of ${h.m(mont.m)} and an FHA limit of ${h.m(mont.fha ?? 0)}, and the Baltimore area at ${h.m(balt.m)} and ${h.m(balt.fha ?? 0)}. MMP publishes its own income and purchase price limits by county and household size, which we link but have not transcribed. The calculator shows your income as a share of the HUD median as a guide while you check.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'MD', c: pg.id, i: 120000, p: 450000, h: 3 }, t: 'Your Maryland county' })}
<h2>Baltimore City, worked through</h2>
${exampleTable(h, { st: 'MD', county: 'Baltimore city', income: 90000, price: 280000, size: 3 }, h.t(`Household of three, ${h.m(90000)}, ${h.m(280000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(90000)}, casa de ${h.m(280000)}, préstamo FHA, 680 puntos.`))}
<p>In Montgomery County, at ${h.m(130000)} and ${h.m(520000)}, the ${top}% loan would reach ${h.m(amt(exMo, 'md-pct'))}, because the loan is larger. A deferred loan of that size stays on the title for as long as the first mortgage, so selling after ten years means paying it back from the proceeds, with no discount for time.</p>
${fhft ? `<h2>${h.t('Loans for teachers and first responders', 'Préstamos para docentes y personal de emergencias')}</h2>` : ''}
<p>The MMP page also lists First Homes for First Responders and Teachers, a ${top}% deferred loan for first-time buyers in those jobs, which is not in the calculator because it depends on the employer. Several counties and Baltimore City add their own grants or loans that can be combined with an MMP first mortgage; the agency's lenders know which ones apply to your address.</p>
<h2>Steps in Maryland</h2>
<p>MMP works only through its approved lenders. Take the homebuyer education course first, since the certificate is required before closing. Ask the lender which 1st Time Advantage product it prices best that week and how the rate moves between the ${low}% and ${top}% versions. A Partner Match is worth asking about if your employer or a county program is on the MMP partner list.</p>
`,
  },
  es: {
    slug: 'ayuda-pago-inicial-maryland', nav: 'Maryland', card: 'MMP 1st Time Advantage: del 3 % al 5 % del préstamo, o $6,000, diferido',
    title: 'Ayuda para el pago inicial en Maryland 2026: programa MMP',
    description: `Ayuda para el pago inicial en Maryland 2026: el Maryland Mortgage Program presta del ${low} % al ${top} % de la hipoteca o ${S.m(sixAmt)}, al 0 %, diferido, en 24 jurisdicciones.`,
    h1: 'Ayuda para el pago inicial en Maryland con el Maryland Mortgage Program',
    intro: 'Elija su condado de Maryland o la ciudad de Baltimore, su ingreso y el precio: el préstamo de MMP que podría obtener y el efectivo y la cuota que quedan.',
    resume: `Maryland canaliza su ayuda a través del Maryland Mortgage Program (MMP) del Departamento de Vivienda y Desarrollo Comunitario. Los préstamos 1st Time Advantage tienen dos formas. La versión en porcentaje añade un segundo préstamo igual al ${low} %, 4 % o ${top} % de la primera hipoteca, según el producto que elija el prestamista; la versión fija, 1st Time Advantage ${S.n(sixAmt)}, añade ${S.m(sixAmt)}, más un Partner Match cuando un empleador o socio aprobado aporta fondos. Ambas van al 0 % de interés y sin cuota, y solo vencen cuando termina la primera hipoteca: venta, refinanciación, transferencia o liquidación. Son para compradores de primera vez, con las excepciones habituales de veteranos y zonas prioritarias, y exigen un curso para compradores. En la ciudad de Baltimore, un hogar de tres que gana ${S.m(90000)} y compra por ${S.m(280000)} con FHA podría obtener hasta ${S.m(amt(ex, 'md-pct'))} al ${top} %, más que la entrada mínima de ${S.m(ex.sm.down)}. Los límites de ingreso y de precio de MMP se fijan por condado, así que la calculadora los marca para confirmar.`,
    faqs: [
      { q: '¿Conviene el préstamo del 5 % de Maryland o el de $6,000?', a: `En la mayoría de los préstamos por encima de ${S.m(120000)}, el ${top} % de la primera hipoteca es la suma mayor. La diferencia está en la tasa: el prestamista fija la primera hipoteca de cada producto 1st Time Advantage de forma distinta, y un segundo préstamo mayor puede venir con una primera tasa más alta. Pida las dos cotizaciones el mismo día y compare el efectivo al cierre con la cuota durante los años que piensa quedarse.` },
      { q: '¿Cuándo se devuelve el préstamo de Maryland para la entrada?', a: 'Cuando termina la primera hipoteca, sea cual sea el motivo: vende la casa, refinancia, transfiere el título o liquida el primer préstamo. Nunca se perdona, así que el monto completo sale de la venta o del nuevo préstamo. No lleva interés, lo que significa que la suma adeudada no crece mientras vive en la casa.' },
      { q: '¿Hay un programa de Maryland para docentes y personal de emergencias?', a: 'Sí. First Homes for First Responders and Teachers da a compradores de primera vez empleados a tiempo completo como docentes o en agencias de seguridad pública, bomberos, servicios de ambulancia u hospitales un préstamo del 5 % de la primera hipoteca, como segundo gravamen diferido al 0 %, según la página de MMP. La calculadora no verifica el empleo.' },
    ],
    body: (h) => `
<h2>Los préstamos de MMP y cómo se devuelven</h2>
${stateProgTable(h, 'MD')}
<p>El monto sigue a la primera hipoteca, no al precio. Con un préstamo FHA de ${h.m(ex.sm.loan)} en el ejemplo de Baltimore, el ${low} % son ${h.m(loanAt(ex, low))}, el 4 % son ${h.m(loanAt(ex, 4))} y el ${top} % son ${h.m(loanAt(ex, top))}. El préstamo fijo de ${h.m(sixAmt)} solo gana en hipotecas pequeñas, por debajo de ${h.m(120000)} frente al ${top} %, pero su primera hipoteca puede tener una tasa más baja; por eso existen los dos.</p>
<h2>Precios y límites federales en Maryland</h2>
${countyTable(h, 'MD', COUNTIES)}
<p>Maryland se divide entre el área de Washington, donde Montgomery y Prince George's comparten una mediana de HUD de ${h.m(mont.m)} y un límite FHA de ${h.m(mont.fha ?? 0)}, y el área de Baltimore, con ${h.m(balt.m)} y ${h.m(balt.fha ?? 0)}. MMP publica sus propios límites de ingreso y de precio por condado y tamaño del hogar, que enlazamos pero no transcribimos. La calculadora muestra su ingreso como porcentaje de la mediana de HUD como guía mientras lo confirma.</p>
${h.mini('dpa', { p: ['c', 'i', 'p'], d: { st: 'MD', c: pg.id, i: 120000, p: 450000, h: 3 }, t: 'Su condado de Maryland' })}
<h2>La ciudad de Baltimore, paso a paso</h2>
${exampleTable(h, { st: 'MD', county: 'Baltimore city', income: 90000, price: 280000, size: 3 }, h.t(`Household of three, ${h.m(90000)}, ${h.m(280000)} home, FHA loan, 680 score.`, `Hogar de tres, ${h.m(90000)}, casa de ${h.m(280000)}, préstamo FHA, 680 puntos.`))}
<p>En el condado de Montgomery, con ${h.m(130000)} y ${h.m(520000)}, el préstamo del ${top} % llegaría a ${h.m(amt(exMo, 'md-pct'))}, porque la hipoteca es mayor. Un préstamo diferido de ese tamaño sigue en el título mientras dure la primera hipoteca, así que vender a los diez años supone devolverlo con lo obtenido en la venta, sin descuento por el tiempo.</p>
${fhft ? `<h2>${h.t('Loans for teachers and first responders', 'Préstamos para docentes y personal de emergencias')}</h2>` : ''}
<p>La página de MMP incluye también First Homes for First Responders and Teachers, un préstamo diferido del ${top} % para compradores de primera vez en esos empleos, que no está en la calculadora porque depende del empleador. Varios condados y la ciudad de Baltimore suman subvenciones o préstamos propios combinables con una primera hipoteca de MMP; los prestamistas de la agencia saben cuáles aplican a su dirección.</p>
<h2>Pasos en Maryland</h2>
<p>MMP trabaja solo con sus prestamistas aprobados. Haga primero el curso para compradores, porque el certificado se exige antes del cierre. Pregunte al prestamista qué producto 1st Time Advantage cotiza mejor esa semana y cómo cambia la tasa entre las versiones del ${low} % y del ${top} %. Vale la pena preguntar por un Partner Match si su empleador o un programa del condado figura en la lista de socios de MMP.</p>
`,
  },
});
