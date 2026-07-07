import { AttributeWithOptions } from "./attribute";
import { pickRandomOption } from "./random";
import { Condition, OptionValue } from "./schemas/attribute.schema";

export type GenerationContext = Map<string, OptionValue>;

export function generateAttribute(attribute: AttributeWithOptions, CTX: GenerationContext) {
  // for root attributes or simple attributes without rules, directly pick random option
  if (attribute.dependsOn.length === 0 || attribute.rules.length === 0) {
    CTX.set(attribute.key, pickRandomOption(attribute.optionsValues));
    return;
  }

  // else resolve rules before picking
  CTX.set(attribute.key, resolveRules(attribute, CTX));
}

function matchesCondition(conditions: Condition, CTX: GenerationContext): boolean {
  return Object.entries(conditions).every(([attr, expected]) => {
    const actual = CTX.get(attr as string);

    if (typeof expected === "object" && expected !== null && typeof actual === "number") {
      if ("lt" in expected && !(actual < expected.lt!)) return false;
      if ("gt" in expected && !(actual > expected.gt!)) return false;
      if ("in" in expected && !expected.in!.includes(actual)) return false;
      return true;
    }

    return actual === expected;
  });
}

function resolveRules(attribute: AttributeWithOptions, CTX: GenerationContext): string | number {
  let options = structuredClone(attribute.optionsValues);

  for (const rule of attribute.rules) {
    if (!matchesCondition(rule.when, CTX)) continue;

    switch (rule.effect.type) {
      case "override":
        return rule.effect.value; // immediately return override value
      case "reweight":
        for (const opt of options) {
          const factor = rule.effect.multiply[opt.value];
          if (factor) opt.weight ? (opt.weight *= factor) : (opt.weight = factor * 10); // apply new weight if none exist, 10 is the base value
        }
        break;
      case "add_options":
        options.push(...rule.effect.options);
        break;
      case "remove_options":
        const toRemove = rule.effect.options;
        options = options.filter((option) => !toRemove.find((rem) => rem.value == option.value));
        break;
      case "use_pools":
        const pools = rule.effect.pools;
        // if (pools.every((pool) => !pool.weight)) {
        const poolNames = pools.map((pool) => pool.pool);
        options = options.filter((option) => poolNames.some((pool) => option.pools?.includes(pool)));
        // }
        //////////// TODO : IMPLEMENT WEIGHTED POOL ADD LATER
        // else {
        //   for (const opt of options) {
        //     const poolNames = pools.map((pool) => pool.pool);
        //     const hasPool = poolNames.some((pool) => opt.pools?.includes(pool));
        //     const factor = rule.effect.multiply[opt.value];
        //     if (factor) opt.weight ? (opt.weight *= factor) : (opt.weight = factor * 10); // apply new weight if none exist, 10 is the base value
        //   }
        // }
        break;
    }
  }

  return pickRandomOption(options);
}
