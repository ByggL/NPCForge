# Attribute files for NPCForge — design

## Goal

Author one JSON attribute file per NPC attribute listed in `ATTRIBUTES.md`, into
`src/data/attributes/`, so the data-driven generator has a complete attribute set to
work from.

## Scope

- **In scope:** the attribute files only (`key`, `dependsOn`, `options`, `rules`).
- **Out of scope:** the option files (`src/data/options/*.json`). The user authors those
  and their own specialised rules.

## Conventions

- **Keys:** English `camelCase`, consistent with existing `race` / `gender` / `facialHair`.
- **Flattening:** the generator only accepts flat keys, so nested groups in `ATTRIBUTES.md`
  are flattened:
  - `visage` → `faceShape`, `mouth`, `nose`, `ears`, `eyebrows`, `facialMarks`
  - `yeux` → `eyeShape`, `irisColor`, `scleraColor`
  - `chevelure` → `hairStyle`
  - the two "signes particuliers" → `facialMarks` (on the face) and `distinctiveMarks` (general)
- **Options:** every attribute uses `"options": ["default"]` (option files are the user's job).
- **Rules:** minimal, generic starter rules only. A rule may only reference attributes that
  are in the same attribute's `dependsOn` (so generation order makes the condition
  deterministic). Effect values use English-lowercase placeholders (`none`, `single`, …)
  consistent with existing option data; the user aligns them with real option values later.

## Dependency graph (acyclic, arrows = dependsOn → earlier layers)

- **Layer 0 (roots):** `race`, `alignment`, `temperament`, `intellect`, `socialOrigin`,
  `sexualOrientation`, `secrets`
- **Layer 1:** `age`←race; `gender`/`religion`/`birthplace`/`lastName`/`skinColor`/
  `faceShape`/`mouth`/`nose`/`eyeShape`/`irisColor`/`scleraColor`/`ears`←race;
  `dominantTraits`/`qualities`/`flaws`←alignment; `socialBehavior`←temperament,alignment
- **Layer 2:** `hairColor`←race,age; `socialStatus`←socialOrigin,age;
  `mentalIssues`/`relationshipStatus`/`beauty`/`facialMarks`/`distinctiveMarks`←age;
  `build`/`height`←race,gender,age; `voice`←gender,age
- **Layer 3:** `firstName`←gender,race,socialStatus; `makeup`←gender,socialStatus;
  `tattoos`←age,gender,socialStatus; `piercings`←gender,socialOrigin,socialStatus;
  `facialHair`←gender,race,age,socialStatus; `hairStyle`←gender,hairColor,age,socialStatus;
  `nickname`←dominantTraits,socialStatus; `eyebrows`←hairColor,gender;
  `occupation`←age,gender,socialStatus; `eatingHabits`/`hobbies`←socialStatus;
  `physicalStrength`←gender,age,build
- **Layer 4:** `weight`←build,height; `clothingStyle`←socialStatus,gender,occupation;
  `residence`←occupation,socialStatus; `lifeRhythm`/`specificKnowledge`←occupation;
  `posture`←age,physicalStrength

52 attributes total.

## Starter rules included

- `facialHair` (kept from existing): `gender=female`→`none`, `age<16`→`none`,
  `race=orc`→reweight `beard_full`/`stubble`
- `gender` (kept from existing): `culture=concilian`→reweight `female`/`double-body`
- `age<16`→`none` on `tattoos`; `age<14`→`none` on `occupation`;
  `age<6`→`none` on `mentalIssues`; `age<16`→`single` on `relationshipStatus`;
  `age>60`→reweight `grey`/`white` on `hairColor`

All other attributes ship with `"rules": []`.

## Existing files

`race.json`, `gender.json`, `facialHair.json` are regenerated to match the set. `facialHair`
gains `age` and `socialStatus` in `dependsOn` (its `age<16` rule needs `age` generated first).

## Validation

A standalone script reads every generated file, asserts every `dependsOn` target exists,
and runs cycle detection + topological sort to confirm the graph is acyclic and orderable.
