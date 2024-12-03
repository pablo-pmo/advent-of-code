import { readFileSync } from "fs";

const str2number = (str: string): number => +str;
const multiply = (previous: number, item: number): number => previous * item;
const sum = (previous: number, item: number): number => previous + item;

const parseInstructions = (input: string): number =>
  input
    .match(/mul\(\d{1,3},\d{1,3}\)/g)
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
