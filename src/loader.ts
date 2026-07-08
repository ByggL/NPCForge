import * as fs from "fs";
import { join } from "path";
import { AttributeWithOptions } from "./attribute";
import { Attribute, AttributeSchema, Option, OptionFileSchema } from "./schemas/attribute.schema";

function readAndParseJsonFile(filename: string) {
  const jsonData = fs.readFileSync(filename, "utf-8");
  return JSON.parse(jsonData.toString());
}

function listFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

export function loadAttributes(dir: string): Attribute[] {
  const files = listFiles(dir).filter((f) => f.endsWith(".json"));

  const correctFiles = files.filter((file) => {
    const index = file.lastIndexOf("\\");
    const defaultOptionsFilename = `default${capitalize(file.substring(index + 1))}`;
    // console.log(defaultOptionsFilename);
    return fs.existsSync(join(process.cwd(), `/src/data/options/${defaultOptionsFilename}`));
  });

  return correctFiles.flatMap((file) => {
    const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
    const result = AttributeSchema.safeParse(raw);

    if (!result.success) {
      throw new Error(`ATTRIBUTS : Attribut invalide dans ${file}:\n${result.error.toString()}`);
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
      const filename = `${optionRequest}${capitalize(attributeInstance.key)}.json`;
      const raw = JSON.parse(fs.readFileSync(join(process.cwd(), `/src/data/options/${filename}`), "utf-8"));
      const result = OptionFileSchema.safeParse(raw);

      if (!result.success) {
        throw new Error(`OPTIONS : Option invalide dans ${filename}:\n${result.error.toString()}`);
      }

      const optionsGroup: Option[] = result.data || [];

      optionsGroup.forEach((option) => {
        option.pools ? option.pools.push(optionRequest) : (option.pools = [optionRequest]);
      });

      attributeInstance.optionsValues.push(...optionsGroup);
    });
  });
}
