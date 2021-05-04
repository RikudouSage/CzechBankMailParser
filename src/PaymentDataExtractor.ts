import {PaymentData} from "./PaymentData";
import {AirBankProvider} from "./Providers/AirBankProvider";

export class PaymentDataExtractor {
    private providers = [
        new AirBankProvider(),
    ];

    async getPaymentData(fromEmail: string, mailContent: string): Promise<PaymentData> {
        for (const provider of this.providers) {
            if (await provider.supports(fromEmail)) {
                return await provider.parse(mailContent);
            }
        }

        throw new Error(`Could not find a provider for email ${fromEmail}`);
    }
}