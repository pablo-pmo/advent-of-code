import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

const main = () => {
    const input: string = readFileSync(path(__dirname, './02.input.txt'), { encoding: 'utf8' });
    const lines: string[] = input.split(EOL);

    let sum = 0;
    for (const line of lines) {

        const colourCount: { [key: string]: number } = { red: 0, green: 0, blue: 0 };
        const checkColourCount = (line: string) => {
            const [amount, text]: string[] = line.split(' ');
            if (+amount < colourCount[text]) return;
            colourCount[text] = +amount;
        }

        const [_, plays]: string[] = line.split(': ');

        plays.split('; ').forEach((play: string) => play.split(', ').forEach(checkColourCount));

        sum += colourCount.red * colourCount.green * colourCount.blue;
    }
    console.log(sum);

};

main();