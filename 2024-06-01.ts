import { readFileSync } from "fs";

const obstacle: string = "#";
const visitedSpot: string = "X";

const newLine: string = "\r\n";

type Position = [number, number];

type SearchResult = Position | null;

enum Arrow {
  r = ">",
  l = "<",
  u = "^",
  d = "v",
}

type Direction = {
  arrow: Arrow;
  directionH: number;
  directionV: number;
};

const directions: Direction[] = [
  { arrow: "^" as Arrow, directionH: 0, directionV: -1 },
  { arrow: ">" as Arrow, directionH: 1, directionV: 0 },
  { arrow: "v" as Arrow, directionH: 0, directionV: 1 },
  { arrow: "<" as Arrow, directionH: -1, directionV: 0 },
];

const keys: string[] = directions.map(({ arrow }: Direction): string => arrow);

const parseMap = (input: string): string[][] =>
  input.split(newLine).map((line: string): string[] => line.split(""));

const searchGuard = (map: string[][]): SearchResult => {
  for (let [lineIndex, line] of map.entries()) {
    const columnIndex: number = line.findIndex((character: string): boolean =>
      keys.includes(character)
    );
    if (columnIndex !== -1) return [lineIndex, columnIndex];
  }
  return null;
};

const getArrowIndex = (
  map: string[][],
  directions: Direction[],
  positionV: number,
  positionH: number
): number =>
  directions.findIndex(({ arrow }: Direction): boolean =>
    map[positionV][positionH].includes(arrow)
  );

const countVisitedSpots = (map: string[][]): number =>
  map.reduce(
    (previous: number, item: string[]) =>
      previous +
      item.filter((character: string): boolean =>
        character.includes(visitedSpot)
      ).length,
    0
  );

const changeCharacter = (
  map: string[][],
  positionV: number,
  positionH: number,
  newCharacter: string
) => map[positionV].splice(positionH, 1, newCharacter);

const outOfBounds = (questionedNumber: number, max: number): boolean =>
  questionedNumber < 0 || questionedNumber >= max;

const main = () => {
  const input: string = readFileSync("2024-06-input.txt", "utf8");

  const map: string[][] = parseMap(input);

  let guardInfo: SearchResult;

  while ((guardInfo = searchGuard(map)) !== null) {
    const [positionV, positionH]: Position = guardInfo;

    let arrowIndex: number = getArrowIndex(
      map,
      directions,
      positionV,
      positionH
    );

    changeCharacter(map, positionV, positionH, visitedSpot);

    let checkingNewDirection: boolean = true;
    while (checkingNewDirection) {
      const { arrow, directionH, directionV }: Direction =
        directions[arrowIndex];

      let newPositionV: number = positionV + directionV;
      let newPositionH: number = positionH + directionH;

      if (
        outOfBounds(newPositionV, map.length) ||
        outOfBounds(newPositionH, map[0].length)
      ) {
        checkingNewDirection = false;
        continue;
      }

      if (map[newPositionV][newPositionH].includes(obstacle)) {
        arrowIndex = arrowIndex === keys.length - 1 ? 0 : ++arrowIndex;
        continue;
      }

      changeCharacter(map, newPositionV, newPositionH, arrow);
      checkingNewDirection = false;
    }
  }
  const visitedSpots: number = countVisitedSpots(map);
  console.log(visitedSpots);
};
main();
