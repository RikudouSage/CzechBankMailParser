import {Provider} from "../Provider";
import {PaymentData} from "../PaymentData";
import {simpleParser} from "mailparser";

export class EquaBankProvider implements Provider {

    public async parse(mailContent: string): Promise<PaymentData> {
        const parsed = await simpleParser(mailContent);
        const text = parsed.text;

        if (text === undefined) {
            throw new Error("Could not parse email text");
        }

        const regex = /na Váš účet ([0-9]+) byla připsána částka ve výši ([0-9. ]+) CZK/;
        const result = regex.exec(text);

        if (result === null) {
            throw new Error("Could not extract payment information from email content");
        }

        return new PaymentData(
            result[1],
            '6100',
            Number(result[2].replace(' ', '')),
            null
        );
    }

    public async supports(fromEmail: string): Promise<boolean> {
        return fromEmail === 'info@equabank.cz';
    }

}