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

        sort(maps);

        console.log('------------------');
        console.log(sources);
        console.log(maps);

        while (sources.length > 0) {

            if (maps.length === 0) {
                destinations.push(...sources);
                break;
            }

            const [sStart, sEnd]: [number, number] = sources[0];
            const [mStart, mEnd, diff]: [number, number, number] = maps[0];

            if (!isSeedRelatedToMap([mStart, mEnd], [sStart, sEnd])) {
                maps.shift();
                continue;
            }

            if (sStart < mStart) {
                const start: number = sStart;
                const end: number = Math.min(sEnd, mStart - 1);
                destinations.push([start, end]);
                sources.splice(0, 1, [mStart, sEnd]);
                continue;
            }
            const start: number = Math.max(mStart, sStart);
            const end: number = Math.min(mEnd, sEnd);
            destinations.push([start + diff, end + diff]);
            if (end === mEnd) {
                maps.shift();
                sources.splice(0, 1, [mEnd + 1, sEnd]);
            }
            if (end === sEnd) {
                sources.shift();
            }
            // if (end === mEnd && end !== sEnd) {
            //     sources.splice(0, 1, [mEnd + 1, sEnd]);
            // }

        }


        sources = destinations;
        destinations = [];

    }
    console.log('.................')
    console.log(sources);
    sort(sources);
    console.log('.................')
    console.log(sources);
    const min: number = sources.shift()![0];
    console.log(min);

};

main();