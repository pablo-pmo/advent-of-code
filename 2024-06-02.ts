import { readFileSync } from "fs";

const obstacle: string = "#";

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

type Path = {
  arrow: Arrow;
  paths: Position[];
};

const directions: Direction[] = [
  { arrow: "^" as Arrow, directionH: 0, directionV: -1 },
  { arrow: ">" as Arrow, directionH: 1, directionV: 0 },
  { arrow: "v" as Arrow, directionH: 0, directionV: 1 },
  { arrow: "<" as Arrow, directionH: -1, directionV: 0 },
];

const newPaths = (): Path[] => [
  { arrow: "^" as Arrow, paths: [] },
  { arrow: ">" as Arrow, paths: [] },
  { arrow: "v" as Arrow, paths: [] },
  { arrow: "<" as Arrow, paths: [] },
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

const changeCharacter = (
  map: string[][],
  positionV: number,
  positionH: number,
  newCharacter: string
) => map[positionV].splice(positionH, 1, newCharacter);

const outOfBounds = (questionedNumber: number, max: number): boolean =>
  questionedNumber < 0 || questionedNumber >= max;

const nextArrowIndex = (arrowIndex: number): number =>
  arrowIndex === keys.length - 1 ? 0 : ++arrowIndex;

const deepCopy = (object: any) => JSON.parse(JSON.stringify(object));

let stop: boolean = false;

const checkLoops = (
  map: string[][],
  paths: Path[],
  firstTime: boolean = false
): Position[] | boolean => {
  let guardInfo: SearchResult;
  const possibleBlockers: Position[] = [];

  while ((guardInfo = searchGuard(map)) !== null) {
    const [positionV, positionH]: Position = guardInfo;

    let arrowIndex: number = getArrowIndex(
      map,
      directions,
      positionV,
      positionH
    );

    let checkingNewDirection: boolean = true;
    while (checkingNewDirection) {
      const { arrow, directionH, directionV }: Direction =
        directions[arrowIndex];

      let newPositionV: number = positionV + directionV;
      let newPositionH: number = positionH + directionH;

      const path: Path = paths.find((path: Path): boolean =>
        path.arrow.includes(arrow)
      )!;

      if (
        !firstTime &&
        path.paths.some(
          ([possiblePositionV, possiblePositionH]: Position): boolean =>
            positionV === possiblePositionV && positionH === possiblePositionH
        )
      ) {
        return true;
      }

      if (!firstTime) {
        path.paths.push([positionV, positionH]);
      }

      if (
        outOfBounds(newPositionV, map.length) ||
        outOfBounds(newPositionH, map[0].length)
      ) {
        checkingNewDirection = false;

        changeCharacter(map, positionV, positionH, ".");
        continue;
      }

      if (map[newPositionV][newPositionH].includes(obstacle)) {
        arrowIndex = nextArrowIndex(arrowIndex);
        continue;
      }

      if (
        firstTime &&
        possibleBlockers.every(
          ([possibleBlockerV, possibleBlockerH]: Position): boolean =>
            possibleBlockerV !== newPositionV ||
            possibleBlockerH !== newPositionH
        )
      ) {
        possibleBlockers.push([newPositionV, newPositionH]);
      }

      changeCharacter(map, positionV, positionH, ".");
      changeCharacter(map, newPositionV, newPositionH, arrow);
      checkingNewDirection = false;
    }
  }
  return firstTime ? possibleBlockers : false;
};

const main = () => {
  const input: string = readFileSync("2024-06-input-sample.txt", "utf8");

  const map: string[][] = parseMap(input);

  const possibleObstacles: Position[] = checkLoops(
    deepCopy(map),
    newPaths(),
    true
  ) as Position[];

  const validObstacles: number = possibleObstacles.filter(
    ([possiblePositionV, possiblePositionH]: Position): boolean => {
      stop = possiblePositionV === 6 && possiblePositionH === 3;
      const newMap: string[][] = deepCopy(map);
      changeCharacter(newMap, possiblePositionV, possiblePositionH, obstacle);
      return checkLoops(newMap, newPaths()) === true;
    }
  ).length;

  console.log(validObstacles);
};
main();
