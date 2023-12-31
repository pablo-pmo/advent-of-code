import { readFileSync } from 'fs';
import { resolve as path } from 'path';
import { EOL } from 'os';

interface StrNumber {
    text: string,
    value: string,
    where?: number
}

const main = () => {
    const input: string = readFileSync(path(__dirname, './01.input.txt'), { encoding: 'utf8' });

    const numbers: StrNumber[] = [
        { text: 'one', value: '1' },
        { text: 'two', value: '2' },
        { text: 'three', value: '3' },
        { text: 'four', value: '4' },
        { text: 'five', value: '5' },
        { text: 'six', value: '6' },
        { text: 'seven', value: '7' },
        { text: 'eight', value: '8' },
        { text: 'nine', value: '9' },
    ];

    const lines: string[] = input.split(EOL);
    let sum: number = 0;
    for (let line of lines) {

        const first: StrNumber = numbers.reduce(
            (acc: StrNumber, curr: StrNumber): StrNumber => {
                const where: number = line.indexOf(curr.text);
                if (where === -1 || acc.where! < where) return acc;
                return { ...curr, where };
            }, { text: '', value: '0', where: line.length });
        if (first.text !== '') {
            line = line.replace(first.text, first.value);
        }

        const last: StrNumber = numbers.reduce(
            (acc: StrNumber, curr: StrNumber): StrNumber => {
                const where: number = line.lastIndexOf(curr.text);
                if (where === -1 || acc.where! > where) return acc;
                return { ...curr, where };
            }, { text: '', value: '0', where: -1 });
        if (last.text !== '') {
            line = line.replace(new RegExp(last.text, 'g'), last.value);
        }

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