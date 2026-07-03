import { Attribute, Option, Rule } from "./schemas/attribute.schema";

export type AttributeOptions = {
  attribute: Attribute;
  options: Record<string, Option[]>;
};

export class AttributeWithOptions {
  key: string;
  dependsOn: string[];
  options: string[];
  rules: Rule[];
  optionsValues: Option[]; // all options stored as flat list, options coming from specifically names JSON file (ie. not "default") will have the specific name as bonus pool

  constructor(attribute: Attribute, options?: Option[]) {
    this.key = attribute.key;
    this.dependsOn = attribute.dependsOn;
    this.options = attribute.options;
    this.rules = attribute.rules;
    this.optionsValues = options || []; // TODO: automatically populate option groups from JSON files based on parent attribute name
  }

  get() {
    return {
      attribute: { key: this.key, dependsOn: this.dependsOn, options: this.options, rules: this.rules },
      optionsValues: this.optionsValues,
    };
  }

  extractPool(pool: string): Option[] {
    let extractedPool: Option[] = [];

    extractedPool.push(...this.optionsValues.filter((option) => option.pools?.includes(pool)));

    return extractedPool;
  }

  getOption(value: string | number | boolean) {
    return this.optionsValues.find((option) => option.value == value);
  }

  addOption(option: Option) {
    if (!this.getOption(option.value)) this.optionsValues.push(option);
    else console.log("This value already exists in the options.");
  }

  toString() {
    let attributeAsString = "";
    attributeAsString += "key: " + this.key;
    attributeAsString += "depends on these attributes: " + this.dependsOn.toString();
    attributeAsString += "imports these options: " + this.options.toString();
  }
}
