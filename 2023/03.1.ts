import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    let input: string = readFileSync(path(__dirname, './03.input.txt'), { encoding: 'utf8' });

    const c: string = '*';
    ['$', '/', '+', '-', '=', '&', '#', '@', '%'].forEach((symbol: string) => input = input.replaceAll(symbol, c));

    input = input.replaceAll(EOL, ',');
    const width: number = input.indexOf(',');

    const borders: [number, number][] = [];

    while (input.includes(c)) {

        const where: number = input.indexOf(c);
        input = input.replace(c, '.');

        const neighbours: number[] = [
            where - width - 1 - 1,
            where - width - 1,
            where - width + 1 - 1,
            where - 1,
            where + 1,
            where + width - 1 + 1,
            where + width + 1,
            where + width + 1 + 1,
        ];

        let peeks: [number, string][] = neighbours.map((neighbour: number): [number, string] => [neighbour, input[neighbour]]);
        peeks = peeks.filter(([_, char]: [number, string]): boolean => ![c, '.'].includes(char));

        peeks.forEach(([peek, _]: [number, string]) => {

            if (borders.some(([left, right]: [number, number]): boolean => peek >= left && peek <= right)) return;

            const border: [number, number] = [peek, peek];
            const searching: [boolean, boolean] = [true, true];

            for (let i: number = 1; i < width; i++) {
                if (searching[0] && !isNaN(+input[peek - i])) {
                    border[0] = peek - i;
                } else searching[0] = false;
                if (searching[1] && !isNaN(+input[peek + i])) {
                    border[1] = peek + i;
                } else searching[1] = false;
                if (!searching[0] && !searching[1]) {
                    borders.push(border);
                    return;
                }
            }

        })


    }

    const result: number = borders.reduce((acc: number, [left, right]: [number, number]): number => acc + +input.substring(left, right + 1), 0);
    console.log(result);

};

main();