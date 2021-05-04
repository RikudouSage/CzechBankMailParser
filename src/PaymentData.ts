export class PaymentData {
    constructor(
        public readonly accountNumber: string,
        public readonly bankCode: string,
        public readonly amount: number,
        public readonly variableSymbol: string | null
    ) {
    }
}
