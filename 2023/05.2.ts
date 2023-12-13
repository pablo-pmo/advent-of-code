import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    const input: string = readFileSync(path(__dirname, './05.input.txt'), { encoding: 'utf8' });
    const lines: string[] = input.split(EOL + EOL);

    let seeds: number[] = lines.shift()!.replace('seeds: ', '').split(' ').map((seed: string): number => +seed);

    for (const line of lines) {

        const [_, ...transformations]: number[][] = line.split(EOL).map((transformation: string): number[] => transformation.split(' ').map((text: string): number => +text));

        seeds = seeds.map((seed: number): number => {
            const transformation: number[] | undefined = transformations.filter((transformation: number[]): boolean => (seed >= transformation[1]) && (seed < (transformation[1] + transformation[2]))).shift();
            if (transformation !== undefined) return transformation[0] + seed - transformation[1];
            return seed;
        });

    }
    const min: number = seeds.sort((a: number, b: number): number => a > b ? 1 : -1).shift()!;
    console.log(min);

};

main();