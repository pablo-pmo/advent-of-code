import { readFileSync } from "fs";

const parseStones = (input: string): string[] => input.split(" ");

type ResultsRegistry = {
  [key: string]: number[];
};

const resultsRegistry: ResultsRegistry = {};

const memoizedRecursiveStoneCounter = (
  stone: string,
  depth: number
): number => {
  if (resultsRegistry[stone]?.[depth] !== undefined)
    return resultsRegistry[stone][depth];

  resultsRegistry[stone] ??= [];

  if (depth === 0) {
    const result: number = 1;
    resultsRegistry[stone][depth] = result;
    return result;
  }

  const newDepth: number = depth - 1;
  const stoneValue: number = +stone;

  if (stoneValue === 0) {
    const result: number = memoizedRecursiveStoneCounter("1", newDepth);
    resultsRegistry[stone][depth] = result;
    return result;
  }

  if (stone.length % 2 === 0) {
    const result: number =
      memoizedRecursiveStoneCounter(
        stone.slice(0, stone.length / 2),
        newDepth
      ) +
      memoizedRecursiveStoneCounter(
        +stone.slice(stone.length / 2) + "",
        newDepth
      );
    resultsRegistry[stone][depth] = result;
    return result;
  }

  const result: number = memoizedRecursiveStoneCounter(
    "" + stoneValue * 2024,
    newDepth
  );
  resultsRegistry[stone][depth] = result;
  return result;
};

const main = () => {
  const input: string = readFileSync("2024-11-input.txt", "utf8");

  let stones: string[] = parseStones(input);

  const sum: number = stones.reduce(
    (sum: number, stone: string): number =>
      sum + memoizedRecursiveStoneCounter(stone, 75),
    0
  );
  console.log(sum);
};
main();
