import { AttributeGroup } from "./attribute";
import { buildAttributesProcessingOrder } from "./dependencies";
import { generateAttribute, GenerationContext } from "./generate";
import { createAttributeInstances, populateOptions } from "./loader";
import { printMap } from "./printer";

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

  printMap(GENERATION_CONTEXT);
}

main();
