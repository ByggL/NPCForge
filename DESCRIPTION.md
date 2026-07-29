# Natural language description — implementation plan

Turn a generated `GenerationContext` (flat `Map<string, string | number>`, ~50 keys of
English tokens) into a readable English portrait of the NPC.

## Decisions

| Question             | Decision                                                                          |
| -------------------- | --------------------------------------------------------------------------------- |
| Output language      | English (matches the option values, no translation layer)                         |
| Shape                | 4 short paragraphs: identity, appearance, personality, life                       |
| Coverage             | every generated attribute appears, except values treated as empty (see below)     |
| Pronouns             | `male` → he, `female` → she, everything else → they                               |
| Where wording lives  | in TypeScript clause builders, not in the option JSON                              |

Wording lives in code because the grammar is cross-attribute: hair colour + hair style
form one clause, eye shape + iris + sclera another, height + weight + build another.
A per-option phrase template cannot express that. The option JSON also keeps changing.

## Files

**`src/describe.ts`** (new) — pure, no I/O.

- `describe(gen: GenerationContext): string` — the only export used elsewhere. Returns
  the finished text, paragraphs separated by a blank line.
- Internal `PARAGRAPHS`: an ordered array of paragraphs, each an ordered array of clause
  builders with signature `(gen, subject) => string | null`.
- A builder reads only the keys it needs and returns `null` when they are absent or
  empty. Nulls are dropped, surviving clauses are assembled into sentences, and a
  paragraph with no surviving clause disappears entirely.
- `subject` carries the naming state: the full name on first mention, the pronoun
  afterwards, so builders never decide that themselves.

**`src/lexicon.ts`** (new) — the wording layer.

- `pronouns(gender)` → subject / object / possessive set, defaulting to they/them/their.
- `label(value)` → default rendering: kebab and snake case to spaced lowercase words.
- `LEXICON` → override map for values `label()` gets wrong: `beard_full` → "a full
  beard", `true-neutral` → "true neutral", `the-fox` → "the Fox", `hidden-lineage` → "a
  hidden lineage", `missing-tooth`, `burn-mark`, `merchant-class`, `high-pitched`, etc.
- `article(word)` → "a" / "an".
- `joinList(items)` → "a", "a and b", "a, b and c".

**`src/printer.ts`** — add `printDescription(gen)`, which only `console.log`s
`describe(gen)`. `printGen` stays untouched as the debug dump.

**`src/main.ts`** — call `printDescription(GENERATION_CONTEXT)` after `printGen`.

Keeping `describe` (pure string) apart from `printDescription` (console) is what makes
the output testable; vitest is already a devDependency.

## Clause plan

**1. Identity** — `firstName` `lastName`, `nickname` ("known as …"); `age` + `race` +
gender noun (man / woman / person) + `build`; `height` + `weight`; `beauty` +
`physicalStrength`.

**2. Appearance** — `hairColor` + `hairStyle` (with `bald` and `shaved` special-cased so
they do not take a colour); `eyeShape` + `irisColor` + `scleraColor`; `faceShape`,
`mouth`, `nose`, `ears`, `eyebrows`; `skinColor`; `facialHair`, `facialMarks`,
`distinctiveMarks`; `tattoos`, `piercings`, `makeup`; `voice`, `posture`.

**3. Personality** — `dominantTraits`, `qualities`, `flaws`; `temperament`,
`socialBehavior`; `intellect`, `specificKnowledge`; `alignment`, `religion`;
`mentalIssues`.

**4. Life** — `occupation`; `socialOrigin` + `socialStatus`; `birthplace` + `residence`;
`relationshipStatus` + `sexualOrientation`; `clothingStyle`, `eatingHabits`,
`lifeRhythm`, `hobbies`; `secrets` as the closing sentence.

## Empty values and edge cases

- `none` is treated as empty and skipped for `tattoos`, `piercings`, `makeup`,
  `facialHair`, `facialMarks`, `distinctiveMarks`, `mentalIssues`, `specificKnowledge`,
  `hobbies` and `secrets`.
- `occupation: "none"` is the exception: it is a real fact about the character's life,
  rendered as "without a trade" rather than skipped.
- A missing key is normal — the loader skips attributes that have no options file yet —
  so no builder may assume its key exists.
- An unknown value renders through `label()` rather than throwing, so new option values
  degrade to plain words instead of breaking generation.
- No gender → they/them. No name → the subject falls back to "This person" / the pronoun.
- **Assumption to confirm:** `height` is centimetres and `weight` kilograms; they are
  printed as "128 cm" and "50 kg". Nothing in the data states the unit.

## Tests (`src/describe.test.ts`)

1. Each clause builder in isolation, against small hand-built `Map`s.
2. A full realistic context, asserting the four paragraphs and pronoun agreement.
3. Empty and partial contexts: no crash, no stray punctuation, no empty paragraph.
4. Data-driven sweep: every value in `src/data/options/**/*.json` must render without
   leaking a raw token (no `-` or `_` surviving into the output) — this catches missing
   `LEXICON` entries as the data files fill up.

## Steps

1. `lexicon.ts` with `label`, `article`, `joinList`, `pronouns` + their tests.
2. `LEXICON` overrides, driven by the data sweep test.
3. `describe.ts`: paragraph and clause scaffolding, subject/pronoun handling, assembly
   and joining rules; one paragraph at a time, tests alongside.
4. `printDescription` in `printer.ts`, wired into `main.ts`.
5. Run generation a dozen times and read the output for grammar slips.
