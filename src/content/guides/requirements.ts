import { defineGuide } from '../../lib/page-types';
import type { Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, STATES_READ } from './_shared';

const oh = example({ st: 'OH', county: 'Cuyahoga County', income: 95000, price: 240000, size: 2 });
const ohLow = example({ st: 'OH', county: 'Cuyahoga County', income: 95000, price: 240000, size: 2, credit: 630 });
const progs = STATES_READ.flatMap((st) => K.state(st).programs.filter((p) => p.form !== 'mcc').map((p) => ({ st, p })));
const credits = progs.map((x) => x.p.minCredit).filter((x): x is number => !!x);
const E = K.en, S = K.es;
const cnt = (v: number) => credits.filter((c) => c === v).length;

function table(h: Helpers) {
  const rows = progs.map(({ st, p }) => [K.stateName(st), p.name, p.minCredit ? String(p.minCredit) : h.t('lender', 'prestamista'), p.education === true ? h.t('yes', 'sí') : typeof p.education === 'string' ? h.t('if all buyers are first-time', 'si todos compran por primera vez') : p.education === false ? h.t('no', 'no') : h.t('not stated', 'no indicado'), p.contribution ?? '', (p.firstMortgage ?? []).join(', ')]);
  return h.table([h.t('State', 'Estado'), h.t('Program', 'Programa'), h.t('Min. credit', 'Crédito mín.'), h.t('Education course', 'Curso'), h.t('Your own contribution (agency wording)', 'Aporte propio (texto de la agencia)'), h.t('First mortgage', 'Primera hipoteca')], rows,
    h.t('Requirements stated by each agency, besides income and price limits.', 'Requisitos que indica cada agencia, además de los límites de ingreso y precio.'), ['l', 'l', 'r', 'l', 'l', 'l']);
}

