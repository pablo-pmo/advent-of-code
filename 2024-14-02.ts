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

const findTree = (robots: Robot[]): number => {
  for (let i = 0; ; i++) {
    const endPositions: Position[] = moveRobots(robots, i);

    const bundledPositions: Position[] = endPositions.filter(
      ([positionAX, positionAY]: Position): boolean =>
        endPositions.filter(([positionBX, positionBY]: Position): boolean => {
          const diffX: number = Math.abs(positionAX - positionBX);
          const diffY: number = Math.abs(positionAY - positionBY);
          return diffX <= 1 && diffY <= 1;
        }).length >= 4
    );

    if (endPositions.length / 3 < bundledPositions.length) {
      return i;
    }
  }
};

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

const main = () => {
  const input: string = readFileSync("2024-14-input.txt", "utf8");

  const robots: Robot[] = parseRobots(input);

  const treeSeconds: number = findTree(robots);

  console.log(treeSeconds);
};
main();
