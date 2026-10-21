/** Server and tests only: every state chunk, loaded once into the shared cache. Never import from a .tsx island. */
import type { StateData } from './engine/dpa';
import { putState, getState } from './states';
const all = import.meta.glob<{ default: StateData }>('../data/states/*.json', { eager: true });
for (const m of Object.values(all)) putState(m.default);
export const stateData = (st: string): StateData => { const d = getState(st); if (!d) throw new Error(`Unknown state ${st}`); return d; };

import { getTool, type Args } from './tool-specs';
import type { Lang } from './format';
/** The state chunk a calculator starts on, serialized for its island (`preload`), or undefined. */
export function preloadFor(kind: string, lang: Lang, arg?: Args): string | undefined {
  const spec = getTool(kind, lang, arg);
  if (!spec.needs) return undefined;
  const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]));
  const st = spec.needs(v);
  return st ? JSON.stringify(stateData(st)) : undefined;
}
