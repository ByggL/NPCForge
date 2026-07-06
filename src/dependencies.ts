import { AttributeGroup } from "./attribute";

interface DependencyNode {
  key: string;
  dependsOn: string[];
  dependents: string[];
}

export type DependencyGraph = Map<string, DependencyNode>;

function extractDependencies(attributeGroup: AttributeGroup): Record<string, string[]> {
  let output: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(attributeGroup)) {
    output[key] = value.dependsOn;
  }

  return output;
}

function buildDependencyGraph(attributes: AttributeGroup): DependencyGraph {
  const graph: DependencyGraph = new Map();

  // create every node for the graph
  Object.values(attributes).forEach((attr) => {
    // console.log("Creating node for:", attr.key);

    const nodeContent: DependencyNode = {
      key: attr.key,
      dependsOn: attr.dependsOn ?? [],
      dependents: [],
    };

    // console.log(JSON.stringify(nodeContent));

    graph.set(attr.key, nodeContent);
  });

  // fill out the dependents (ie. all attributes which have this attribute as dependency)
  Object.values(attributes).forEach((attr) => {
    for (const dep of attr.dependsOn ?? []) {
      // console.log(`Adding ${attr.key} as dependent of ${dep}`);
      const depNode = graph.get(dep);
      if (!depNode) {
        throw new Error(`Attribut "${attr.key}" dépend de "${dep}", qui n'existe pas.`);
      }
      depNode.dependents.push(attr.key);
    }
  });

  return graph;
}

function detectCycles(graph: DependencyGraph): string[][] {
  const WHITE = 0; // WHITE = non visited node
  const GRAY = 1; // GRAY = in process of being visited
  const BLACK = 2; // BLACK = done visiting

  // a gray node that is visited more than once means there is a cycle (ie. circular dependency)

  const state = new Map<string, number>();
  const cycles: string[][] = [];
  const stack: string[] = [];

  graph.forEach((value, key) => {
    state.set(key, WHITE);
  });

  function visit(node: string): void {
    // console.log("VISITING", node);
    state.set(node, GRAY);
    stack.push(node);

    const current = graph.get(node)!;
    for (const dep of current.dependsOn) {
      const depState = state.get(dep);
      if (depState === GRAY) {
        // CYCLE FOUND (because gray node found again)
        const cycleStart = stack.indexOf(dep);
        cycles.push([...stack.slice(cycleStart), dep]);
        // console.log("CYCLE FOUND");
      } else if (depState === WHITE) {
        visit(dep);
      }
    }

    stack.pop();
    state.set(node, BLACK);
  }

  graph.forEach((value, key) => {
    if (state.get(key) === WHITE) visit(key);
  });

  return cycles;
}

// sorts attributes based on their dependencies to have a processing order
function topologicalSort(graph: DependencyGraph): string[] {
  const cycles = detectCycles(graph);
  // console.log(cycles);
  if (cycles.length > 0) {
    const details = cycles.map((c) => c.join(" -> ")).join(" | ");
    throw new Error(`Dépendances circulaires détectées: ${details}`);
  }

  const visited = new Set<string>();
  const order: string[] = [];

  function visit(node: string): void {
    if (visited.has(node)) return;
    visited.add(node);
    const current = graph.get(node)!;
    for (const dep of current.dependsOn) visit(dep);
    order.push(node);
  }

  graph.forEach((value, key) => visit(key));

  return order;
}

export function evaluateDependencies(attributeGroup: AttributeGroup): {
  dependencies: Record<string, string[]>;
  graph: DependencyGraph;
  order: string[];
} {
  let attributeDependencies: Record<string, string[]> = {};
  let dependencyTree: DependencyGraph = new Map();
  let processingOrder: string[] = [];

  try {
    attributeDependencies = extractDependencies(attributeGroup);
    dependencyTree = buildDependencyGraph(attributeGroup);
    processingOrder = topologicalSort(dependencyTree);

    console.log(processingOrder);

    // console.log(JSON.stringify(Array.from(dependencyTree.entries()), null, 4));
  } catch (error) {
    console.error(error);
  }

  return {
    dependencies: attributeDependencies,
    graph: dependencyTree,
    order: processingOrder,
  };
}

export function buildAttributesProcessingOrder(attributeGroup: AttributeGroup) {
  return topologicalSort(buildDependencyGraph(attributeGroup));
}
