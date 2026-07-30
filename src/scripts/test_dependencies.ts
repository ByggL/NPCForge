import { AttributeWithOptions } from "../attribute";
import { buildAttributesProcessingOrder, evaluateDependencies } from "../dependencies";
import { printDependencyTree } from "../display/printer";
import { createAttributeInstances, populateOptions } from "../loader";

function main() {
  var ATTRIBUTES: Record<string, AttributeWithOptions>;

  ATTRIBUTES = createAttributeInstances();

  populateOptions(ATTRIBUTES);

  const dependencies = evaluateDependencies(ATTRIBUTES);

  console.log("---");
  // console.log(JSON.stringify(dependencies.dependencies));

  // console.log(JSON.stringify(Array.from(dependencies.graph.entries()), null, 4));

  printDependencyTree(dependencies.graph);

  console.log(buildAttributesProcessingOrder(ATTRIBUTES));
}

main();
