import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    const input: string = readFileSync(path(__dirname, './04.input.txt'), { encoding: 'utf8' });
    const lines: string[] = input.split(EOL);

    let sum = 0;
    let copies: number[] = [];
    for (let line of lines) {

        line = line.replace(/\s+/g, ' ');
        line = line.slice(line.indexOf(':') + 1);

        const [winningNumbers, aspiringNumbers]: string[][] = line.split('|').map((text: string): string[] => text.trim().split(' '));

        const currentCopies: number = (copies.shift() ?? 0) + 1;

        const count: number = aspiringNumbers.filter((aspiringNumber: string): boolean => winningNumbers.includes(aspiringNumber)).length;

        sum += currentCopies;
        for (let i: number = 0; i < count; i++) {
            if (copies[i] === undefined) copies[i] = 0;
            copies[i] += currentCopies;
        }

        if (count === 0 && currentCopies === 1) break;

    }
    console.log(sum);

};

main();