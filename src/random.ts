import { Option, OptionValue } from "./schemas/attribute.schema";

export function pickRandomOption(options: Option[]): OptionValue {
  console.log("\n-----Random pick iteration-----");
  if (options.every((option) => !option.weight || option.weight <= 0)) {
    const indexToPick = Math.floor(Math.random() * options.length - 1);
    return options[indexToPick].value;
  }

  const totalWeight = options.reduce((acc: number, option: Option) => (option.weight ? (acc += option.weight) : acc++), 0);

  console.log("Total weight:", totalWeight);

  const weightedValue = Math.floor(Math.random() * totalWeight);

  console.log("Random value (weighted):", weightedValue);

  let accumulator: number = weightedValue;
  for (const option of options) {
    accumulator -= option.weight || 1;

    console.log(`Accumulator value: ${accumulator} (removed ${option.weight || 1} for option ${option.value})`);

    if (accumulator <= 0) return option.value;
  }

  // if shit fucked up and somehow didn't end up on any value, return last one
  console.log("Shit fucked up, picking last option");
  return options[options.length - 1].value;
}
