import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    const input: string = readFileSync(path(__dirname, './05.input.txt'), { encoding: 'utf8' });
    const lines: string[] = input.split(EOL + EOL);

    let seeds: number[] = lines.shift()!.replace('seeds: ', '').split(' ').map((seed: string): number => +seed);

    for (const line of lines) {

        const [_, ...maps]: number[][] = line.split(EOL).map((map: string): number[] => map.split(' ').map((text: string): number => +text));

        seeds = seeds.map((seed: number): number => {
            const map: number[] | undefined = maps.filter(([_, source, length]: number[]): boolean => (seed >= source) && (seed < (source + length))).shift();
            if (map !== undefined) return map[0] + seed - map[1];
            return seed;
        });

    }
    const min: number = seeds.sort((a: number, b: number): number => a > b ? 1 : -1).shift()!;
    console.log(min);

};

main();