/** Engine and data checks: figures read by eye in the official files and the agencies' own examples. */
import { describe, expect, it } from 'vitest';
import '../src/lib/states-server';
import { getState } from '../src/lib/states';
import { ami, evaluate, summarize, pmt, owedAtSale, mcc, programAmount, minDownPct, loanAmount, type Ctx } from '../src/lib/engine/dpa';
import { runTool, TOOL_KINDS } from '../src/lib/tool-specs';

const st = (s: string) => getState(s)!;
const county = (s: string, n: string) => st(s).counties.find((c) => c.n === n)!;
const ctx = (s: string, n: string, o: Partial<Ctx> = {}): Ctx => ({ county: county(s, n), size: 3, income: 85000, price: 300000, firstTime: true, credit: 680, loan: 'fha', rate: 7, ...o });

describe('federal files', () => {
  it('HUD FY2026 medians and 80% limits', () => {
    expect(county('TX', 'Harris County').m).toBe(104000);
    expect(county('CA', 'Los Angeles County').m).toBe(108100);
    expect(county('CA', 'Los Angeles County').l80[2]).toBe(119950);
    expect(county('NJ', 'Bergen County').m).toBe(139100);
  });
  it('FHA and FHFA 2026 limits', () => {
    expect(county('CA', 'Los Angeles County').fha).toBe(1249125);
    expect(county('CA', 'Los Angeles County').cll).toBe(1249125);
    expect(county('TX', 'Harris County').fha).toBe(541287);
    expect(county('TX', 'Harris County').cll).toBe(832750);
    expect(county('NJ', 'Bergen County').cll).toBe(1209750);
  });
  it('every state is there, with its counties', () => {
    for (const s of ['AL', 'AK', 'CA', 'DC', 'TX', 'WY']) expect(st(s).counties.length).toBeGreaterThan(0);
  });
});

describe('agency county tables', () => {
  it('Texas, Ohio, New Jersey rows read by eye', () => {
    expect(st('TX').countyLimits!.rows['Harris County']).toEqual({ i12: 104000, i3: 119600, price: 566354 });
    expect(st('OH').countyLimits!.rows['Franklin County']).toEqual({ i12: 111500, i3: 128225, price: 618475 });
    expect(st('NJ').countyLimits!.rows['Bergen County']).toEqual({ i12: 139100, i3: 159965, price: 1306975, amt: 15000 });
    expect(st('NJ').countyLimits!.rows['Camden County'].amt).toBe(10000);
  });
});

