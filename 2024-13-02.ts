import { readFileSync } from "fs";

const newLine: string = "\r\n";

const conversionError: number = 10000000000000;
// const conversionError: number = 0;

type Equation = {
  result: Vector;
  a: Vector;
  b: Vector;
};

type Vector = {
  x: number;
  y: number;
};

const str2number = (str: string): number => +str;

const parseMachines = (input: string): Equation[] =>
  input.split(newLine + newLine).map((line: string): Equation => {
    const [ax, ay, bx, by, cx, cy]: number[] = line
      .replaceAll(/[^0-9]+/g, " ")
      .trim()
      .split(" ")
      .map(str2number);
    const equation: Equation = {
      result: {
        x: cx + conversionError,
        y: cy + conversionError,
      },
      a: {
        x: ax,
        y: ay,
      },
      b: {
        x: bx,
        y: by,
      },
    };
    return equation;
  });

const greatestCommonDivider = (x: number, y: number): number => {
  let mod: number;
  while ((mod = x % y) !== 0) {
    x = y;
    y = mod;
  }
  return y;
};

const isEquationSolvable = ({ a, b, result }: Equation): boolean => {
  const gcdX: number = greatestCommonDivider(a.x, b.x);

  const gcdY: number = greatestCommonDivider(a.y, b.y);

  if (result.x % gcdX !== 0) return false;

  if (result.y % gcdY !== 0) return false;

  return true;
};

const main = () => {
  const input: string = readFileSync("2024-13-input.txt", "utf8");

  const machines: Equation[] = parseMachines(input);

  let sum: number = 0;

  machines.filter(isEquationSolvable).forEach(({ a, b, result }: Equation) => {
    const determinant: number = Math.abs(a.x * b.y - a.y * b.x);

    const nA: number = Math.abs(
      (result.x * b.y - result.y * b.x) / determinant
    );
    if (!Number.isInteger(nA)) return;

    const nB: number = Math.abs(
      (result.x * a.y - result.y * a.x) / determinant
    );
    if (!Number.isInteger(nB)) return;

    sum += nA * 3 + nB * 1;
  });

  console.log(sum);
};
main();
