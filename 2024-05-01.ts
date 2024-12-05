import { readFileSync } from "fs";

const newLine: string = "\r\n";

const parseContent = (input: string): string[][][] =>
  input
    .split(newLine + newLine)
    .map((content: string): string[][] =>
      content.split(newLine).map((line: string): string[] => line.split(/[,|]/))
    );

const main = () => {
  const input: string = readFileSync("2024-05-input.txt", "utf8");

  const [rules, updates]: string[][][] = parseContent(input);

  let sum: number = 0;

  updates.forEach((update: string[]) => {
    const isValid: boolean = rules.every((rule: string[]): boolean => {
      const [firstRuleNumber, secondRuleNumber]: number[] = rule.map(
        (ruleNumber: string): number => update.indexOf(ruleNumber)
      );

      if (firstRuleNumber === -1 || secondRuleNumber === -1) return true;
      return firstRuleNumber < secondRuleNumber;
    });

    if (isValid) {
      sum += +update[(update.length - 1) / 2];
    }
  });

  console.log(sum);
};
main();
