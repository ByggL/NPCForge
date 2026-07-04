import * as fs from "fs";
import { join } from "path";
import { AttributeWithOptions } from "./attribute";
import { Attribute, AttributeSchema, Option } from "./schemas/attribute.schema";

function readAndParseJsonFile(filename: string) {
  const jsonData = fs.readFileSync(filename, "utf-8");
  return JSON.parse(jsonData.toString());
}

export function loadAttributes(dir: string): Attribute[] {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  return files.flatMap((file) => {
    const raw = JSON.parse(fs.readFileSync(join(dir, file), "utf-8"));
    const result = AttributeSchema.safeParse(raw);

    if (!result.success) {
      throw new Error(`Attribut invalide dans ${file}:\n${result.error.toString()}`);
    }
    return result.data;
  });
}

export function createAttributeInstances(): Record<string, AttributeWithOptions> {
  const attributeObjects: Attribute[] = loadAttributes(join(process.cwd(), "/src/data/attributes")); // TODO : templacer par join(__dirname__, "path/truc")

  let attributes: Record<string, AttributeWithOptions> = {};

  attributeObjects.forEach((attributeObject) => {
    attributes[attributeObject.key] = new AttributeWithOptions(attributeObject);
  });

  return attributes;
}

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export function populateOptions(attributeInstances: Record<string, AttributeWithOptions>) {
  Object.values(attributeInstances).forEach((attributeInstance: AttributeWithOptions) => {
    attributeInstance.options.forEach((optionRequest) => {
      const optionsGroup: Option[] = readAndParseJsonFile(join(process.cwd(), `/src/data/options/${optionRequest}${capitalize(attributeInstance.key)}.json`));

      optionsGroup.forEach((option) => {
        option.pools ? option.pools.push(optionRequest) : (option.pools = [optionRequest]);
      });

      attributeInstance.optionsValues.push(...optionsGroup);
    });
  });
}
