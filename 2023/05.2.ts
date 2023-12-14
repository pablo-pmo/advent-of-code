import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    const input: string = readFileSync(path(__dirname, './05.test.txt'), { encoding: 'utf8' });
    const lines: string[] = input.split(EOL + EOL);

    let origin: number[] = lines.shift()!.replace('seeds: ', '').split(' ').map((seed: string): number => +seed);
    let seeds: [number, number][] = [];

    while (origin.length > 1) {
        const start: number = origin.shift()!;
        const end: number = start + origin.shift()! - 1;
        seeds.push([start, end]);
    }

    console.log(seeds);



    for (const line of lines) {

        const [_, ...transformations]: number[][] = line.split(EOL).map((map: string): number[] => map.split(' ').map((text: string): number => +text));

        let maps: [number, number, number][] = transformations.map(([destination, start, length]: number[]): [number, number, number] => [start, start + length - 1, destination]);

        console.log(maps);

        maps = maps.filter(([mStart, mEnd, _]: [number, number, number]): boolean => seeds.some(([sStart, sEnd]: [number, number]): boolean => ((mStart <= sStart) && (mEnd >= sStart)) || ((sStart <= mStart) && (sEnd >= mStart))));

        console.log(maps);
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