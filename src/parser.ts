import * as fs from "fs";
import { Attribute, AttributeWithOptions, Option } from "./attribute";

function readAndParseJsonFile(filename: string) {
  const jsonData = fs.readFileSync(filename);
  return JSON.parse(jsonData.toString());
}

export function createAttributeInstances(): Record<string, AttributeWithOptions> {
  const attributeFilenames = fs.readdirSync("../data/attributes");

  let attributes: Record<string, AttributeWithOptions> = {};

  attributeFilenames.forEach((attributeFile) => {
    const attributeObject: Attribute = readAndParseJsonFile(attributeFile);

    attributes[attributeObject.key] = new AttributeWithOptions(attributeObject);
  });

  return attributes;
}

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export function populateOptions(attributeInstances: Record<string, AttributeWithOptions>) {
  Object.values(attributeInstances).forEach((attributeInstance: AttributeWithOptions) => {
    attributeInstance.options.forEach((optionRequest) => {
      const optionsGroup: Option[] = readAndParseJsonFile(`../data/options/${optionRequest}${capitalize(attributeInstance.key)}.json`);

      optionsGroup.forEach((option) => {
        option.pools ? option.pools.push(optionRequest) : (option.pools = [optionRequest]);
      });

      attributeInstance.optionsValues.push(...optionsGroup);
    });
  });
}
