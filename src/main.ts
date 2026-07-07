import { AttributeGroup } from "./attribute";
import { buildAttributesProcessingOrder } from "./dependencies";
import { GenerationContext } from "./generate";
import { createAttributeInstances, populateOptions } from "./loader";

function main() {
  var ATTRIBUTES: AttributeGroup;
  var GENERATION_CONTEXT: GenerationContext = new Map();

  ATTRIBUTES = createAttributeInstances();

  populateOptions(ATTRIBUTES);

  const processingOrder = buildAttributesProcessingOrder(ATTRIBUTES);

  // start processing here
}
