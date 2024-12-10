import { readFileSync } from "fs";

type Position = {
  x: number;
  y: number;
  connectedPositions?: Position[];
};

const newLine: string = "\r\n";

const str2number = (str: string): number => +str;

const parseMap = (input: string): number[][] =>
  input
    .split(newLine)
    .map((line: string): number[] => line.split("").map(str2number));

const mapNumbers = (map: number[][]): Position[][] => {
  const mappings: Position[][] = Array.from(Array(10), () => []);

  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      mappings[map[x][y]].push({ x, y });
    }
  }
  return mappings;
};

const mapConnections = (mappings: Position[][]) => {
  for (let i = 0; i < mappings.length - 1; i++) {
    mappings[i].forEach(
      (current: Position) =>
        (current.connectedPositions = mappings[i + 1].filter(
          (connection: Position): boolean =>
            arePositionsConnected(current, connection)
        ))
    );
  }
};

const calculateDistinctPaths = ({ connectedPositions }: Position): number => {
  if (connectedPositions === undefined) return 1;
  if (connectedPositions.length === 0) return 0;
  return connectedPositions.reduce(sumCalculateDistinctPaths, 0);
};

const sumCalculateDistinctPaths = (sum: number, position: Position): number =>
  sum + calculateDistinctPaths(position);

const arePositionsConnected = (positionA: Position, positionB: Position) => {
  const diffX: number = Math.abs(positionA.x - positionB.x);
  const diffY: number = Math.abs(positionA.y - positionB.y);
  if (diffX === 0 && diffY === 1) return true;
  if (diffX === 1 && diffY === 0) return true;
  return false;
};

const main = () => {
  const input: string = readFileSync("2024-10-input.txt", "utf8");

  const map: number[][] = parseMap(input);

  const mappings: Position[][] = mapNumbers(map);

  mapConnections(mappings);

  const sum: number = mappings[0].reduce(sumCalculateDistinctPaths, 0);
  console.log(sum);
};
main();
