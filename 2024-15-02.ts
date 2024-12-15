import { readFileSync } from "fs";

const newLine: string = "\r\n";

const robot: string = "@";
const wall: string = "#";
const gap: string = ".";
const box: string = "O";
const leftBox: string = "[";
const rightBox: string = "]";

type State = {
  robot: Position;
  movements: string[];
  map: string[][];
};

type Position = {
  x: number;
  y: number;
};

// type Translation = {
//   [key: string]: [string, string];
// };

type MovementInfo = {
  positions: Position[];
  characters: string[];
};

const expandCharacter = (character: string): [string, string] => {
  let translation!: [string, string];
  switch (character) {
    case wall:
      translation = [wall, wall];
      break;
    case gap:
      translation = [gap, gap];
      break;
    case box:
      translation = [leftBox, rightBox];
      break;
    case robot:
      translation = [robot, gap];
      break;
  }

  return translation;
};

const parseState = (input: string) => {
  const [mapString, arrows]: string[] = input.split(newLine + newLine);

  const map: string[][] = mapString
    .split(newLine)
    .map((line: string): string[] => line.split("").flatMap(expandCharacter));

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

const missingEndingConditions = (characters: string[]): boolean =>
  !characters.includes(gap) && !characters.includes(wall);

const stillCheckingMovement = (movementInfo: MovementInfo[]): boolean =>
  movementInfo.some(({ characters }: MovementInfo): boolean =>
    missingEndingConditions(characters)
  );

const getDirection = (arrow: string): Position => {
  let direction!: Position;
  switch (arrow) {
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

  return direction;
};

const isColumnAlreadyIncluded = (
  movementInfo: MovementInfo[],
  column: number
): boolean =>
  movementInfo.some(({ characters, positions }: MovementInfo): boolean => {
    return (
      positions.some(({ y }: Position): boolean => y === column) &&
      !characters.includes(gap)
    );
  });

const moveRobot = ({ map, movements, robot }: State) => {
  movements.forEach((movement: string) => {
    const isHorizontal: boolean = "<>".includes(movement);

    const direction: Position = getDirection(movement);

    const movementInfo: MovementInfo[] = [
      {
        characters: ["@"],
        positions: [robot],
      },
    ];

    while (stillCheckingMovement(movementInfo)) {
      const newMovementInfos: MovementInfo[] = [];

      movementInfo.forEach(({ characters, positions }: MovementInfo) => {
        if (characters.includes(gap)) return;

        const start: Position = positions[0];

        const x: number = start.x + direction.x * positions.length;
        const y: number = start.y + direction.y * positions.length;

        const currentPosition: Position = {
          x,
          y,
        };
        const currentCharacter: string = map[x][y];

        positions.push(currentPosition);
        characters.push(currentCharacter);

        if (isHorizontal) return;

        if (!"[]".includes(currentCharacter)) return;

        const newY: number = currentCharacter.includes(leftBox) ? y + 1 : y - 1;

        if (isColumnAlreadyIncluded(movementInfo, newY)) return;

        const newCharacter: string = map[x][newY];
        const newPosition: Position = {
          x,
          y: newY,
        };

        const newMovementInfo: MovementInfo = {
          characters: [newCharacter],
          positions: [newPosition],
        };

        newMovementInfos.push(newMovementInfo);
      });

      movementInfo.push(...newMovementInfos);
    }

    if (
      movementInfo.some(({ characters }: MovementInfo): boolean =>
        characters.includes(wall)
      )
    )
      return;

    movementInfo.forEach(({ characters, positions }: MovementInfo) => {
      characters.unshift(characters.splice(-1)[0]);

      positions.forEach(({ x, y }: Position) => {
        map[x][y] = characters.shift()!;
      });
    });
    robot = movementInfo[0].positions[1];
  });
};

const sumCoordinates = ({ map }: State): number => {
  let sum: number = 0;

  map.forEach((line: string[], i: number) => {
    line.forEach((character: string, j: number) => {
      if (character.includes(leftBox)) {
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
