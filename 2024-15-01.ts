import { readFileSync } from "fs";

const newLine: string = "\r\n";

const robot: string = "@";
const box: string = "O";
const wall: string = "#";
const gap: string = ".";

type State = {
  robot: Position;
  movements: string[];
  map: string[][];
};

type Position = {
  x: number;
  y: number;
};

const parseState = (input: string) => {
  const [mapString, arrows]: string[] = input.split(newLine + newLine);

  const map: string[][] = mapString
    .split(newLine)
    .map((line: string): string[] => line.split(""));

  const movements: string[] = arrows.replaceAll(newLine, "").split("");

  const robotX: number = map.findIndex((line: string[]): boolean =>
    line.includes(robot)
  );
  const robotY: number = map[robotX].indexOf(robot);

  const state: State = {
    robot: {
      x: robotX,
      y: robotY,
    },
    map,
    movements,
  };
  return state;
};

const stillCheckingMovement = (characters: string[]): boolean =>
  !characters.includes(gap) && !characters.includes(wall);

const moveRobot = ({ map, movements, robot }: State) => {
  movements.forEach((movement: string) => {
    let direction!: Position;
    switch (movement) {
      case "^":
        direction = {
          x: -1,
          y: 0,
        };
        break;
      case "v":
        direction = {
          x: 1,
          y: 0,
        };
        break;
      case "<":
        direction = {
          x: 0,
          y: -1,
        };
        break;
      case ">":
        direction = {
          x: 0,
          y: 1,
        };
        break;
    }

    const movementPositions: Position[] = [];
    const movedCharacters: string[] = [];
    for (
      let movedSpaces = 0;
      stillCheckingMovement(movedCharacters);
      movedSpaces++
    ) {
      const x: number = robot.x + direction.x * movedSpaces;
      const y: number = robot.y + direction.y * movedSpaces;

      const currentPosition: Position = {
        x,
        y,
      };

      movementPositions.push(currentPosition);
      movedCharacters.push(map[x][y]);
    }
    if (movedCharacters.includes(wall)) return;

    movedCharacters.unshift(movedCharacters.splice(-1)[0]);

    movementPositions.forEach(({ x, y }: Position) => {
      map[x].splice(y, 1, movedCharacters.shift()!);
    });

    robot = movementPositions[1];
  });
};

const sumCoordinates = ({ map }: State): number => {
  let sum: number = 0;

  map.forEach((line: string[], i: number) => {
    line.forEach((character: string, j: number) => {
      if (character.includes(box)) {
        sum += i * 100 + j;
      }
    });
  });

  return sum;
};

const main = () => {
  const input: string = readFileSync("2024-15-input.txt", "utf8");

  const state: State = parseState(input);

  moveRobot(state);

  const sum: number = sumCoordinates(state);

  console.log(sum);
};
main();
