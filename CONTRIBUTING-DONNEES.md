# Mettre à jour les données

Tout chiffre affiché vient de `src/data/` ; rien n'est saisi dans les pages.

| Fichier | Contenu | Source | Rythme |
|---|---|---|---|
| `src/data/rates.json`, `research/raw/pmms.csv` | taux moyen 30 et 15 ans | Freddie Mac PMMS (domaine public) | chaque jeudi, `scripts/update-data.py` |
| `research/raw/Section8-FY26.xlsx` | revenu médian HUD et limites 80 % par comté ou ville | HUD Income Limits FY 2026 (œuvre du gouvernement fédéral) | chaque printemps |
| `research/raw/fhfa2026.csv` | plafonds de prêt conformes | FHFA Conforming Loan Limits 2026 | chaque novembre ou décembre |
| `research/raw/fha2026.txt` | plafonds FHA par comté | HUD FHA Mortgage Limits, Mortgagee Letter 2025-23 | chaque décembre |
| `research/programs/<ST>.json` | programmes des 18 agences d'État : montant, forme, remboursement, plafonds, crédit minimum, statut, citation, URL | pages officielles des agences, lues le 2026-10-21 | à relire tous les trimestres et à chaque annonce |
| `research/programs/<ST>-counties.json` | tableaux par comté de l'agence (TX, OH, NJ) | PDF des agences (`scripts/parse-agency-tables.py`) | à chaque nouvelle table |
| `src/data/params-2026.json` | règles fédérales (facteurs de taille HUD, FHA 3.5 % / 580, conventionnel 3 %, MCC) et sources | HUD, FHFA, IRS (formulaire 8396), Freddie Mac | chaque année |

## Commandes

```
python3 scripts/update-data.py            # PMMS de la semaine → rates.json
python3 scripts/update-data.py --yearly   # cherche les fichiers HUD / FHFA / FHA de l'année suivante
python3 scripts/build-data.py             # reconstruit src/data/states/*.json, national.json, program-sources.json
npx vitest run && npm run check
```

Le workflow `.github/workflows/deploy.yml` lance la mise à jour chaque jeudi (cron `30 22 * * 4`), reconstruit,
teste, recommite les données et redéploie.

## Règles

- Un programme n'est ajouté que lu sur la page officielle de l'agence, avec `sourceUrl`, la citation et la date.
  Si le site refuse les scripts, on le dit dans `note` ; un chiffre non vérifié n'est pas publié.
- Statut fermé ou fonds épuisés : `status` le dit en toutes lettres ; le calculateur affiche « fermé ».
- Changement d'année : renommer les fichiers bruts, mettre à jour `params-2026.json` (dates d'effet) et relancer
  `build-data.py` ; les pages se mettent à jour seules.
