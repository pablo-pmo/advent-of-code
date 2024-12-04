import { readFileSync } from "fs";

const countWords = (input: string): number => {
  const validWords: string[] = ["XMAS", "SAMX"];
  let words: number = 0;

  const content: string[] = input.split("\r\n");

  for (let current of content.entries()) {
    const [i, file] = current;

    for (let j = 0; j < file.length; j++) {
      let horizontalWord: string = "";
      let verticalWord: string = "";
      let diagonalWordRight: string = "";
      let diagonalWordLeft: string = "";

      for (let height = 0; height < 4; height++) {
        horizontalWord += content[i][j + height];
        verticalWord += content[i + height]?.[j];
        diagonalWordRight += content[i + height]?.[j + height];
        diagonalWordLeft += content[i + height]?.[j - height];
      }

      words += [
        horizontalWord,
        verticalWord,
        diagonalWordRight,
        diagonalWordLeft,
      ].filter((word: string): boolean => validWords.includes(word)).length;
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
