Extractor of payment information from notification emails of Czech banks.

**Supported banks:**

- AirBank
- Komerční banka
- EquaBank (partial, without variable symbol)

## Installation

`yarn add @rikudou/czech-bank-mail-parser`

or

`npm install @rikudou/czech-bank-mail-parser`

## Usage

You can use the `PaymentDataExtractor` class to automatically parse the email:

```typescript
import {PaymentDataExtractor} from "@rikudou/czech-bank-mail-parser";

const extractor = new PaymentDataExtractor();
const result = await extractor.getPaymentData('info@airbank.cz', '...the raw email content...');
console.log(result.accountNumber, result.bankCode, result.amount, result.variableSymbol);

// or if you use promises

extractor.getPaymentData('info@airbank.cz', '...the raw email content...').then(result => {
    // do something with result
})
```

If you want to get the provider object (all of them implement the `Provider` interface), you can get it from the
extractor:

```typescript
import {PaymentDataExtractor} from "@rikudou/czech-bank-mail-parser";

const extractor = new PaymentDataExtractor();
const provider = await extractor.getProvider('info@airbank.cz'); // provider is now an instance of AirBankProvider
const result = await provider.parse('...the raw email content...');
```

If you know what bank the email is from you can also use the provider directly:

```typescript
import {AirBankProvider} from "@rikudou/czech-bank-mail-parser";

const provider = new AirBankProvider();
const result = await provider.parse('...the raw email content...');
```

In all cases an instance of `PaymentData` is returned, which contains these public readonly properties:

- `string accountNumber`
- `string bankCode`
- `number amount`
- `string variableSymbol`
