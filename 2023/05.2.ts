import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    const input: string = readFileSync(path(__dirname, './05.test.txt'), { encoding: 'utf8' });
    const lines: string[] = input.split(EOL + EOL);

    let origin: number[] = lines.shift()!.replace('seeds: ', '').split(' ').map((seed: string): number => +seed);
    let sources: [number, number][] = [];
    let destinations: [number, number][] = [];

    while (origin.length > 1) {
        const start: number = origin.shift()!;
        const end: number = start + origin.shift()! - 1;
        sources.push([start, end]);
    }

    const isSeedRelatedToMap = ([mStart, mEnd, _]: [number, number, number?], [sStart, sEnd]: [number, number]): boolean => ((mStart <= sStart) && (mEnd >= sStart)) || ((sStart <= mStart) && (sEnd >= mStart));

    const sort = (arr: [number, number, number?][]) => arr.sort(([a]: [number, number, number?], [b]: [number, number, number?]): number => a > b ? 1 : -1);


    for (const line of lines) {

        sort(sources);

        const [_, ...transformations]: number[][] = line.split(EOL).map((map: string): number[] => map.split(' ').map((text: string): number => +text));

        let maps: [number, number, number][] = transformations.map(([destination, start, length]: number[]): [number, number, number] => [start, start + length - 1, destination - start]);

        maps = maps.filter((map: [number, number, number]): boolean => sources.some((source: [number, number]): boolean => isSeedRelatedToMap(map, source)));

        if (maps.length === 0) continue;

        sort(maps);

        console.log(sources);
        console.log(maps);

        while (sources.length > 0) {

            const [sStart, sEnd]: [number, number] = sources[0];
            const [mStart, mEnd, diff]: [number, number, number] = maps[0];

            if (sStart < mStart) {
                const start: number = sStart;
                const end: number = sEnd < mStart ? sEnd : mStart - 1;
                destinations.push([start, end]);
            }
            const start: number = mStart > sStart ? mStart : sStart;
            const end: number = mEnd < sEnd ? mEnd : sEnd;
            destinations.push([start + diff, end + diff]);
            if (end === sEnd) {
                sources.shift();
            }
            if (end === mEnd) {
                maps.shift();
            }

        }
        console.log(destinations);


        sources = destinations;
        destinations = [];

        // maps.forEach(([mStart, mEnd, diff]: [number, number, number]) => {
        //     sources.filter((source: [number, number]): boolean => isSeedRelatedToMap([mStart, mEnd], source)).forEach(([sStart, sEnd]: [number, number]) => {
        //         const start: number = mStart > sStart ? mStart : sStart;
        //         const end: number = mEnd < sEnd ? mEnd : sEnd;
        //         destinations.push([start + diff, end + diff]);
        //     })
        // })

        // console.log(maps);
        // console.log(destinations);
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