import {Provider} from "../Provider";
import {PaymentData} from "../PaymentData";
import {simpleParser} from "mailparser";
import {parse} from "node-html-parser";

export class KomercniBankaProvider implements Provider {
    async parse(mailContent: string): Promise<PaymentData> {
        const parsed = await simpleParser(mailContent);
        const html = parsed.html;

        if (html === false) {
            throw new Error("Could not parse email text");
        }

        const document = parse(html);
        const cells = document.querySelectorAll('td span');

        let variableSymbolIndex = -1;
        let accountNumberIndex = -1;
        let amountIndex = -1;

        let i = 0;
        for (const cell of cells) {
            if (cell.text.indexOf('Variable symbol') === 0) {
                variableSymbolIndex = i + 1;
            }
            if (cell.text.indexOf('Your account number') === 0) {
                accountNumberIndex = i + 1;
            }
            if (cell.text.indexOf('Amount and currency') === 0) {
                amountIndex = i + 1;
            }
            ++i;
        }

        if (amountIndex === -1 || accountNumberIndex === -1) {
            throw new Error("Could not extract payment information from email content");
        }
        let variableSymbol = null;
        if (variableSymbolIndex > -1) {
            variableSymbol = cells[variableSymbolIndex].text.trim();
        }

        const amountContent = cells[amountIndex].text.trim();
        const accountContent = cells[accountNumberIndex].text.trim();

        const regexAmount = /([0-9, ]+) [A-Z]/;
        const regexAccount = /(?:([0-9]+)-)?([0-9]+)/;
        const resultAmount = regexAmount.exec(amountContent);
        const resultAccount = regexAccount.exec(accountContent);

        if (resultAmount === null || resultAccount === null) {
            throw new Error("Could not extract payment information from email content");
        }

        return new PaymentData(
            resultAccount[0],
            '0100',
            Number(
                resultAmount[1]
                    .replace(',', '.')
                    .replace(/ /g, '')
            ),
            variableSymbol
        );
    }

    async supports(fromEmail: string): Promise<boolean> {
        return fromEmail === 'info@kb.cz';
    }
}