export default defineGuide({
  id: 'requirements', group: 'tools', order: 5, tool: 'dpa', toolArg: { st: 'OH', c: oh.c.id, i: 95000, p: 240000, h: 2 },
  related: ['first-time', 'income-limits', 'how-much-down', 'programs', 'oh', 'il'],
  sources: ['agency-OH', 'prog-oh-dpa', 'limits-OH', 'prog-il-home', 'fha-handbook'],
  en: {
    slug: 'down-payment-assistance-requirements', nav: 'Requirements to qualify', card: 'Income, price, credit score, education and the rest, program by program',
    title: 'Down Payment Assistance Requirements 2026: Full Checklist',
    description: 'Down payment assistance requirements in 2026: income and price limits by county, credit score floors, homebuyer education, own funds and the loans allowed.',
    h1: 'Down payment assistance requirements, one by one',
    intro: 'The calculator tests each requirement it can: income, price, credit score, first-time status and loan type. The table lists the rest.',
    resume: `To get down payment assistance you generally need to meet six conditions at once: household income under the program's limit for your county and household size, a purchase price under its limit, a credit score at or above its floor, first-time buyer status when the program asks for it, a first mortgage of a type the agency accepts, and a homebuyer education course before closing. Among the state programs we read, the credit floor is 620 for ${cnt(620)} programs, 640 for ${cnt(640)} and 660 for ${cnt(660)}; the others leave it to the lender. In Cuyahoga County, Ohio, a couple earning ${E.m(95000)} and buying at ${E.m(240000)} with a 680 score ${oh.sm.best ? `meets every condition of ${oh.sm.best.p.name}, worth ${E.m(oh.sm.bestAmount)}` : 'meets no program'}; with a 630 score the same couple ${ohLow.sm.best ? `still gets ${E.m(ohLow.sm.bestAmount)}` : 'loses it, because Ohio asks for 640'}. The calculator shows which condition fails.`,
    faqs: [
      { q: 'What debt-to-income ratio do down payment programs allow?', a: 'Most follow the automated underwriting of the first mortgage, with a cap set by the agency on all monthly debts, the new payment included, divided by gross monthly income. North Carolina states 45%; Texas follows the automated findings and caps manual files at 45%. The lender computes the ratio from your documents; the calculator does not.' },
      { q: 'Can I get down payment assistance with a 580 credit score?', a: 'FHA insures loans from 580 with 3.5% down, but state assistance programs set their own floor above that: 620 at the lowest among the programs we read. A 580 score therefore usually means an FHA loan without state assistance, or a city or nonprofit program with its own rules.' },
      { q: 'Do I need savings to get down payment assistance?', a: `Usually a little. Illinois asks for ${K.prog('il-home').contribution} on Access Home and Access Forgivable, and Colorado a minimum financial investment of $1,000. Elsewhere the first mortgage sets the minimum, which can be zero with a VA or USDA loan. Closing costs and reserves asked by the lender come on top.` },
      { q: 'Does the home have to be my primary residence?', a: 'Yes, in every state program we read. You must move in shortly after closing, within the delay set by the agency, and live there; renting the home out or moving away before the end of a forgiveness period makes the assistance due. Second homes and investment properties are excluded.' },
    ],
    body: (h) => `
<h2>The conditions the calculator checks</h2>
<p>Income is compared with the agency's own figure when it publishes one for your county (Texas, Ohio, New Jersey are transcribed), with a statewide cap when there is one (North Carolina, Arizona, Washington), and otherwise flagged. Price is compared with the county or state limit the same way. Your credit score is compared with the program's floor, your first-time answer with its rule, and your type of first mortgage with the list of loans the agency pairs with its help. Each failure is written in the "Why" column, so you see whether you are one condition away.</p>
${table(h)}
<h2>The conditions the lender checks</h2>
<p>Debt-to-income ratio, employment and income documents, the appraisal, and the agency's own income worksheet, which can count income differently from the mortgage underwriting: bond programs include household members who are not on the loan. Assets: a few programs refuse buyers with large savings, because the help is meant for those who cannot cover the down payment. The property: one to four units in most programs, condos subject to approval, manufactured homes on permanent foundations in some.</p>
${h.mini('dpa', { p: ['st', 'c', 'cs'], d: { st: 'OH', c: oh.c.id, i: 95000, p: 240000, h: 2 }, t: 'Change the credit score, see what changes' })}
<h2>The order to tackle them</h2>
<p>Start with the course: it takes a few hours and is valid for a year in most programs. Then check your credit report for errors months before applying, since a correction can take weeks and the floor is a hard line. Then compare your income with the limit for your county: if you are just above, a bond program's jump at three people or the targeted-area limits may still work. Last, ask an approved lender to reserve the assistance with the first mortgage; funds are first come, first served.</p>
<h2>Requirements that surprise buyers</h2>
<p>A recapture tax can apply to bond-financed loans if you sell within nine years with a large gain and a much higher income; it is capped and many agencies reimburse it. Some programs require that the assistance be used only for down payment and closing costs, not to pay off debts. And a program can be "open" on its page while its funds for the month are reserved; only the lender's reservation confirms the money.</p>
`,
  },
  es: {
    slug: 'requisitos-de-la-ayuda-para-el-pago-inicial', nav: 'Requisitos para calificar', card: 'Ingreso, precio, crédito, curso y lo demás, programa por programa',
    title: 'Requisitos de la ayuda para el pago inicial 2026: la lista',
    description: 'Requisitos de la ayuda para el pago inicial 2026: límites de ingreso y precio por condado, crédito mínimo, curso, aporte propio y tipos de hipoteca aceptados.',
    h1: 'Requisitos de la ayuda para el pago inicial, uno por uno',
    intro: 'La calculadora comprueba cada requisito que puede: ingreso, precio, puntaje de crédito, primera vivienda y tipo de préstamo. La tabla enumera el resto.',
    resume: `Para recibir ayuda para el pago inicial hay que cumplir en general seis condiciones a la vez: un ingreso del hogar por debajo del límite del programa para su condado y tamaño de hogar, un precio de compra por debajo de su tope, un puntaje de crédito igual o mayor a su mínimo, ser comprador de primera vez cuando el programa lo pide, una primera hipoteca de un tipo que la agencia acepte y un curso para compradores antes del cierre. Entre los programas estatales que leímos, el crédito mínimo es de 620 en ${cnt(620)} programas, 640 en ${cnt(640)} y 660 en ${cnt(660)}; los demás lo dejan al prestamista. En el condado de Cuyahoga, Ohio, una pareja que gana ${S.m(95000)} y compra por ${S.m(240000)} con 680 puntos ${oh.sm.best ? `cumple todas las condiciones de ${oh.sm.best.p.name}, que vale ${S.m(oh.sm.bestAmount)}` : 'no cumple ningún programa'}; con 630 puntos, la misma pareja ${ohLow.sm.best ? `todavía recibe ${S.m(ohLow.sm.bestAmount)}` : 'lo pierde, porque Ohio pide 640'}. La calculadora muestra qué condición falla.`,
    faqs: [
      { q: '¿Qué relación deuda-ingreso permiten los programas de ayuda?', a: 'La mayoría sigue la evaluación automática de la primera hipoteca, con un tope fijado por la agencia sobre todas las deudas mensuales, el nuevo pago incluido, divididas por el ingreso bruto mensual. Carolina del Norte indica 45 %; Texas sigue la evaluación automática y limita los expedientes manuales al 45 %. Lo calcula el prestamista con sus documentos, no la calculadora.' },
      { q: '¿Puedo recibir ayuda con 580 puntos de crédito?', a: 'FHA asegura préstamos desde 580 puntos con el 3.5 % de entrada, pero los programas estatales de ayuda fijan su propio mínimo por encima: 620 como mínimo entre los programas que leímos. Con 580 puntos lo habitual es un préstamo FHA sin ayuda estatal, o un programa municipal o de una organización con sus propias reglas.' },
      { q: '¿Necesito ahorros para recibir la ayuda?', a: 'Normalmente un poco. Illinois pide $1,000 o el 1 % del precio, lo que sea mayor, en Access Home y Access Forgivable, y Colorado una inversión financiera mínima de $1,000. En los demás estados el mínimo lo fija la primera hipoteca, que puede ser cero con un préstamo VA o USDA. Los gastos de cierre y las reservas que pida el prestamista se suman.' },
      { q: '¿La vivienda tiene que ser mi residencia principal?', a: 'Sí, en todos los programas estatales que leímos. Hay que mudarse poco después del cierre, en el plazo que fija la agencia, y vivir allí; alquilar la casa o irse antes del fin de un periodo de perdón hace exigible la ayuda. Las segundas residencias y las inversiones quedan excluidas.' },
    ],
    body: (h) => `
<h2>Las condiciones que comprueba la calculadora</h2>
<p>El ingreso se compara con la cifra de la agencia cuando publica una para su condado (Texas, Ohio y Nueva Jersey están transcritos), con un tope estatal cuando existe (Carolina del Norte, Arizona, Washington) y si no se marca para confirmar. El precio se compara de la misma manera con el tope del condado o del estado. Su puntaje se compara con el mínimo del programa, su respuesta sobre primera vivienda con su regla y su tipo de hipoteca con la lista de préstamos que la agencia combina con su ayuda. Cada fallo se escribe en la columna "Motivo", para que vea si está a una sola condición.</p>
${table(h)}
<h2>Las condiciones que revisa el prestamista</h2>
<p>La relación deuda-ingreso, los comprobantes de empleo e ingresos, la tasación y la hoja de ingresos de la agencia, que puede contar el ingreso de otra manera que la evaluación de la hipoteca: los programas de bonos incluyen a miembros del hogar que no firman el préstamo. Los ahorros: algunos programas rechazan a compradores con muchos ahorros, porque la ayuda es para quien no puede cubrir la entrada. La vivienda: de una a cuatro unidades en la mayoría de los programas, condominios sujetos a aprobación y casas prefabricadas sobre cimientos permanentes en algunos.</p>
${h.mini('dpa', { p: ['st', 'c', 'cs'], d: { st: 'OH', c: oh.c.id, i: 95000, p: 240000, h: 2 }, t: 'Cambie el puntaje y vea qué cambia' })}
<h2>En qué orden abordarlas</h2>
<p>Empiece por el curso: lleva unas horas y vale un año en la mayoría de los programas. Luego revise su informe de crédito en busca de errores meses antes de solicitar, porque una corrección puede tardar semanas y el mínimo es una línea firme. Después compare su ingreso con el límite de su condado: si está justo por encima, el salto de los programas de bonos a partir de tres personas o los límites de las zonas prioritarias pueden servir. Por último, pida a un prestamista aprobado que reserve la ayuda junto con la hipoteca; los fondos se asignan por orden de llegada.</p>
<h2>Requisitos que sorprenden</h2>
<p>Un impuesto de recuperación puede aplicarse a los préstamos financiados con bonos si vende dentro de nueve años con una ganancia grande y un ingreso mucho mayor; tiene un tope y muchas agencias lo reembolsan. Algunos programas exigen que la ayuda se use solo para la entrada y los gastos de cierre, no para pagar deudas. Y un programa puede figurar "abierto" en su página mientras sus fondos del mes ya están reservados; solo la reserva del prestamista confirma el dinero.</p>
`,
  },
});
