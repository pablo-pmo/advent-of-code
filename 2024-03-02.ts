import { readFileSync } from "fs";

let enabled: boolean = true;

const multiplyPattern: string = "(mul\\(\\d{1,3},\\d{1,3}\\))";
const controlPattern: string = "(do(n't)?\\(\\))";

const filterDisabled = (instruction: string): boolean => {
  if (instruction.match(new RegExp(controlPattern)) !== null) {
    enabled = instruction.includes("do()");
    return false;
  }
  return enabled;
};
const str2number = (str: string): number => +str;
const multiply = (previous: number, item: number): number => previous * item;
const sum = (previous: number, item: number): number => previous + item;

const parseInstructions = (input: string): number =>
  input
    .match(new RegExp(`${multiplyPattern}|${controlPattern}`, "g"))
    ?.filter(filterDisabled)
    ?.map(
      (instruction: string): number =>
        instruction
          .match(/\d{1,3}/g)
          ?.map(str2number)
          .reduce(multiply)!
    )
    .reduce(sum)!;

const main = () => {
  const input: string = readFileSync("2024-03-input.txt", "utf8");

  const result: number = parseInstructions(input);

  console.log(result);
};

main();
