import { readFileSync } from "fs";

const parseNumbers = (
  input: string
): { column1: number[]; column2: number[] } => {
  const column1: number[] = [];
  const column2: number[] = [];

  input.split("\r\n").forEach((line: string) => {
    const [numberA, numberB]: string[] = line.split(/ +/);
    column1.push(+numberA);
    column2.push(+numberB);
  });

  return { column1, column2 };
};

const main = () => {
  const input: string = readFileSync("2024-01-input.txt", "utf8");

  const { column1, column2 }: { column1: number[]; column2: number[] } =
    parseNumbers(input);

  column1.sort((a: number, b: number) => a - b);
  column2.sort((a: number, b: number) => a - b);

  const diff: number = column1.reduce(
    (previous: number, item: number, index: number): number =>
      previous + Math.abs(item - column2[index]),
    0
  );

  console.log(diff);
};

main();