describe('engine', () => {
  it('HUD household-size factors', () => {
    const a = ami(county('TX', 'Harris County'), 3, 93600);
    expect(a.medianForSize).toBe(93600);
    expect(a.pct).toBeCloseTo(1, 5);
  });
  it('minimum down payment by loan type', () => {
    expect(minDownPct('fha', 600)).toBe(3.5);
    expect(minDownPct('fha', 560)).toBe(10);
    expect(minDownPct('conv')).toBe(3);
    expect(minDownPct('va')).toBe(0);
    expect(loanAmount(300000, 'fha')).toBe(289500);
  });
  it("MassHousing's own payment examples", () => {
    expect(pmt(25000, 2, 15)).toBeCloseTo(160.88, 2);
    // MassHousing prints $172.62 at 3%; the annuity gives $172.65 (their rounding of the rate): within 5 cents.
    expect(Math.abs(pmt(25000, 3, 15) - 172.62)).toBeLessThan(0.05);
  });
  it('program amounts', () => {
    const tx = st('TX');
    expect(programAmount(tx.programs.find((p) => p.id === 'tx-mfth')!, tx, ctx('TX', 'Harris County'))).toBe(14475);
    const ny = st('NY'), dpal = ny.programs.find((p) => p.id === 'ny-dpal')!;
    expect(programAmount(dpal, ny, ctx('NY', 'Kings County', { price: 80000 }))).toBe(3000);
    expect(programAmount(dpal, ny, ctx('NY', 'Kings County', { price: 400000 }))).toBe(12000);
    expect(programAmount(dpal, ny, ctx('NY', 'Kings County', { price: 900000 }))).toBe(15000);
    const il = st('IL');
    expect(programAmount(il.programs.find((p) => p.id === 'il-home')!, il, ctx('IL', 'Cook County', { price: 300000 }))).toBe(15000);
    expect(programAmount(il.programs.find((p) => p.id === 'il-home')!, il, ctx('IL', 'Cook County', { price: 200000 }))).toBe(12000);
    const nj = st('NJ');
    expect(programAmount(nj.programs.find((p) => p.id === 'nj-dpa')!, nj, ctx('NJ', 'Camden County'))).toBe(10000);
  });
  it('verdicts: income, first-time, credit, loan type, closed', () => {
    const tx = st('TX'), mfth = tx.programs.find((p) => p.id === 'tx-mfth')!;
    expect(evaluate(mfth, tx, ctx('TX', 'Harris County')).verdict).toBe('yes');
    expect(evaluate(mfth, tx, ctx('TX', 'Harris County', { income: 125000 })).reasons[0]).toEqual({ code: 'income', value: 119600 });
    expect(evaluate(mfth, tx, ctx('TX', 'Harris County', { size: 2, income: 110000 })).verdict).toBe('no');
    expect(evaluate(mfth, tx, ctx('TX', 'Harris County', { firstTime: false })).verdict).toBe('no');
    expect(evaluate(mfth, tx, ctx('TX', 'Harris County', { credit: 600 })).verdict).toBe('no');
    expect(evaluate(mfth, tx, ctx('TX', 'Harris County', { price: 600000 })).verdict).toBe('no');
    const nj = st('NJ'), njd = nj.programs.find((p) => p.id === 'nj-dpa')!;
    expect(evaluate(njd, nj, ctx('NJ', 'Bergen County', { loan: 'conv' })).verdict).toBe('no');
    const fl = st('FL');
    expect(evaluate(fl.programs.find((p) => p.id === 'fl-hth')!, fl, ctx('FL', 'Miami-Dade County')).verdict).toBe('closed');
  });
  it('stacking: New Jersey First Generation adds to the county amount', () => {
    const s = summarize(st('NJ'), ctx('NJ', 'Bergen County', { income: 100000, price: 400000 }));
    expect(s.best?.p.id).toBe('nj-dpa');
    expect(s.bestAmount).toBe(22000);
  });
  it('owed at sale', () => {
    expect(owedAtSale(10000, 'linear', 4, 10)).toBeCloseTo(6000, 6);
    expect(owedAtSale(10000, 'cliff', 4, 5)).toBe(10000);
    expect(owedAtSale(10000, 'cliff', 5, 5)).toBe(0);
    expect(owedAtSale(10000, 'deferred', 20, 30)).toBe(10000);
    expect(owedAtSale(10000, 'amortizing', 10, 10, 0)).toBe(0);
    expect(owedAtSale(12000, 'amortizing', 5, 10, 0)).toBeCloseTo(6000, 6);
  });
  it('mortgage credit certificate: 10% to 50%, $2,000 cap above 20%', () => {
    expect(mcc(400000, 7, 40).credit).toBe(2000);
    const r = mcc(200000, 7, 20);
    expect(r.capped).toBe(false);
    expect(r.credit).toBeCloseTo(r.interest * 0.2, 6);
  });
});

describe('calculators', () => {
  it('every calculator runs on its defaults in both languages', () => {
    for (const k of TOOL_KINDS) for (const l of ['en', 'es'] as const) {
      const o = runTool(k, l);
      expect(o.value, k).not.toMatch(/NaN|undefined|Infinity/);
      for (const r of o.rows) expect(r[1], `${k} ${r[0]}`).not.toMatch(/NaN|undefined|Infinity/);
    }
  });
  it('the main calculator reads the county', () => {
    const o = runTool('dpa', 'en', { st: 'TX', c: '48201', i: 85000, p: 300000, h: 3 });
    expect(o.value).toBe('$14,475');
  });
});
