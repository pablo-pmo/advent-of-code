import { readFileSync } from "fs";

const newLine: string = "\r\n";

const str2number = (str: string): number => +str;

const parseContent = (input: string): number[][][] =>
  input
    .split(newLine + newLine)
    .map((content: string): number[][] =>
      content
        .split(newLine)
        .map((line: string): number[] => line.split(/[,|]/).map(str2number))
    );

const main = () => {
  const input: string = readFileSync("2024-05-input.txt", "utf8");

  const [rules, updates]: number[][][] = parseContent(input);

  let sum: number = 0;

  updates.forEach((update: number[]) => {
    const isValid: boolean = rules.every((rule: number[]): boolean => {
      const [firstRuleNumber, secondRuleNumber]: number[] = rule.map(
        (ruleNumber: number): number => update.indexOf(ruleNumber)
      );

      if (firstRuleNumber === -1 || secondRuleNumber === -1) return true;
      return firstRuleNumber < secondRuleNumber;
    });

    if (isValid) return;

    update.sort((number1: number, number2: number): number => {
      const [firstNumber]: number[] = rules.find(
        (rule: number[]): boolean =>
          rule.includes(number1) && rule.includes(number2)
      )!;
      return firstNumber === number1 ? -1 : 1;
    });

    sum += update[(update.length - 1) / 2];
  });

  console.log(sum);
};
main();
