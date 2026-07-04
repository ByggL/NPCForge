import type { Condition, Effect } from "./schemas/attribute.schema";

export function conditionToString(cond: Condition): string {
  const parts = Object.entries(cond).map(([key, val]) => {
    if (typeof val === "object" && val !== null) {
      const comparisons = Object.entries(val)
        .map(([op, v]) => `${op} ${Array.isArray(v) ? `[${v.join(", ")}]` : v}`)
        .join(", ");
      return `${key} (${comparisons})`;
    }
    return `${key} = ${val}`;
  });
  return parts.join(" AND ");
}

export function effectToString(effect: Effect): string {
  switch (effect.type) {
    case "override":
      return `override → ${effect.value}`;
    case "reweight":
      return `reweight ×${JSON.stringify(effect.multiply)}`;
    case "add_options":
      return `add_options [${effect.options.map((o) => `${o.value}${o.weight ? `:${o.weight}` : ""}`).join(", ")}]`;
    case "remove_options":
      return `remove_options [${effect.options.map((o) => o.value).join(", ")}]`;
    case "use_pools":
      return `use_pools [${effect.pools.map((p) => `${p.pool}${p.weight ? `:${p.weight}` : ""}`).join(", ")}]`;
  }
}
