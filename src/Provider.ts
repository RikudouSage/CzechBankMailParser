import {PaymentData} from "./PaymentData";

export interface Provider {
    parse(mailContent: string): Promise<PaymentData>;
    supports(fromEmail: string): Promise<boolean>;
}