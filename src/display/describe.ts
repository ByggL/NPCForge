import { GenerationContext } from "../generate";
import { Pronouns, pronouns } from "./lexicon";

function none(val: string) {
  return val === "none" ? true : false;
}

export function describe(CTX: GenerationContext) {
  const pronoun: Pronouns = pronouns(CTX);

  const introduction = (CTX: GenerationContext) => {
    const firstname = CTX.get("firstName");
    const lastname = CTX.get("lastName");
    const nickname = CTX.get("nickname") as string;
    const gender = CTX.get("gender");
    const age = CTX.get("age");

    return `${firstname} ${lastname} ${!none(nickname) ? `, nicknamed ${nickname}, ` : ""} is a ${age} ${gender}.`;
  };
}
