import { DependencyGraph } from "./dependencies";
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

export function printDependencyTree(graph: DependencyGraph): void {
  const roots = Array.from(graph.values()).filter((node) => node.dependsOn.length === 0);
  // console.log(roots.map((root) => root.key));

  function printNode(key: string, prefix: string, isLast: boolean, visited: Set<string>): void {
    const connector = prefix === "" ? "" : isLast ? "└── " : "├── ";
    console.log(prefix + connector + key);

    if (visited.has(key)) {
      console.log(prefix + (isLast ? "    " : "│   ") + "└── (cycle détecté, arrêt)");
      return;
    }
    visited.add(key);

    const node = graph.get(key)!;
    const children = node.dependents;
    const childPrefix = prefix + (prefix === "" ? "" : isLast ? "    " : "│   ");

    children.forEach((child, index) => {
      printNode(child, childPrefix, index === children.length - 1, new Set(visited));
    });
  }

  roots.forEach((root, index) => {
    printNode(root.key, "", index === roots.length - 1, new Set());
  });
}
