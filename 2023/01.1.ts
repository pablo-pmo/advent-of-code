import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    const input: string = readFileSync(path(__dirname, './01.1.input.txt'), { encoding: 'utf8' });
    const lines: string[] = input.split(EOL);
    const numbers: number[] = [];
    for (const line of lines) {
        let number: number = 0;
        const searching: boolean[] = [true, true];
        for (let i = 0; i < line.length; i++) {
            if (searching[0] && !isNaN(+line[i])) {
                number += +line[i] * 10;
                searching[0] = false;
            }
            if (searching[1] && !isNaN(+line[line.length - i - 1])) {
                number += +line[line.length - i - 1];
                searching[1] = false;
            }
            if (!searching[0] && !searching[1]) {
                numbers.push(number);
                break;
            }
        }
    }
    const result: number = numbers.reduce((acc, curr) => acc + curr);
    console.log(result);

};

main();