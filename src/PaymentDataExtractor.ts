import {PaymentData} from "./PaymentData";
import {AirBankProvider} from "./Providers/AirBankProvider";
import {Provider} from "./Provider";
import {EquaBankProvider} from "./Providers/EquaBankProvider";
import {KomercniBankaProvider} from "./Providers/KomercniBankaProvider";

export class PaymentDataExtractor {
    private providers = [
        new AirBankProvider(),
        new EquaBankProvider(),
        new KomercniBankaProvider(),
    ];

    public async getPaymentData(fromEmail: string, mailContent: string): Promise<PaymentData> {
        return (await this.getProvider(fromEmail)).parse(mailContent);
    }

    public async getProvider(fromEmail: string): Promise<Provider> {
        for (const provider of this.providers) {
            if (await provider.supports(fromEmail)) {
                return provider;
            }
        }
        throw new Error(`Could not find a provider for email ${fromEmail}`);
    }
}