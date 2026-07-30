import { GenerationContext } from "../generate";

export type Pronouns = {
  pers: "he" | "she" | "they";
  obj: "him" | "her" | "them";
  poss: "his" | "her" | "their";
};

const MASCULINE_PRONOUNS: Pronouns = {
  pers: "he",
  obj: "him",
  poss: "his",
};

const FEMININE_PRONOUNS: Pronouns = {
  pers: "she",
  obj: "her",
  poss: "her",
};

const NEUTRAL_PRONOUNS: Pronouns = {
  pers: "they",
  obj: "them",
  poss: "their",
};

export function pronouns(CTX: GenerationContext): Pronouns {
  const gender = CTX.get("gender");

  if (gender === "male") return MASCULINE_PRONOUNS;

  if (gender === "female") return FEMININE_PRONOUNS;

  return NEUTRAL_PRONOUNS;
}

const capitalize = <T extends string>(s: T) => (s[0].toUpperCase() + s.slice(1)) as string;
const isVowel = (x: string) => {
  return /[aeiouAEIOU]/.test(x);
};

export function label(value: string | number): string {
  if (typeof value === "number") return value.toString();

  return capitalize(value).replace(/[-_]/g, " ");
}

export function article(word: string) {
  return isVowel(word.charAt(0)) ? "an" : "a";
}

export function joinList(list: string[]) {
  if (list.length === 1) return list[0];

  return list[0] + list.slice(1, -1).reduce((acc, word) => (acc += `, ${word}`)) + " and " + list[1];
}
