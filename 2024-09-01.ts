import { readFileSync } from "fs";

const parseFiles = (input: string): [number[], number[]] => {
  const digits: number[] = input
    .split("")
    .map((digit: string): number => +digit);
  const files: number[] = [];
  const freeSpace: number[] = [];
  for (let i = 0; i < digits.length; i++) {
    (i % 2 === 0 ? files : freeSpace).push(digits[i]);
  }
  return [files, freeSpace];
};

const repeatNumber = (desiredNumber: number, times: number): number[] =>
  Array.from(Array(times), () => desiredNumber);

const main = () => {
  const input: string = readFileSync("2024-09-input.txt", "utf8");

  const [files, freeSpace]: [number[], number[]] = parseFiles(input);

  const output: number[] = [];
  for (let index = 0; index < files.length; index++) {
    output.push(...repeatNumber(index, files[index]));

    while (freeSpace[index] > 0) {
      const lastFileIndex: number = files.length - 1;

      const min: number =
        freeSpace[index] < files[lastFileIndex]
          ? freeSpace[index]
          : files[lastFileIndex];

      output.push(...repeatNumber(lastFileIndex, min));

      freeSpace[index] -= min;
      files[lastFileIndex] -= min;

      if (files[lastFileIndex] <= 0) {
        files.pop();
      }
    }
  }

  const checksum: number = output.reduce(
    (previous: number, item: number, index: number): number =>
      previous + item * index,
    0
  );
  console.log(checksum);
};
main();
