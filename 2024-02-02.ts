import { readFileSync } from "fs";

type ResultValidation = number | undefined | null;

const parseReports = (input: string): number[][] =>
  input
    .split("\r\n")
    .map((line: string): number[] =>
      line.split(/ +/).map((character: string): number => +character)
    );

const validateReports = (report: number[]): ResultValidation => {
  let error: ResultValidation = undefined;

  const directions: [number[], number[]] = [[], []];
  let previous: number = report[0];

  for (let current of report.slice(1).entries()) {
    const [index, item] = current;

    const isEqual: boolean = previous === item;
    const diff: number = previous - item;

    previous = item;

    if (isEqual) {
      if (error !== undefined) return null;
      error = index;
      continue;
    }

    if (Math.abs(diff) > 3) {
      if (error !== undefined) return null;
      error = index;
      continue;
    }

    const isAscending: boolean = diff < 0;
    directions[+isAscending].push(index);
  }

  if (directions.every((direction: number[]): boolean => direction.length > 1))
    return null;

  const singledDirections: number[] =
    directions.find((direction: number[]): boolean => direction.length === 1) ??
    [];

  if (
    singledDirections.length === 1 &&
    directions.some((direction: number[]): boolean => direction.length > 1)
  )
    return singledDirections[0];
  return error;
};

const main = () => {
  const input: string = readFileSync("2024-02-input.txt", "utf8");

  const reports: number[][] = parseReports(input);

  const validReports: number[][] = reports.filter(
    (report: number[]): boolean => {
      const error: ResultValidation = validateReports(report);

      if (error === undefined) return true;

      if (error === null) return false;

      const reportWithoutBefore: number[] = report.slice();
      reportWithoutBefore.splice(error, 1);
      const reportWithoutAfter: number[] = report.slice();
      reportWithoutAfter.splice(error + 1, 1);

      return (
        validateReports(reportWithoutBefore) === undefined ||
        validateReports(reportWithoutAfter) === undefined
      );
    }
  );

  console.log(validReports.length);
};

main();
