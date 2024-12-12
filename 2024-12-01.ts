import { readFileSync } from "fs";

type Position = [number, number];

type Regions = {
  [key: string]: Position[][];
};

const parseGarden = (input: string): string[] => input.split("\r\n");

const numberPositionsConnected = (
  group: Position[],
  position: Position
): number =>
  group.filter((searchingPosition: Position): boolean =>
    arePositionsConnected(position, searchingPosition)
  ).length;

const arePositionsConnected = (
  positionA: Position,
  positionB: Position
): boolean => {
  const diffX: number = Math.abs(positionA[0] - positionB[0]);
  const diffY: number = Math.abs(positionA[1] - positionB[1]);

  if (diffX === 0 && diffY === 1) return true;
  if (diffX === 1 && diffY === 0) return true;
  return false;
};

const parseRegions = (garden: string[]): Regions => {
  const regions: Regions = {};

  for (let i = 0; i < garden.length; i++) {
    for (let j = 0; j < garden[i].length; j++) {
      const position: Position = [i, j];

      const plant: string = garden[i][j];
      regions[plant] ??= [];

      const adjacentGroups: Position[][] = regions[plant].filter(
        (group: Position[]): boolean =>
          numberPositionsConnected(group, position) > 0
      );

      if (adjacentGroups.length === 0) {
        regions[plant].push([position]);
        continue;
      }

      if (adjacentGroups.length === 1) {
        adjacentGroups[0].push(position);
        continue;
      }

      let adjacentGroupIndex: number;
      const newUnifiedGroup: Position[] = [];
      while (
        (adjacentGroupIndex = regions[plant].findIndex(
          (group: Position[]): boolean =>
            numberPositionsConnected(group, position) > 0
        )) !== -1
      ) {
        newUnifiedGroup.push(
          ...regions[plant].splice(adjacentGroupIndex, 1)[0]
        );
      }

      newUnifiedGroup.push(position);
      regions[plant].push(newUnifiedGroup);
    }
  }
  return regions;
};

const reduceSum = (sum: number, current: number): number => sum + current;

const countBorders = (regions: Regions): number => {
  let sum: number = 0;
  const regionsArray: Position[][] = Object.values(regions).flat();

  for (let region of regionsArray) {
    const perimeter: number = region
      .map(
        (position: Position): number =>
          4 - numberPositionsConnected(region, position)
      )
      .reduce(reduceSum);

    sum += perimeter * region.length;
  }
  return sum;
};

const main = () => {
  const input: string = readFileSync("2024-12-input.txt", "utf8");

  let garden: string[] = parseGarden(input);

  const groups: Regions = parseRegions(garden);

  const borders: number = countBorders(groups);

  console.log(borders);
};
main();
