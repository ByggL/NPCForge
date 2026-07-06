import { Option, OptionValue } from "./schemas/attribute.schema";

export function pickRandomOption(options: Option[]): OptionValue {
  if (options.every((option) => option.weight && option.weight > 0)) {
    const indexToPick = Math.floor(Math.random() * options.length - 1);

    return options[indexToPick].value;
  }

  const totalWeight = options.reduce((acc: number, option: Option) => (option.weight ? (acc += option.weight) : acc++), 0);

  const weightedValue = Math.floor(Math.random() * totalWeight);

  let accumulator: number = weightedValue;
  options.forEach((option) => {
    accumulator -= option.weight || 1;

    if (accumulator <= 0) return option.value;
  });

  // if shit fucked up and somehow didn't end up on any value, return last one
  return options[options.length - 1].value;
}
