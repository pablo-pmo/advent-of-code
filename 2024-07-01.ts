import { readFileSync } from "fs";

interface Equation {
  result: number;
  values: number[];
}

interface Node {
  value: number;
  "+"?: Node;
  "*"?: Node;
}

const parseEquations = (input: string): Equation[] =>
  input.split("\r\n").map((line: string): Equation => {
    const [strResult, strValues]: string[] = line.split(": ");
    const result: number = +strResult;
    const values: number[] = strValues
      .split(" ")
      .map((value: string): number => +value);
    return { result, values };
  });

const operateNext = (node: Node, values: number[], lastResults: number[]) => {
  const nextValue: number = values[0];
  node["*"] = { value: node.value * nextValue };
  node["+"] = { value: node.value + nextValue };
  if (values.length > 1) {
    const nextValues: number[] = values.slice(1);
    operateNext(node["*"], nextValues, lastResults);
    operateNext(node["+"], nextValues, lastResults);
  } else {
    lastResults.push(node["*"].value);
    lastResults.push(node["+"].value);
  }
};

const main = () => {
  const input: string = readFileSync("2024-07-input.txt", "utf8");

  const equations: Equation[] = parseEquations(input);

  let sum: number = 0;
  equations.forEach((equation: Equation) => {
    const { result, values }: Equation = equation;
    const root: Node = { value: values.splice(0, 1)[0] };
    const lastResults: number[] = [];
    operateNext(root, values, lastResults);
    if (lastResults.includes(result)) {
      sum += result;
    }
  });

  console.log(sum);
};
main();
