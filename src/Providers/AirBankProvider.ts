import {simpleParser} from "mailparser";
import {Provider} from "../Provider";
import {PaymentData} from "../PaymentData";

export class AirBankProvider implements Provider {
    async supports(fromEmail: string): Promise<boolean> {
        return fromEmail === 'info@airbank.cz';
    }

    async parse(mailContent: string): Promise<PaymentData> {
        const parsed = await simpleParser(mailContent);
        const text = parsed.text;

        const regexAccountNumberAmount = /číslo ([0-9]+)\/3030 se zvýšil o částku ([0-9., ]+) CZK/;
        const regexVariableSymbol = /Variabilní symbol: (.+)/;
        const resultAccountNumberAmount = regexAccountNumberAmount.exec(text);
        const resultVariableSymbol = regexVariableSymbol.exec(text);

        if (resultAccountNumberAmount === null || resultVariableSymbol === null) {
            throw new Error("Could not extract payment information from email content");
        }

        return new PaymentData(
            resultAccountNumberAmount[1],
            '3030',
            Number(
                resultAccountNumberAmount[2]
                    .replace(",", ".")
                    .replace(' ', '')
            ),
            resultVariableSymbol ? resultVariableSymbol[1] : null
        );
    }

}