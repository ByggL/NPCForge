import { AttributeWithOptions } from "./attribute";
import { createAttributeInstances, populateOptions } from "./loader";

var ATTRIBUTES: Record<string, AttributeWithOptions>;

ATTRIBUTES = createAttributeInstances();

populateOptions(ATTRIBUTES);
