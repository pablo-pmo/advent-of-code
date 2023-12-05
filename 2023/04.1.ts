import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    const input: string = readFileSync(path(__dirname, './04.input.txt'), { encoding: 'utf8' });
    const lines: string[] = input.split(EOL);

    let sum = 0;
    for (let line of lines) {

        line = line.replace(/\s+/g, ' ');
        line = line.slice(line.indexOf(':') + 1);

        const [winningNumbers, aspiringNumbers]: string[][] = line.split('|').map((text: string): string[] => text.trim().split(' '));

        const count: number = aspiringNumbers.filter((aspiringNumber: string): boolean => winningNumbers.includes(aspiringNumber)).length;
        if (count === 0) continue;
        sum += Math.pow(2, count - 1);

    }
    console.log(sum);

};

main();