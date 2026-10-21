#!/usr/bin/env python3
"""Refresh the data that changes on its own (run by .github/workflows/update-data.yml, every Thursday evening).

  weekly   Freddie Mac PMMS history  -> src/data/rates.json (30-year and 15-year fixed, week of the survey)
  yearly   HUD income limits, FHFA conforming limits, FHA limits for the next year: when the file for the
           next fiscal / calendar year answers, it is downloaded to research/raw and build-data.py is rerun.
           The site keeps the files it has until then, and every page shows the year of the limits it uses.

State program terms are NOT scraped: they are read by a person on each agency's own page (CONTRIBUTING-DONNEES.md).

A source that answers with an outage page or with something that does not parse leaves the previous file in place
and the script exits 0: the pages keep showing the date of the last figure actually read.

Usage: python3 scripts/update-data.py [--yearly]
"""
import csv, io, json, os, subprocess, sys, urllib.request
from datetime import date, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src', 'data')
RAW = os.path.join(ROOT, 'research', 'raw')
UA = 'Mozilla/5.0 (compatible; data refresh; +https://github.com/)'


def get(url, timeout=60):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def pmms():
    try:
        raw = get('https://www.freddiemac.com/pmms/docs/PMMS_history.csv').decode('utf-8-sig')
        rows = [r for r in csv.DictReader(io.StringIO(raw)) if r.get('pmms30')]
        last = rows[-1]
        d = datetime.strptime(last['date'], '%m/%d/%Y').date()
        r30, r15 = float(last['pmms30']), float(last['pmms15'])
        assert 1 < r30 < 20 and 1 < r15 < 20 and (date.today() - d).days < 40, (d, r30, r15)
    except Exception as e:  # keep the previous file
        print('PMMS: kept previous file:', e)
        return False
    with open(os.path.join(RAW, 'pmms.csv'), 'w') as f:
        f.write(raw)
    out = {'date': d.isoformat(), 'r30': r30, 'r15': r15, 'read': date.today().isoformat()}
    json.dump(out, open(os.path.join(DATA, 'rates.json'), 'w'), indent=1)
    print('PMMS:', out)
    return True


def yearly():
    """Next year's federal limit files, when published (HUD in spring, FHFA and FHA in late November)."""
    y = date.today().year + (1 if date.today().month >= 11 else 0)
    files = {
        f'Section8-FY{y % 100}.xlsx': f'https://www.huduser.gov/portal/datasets/il/il{y % 100}/Section8-FY{y % 100}.xlsx',
        f'fhfa{y}.csv': f'https://www.fhfa.gov/document/d/cll/fullcountyloanlimitlist{y}_hera-based_final_flat.csv',
        f'fha{y}.txt': f'https://www.hud.gov/pub/chums/cy{y}-forward-limits.txt',
    }
    found = []
    for name, url in files.items():
        if os.path.exists(os.path.join(RAW, name)):
            continue
        try:
            b = get(url, 120)
            if len(b) < 50_000 or b[:15].lower().startswith((b'<!doctype', b'<html')):
                raise ValueError('not a data file')
            open(os.path.join(RAW, name), 'wb').write(b)
            found.append(name)
        except Exception as e:
            print(f'{name}: not published yet ({e})')
    if found:
        print('New federal files:', found, '- update the file names in build-data.py and params-<year>.json, then rebuild.')


if __name__ == '__main__':
    changed = pmms()
    if '--yearly' in sys.argv:
        yearly()
    sys.exit(0)
