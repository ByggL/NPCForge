import { AttributeGroup } from "./attribute";
import { buildAttributesProcessingOrder } from "./dependencies";
import { printGen } from "./display/printer";
import { generateAttribute, GenerationContext } from "./generate";
import { createAttributeInstances, populateOptions } from "./loader";

function main() {
  let ATTRIBUTES: AttributeGroup;
  let GENERATION_CONTEXT: GenerationContext = new Map();

  ATTRIBUTES = createAttributeInstances();

  populateOptions(ATTRIBUTES);

  const processingOrder = buildAttributesProcessingOrder(ATTRIBUTES);

  // start processing here
  for (const attributeToProcess of processingOrder) {
    generateAttribute(ATTRIBUTES[attributeToProcess], GENERATION_CONTEXT);
  }

  printGen(GENERATION_CONTEXT);
}

main();
