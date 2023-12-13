import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    const input: string = readFileSync(path(__dirname, './05.test.txt'), { encoding: 'utf8' });
    const lines: string[] = input.split(EOL + EOL);

    let origin: number[] = lines.shift()!.replace('seeds: ', '').split(' ').map((seed: string): number => +seed);
    let seeds: [number, number][] = [];

    while (origin.length > 1) {
        seeds.push([origin.shift()!, origin.shift()!]);
    }

    console.log(seeds);



    for (const line of lines) {

        let [_, ...transformations]: number[][] = line.split(EOL).map((transformation: string): number[] => transformation.split(' ').map((text: string): number => +text));

        console.log(transformations);

        transformations = transformations.filter(([_, tStart, tLength]: number[]): boolean => seeds.some(([sStart, sLength]: [number, number]): boolean => ((tStart <= sStart) && (tStart + tLength >= sStart)) || ((sStart <= tStart) && (sStart + sLength >= tStart))));


        console.log(transformations);
        // seeds = seeds.map((seed: number): number => {
        //     const transformation: number[] | undefined = transformations.filter((transformation: number[]): boolean => (seed >= transformation[1]) && (seed < (transformation[1] + transformation[2]))).shift();
        //     if (transformation !== undefined) return transformation[0] + seed - transformation[1];
        //     return seed;
        // });

    }
    // const min: number = seeds.sort((a: number, b: number): number => a > b ? 1 : -1).shift()!;
    // console.log(min);

};

main();