#!/usr/bin/env python3
"""Rebuild src/data/states/<ST>.json and src/data/national.json from the official files kept in research/raw.

Sources (all US federal works, public domain):
  research/raw/Section8-FY26.xlsx   HUD FY2026 income limits by county / New England town (huduser.gov, effective 2026-05-01... see params)
  research/raw/fhfa2026.csv         FHFA 2026 conforming loan limits by county (fhfa.gov)
  research/raw/fha2026.txt          HUD CY2026 FHA forward mortgage limits by county (hud.gov/pub/chums)
State program facts: research/programs/<ST>.json (read by hand on each agency's own pages, see CONTRIBUTING-DONNEES.md);
county tables of a state agency: research/programs/<ST>-counties.json when we transcribed one.

Usage: python3 scripts/build-data.py   (no network)
"""
import csv, json, os, re, glob
import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'research', 'raw')
OUT = os.path.join(ROOT, 'src', 'data', 'states')
os.makedirs(OUT, exist_ok=True)

STATES = {
 'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut',
 'DE': 'Delaware', 'DC': 'District of Columbia', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois',
 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana',
 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania',
 'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
}


def money(s):
    s = re.sub(r'[^0-9]', '', str(s))
    return int(s) if s else None


# FHFA conforming limit (1 unit) by state+county FIPS
cll = {}
cll_name = {}
with open(os.path.join(RAW, 'fhfa2026.csv'), encoding='utf-8-sig') as f:
    r = csv.reader(f)
    next(r)
    for row in r:
        if len(row) < 6 or not row[0].strip():
            continue
        cll[row[0].zfill(2) + row[1].zfill(3)] = money(row[5])
        cll_name[(row[3], row[2].upper())] = money(row[5])

# FHA forward limit (1 unit) by state abbr + county FIPS (fixed-width file, layout checked on Los Angeles and Aleutians East)
fha = {}
fha_name = {}
for line in open(os.path.join(RAW, 'fha2026.txt'), encoding='latin-1'):
    if len(line) < 110 or not line[101:103].strip():
        continue
    st, cty, one = line[101:103], line[103:106], line[73:80]
    if one.isdigit():
        fha[st + cty] = int(one)
        fha_name[(st, line[132:147].strip())] = int(one)

# HUD income limits FY2026
wb = openpyxl.load_workbook(os.path.join(RAW, 'Section8-FY26.xlsx'), read_only=True)
ws = wb['Section8-FY26']
rows = ws.iter_rows(values_only=True)
head = next(rows)
ix = {h: i for i, h in enumerate(head)}
by_state = {k: [] for k in STATES}
for row in rows:
    if not row or not row[ix['fips']]:
        continue
    st = row[ix['stusps']]
    if st not in by_state:
        continue
    fips10 = str(row[ix['fips']])
    county5 = fips10[:5]
    name = row[ix['county_town_name']] or row[ix['County_Name']]
    town = fips10[5:] != '99999'
    l80 = [row[ix[f'l80_{k}']] for k in range(1, 9)]
    by_state[st].append({
        'id': fips10 if town else county5,
        'n': name.strip(),
        'cn': (row[ix['County_Name']] or '').strip() if town else None,
        'a': (row[ix['hud_area_name']] or '').strip(),
        'm': int(row[ix['median2026']]),
        'l80': [int(x) for x in l80],
        # HUD splits a few counties into parts with their own code (Sullivan part, MO): fall back on the county name.
        'cll': cll.get(county5) or cll_name.get((st, re.sub(r' part$', '', (row[ix['County_Name']] or '').strip()).upper())),
        'fha': fha.get(st + county5[2:]) or fha_name.get((st, re.sub(r' part$', '', (row[ix['County_Name']] or '').strip()).upper()[:15])),
        'metro': int(row[ix['metro']] or 0),
    })

# State program files
progs = {}
for f in glob.glob(os.path.join(ROOT, 'research', 'programs', '*.json')):
    b = os.path.basename(f)[:-5]
    if b in STATES:
        progs[b] = json.load(open(f))
county_tables = {}
for f in glob.glob(os.path.join(ROOT, 'research', 'programs', '*-counties.json')):
    county_tables[os.path.basename(f)[:2]] = json.load(open(f))

national = []
missing_cll = 0
for st, name in STATES.items():
    cs = sorted(by_state[st], key=lambda c: c['n'])
    for c in cs:
        if c['cll'] is None:
            missing_cll += 1
        if c['cn'] is None:
            del c['cn']
    p = progs.get(st)
    data = {'st': st, 'name': name, 'counties': cs, 'agency': p and {k: p[k] for k in ('agency', 'agencyUrl')},
            'programs': (p or {}).get('programs', []), 'local': (p or {}).get('local', []),
            'countyLimits': county_tables.get(st)}
    json.dump(data, open(os.path.join(OUT, f'{st}.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    big = max(cs, key=lambda c: c['m']) if cs else None
    national.append({'st': st, 'name': name, 'n': len(cs), 'programs': len(data['programs']),
                     'agency': p and p['agency'], 'agencyUrl': p and p['agencyUrl']})

json.dump(national, open(os.path.join(ROOT, 'src', 'data', 'national.json'), 'w'), ensure_ascii=False, indent=1)

# Sources of each state page: the agency home page and each program's own page or guide (proper nouns, same label
# in both languages).
srcs = {}
for st, p in sorted(progs.items()):
    srcs[f'agency-{st}'] = {'url': p['agencyUrl'], 'label': {'en': p['agency'], 'es': p['agency']}}
    for g in p['programs']:
        lab = g.get('sourceTitle') or g['name']
        srcs[f"prog-{g['id']}"] = {'url': g['sourceUrl'], 'label': {'en': lab, 'es': lab}}
    t = county_tables.get(st)
    if t:
        srcs[f'limits-{st}'] = {'url': t['url'], 'label': {'en': t['title'], 'es': t['title']}}
json.dump(srcs, open(os.path.join(ROOT, 'src', 'data', 'program-sources.json'), 'w'), ensure_ascii=False, indent=1)
print(f"{sum(len(v) for v in by_state.values())} HUD areas · {missing_cll} without FHFA limit · {len(progs)} states with programs")
