# Écrire ou modifier une page

Une page = UN fichier `src/content/guides/<id>.ts` (`defineGuide`), version anglaise (`en`) et espagnole (`es`)
côte à côte. Routes, menus, pied de page, sitemap, hreflang, schémas et liens internes lisent ces fichiers et rien
d'autre. Pages prévues : `src/lib/planned.ts` (10 pages de sujet, 18 pages d'État). Modèles :
`src/content/guides/income-limits.ts` (sujet) et `src/content/guides/tx.ts` (État).

## Règles

- **Aucun chiffre tapé à la main.** Tout montant, limite, taux ou date vient de la trousse `KIT as K`
  (`src/lib/kit.ts`) : `K.P` (HUD, FHFA, FHA, MCC), `K.RATES` (Freddie Mac PMMS), `K.state(st)` (comtés et
  programmes), `K.county(st, nom)`, `K.prog(id)`, `K.ami`, `K.summarize`, `K.owedAtSale`, `K.mcc`, `K.pmt`,
  `K.tool(kind, langue, valeurs)` ; formats `K.en` / `K.es` (`m`, `p`, `n`, `r`, `day`).
- Pièces communes, rendues en TABLEAUX (`src/content/guides/_shared.ts`) : `progTable`, `stateProgTable`,
  `countyTable`, `agencyLimitsTable`, `example`, `exampleTable`.
- Dans `body(h)` : `h.a(id, texte)` lien interne, `h.ext(url, texte)`, `h.table(...)`, `h.mini(kind, { p, d, t })`
  (au moins un mini-simulateur par page), `h.t(en, es)`, `h.m`, `h.p`, `h.n`, `h.r`, `h.day`.
- Un fait sur un programme n'entre dans une page que s'il est dans `research/programs/<ST>.json` avec son URL
  officielle ; une source bloquée est dite comme telle (champ `note`).
- Titre 50 à 60 caractères, terme clé d'abord, « 2026 » compris, jamais en tête une question, « US » ou un mot
  d'outil. Description 150 à 160 caractères avec « 2026 ».
- `resume` : UN paragraphe de 120 mots ou plus, la réponse directe et chiffrée.
- Corps : 320 mots de prose ou plus, tableaux à part. FAQ : 3 à 5 questions (6 à 8 sur l'accueil), réponses de
  40 à 90 mots, aucune question répétée sur le site. Aucun tiret long ni demi-cadratin, aucune tournure listée
  dans `tests/pages.test.ts`. Espagnol des États-Unis : point décimal (« 3.5 % »), « $7,000 ».
- Jamais se présenter comme HUD, FHA, une agence ou un prêteur ; aucun formulaire de contact, aucun lien
  d'affiliation, aucun lien vers un autre site du portefeuille.
- Deux pages ne se ressemblent jamais à plus de 30 % (`check-unique.py`).

## Vérifier

```
PAGE_FILES=tx,ca npx vitest run tests/pages.test.ts
```

puis `npm run check` (build et tous les contrôles).
