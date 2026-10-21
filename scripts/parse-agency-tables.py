#!/usr/bin/env python3
"""Transcribe the county income and purchase price tables that state agencies publish as text PDFs into
research/programs/<ST>-counties.json (read by build-data.py). One function per agency, each checked against
three rows read by eye in the PDF (asserts below). Non-target areas only: a targeted census tract has higher
limits, which the site states in words.

  TX  TDHCA My First Texas Home / Texas MCC, research/raw/tx-limits.pdf, page 1 (effective July 13, 2026)
  OH  OHFA, research/raw/oh-limits.pdf, pages 2-3 (income) and 10 (price), effective July 1, 2026
"""
import json, os, re, sys
import pypdf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'research', 'raw')
OUT = os.path.join(ROOT, 'research', 'programs')


def text(pdf, pages):
    r = pypdf.PdfReader(os.path.join(RAW, pdf))
    return '\n'.join(r.pages[i].extract_text() or '' for i in pages)


def num(s):
    return int(re.sub(r'[^0-9]', '', s))


def tx():
    t = text('tx-limits.pdf', [0])
    t = t.replace('B\nlanco', 'Blanco').replace('At ascosa', 'Atascosa').replace('Fay ette', 'Fayette').replace('\nW\naller', ' Waller')
    rows = {}
    for line in t.split('\n'):
        if '$' not in line or 'Counties' in line or line.startswith('$'):
            continue
        k = line.index('$')
        prefix, tail = line[:k].strip(), line[k:]
        mm = list(re.finditer(r'\b(HMFA|MSA|County)\b', prefix))
        if not mm:
            continue
        counties = prefix[mm[-1].end():] if mm[-1].group(1) != 'County' else prefix[mm[0].end():]
        vals = []
        for tok in re.split(r'\$', tail)[1:]:
            tok = tok.strip()
            na = tok.endswith('N/A')
            digits = re.sub(r'[^0-9]', '', tok.replace('N/A', ''))
            vals.append(int(digits))
            if na:
                vals.append(None)
        i12, i3 = vals[0], vals[1]
        price = vals[4] if len(vals) >= 6 else vals[2]
        for c in re.split(r',|&', counties):
            c = c.replace('*', '').strip()
            if c:
                rows[f'{c} County'] = {'i12': i12, 'i3': i3, 'price': price}
    assert rows['Harris County'] == {'i12': 104000, 'i3': 119600, 'price': 566354}, rows.get('Harris County')
    assert rows['Travis County'] == {'i12': 134400, 'i3': 154560, 'price': 598019}, rows.get('Travis County')
    assert rows['Bexar County']['i12'] == 104725 and rows['Dallas County']['price'] == 589596
    return {
        'programs': ['tx-mfth', 'tx-mcc'],
        'title': 'TDHCA My First Texas Home and Texas Mortgage Credit Certificate, non-targeted areas',
        'effective': '2026-07-13', 'url': 'https://welcomehome.tdhca.texas.gov/uploads/Limits.pdf',
        'default': {'i12': 101500, 'i3': 116725, 'price': 566354}, 'rows': rows,
    }


def oh():
    t = text('oh-limits.pdf', [1, 2])
    rows = {}
    for c, a, b in re.findall(r'\n([A-Z][A-Za-z]+) \$([\d,]+) \$([\d,]+)', t):
        name = 'Van Wert' if c == 'VanWert' else c
        rows[f'{name} County'] = {'i12': num(a), 'i3': num(b)}
    p = text('oh-limits.pdf', [9])
    columbus = re.search(r'Columbus\s+Counties: (.*?)1-Family', p, re.S).group(1)
    col = [c.strip() for c in re.split(r',', columbus.replace('\n', ' ')) if c.strip()]
    nt = re.findall(r'Non-Target \$([\d,]+)', p)
    other_price, col_price = num(nt[-1]), num(nt[3])
    for c, v in rows.items():
        v['price'] = col_price if c.replace(' County', '') in col else other_price
    assert len(rows) == 88, len(rows)
    assert rows['Franklin County'] == {'i12': 111500, 'i3': 128225, 'price': 618475}, rows['Franklin County']
    assert rows['Cuyahoga County'] == {'i12': 105000, 'i3': 120750, 'price': 566355}
    assert rows['Union County']['i3'] == 168705
    return {
        'programs': ['oh-dpa', 'oh-mtc'],
        'title': 'OHFA maximum non-target income limits (government, conventional, MTC) and purchase price limits',
        'effective': '2026-07-01', 'url': 'https://myohiohome.org/documents/IncomePurchasePriceLimits.pdf',
        'default': None, 'rows': rows,
    }


for st, fn in {'TX': tx, 'OH': oh}.items():
    d = fn()
    json.dump(d, open(os.path.join(OUT, f'{st}-counties.json'), 'w'), indent=1, ensure_ascii=False)
    print(st, len(d['rows']), 'rows')
