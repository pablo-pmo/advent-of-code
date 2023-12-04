import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    const input: string = readFileSync(path(__dirname, './02.input.txt'), { encoding: 'utf8' });
    const lines: string[] = input.split(EOL);

    const colourCount: { [key: string]: number } = { red: 12, green: 13, blue: 14 };
    const checkColourCount = (line: string): boolean => {
        const [amount, text]: string[] = line.split(' ');
        return colourCount[text] < +amount;
    }

    let sum = 0;
    for (const line of lines) {
        const [id, plays]: string[] = line.split(': ');

        const illegalPlays: string[] = plays.split('; ').map((play: string): string[] => play.split(', ').filter(checkColourCount)).flat();

        if (illegalPlays.length > 0) continue;
        sum += +id.replace(/Game /, '');
    }
    console.log(sum);

};

main();