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

  const similarity: number = column1.reduce(
    (previous: number, item: number, index: number): number =>
      previous +
      item *
        column2.filter((comparedItem: number): boolean => item === comparedItem)
          .length,
    0
  );

  console.log(similarity);
};

main();
