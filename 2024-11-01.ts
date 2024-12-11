import { readFileSync } from "fs";

const parseStones = (input: string): string[] => input.split(" ");

const changeStoneBlink = (stone: string): string[] => {
  const stoneValue: number = +stone;
  if (stoneValue === 0) return ["1"];
  if (stone.length % 2 === 0)
    return [
      stone.slice(0, stone.length / 2),
      +stone.slice(stone.length / 2) + "",
    ];
  return ["" + stoneValue * 2024];
};

const main = () => {
  const input: string = readFileSync("2024-11-input.txt", "utf8");

  let stones: string[] = parseStones(input);

  for (let i = 0; i < 25; i++) {
    stones = stones.flatMap(changeStoneBlink);
  }
  console.log(stones.length);
};
main();
