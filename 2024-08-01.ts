import { readFileSync } from "fs";

const newLine: string = "\r\n";

let width: number;
let height: number;

type Position = [number, number];

type Antennas = Map<string, Position[]>;

const parseAntennas = (input: string): Antennas => {
  const antennas: Antennas = new Map();
  width = input.indexOf(newLine);
  const grid: string[] = input.split(newLine);
  height = grid.length;

  grid.forEach((line: string, index: number) => {
    let pos: number;
    while ((pos = line.search(/\w/)) !== -1) {
      const antenna: string = line.charAt(pos);
      line = line.slice(0, pos) + "." + line.slice(pos + 1);
      if (antennas.has(antenna) === false) {
        antennas.set(antenna, []);
      }
      const currentAntennas: Position[] = antennas.get(antenna)!;
      antennas.set(antenna, [[index, pos], ...currentAntennas]);
    }
  });

  return antennas;
};

const outOfBounds = (questionedNumber: number, max: number): boolean =>
  questionedNumber < 0 || questionedNumber >= max;

const isPositionContained = (
  array: Position[],
  [positionAX, positionAY]: Position
): boolean =>
  array.find(
    ([positionBX, positionBY]: Position): boolean =>
      positionAX === positionBX && positionAY === positionBY
  ) !== undefined;

const main = () => {
  const input: string = readFileSync("2024-08-input.txt", "utf8");

  const antennas: Antennas = parseAntennas(input);

  const antinodes: Position[] = [];

  for (let positions of antennas.values()) {
    if (positions.length < 2) continue;

    while (positions.length > 1) {
      const [positionAX, positionAY]: Position = positions.shift()!;

      positions.forEach(([positionBX, positionBY]: Position) => {
        const diffX: number = positionAX - positionBX;
        const diffY: number = positionAY - positionBY;

        const newPositionAX: number = positionAX + diffX;
        const newPositionBX: number = positionBX - diffX;
        const newPositionAY: number = positionAY + diffY;
        const newPositionBY: number = positionBY - diffY;

        if (
          !isPositionContained(antinodes, [newPositionAX, newPositionAY]) &&
          !outOfBounds(newPositionAX, height) &&
          !outOfBounds(newPositionAY, width)
        ) {
          antinodes.push([newPositionAX, newPositionAY]);
        }

        if (
          !isPositionContained(antinodes, [newPositionBX, newPositionBY]) &&
          !outOfBounds(newPositionBX, height) &&
          !outOfBounds(newPositionBY, width)
        ) {
          antinodes.push([newPositionBX, newPositionBY]);
        }
      });
    }
  }
  console.log(antinodes.length);
};
main();
