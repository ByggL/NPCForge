import { AttributeWithOptions } from "../attribute";
import { createAttributeInstances, populateOptions } from "../loader";

function main() {
  var ATTRIBUTES: Record<string, AttributeWithOptions>;

  ATTRIBUTES = createAttributeInstances();

  populateOptions(ATTRIBUTES);

  for (const [key, value] of Object.entries(ATTRIBUTES)) {
    const attributeString = value.toString();
    console.log(attributeString, "\n");
  }
}

main();
