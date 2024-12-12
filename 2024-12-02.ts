import { chownSync, readFileSync } from "fs";

type Position = [number, number];

type Regions = {
  [key: string]: Position[][];
};

type Borders = {
  up: Position[];
  down: Position[];
  right: Position[];
  left: Position[];
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

const addPositionToCorrectRegion = (
  position: Position,
  regions: Position[][]
) => {
  const adjacentGroups: Position[][] = regions.filter(
    (group: Position[]): boolean =>
      numberPositionsConnected(group, position) > 0
  );

  if (adjacentGroups.length === 0) return regions.push([position]);

  if (adjacentGroups.length === 1) return adjacentGroups[0].push(position);

  let adjacentRegionIndex: number;
  const newUnifiedGroup: Position[] = [];
  while (
    (adjacentRegionIndex = regions.findIndex(
      (region: Position[]): boolean =>
        numberPositionsConnected(region, position) > 0
    )) !== -1
  ) {
    newUnifiedGroup.push(...regions.splice(adjacentRegionIndex, 1)[0]);
  }

  newUnifiedGroup.push(position);
  regions.push(newUnifiedGroup);
};

const parseRegions = (garden: string[]): Regions => {
  const regions: Regions = {};

  for (let i = 0; i < garden.length; i++) {
    for (let j = 0; j < garden[i].length; j++) {
      const position: Position = [i, j];

      const plant: string = garden[i][j];
      regions[plant] ??= [];

      addPositionToCorrectRegion(position, regions[plant]);
    }
  }
  return regions;
};

const addBorders = ([positionX, positionY]: Position, borders: Borders) => {
  borders.up.push([positionX - 1, positionY]);
  borders.down.push([positionX + 1, positionY]);
  borders.left.push([positionX, positionY - 1]);
  borders.right.push([positionX, positionY + 1]);
};

const calculateBorderRegions = (
  borders: Borders,
  region: Position[]
): Regions => {
  const borderRegion: Regions = {};

  Object.entries(borders).forEach(([key, borders]: [string, Position[]]) => {
    borderRegion[key] ??= [];

    borders.forEach((border: Position) => {
      if (
        region.every((position: Position): boolean =>
          differentPosition(position, border)
        )
      ) {
        addPositionToCorrectRegion(border, borderRegion[key]);
      }
    });
  });
  return borderRegion;
};

const differentPosition = (
  [positionAX, positionAY]: Position,
  [positionBX, positionBY]: Position
): boolean => positionAX !== positionBX || positionAY !== positionBY;

const countSides = (regions: Regions): number => {
  let sum: number = 0;
  const regionsArray: Position[][] = Object.values(regions).flat();

  for (let region of regionsArray) {
    const borders: Borders = { down: [], left: [], right: [], up: [] };
    region.forEach((position: Position) => addBorders(position, borders));

    const borderRegion: Regions = calculateBorderRegions(borders, region);

    const numberBorderRegions: number =
      Object.values(borderRegion).flat().length;
    sum += numberBorderRegions * region.length;
  }
  return sum;
};

const main = () => {
  const input: string = readFileSync("2024-12-input.txt", "utf8");

  let garden: string[] = parseGarden(input);

  const groups: Regions = parseRegions(garden);

  const borders: number = countSides(groups);

  console.log(borders);
};
main();
