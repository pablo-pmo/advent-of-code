import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    const input: string = readFileSync(path(__dirname, './01.input.txt'), { encoding: 'utf8' });
    const lines: string[] = input.split(EOL);
    let sum: number = 0;
    for (const line of lines) {
        let number: number = 0;
        const searching: [boolean, boolean] = [true, true];
        for (let i: number = 0; i < line.length; i++) {
            if (searching[0] && !isNaN(+line[i])) {
                number += +line[i] * 10;
                searching[0] = false;
            }
            if (searching[1] && !isNaN(+line[line.length - i - 1])) {
                number += +line[line.length - i - 1];
                searching[1] = false;
            }
            if (!searching[0] && !searching[1]) {
                sum += number;
                break;
            }
        }
    }
    console.log(sum);

};

main();