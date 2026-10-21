/**
 * State data, isomorphic. Each state is one JSON chunk (src/data/states/<ST>.json, built by scripts/build-data.py).
 * The browser loads a chunk only when a calculator asks for that state; the page that renders a calculator sends
 * its starting state with it (Tool.astro, `preload`), so the first render and hydration see the same figures.
 * On the server every chunk is loaded once by states-server.ts.
 */
import NATIONAL from '../data/national.json';
import type { County, StateData } from './engine/dpa';

export interface StateRow { st: string; name: string; n: number; programs: number; agency: string | null; agencyUrl: string | null }
export const STATES = NATIONAL as StateRow[];
export const stateName = (st: string) => STATES.find((s) => s.st === st)?.name ?? st;

const cache = new Map<string, StateData>();
export const getState = (st: string) => cache.get(st);
export const putState = (d: StateData) => { if (!cache.has(d.st)) cache.set(d.st, d); };
const lazy = import.meta.glob<{ default: StateData }>('../data/states/*.json');
export async function loadState(st: string): Promise<StateData | undefined> {
  const hit = cache.get(st);
  if (hit) return hit;
  const f = lazy[`../data/states/${st}.json`];
  if (!f) return undefined;
  const m = await f();
  putState(m.default);
  return m.default;
}

/** Starting county of each state's calculator: its largest city. Other states start on their first county. */
export const DEFAULT_COUNTY: Record<string, string> = {
  TX: '48201', CA: '06037', FL: '12086', NY: '36047', GA: '13121', OH: '39049', NC: '37119', WA: '53033', VA: '51059',
  PA: '42101', IL: '17031', MI: '26163', CO: '08031', AZ: '04013', NJ: '34013', MD: '24510', MA: '2502507000', TN: '47037',
};
export const defaultCounty = (st: string) => DEFAULT_COUNTY[st] ?? getState(st)?.counties[0]?.id ?? '';
export const countyOf = (st: string, id: string): County | undefined => getState(st)?.counties.find((c) => c.id === id);
export const countyLabel = (c: County) => (c.cn ? `${c.n}, ${c.cn}` : c.n);
