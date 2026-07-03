export type Option = { value: string | number | boolean; weight?: number; pools?: string[] };

export type AttributeOptions = {
  attribute: string;
  options: Record<string, Option[]>;
};

export class Options {
  parentAttribute: string;
  options: Option[]; // all options stored as flat list, options coming from specifically names JSON file (ie. not "default") will have the specific name as bonus pool

  constructor(attribute: string) {
    this.parentAttribute = attribute;
    this.options = []; // TODO: automatically populate option groups from JSON files based on parent attribute name
  }

  get() {
    return {
      attribute: this.parentAttribute,
      options: this.options,
    };
  }

  extractPool(pool: string): Option[] {
    let extractedPool: Option[] = [];

    extractedPool.push(...this.options.filter((option) => option.pools?.includes(pool)));

    return extractedPool;
  }

  getOption(value: string) {
    return this.options.find((option) => option.value == value);
  }
}
