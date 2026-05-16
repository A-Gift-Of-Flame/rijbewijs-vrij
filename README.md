# Rijbewijs Vrij 🚦

**Free, open-source Belgian driver's license theory preparation — no account, no ads, no cost.**

> *Rijbewijs Vrij* = "Free License" (NL) · *Permis Libre* (FR) · *Freier Führerschein* (DE)

---

## What is this?

A fully free web application that helps you study for and pass the **Belgian Category B theoretical driving exam**. It covers all required knowledge domains and lets you practice with realistic exam simulations — completely in the open, forever.

Commercial prep platforms charge €20–€50 for what should be public knowledge. This project fixes that.

---

## Features

- **Study mode** — learn traffic signs, right-of-way rules, road markings, safe distances, alcohol/drug limits, and all other exam topics
- **Practice tests** — randomized question sets drawn from the full knowledge base
- **Exam simulation** — timed 50-question mock exams matching the official GOCA format (pass mark: 41/50)
- **Instant explanations** — every wrong answer shows the rule behind it, with legal references
- **Progress tracking** — local storage only, no account required
- **Trilingual** — Dutch · French · German (switch at any time)
- **Offline capable** — works as a PWA after first load

---

## Tech stack

> Not finalized — contributions welcome before we commit.

| Layer | Candidate |
|---|---|
| Frontend | SvelteKit or Next.js |
| Data | JSON question bank (community-maintained) |
| Hosting | Vercel / Netlify (free tier) |
| i18n | Paraglide or i18next |

---

## Question bank

Questions are stored as structured JSON with multilingual text, correct answer(s), explanation, and topic tag. The bank is the heart of the project and the part most needing community contribution.

Format (draft):

```json
{
  "id": "B-0042",
  "topic": "right_of_way",
  "image": "signs/B15.svg",
  "question": {
    "nl": "Wie heeft voorrang?",
    "fr": "Qui a la priorité ?",
    "de": "Wer hat Vorfahrt?"
  },
  "options": {
    "nl": ["Ik", "De fietser rechts", "De auto links"],
    "fr": ["Moi", "Le cycliste à droite", "La voiture à gauche"],
    "de": ["Ich", "Der Radfahrer rechts", "Das Auto links"]
  },
  "correct": 1,
  "explanation": {
    "nl": "Rechts heeft altijd voorrang, tenzij anders aangegeven. (Wegcode art. 12)",
    "fr": "La priorité de droite s'applique toujours sauf indication contraire. (Code de la route art. 12)",
    "de": "Rechts hat immer Vorfahrt, sofern nicht anders angegeben. (Straßenverkehrsordnung Art. 12)"
  },
  "legal_ref": "Wegcode art. 12 / Code de la route art. 12"
}
```

---

## Official exam topics covered

Based on the [GOCA](https://www.goca.be) exam framework:

- [ ] Traffic signs (warning, obligation, prohibition, information)
- [ ] Road markings and signals
- [ ] Right-of-way rules
- [ ] Speed limits and following distances
- [ ] Alcohol, drugs, and medication rules
- [ ] Motorway and urban driving rules
- [ ] Vulnerable road users (cyclists, pedestrians)
- [ ] Vehicle safety and documentation
- [ ] Environmental rules (LEZ, emissions)
- [ ] First aid obligations

---

## Contributing

All contributions welcome — especially:

1. **Question bank** — translate, verify, add missing questions
2. **Traffic sign SVGs** — clean, licensed vector assets
3. **Frontend** — UI/UX, accessibility, mobile
4. **Legal review** — flag outdated references after Wegcode changes

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Legal

Questions and answers are derived from publicly available Belgian traffic law (*Wegcode / Code de la route*). Traffic sign images are standardized under EU/Belgian law and are not copyrightable as such.

This project is **not affiliated with GOCA, the Belgian government, or any commercial driving school.**

---

## License

[AGPL-3.0](LICENSE) — free forever, modifications must stay open.
