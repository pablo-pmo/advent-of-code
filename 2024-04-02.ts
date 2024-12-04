import { readFileSync } from "fs";

const countWords = (input: string): number => {
  const validWords: string[] = ["MAS", "SAM"];
  let words: number = 0;

  const content: string[] = input.split("\r\n");

  for (let i = 1; i < content.length - 1; i++) {
    for (let j = 1; j < content[1].length - 1; j++) {
      let diagonalWordRight: string =
        content[i - 1][j - 1] + content[i][j] + content[i + 1][j + 1];
      let diagonalWordLeft: string =
        content[i - 1][j + 1] + content[i][j] + content[i + 1][j - 1];

      if (
        validWords.includes(diagonalWordLeft) &&
        validWords.includes(diagonalWordRight)
      ) {
        words++;
      }
    }
  }
  return words;
};

const main = () => {
  const input: string = readFileSync("2024-04-input.txt", "utf8");

  const result: number = countWords(input);

  console.log(result);
};
main();
