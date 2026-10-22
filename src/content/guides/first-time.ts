import { defineGuide } from '../../lib/page-types';
import type { Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { example, STATES_READ } from './_shared';

const ga = example({ st: 'GA', county: 'Fulton County', income: 82000, price: 320000, size: 2 });
const gaRepeat = example({ st: 'GA', county: 'Fulton County', income: 82000, price: 320000, size: 2, firstTime: false });
const all = STATES_READ.flatMap((st) => K.state(st).programs.filter((p) => p.form !== 'mcc').map((p) => ({ st, p })));
const ftOnly = all.filter((x) => x.p.firstTimeRequired === true), open = all.filter((x) => x.p.firstTimeRequired === false), dep = all.filter((x) => x.p.firstTimeRequired == null);
const E = K.en, S = K.es;

function table(h: Helpers) {
  const word = (v: boolean | null | undefined) => (v === true ? h.t('first-time only', 'solo primera vivienda') : v === false ? h.t('repeat buyers too', 'también quien ya tuvo casa') : h.t('follows the first mortgage', 'según la hipoteca'));
  const rows = [...open, ...dep, ...ftOnly].map(({ st, p }) => [K.stateName(st), h.ext(p.sourceUrl, p.name), word(p.firstTimeRequired), p.firstTimeNote ?? '']);
  return h.table([h.t('State', 'Estado'), h.t('Program', 'Programa'), h.t('Who can apply', 'Quién puede solicitar'), h.t('Agency note (English)', 'Nota de la agencia (inglés)')], rows,
    h.t('First-time buyer rule of each state program read, repeat-buyer programs first.', 'Regla de primera vivienda de cada programa estatal leído, primero los abiertos a quien ya tuvo casa.'), ['l', 'l', 'l', 'l']);
}

export default defineGuide({
  id: 'first-time', group: 'tools', order: 3, tool: 'dpa', toolArg: { st: 'GA', c: ga.c.id, i: 82000, p: 320000, h: 2 },
  related: ['programs', 'requirements', 'how-much-down', 'income-limits', 'ga', 'nc'],
  sources: ['agency-GA', 'prog-ga-dream', 'prog-nc-homeadv', 'prog-il-deferred', 'prog-az-homeplus'],
  en: {
    slug: 'first-time-home-buyer-programs', nav: 'First-time buyer programs', card: 'The three-year rule, exemptions, and programs open to repeat buyers',
    title: 'First-Time Home Buyer Programs 2026: Rules by State',
    description: 'First-time home buyer programs 2026: who counts as first-time (3 years without owning), veteran and targeted-area exemptions, programs for repeat buyers.',
    h1: 'First-time home buyer programs and who counts as first-time',
    intro: 'Answer "first-time buyer?" yes or no in the calculator: programs reserved to first-time buyers drop out or stay, with the reason.',
    resume: `For almost every state housing finance agency, a first-time home buyer is someone who has not owned their principal residence during the last three years, the definition of the federal mortgage revenue bond rules. Owning a rental property, land or a home you never lived in usually does not count against you, and veterans and buyers in federally targeted areas are generally exempt. Of the ${all.length} state programs we read, ${ftOnly.length} are reserved to first-time buyers, ${open.length} are open to repeat buyers and ${dep.length} follow the rule of the first mortgage they are paired with. In Fulton County, Georgia, a couple earning ${E.m(82000)} and buying at ${E.m(320000)} ${ga.sm.best ? `can draw ${E.m(ga.sm.bestAmount)} from ${ga.sm.best.p.name} as first-time buyers` : 'fits no Georgia program'}; answer "no" to the first-time question and the calculator ${gaRepeat.sm.best ? `still finds ${E.m(gaRepeat.sm.bestAmount)}` : 'finds nothing, because Georgia Dream requires first-time status outside targeted areas'}.`,
    faqs: [
      { q: 'Am I a first-time home buyer if I owned a home with an ex-spouse?', a: 'Often yes. Some agencies, following the federal HOME program definition, let a displaced homemaker or a single parent who only owned with a former spouse count as a first-time buyer, and anyone who has not owned a principal residence for three years qualifies anyway. The definition is the agency\'s: check its guide or ask an approved lender before you rule yourself out.' },
      { q: 'Does owning land or a rental property stop me from being a first-time buyer?', a: 'Usually not. The bond rules look at ownership of your principal residence, the home you lived in. Owning vacant land or a property you rented out without living in it does not by itself make you a repeat buyer. A mobile home that was your residence on a permanent foundation can count, so mention it to the lender.' },
      { q: 'What is a targeted area for first-time buyer programs?', a: 'A census tract the federal government designates for more homeownership, usually because incomes there are low or the area is in economic distress. In a targeted area, the first-time rule is waived and income and price limits are higher. Agencies publish maps or address lookups; the calculator uses non-targeted limits.' },
    ],
    body: (h) => `
<h2>The three-year rule in practice</h2>
<p>The clock looks back from the day you close. If you sold your last home in March 2023, you become a first-time buyer again in March 2026. What counts is an ownership interest in the home you lived in: your name on the deed, alone or with others. A co-signer who never lived in the home is not affected for that home, but lenders look at every borrower on the new loan, so a spouse who owned a home last year can disqualify a couple for a first-time-only program even when the other spouse never owned one.</p>
<p>Agencies verify with three years of federal tax returns: a mortgage interest deduction or a property tax deduction on Schedule A is the usual trigger for questions. If you have not filed, a signed affidavit replaces the returns in most programs.</p>
${table(h)}
<h2>Exemptions worth checking before you give up</h2>
<p>Veterans with an honorable discharge are exempt in Texas, Illinois, New Jersey, Maryland and most other bond programs. Buying in a targeted area waives the rule in every state that uses bond financing. Several programs never had the rule: North Carolina's Home Advantage, Illinois' Access Forgivable and Access Deferred, Washington's Home Advantage, Arizona's Home Plus, Texas' My Choice Texas Home. If you are a repeat buyer, these are the programs the calculator keeps.</p>
${h.mini('down', { p: ['p', 'l'], d: { p: 320000, l: 'fha' }, t: 'Your minimum down payment' })}
<h2>First-time buyer loans are not the same as first-time buyer assistance</h2>
<p>FHA loans, Fannie Mae's and Freddie Mac's 3% down loans and VA loans have no first-time requirement of their own, although some low down payment conventional loans ask that at least one borrower be a first-time buyer. The first-time rule comes from the assistance and from the bond-financed first mortgage that usually goes with it. A buyer who does not qualify for the assistance can still use a 3.5% FHA loan or a 3% conventional loan with their own savings, a gift from family or help from an employer.</p>
<h2>Education is part of being a first-time buyer</h2>
<p>Almost every program requires a homebuyer education course before closing, usually a few hours online or in a class run by a HUD-approved counseling agency. Some agencies require one-on-one counseling below a credit score: Pennsylvania asks it of borrowers under 680. Book it early: the certificate is often needed before the lender can reserve funds.</p>
`,
  },
  es: {
    slug: 'programas-para-compradores-de-primera-vivienda', nav: 'Programas de primera vivienda', card: 'La regla de tres años, las excepciones y los programas para quien ya tuvo casa',
    title: 'Programas para compradores de primera vivienda 2026',
    description: 'Programas de primera vivienda 2026: quién cuenta como primera vez (3 años sin ser dueño), excepciones para veteranos y zonas prioritarias, y alternativas.',
    h1: 'Programas de primera vivienda y quién cuenta como comprador de primera vez',
    intro: 'Responda sí o no a "¿Primera vivienda?" en la calculadora: los programas reservados a quienes compran por primera vez se quedan o salen, con el motivo.',
    resume: `Para casi todas las agencias estatales de vivienda, un comprador de primera vivienda es quien no ha sido dueño de su residencia principal en los últimos tres años, la definición de las reglas federales de los bonos hipotecarios. Ser dueño de una propiedad en alquiler, de un terreno o de una casa en la que nunca vivió no suele contar en su contra, y los veteranos y quienes compran en zonas prioritarias federales suelen estar exentos. De los ${all.length} programas estatales que leímos, ${ftOnly.length} están reservados a compradores de primera vez, ${open.length} aceptan a quien ya tuvo casa y ${dep.length} siguen la regla de la hipoteca con la que se combinan. En el condado de Fulton, Georgia, una pareja que gana ${S.m(82000)} y compra por ${S.m(320000)} ${ga.sm.best ? `puede recibir ${S.m(ga.sm.bestAmount)} de ${ga.sm.best.p.name} como compradores de primera vez` : 'no entra en ningún programa de Georgia'}; si responde "no" a la pregunta de primera vivienda, la calculadora ${gaRepeat.sm.best ? `todavía encuentra ${S.m(gaRepeat.sm.bestAmount)}` : 'no encuentra nada, porque Georgia Dream exige ser comprador de primera vez fuera de las zonas prioritarias'}.`,
    faqs: [
      { q: '¿Soy comprador de primera vivienda si tuve una casa con mi expareja?', a: 'A menudo sí. Algunas agencias, siguiendo la definición del programa federal HOME, permiten que una persona que solo fue dueña junto con su excónyuge, o un padre o madre solo, cuente como comprador de primera vez, y quien lleva tres años sin ser dueño de su residencia califica de todos modos. La definición es la de la agencia: revise su guía o pregunte a un prestamista aprobado.' },
      { q: '¿Tener un terreno o una casa en alquiler me impide ser comprador de primera vez?', a: 'Por lo general no. Las reglas de los bonos miran la propiedad de su residencia principal, la casa donde vivió. Ser dueño de un terreno o de una propiedad que alquiló sin vivir en ella no le convierte por sí solo en comprador repetido. Una casa móvil que fue su residencia sobre cimientos permanentes sí puede contar: dígaselo al prestamista.' },
      { q: '¿Qué es una zona prioritaria en los programas de primera vivienda?', a: 'Un sector censal que el gobierno federal designa para fomentar la compra de vivienda, casi siempre porque los ingresos allí son bajos o la zona atraviesa dificultades económicas. En una zona prioritaria no se aplica la regla de primera vivienda y los límites de ingreso y precio son más altos. Las agencias publican mapas o buscadores por dirección; la calculadora usa los límites normales.' },
    ],
    body: (h) => `
<h2>La regla de tres años en la práctica</h2>
<p>El reloj cuenta hacia atrás desde el día del cierre. Si vendió su última casa en marzo de 2023, vuelve a ser comprador de primera vez en marzo de 2026. Lo que cuenta es tener parte de la propiedad de la vivienda donde vivía: su nombre en la escritura, solo o con otras personas. Un cofirmante que nunca vivió en esa casa no queda afectado por ella, pero el prestamista mira a todos los deudores del nuevo préstamo, así que un cónyuge que tuvo casa el año pasado puede dejar a la pareja fuera de un programa reservado a primera vivienda aunque el otro nunca haya sido dueño.</p>
<p>Las agencias lo comprueban con tres años de declaraciones federales de impuestos: una deducción de intereses hipotecarios o de impuesto a la propiedad en el Anexo A es lo que suele generar preguntas. Si no presentó declaración, una declaración jurada firmada reemplaza a las declaraciones en la mayoría de los programas.</p>
${table(h)}
<h2>Excepciones que conviene revisar antes de rendirse</h2>
<p>Los veteranos con baja honorable están exentos en Texas, Illinois, Nueva Jersey, Maryland y la mayoría de los demás programas de bonos. Comprar en una zona prioritaria elimina la regla en todos los estados que usan bonos. Varios programas nunca tuvieron la regla: Home Advantage de Carolina del Norte, Access Forgivable y Access Deferred de Illinois, Home Advantage de Washington, Home Plus de Arizona, My Choice Texas Home. Si ya tuvo casa, esos son los programas que la calculadora mantiene.</p>
${h.mini('down', { p: ['p', 'l'], d: { p: 320000, l: 'fha' }, t: 'Su pago inicial mínimo' })}
<h2>Un préstamo para primera vivienda no es lo mismo que una ayuda para primera vivienda</h2>
<p>Los préstamos FHA, los préstamos con 3 % de entrada de Fannie Mae y Freddie Mac y los préstamos VA no tienen regla de primera vivienda propia, aunque algunos préstamos convencionales de entrada baja piden que al menos un deudor compre por primera vez. La regla viene de la ayuda y de la hipoteca financiada con bonos que suele acompañarla. Quien no califica para la ayuda puede usar igualmente un préstamo FHA con 3.5 % o uno convencional con 3 %, con sus ahorros, un regalo de la familia o la ayuda de un empleador.</p>
<h2>La educación forma parte de comprar por primera vez</h2>
<p>Casi todos los programas exigen un curso para compradores antes del cierre, de unas pocas horas en línea o en una clase de una agencia de asesoría aprobada por HUD. Algunas agencias piden asesoría individual por debajo de cierto puntaje: Pensilvania la exige a quienes tienen menos de 680. Inscríbase pronto: el certificado suele hacer falta antes de que el prestamista pueda reservar los fondos.</p>
`,
  },
});
