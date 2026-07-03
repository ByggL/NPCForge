type AttributeKey = string;

export type Condition = Record<AttributeKey, string | number | boolean | { lt?: number; gt?: number; in?: (string | number)[] }>; // any number of comparisons

export type Effect =
  | { type: "reweight"; multiply: Record<string, number> }
  | { type: "override"; value: string | number | boolean }
  | { type: "add_options"; options: { value: string; weight?: number }[] }
  | { type: "remove_options"; options: { value: string; weight?: number }[] }
  | { type: "use_pools"; pools: { pool: string; weight?: number }[] };

export type Rule = { when: Condition; effect: Effect };

export type Attribute = {
  key: AttributeKey;
  dependsOn: AttributeKey[];
  options: string[];
  rules: Rule[];
};
