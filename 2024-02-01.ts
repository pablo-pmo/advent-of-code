import { readFileSync } from "fs";

const parseReports = (input: string): number[][] =>
  input
    .split("\r\n")
    .map((line: string): number[] =>
      line.split(/ +/).map((character: string): number => +character)
    );

const main = () => {
  const input: string = readFileSync("2024-02-input.txt", "utf8");

  const reports: number[][] = parseReports(input);

  const validReports: number[][] = reports.filter(
    (report: number[]): boolean => {
      let isAscending: boolean | undefined = undefined;
      let previous: number = report.splice(0, 1)[0];

      for (let current of report) {
        if (previous === current) return false;

        const diff: number = previous - current;
        if (Math.abs(diff) > 3) return false;

        if (isAscending === undefined) {
          isAscending = diff < 0;
        } else {
          if (isAscending !== diff < 0) return false;
        }

        previous = current;
      }
      return true;
    }
  );

  console.log(validReports.length);
};

main();
