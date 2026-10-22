import { defineGuide } from '../../lib/page-types';
import type { Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.en, S = K.es, r30 = K.RATES.r30, M = K.P.mcc;
const LOANS = [200000, 280000, 400000, 550000];
const RATES_ = [20, 25, 40];
const base = K.mcc(280000, r30, 20), big = K.mcc(400000, r30, 40);

function table(h: Helpers) {
  const rows = LOANS.map((b) => [h.m(b), h.m(K.mcc(b, r30, 0).interest), ...RATES_.map((q) => h.m(K.mcc(b, r30, q).credit))]);
  return h.table([h.t('Mortgage', 'Hipoteca'), h.t('Interest, year one', 'Intereses, primer año'), ...RATES_.map((q) => h.t(`Credit at ${q}%`, `Crédito al ${q} %`))], rows,
    h.t(`30-year loan at ${h.r(r30)} (Freddie Mac, ${h.day(K.RATES.date)}). Above 20% the credit is capped at ${h.m(M.capAbove20)} a year (IRS Form 8396).`, `Préstamo a 30 años al ${h.r(r30)} (Freddie Mac, ${h.day(K.RATES.date)}). Por encima del 20 %, el crédito tiene un tope de ${h.m(M.capAbove20)} al año (formulario 8396 del IRS).`), ['r', 'r', 'r', 'r', 'r']);
}

export default defineGuide({
  id: 'mcc', group: 'tools', order: 10, tool: 'mcc', toolArg: { b: 280000, q: 20 },
  related: ['payment', 'programs', 'first-time', 'tx', 'oh', 'grants'],
  sources: ['irs-mcc', 'prog-tx-mcc', 'prog-oh-mtc', 'pmms'],
  en: {
    slug: 'mortgage-credit-certificate', nav: 'Mortgage credit certificate', card: 'The yearly federal tax credit on your mortgage interest',
    title: 'Mortgage Credit Certificate 2026: Your Yearly Tax Credit',
    description: 'Mortgage credit certificate in 2026: the federal tax credit on your mortgage interest each year, at 20% to 50%, with the $2,000 cap and a free calculator.',
    h1: 'Mortgage credit certificate: the tax credit, year by year',
    intro: 'Enter your mortgage and the certificate rate set by your agency: the credit you claim in the first year, before and after the cap.',
    resume: `A mortgage credit certificate (MCC) is not down payment help: it is a federal tax credit, issued through a state or local agency, worth a share of the mortgage interest you pay each year for as long as you keep the loan and live in the home. The agency sets the share between 10% and 50%; above 20%, the credit cannot exceed ${E.m(M.capAbove20)} a year. On a ${E.m(280000)} loan at ${E.r(r30)}, the Freddie Mac average of ${E.day(K.RATES.date)}, you pay about ${E.m(base.interest)} of interest in year one, so a 20% certificate is worth ${E.m(base.credit)}; a 40% certificate on ${E.m(400000)} hits the cap at ${E.m(big.credit)}. The credit lowers your tax dollar for dollar, but it cannot exceed the tax you owe; any unused part carries forward three years. Texas and Ohio offer one among the states we read, alone or with their down payment help.`,
    faqs: [
      { q: 'Can I combine a mortgage credit certificate with down payment assistance?', a: 'Often, yes. Texas lets buyers pair its certificate with the My First Texas Home loan, and Ohio offers its Mortgage Tax Credit next to its assistance. The certificate has the same income and price limits as the agency\'s bond loans in most states, and it must be issued before closing.' },
      { q: 'Do I still get the mortgage interest deduction with an MCC?', a: 'Yes, on the interest left after the credit, and only if you itemize. IRS Form 8396 asks you to reduce the deductible interest by the credit you claim. Since most households now take the standard deduction, the credit is usually worth more than the deduction it replaces.' },
      { q: 'What happens to my MCC if I refinance?', a: 'The certificate is tied to the original loan and ends when it is paid off. Some agencies reissue a certificate for a refinance if you ask before closing, under conditions. Without a reissue, refinancing ends the credit for the years that remain.' },
    ],
    body: (h) => `
<h2>The credit for four loans and three rates</h2>
${table(h)}
<p>The table shows why the rate matters less than it seems above 20%: on most loans, any rate from about 25% hits the ${h.m(M.capAbove20)} cap. Below the cap, the credit grows with the loan and the mortgage rate, which is why it is worth more when rates are high. Each year the interest falls a little, and so does the credit, slowly at first.</p>
<h2>What the credit is worth over time</h2>
<p>The credit runs every year you keep the loan and live in the home. A ${h.m(base.credit)} credit in year one is still worth a little less each year after that as the balance falls; over ten years it can add up to more than many down payment grants, which is why some buyers choose a certificate over a cash program when they cannot have both. The catch: it only helps if you owe federal income tax.</p>
${h.mini('mcc', { p: ['b', 'q'], d: { b: 350000, q: 25 }, t: 'Your loan, your rate' })}
<h2>Taking the credit in your paycheck</h2>
<p>You claim the credit on Form 8396 with your return. Many holders adjust their withholding on Form W-4 to receive it through the year instead of in one refund, which lowers the effective monthly cost of the loan. Some lenders count the credit as added income when they qualify you, others do not, so ask yours.</p>
<h2>Recapture if you sell early</h2>
<p>As with bond-financed loans, selling within nine years with a gain and a much higher income can trigger a federal recapture tax on part of the benefit. The agency's notice at closing gives the figures, and the tax applies only if all its conditions are met at the sale.</p>
<h2>How to get a certificate</h2>
<p>You do not apply to the IRS. The certificate is issued by the state or local agency through an approved lender, at the same time as your mortgage, and it must be in place before closing. The agency checks the same income and price limits as for its bond loans, and the first-time buyer rule, with the targeted-area exceptions. Ask the lender at the start: it cannot be added after the loan has closed.</p>
`,
  },
  es: {
    slug: 'certificado-de-credito-hipotecario', nav: 'Certificado de crédito hipotecario', card: 'El crédito fiscal federal anual sobre sus intereses',
    title: 'Certificado de crédito hipotecario 2026: su crédito fiscal',
    description: 'Certificado de crédito hipotecario 2026: el crédito fiscal federal anual por intereses hipotecarios, del 20 % al 50 %, con el tope de $2,000 y calculadora.',
    h1: 'Certificado de crédito hipotecario: el crédito fiscal, año por año',
    intro: 'Escriba su hipoteca y la tasa del certificado que fija su agencia: el crédito que reclama el primer año, antes y después del tope.',
    resume: `Un certificado de crédito hipotecario (MCC) no es una ayuda para el pago inicial: es un crédito fiscal federal, emitido por una agencia estatal o local, que vale una parte de los intereses hipotecarios que paga cada año mientras conserve el préstamo y viva en la casa. La agencia fija la parte entre el 10 % y el 50 %; por encima del 20 %, el crédito no puede pasar de ${S.m(M.capAbove20)} al año. En un préstamo de ${S.m(280000)} al ${S.r(r30)}, el promedio de Freddie Mac del ${S.day(K.RATES.date)}, paga unos ${S.m(base.interest)} de intereses el primer año, así que un certificado al 20 % vale ${S.m(base.credit)}; uno al 40 % sobre ${S.m(400000)} llega al tope de ${S.m(big.credit)}. El crédito baja su impuesto dólar por dólar, pero no puede superar el impuesto que debe; lo no usado se arrastra tres años. Texas y Ohio lo ofrecen entre los estados que leímos, solo o con su ayuda para la entrada.`,
    faqs: [
      { q: '¿Puedo combinar un certificado de crédito con la ayuda para el pago inicial?', a: 'A menudo, sí. Texas permite combinar su certificado con el préstamo My First Texas Home, y Ohio ofrece su Mortgage Tax Credit junto a su ayuda. El certificado tiene en la mayoría de los estados los mismos límites de ingreso y precio que los préstamos con bonos de la agencia, y debe emitirse antes del cierre.' },
      { q: '¿Sigo teniendo la deducción por intereses con un MCC?', a: 'Sí, sobre los intereses que quedan tras el crédito, y solo si detalla deducciones. El formulario 8396 del IRS pide reducir los intereses deducibles en el crédito reclamado. Como la mayoría de los hogares toma hoy la deducción estándar, el crédito suele valer más que la deducción que reemplaza.' },
      { q: '¿Qué pasa con mi MCC si refinancio?', a: 'El certificado está ligado al préstamo original y termina cuando este se liquida. Algunas agencias emiten de nuevo un certificado para un refinanciamiento si se pide antes del cierre, con condiciones. Sin esa nueva emisión, refinanciar pone fin al crédito para los años que quedan.' },
    ],
    body: (h) => `
<h2>El crédito para cuatro préstamos y tres tasas</h2>
${table(h)}
<p>La tabla muestra por qué la tasa importa menos de lo que parece por encima del 20 %: en la mayoría de los préstamos, cualquier tasa desde un 25 % llega al tope de ${h.m(M.capAbove20)}. Por debajo del tope, el crédito crece con el préstamo y con la tasa de la hipoteca, por eso vale más cuando las tasas están altas. Cada año los intereses bajan un poco, y el crédito también, despacio al principio.</p>
<h2>Lo que vale el crédito con el tiempo</h2>
<p>El crédito corre cada año que conserva el préstamo y vive en la casa. Un crédito de ${h.m(base.credit)} el primer año vale algo menos cada año siguiente a medida que baja el saldo; en diez años puede sumar más que muchas subvenciones para la entrada, por eso algunos compradores eligen un certificado antes que un programa en efectivo cuando no pueden tener ambos. La condición: solo ayuda si debe impuesto federal sobre la renta.</p>
${h.mini('mcc', { p: ['b', 'q'], d: { b: 350000, q: 25 }, t: 'Su préstamo, su tasa' })}
<h2>Recibir el crédito en su sueldo</h2>
<p>El crédito se reclama con el formulario 8396 en su declaración. Muchos titulares ajustan su retención con el formulario W-4 para recibirlo a lo largo del año en lugar de en un solo reembolso, lo que baja el costo mensual efectivo del préstamo. No todos los prestamistas cuentan el crédito como ingreso al evaluarle, así que pregunte si el suyo lo hace.</p>
<h2>Recuperación si vende pronto</h2>
<p>Como en los préstamos con bonos, vender dentro de nueve años con ganancia y un ingreso mucho mayor puede generar un impuesto federal de recuperación sobre parte del beneficio. El aviso de la agencia al cierre da las cifras, y el impuesto solo se aplica si se cumplen todas sus condiciones en la venta.</p>
<h2>Cómo obtener un certificado</h2>
<p>No se solicita al IRS. El certificado lo emite la agencia estatal o local a través de un prestamista aprobado, al mismo tiempo que su hipoteca, y debe estar listo antes del cierre. La agencia revisa los mismos límites de ingreso y precio que para sus préstamos con bonos, y la regla de primera vivienda, con las excepciones de las zonas prioritarias. Pregunte al prestamista desde el principio: no se puede añadir una vez cerrado el préstamo.</p>
`,
  },
});
