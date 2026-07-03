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

export type Option = { value: string | number | boolean; weight?: number; pools?: string[] };

export type AttributeOptions = {
  attribute: Attribute;
  options: Record<string, Option[]>;
};

export class AttributeWithOptions {
  attribute: Attribute;
  options: Option[]; // all options stored as flat list, options coming from specifically names JSON file (ie. not "default") will have the specific name as bonus pool

  constructor(attribute: Attribute, options: Option[]) {
    this.attribute = attribute;
    this.options = options || []; // TODO: automatically populate option groups from JSON files based on parent attribute name
  }

  get() {
    return {
      attribute: this.attribute,
      options: this.options,
    };
  }

  extractPool(pool: string): Option[] {
    let extractedPool: Option[] = [];

    extractedPool.push(...this.options.filter((option) => option.pools?.includes(pool)));

    return extractedPool;
  }

  getOption(value: string | number | boolean) {
    return this.options.find((option) => option.value == value);
  }

  addOption(option: Option) {
    if (!this.getOption(option.value)) this.options.push(option);
    else console.log("This value already exists in the options.");
  }
}
