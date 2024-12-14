import { readFileSync } from "fs";

const dimensions: Position = [101, 103];

type Position = [number, number];
type Robot = {
  origin: Position;
  movement: Position;
};

const str2number = (str: string): number => +str;

const parseRobots = (input: string): Robot[] =>
  input.split("\r\n").map((line: string): Robot => {
    const [originX, originY, movementX, movementY]: number[] = line
      .replaceAll(/[^\-0-9]+/g, " ")
      .trim()
      .split(" ")
      .map(str2number);

    const robot: Robot = {
      origin: [originX, originY],
      movement: [movementX, movementY],
    };

    return robot;
  });

const moveRobots = (robots: Robot[], seconds: number): Position[] =>
  robots.map(({ movement, origin }: Robot): Position => {
    let endX: number = origin[0] + movement[0] * seconds;
    let endY: number = origin[1] + movement[1] * seconds;

    endX %= dimensions[0];
    endY %= dimensions[1];

    if (endX < 0) {
      endX += dimensions[0];
    }
    if (endY < 0) {
      endY += dimensions[1];
    }
    return [endX, endY];
  });

const getSafetyFactor = (positions: Position[]): number => {
  const middleX: number = Math.floor(dimensions[0] / 2);
  const middleY: number = Math.floor(dimensions[1] / 2);

  const validPositions: Position[] = positions.filter(
    ([positionX, positionY]: Position): boolean =>
      positionX !== middleX && positionY !== middleY
  );

  const topPositions: Position[] = validPositions.filter(
    (position: Position): boolean => position[1] < middleY
  );
  const leftPositions: Position[] = validPositions.filter(
    (position: Position): boolean => position[0] < middleX
  );

  const topLeftPositions: Position[] = topPositions.filter(
    (position: Position): boolean => leftPositions.includes(position)
  );
  const topRightPositions: Position[] = topPositions.filter(
    (position: Position): boolean => !leftPositions.includes(position)
  );
  const bottomLeftPositions: Position[] = leftPositions.filter(
    (position: Position): boolean => !topPositions.includes(position)
  );
  const bottomRightPositions: Position[] = validPositions.filter(
    (position: Position): boolean =>
      !topPositions.includes(position) && !leftPositions.includes(position)
  );

  return (
    topLeftPositions.length *
    topRightPositions.length *
    bottomLeftPositions.length *
    bottomRightPositions.length
  );
};

const main = () => {
  const input: string = readFileSync("2024-14-input.txt", "utf8");

  const robots: Robot[] = parseRobots(input);

  const endPositions: Position[] = moveRobots(robots, 100);

  const safetyFactor: number = getSafetyFactor(endPositions);

  console.log(safetyFactor);
};
main();
