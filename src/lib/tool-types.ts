/** Declarative calculators (src/lib/tool-specs.ts), rendered by components/calc/SpecTool.tsx. */
export type V = Record<string, number | string>;
export interface NumIn { kind?: 'num'; id: string; label: string; def: number; unit?: string; max?: number; decimals?: number; help?: string; adv?: boolean; wide?: boolean }
export interface ChoiceIn { kind: 'choice'; id: string; label: string; def: string; options: Array<{ value: string; label: string }>; help?: string; adv?: boolean; wide?: boolean }
export type Opt = { value: string; label: string };
/** Options can depend on the other fields (the counties of the chosen state). */
export interface SelectIn { kind: 'select'; id: string; label: string; def: string; options: Opt[] | ((v: V) => Opt[]); help?: string; adv?: boolean; wide?: boolean; /** value to take when the stored one is not offered (the largest county of a newly chosen state) */ fallback?: (v: V) => string }
export type Input = NumIn | ChoiceIn | SelectIn;
export interface ToolOut {
  label: string; value: string; sub?: string;
  rows: Array<[string, string, number?]>;
  table?: { caption?: string; headers: string[]; rows: string[][]; align?: Array<'l' | 'r'> };
  note?: string;
}
export interface ToolSpec {
  inputs: Input[]; run: (v: V) => ToolOut;
  /** State whose data chunk the calculator needs for these values (src/lib/states.ts loads it). */
  needs?: (v: V) => string | undefined;
}
/** The options of a select for the current values, and the value actually in force (the first option
 *  when the stored one is not offered, e.g. a county of the previous state). */
export const optsOf = (i: SelectIn, v: V): Opt[] => (typeof i.options === 'function' ? i.options(v) : i.options);
export function resolve(inputs: Input[], v: V): V {
  const out: V = { ...v };
  // An empty list means the data is still loading: the stored value is kept until it arrives.
  for (const i of inputs) if (i.kind === 'select') { const o = optsOf(i, out); if (o.length && !o.some((x) => x.value === String(out[i.id]))) { const f = i.fallback?.(out); out[i.id] = f && o.some((x) => x.value === f) ? f : o[0].value; } }
  return out;
}
