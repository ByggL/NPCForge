import { GenerationContext } from "./generate";

type Pronouns = {
  personal: "he" | "she" | "they";
  object: "him" | "her" | "them";
  possessive: "his" | "her" | "their";
};

const MASCULINE_PRONOUNS: Pronouns = {
  personal: "he",
  object: "him",
  possessive: "his",
};

const FEMININE_PRONOUNS: Pronouns = {
  personal: "she",
  object: "her",
  possessive: "her",
};

const NEUTRAL_PRONOUNS: Pronouns = {
  personal: "they",
  object: "them",
  possessive: "their",
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
