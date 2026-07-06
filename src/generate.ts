import { AttributeGroup, AttributeWithOptions } from "./attribute";
import { buildAttributesProcessingOrder } from "./dependencies";
import { createAttributeInstances, populateOptions } from "./loader";
import { pickRandomOption } from "./random";
import { OptionValue } from "./schemas/attribute.schema";

var ATTRIBUTES: AttributeGroup;
var GENERATION_CONTEXT: Map<string, OptionValue> = new Map();

ATTRIBUTES = createAttributeInstances();

populateOptions(ATTRIBUTES);

const processingOrder = buildAttributesProcessingOrder(ATTRIBUTES);

function generateAttribute(attribute: AttributeWithOptions, CTX: Map<string, OptionValue>) {
  // for root attributes or simple attributes without rules, directly pick random option
  if (attribute.dependsOn.length === 0 || attribute.rules.length === 0) {
    CTX.set(attribute.key, pickRandomOption(attribute.optionsValues));
    return;
  }
}
