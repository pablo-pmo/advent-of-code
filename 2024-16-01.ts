import { readFileSync } from "fs";

const start: string = "S";
const end: string = "E";
const wall: string = "#";

type Position = {
  x: number;
  y: number;
};

type State = {
  position: Position;
  direction: Position;
  value: number;
};

type Trajectory = State[];

const parseMaze = (input: string): string[] => input.split("\r\n");

const findPosition = (maze: string[], character: string): Position => {
  const x: number = maze.findIndex((line: string): boolean =>
    line.includes(character)
  );
  const y: number = maze[x].indexOf(character);

  const startPosition: Position = { x, y };
  return startPosition;
};

const samePosition = (positionA: Position, positionB: Position): boolean =>
  positionA.x === positionB.x && positionA.y === positionB.y;

const getNextPosition = ({ position, direction, value }: State): State => {
  const nextPosition: Position = {
    x: position.x + direction.x,
    y: position.y + direction.y,
  };
  const nextState: State = {
    position: nextPosition,
    direction,
    value: value + 1,
  };
  return nextState;
};

const getCharacterFromPosition = (maze: string[], { x, y }: Position): string =>
  maze[x][y];

const get90DegreeTurns = (direction: Position): [Position, Position] => {
  const verticalDirections: [Position, Position] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ];
  const horizontalDirections: [Position, Position] = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  return verticalDirections.some((searchingDirection: Position): boolean =>
    samePosition(searchingDirection, direction)
  )
    ? horizontalDirections
    : verticalDirections;
};

const isInBounds = (value: number, max: number): boolean =>
  value >= 0 && value < max;

const isValidPosition = (maze: string[], { x, y }: Position): boolean =>
  isInBounds(x, maze.length) &&
  isInBounds(y, maze[0].length) &&
  !getCharacterFromPosition(maze, { x, y }).includes(wall);

const getPossibleTurns = (
  maze: string[],
  { position, direction, value }: State
): State[] => {
  const turns: Position[] = get90DegreeTurns(direction);

  const states: State[] = turns
    .map(
      (direction: Position): State =>
        getNextPosition({ position, direction, value: value + 1000 })
    )
    .filter(({ position }: State): boolean => isValidPosition(maze, position));

  return states;
};

const sameState = (
  { position: positionA, direction: directionA }: State,
  { position: positionB, direction: directionB }: State
): boolean =>
  samePosition(positionA, positionB) && samePosition(directionA, directionB);

const checkExistingTrajectoriesAgainstNewOne = (
  trajectories: Trajectory[],
  state: State
): boolean => {
  const trajectoryIndex: number = trajectories.findIndex(
    (trajectory: Trajectory): boolean =>
      trajectory.some((searchingState: State): boolean =>
        sameState(state, searchingState)
      )
  );
  if (trajectoryIndex === -1) return true;

  const stateIndex: number = trajectories[trajectoryIndex].findIndex(
    (searchingState: State): boolean => sameState(state, searchingState)
  );
  const { value }: State = trajectories[trajectoryIndex][stateIndex];
  if (state.value >= value) return false;
  trajectories.splice(trajectoryIndex, 1);
  return true;
};

const getMinimunTrajectoryIndex = (trajectories: Trajectory[]): number => {
  let minValue: number = Infinity;
  let minindex: number;
  trajectories.forEach((trajectory: Trajectory, index: number) => {
    const value: number = trajectory.at(-1)?.value!;
    if (value < minValue) {
      minValue = value;
      minindex = index;
    }
  });
  return minindex!;
};

const findPath = (maze: string[]): number => {
  const endPosition: Position = findPosition(maze, end);

  const startPosition: Position = findPosition(maze, start);
  const startDirection: Position = { x: 0, y: 1 };
  const startState: State = {
    position: startPosition,
    direction: startDirection,
    value: 0,
  };

  const trajectories: Trajectory[] = [[startState]];
  let currentTrajectoryIndex: number;
  let currentTrajectory: Trajectory;
  let currentState!: State;

  let stillSearching: boolean = true;

  while (stillSearching) {
    currentTrajectoryIndex = getMinimunTrajectoryIndex(trajectories);
    currentTrajectory = trajectories[currentTrajectoryIndex];
    currentState = currentTrajectory.at(-1)!;

    if (samePosition(endPosition, currentState.position)) {
      stillSearching = false;
      continue;
    }

    let turns: State[] = getPossibleTurns(maze, currentState);
    turns = turns.filter((state: State): boolean =>
      checkExistingTrajectoriesAgainstNewOne(trajectories, state)
    );
    trajectories.push(
      ...turns.map((turn: State): Trajectory => [...currentTrajectory, turn])
    );

    const nextState: State = getNextPosition(currentState);

    if (
      isValidPosition(maze, nextState.position) &&
      checkExistingTrajectoriesAgainstNewOne(trajectories, nextState)
    ) {
      currentTrajectory.push(nextState);
      continue;
    }

    trajectories.splice(currentTrajectoryIndex, 1);
  }

  return currentState.value;
};

const main = () => {
  const input: string = readFileSync("2024-16-input.txt", "utf8");

  const maze: string[] = parseMaze(input);

  const pathValue: number = findPath(maze);

  console.log(pathValue);
};
main();
