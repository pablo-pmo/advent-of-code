import { readFileSync } from "fs";

type Position = [number, number];

const newLine: string = "\r\n";

const parseMap = (input: string): number[][] =>
  input
    .split(newLine)
    .map((line: string): number[] =>
      line.split("").map((character: string): number => +character)
    );

const mapNumbers = (map: number[][]): Position[][] => {
  const mappings: Position[][] = Array.from(Array(10), () => []);

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      mappings[map[i][j]].push([i, j]);
    }
  }
  return mappings;
};

const isConnectedToPrevious = (
  [currentI, currentJ]: Position,
  previous: Position[]
): boolean =>
  previous.some(([previousI, previousJ]: Position): boolean => {
    const diffI: number = Math.abs(currentI - previousI);
    const diffJ: number = Math.abs(currentJ - previousJ);
    if (diffI === 0 && diffJ === 1) return true;
    if (diffI === 1 && diffJ === 0) return true;
    return false;
  });

const main = () => {
  const input: string = readFileSync("2024-10-input.txt", "utf8");

  const map: number[][] = parseMap(input);

  const mappings: Position[][] = mapNumbers(map);

  let sum: number = 0;

  mappings.shift()?.forEach((start: Position) => {
    let previous: Position[] = [start];

    for (let i = 0; i < mappings.length; i++) {
      previous = mappings[i].filter((current: Position): boolean =>
        isConnectedToPrevious(current, previous)
      );
    }
    sum += previous.length;
  });

  console.log(sum);
};
main();
