/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P                    params-2026.json (HUD, FHFA, FHA, MCC rules, sources)
 *   K.RATES                rates.json (Freddie Mac PMMS, written by scripts/update-data.py)
 *   K.state(st)            a state's chunk: counties (HUD median, 80% limits, FHA and conforming limits), programs
 *   K.county(st, name)     one county by name ("Harris County") or id
 *   K.prog(id)             one program, from any state
 *   K.ami, K.summarize, K.evaluate, K.pmt, K.owedAtSale, K.mcc, K.minDownPct, K.loanAmount   (engine/dpa.ts)
 *   K.tool(kind, lang, values)   runs a calculator and returns its result card
 *   K.en / K.es            formats of the language: m (amount), p (share), n (number), r (rate), day (date)
 */
import P from '../data/params-2026.json';
import RATES from '../data/rates.json';
import { stateData } from './states-server';
import { STATES, stateName, defaultCounty, countyLabel } from './states';
import * as E from './engine/dpa';
import { runTool } from './tool-specs';
import { formatMoney, formatNumber, formatPercent, formatDecimal, displayDate, type Lang } from './format';

const fmt = (l: Lang) => ({
  m: (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0, l)}`,
  p: (x: number, d = 0) => formatPercent(x, d, l),
  n: (x: number, d = 0) => formatNumber(x, d, l),
  r: (x: number) => `${formatDecimal(x, 2, l)}${l === 'es' ? ' ' : ''}%`,
  day: (iso: string) => displayDate(iso, l === 'es' ? 'es-US' : 'en-US'),
});
function county(st: string, key: string) {
  const d = stateData(st);
  const c = d.counties.find((x) => x.id === key || x.n === key);
  if (!c) throw new Error(`Unknown county ${st} ${key}`);
  return c;
}
function prog(id: string) {
  for (const s of STATES) { const p = stateData(s.st).programs.find((x) => x.id === id); if (p) return p; }
  throw new Error(`Unknown program ${id}`);
}
export const KIT = {
  P, RATES, STATES, state: stateData, stateName, county, countyLabel, defaultCounty, prog,
  ...E, tool: runTool,
  en: fmt('en'), es: fmt('es'), fmt,
};
export type Kit = typeof KIT;
