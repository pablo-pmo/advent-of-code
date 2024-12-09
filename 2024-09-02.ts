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
  Array(times).fill(desiredNumber);

const main = () => {
  const input: string = readFileSync("2024-09-input.txt", "utf8");

  const [files, freeSpaces]: [number[], number[]] = parseFiles(input);

  let state: number[] = [];
  for (let index = 0; index < files.length; index++) {
    state.push(...repeatNumber(index, files[index]));
    state.push(...repeatNumber(NaN, freeSpaces[index]));
  }
  state.pop();

  files.toReversed().forEach((amount: number, index: number) => {
    const value: number = files.length - 1 - index;
    const stateIndex: number = state.indexOf(value);

    for (let i = 0; i + amount - 1 < stateIndex; i++) {
      const searchingChunk: number[] = state.slice(i, i + amount);
      if (
        searchingChunk.some(
          (searchingValue: number): boolean => !isNaN(searchingValue)
        )
      )
        continue;

      state = state.map((searchingValue: number): number =>
        searchingValue === value ? NaN : searchingValue
      );
      state.splice(i, amount, ...repeatNumber(value, amount));

      return;
    }
  });

  const checksum: number = state.reduce(
    (previous: number, item: number, index: number): number =>
      isNaN(item) ? previous : previous + item * index,
    0
  );

  console.log(checksum);
};
main();
