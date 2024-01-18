# @bitahon/crypto

The library includes a crypto-provider for the Bitahon Protocol, encompassing core cryptographic interfaces and corresponding proxy classes.

## Installation

### General

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @bitahon/crypto
```

## Usage

Initialize the required crypto-provider implementing the ICryptoProvider interface. For example, in a web environment, you can utilize the package [@bitahon/browser-crypto](../browser-crypto).

```ts
import {initCryptoProvider} from '@bitahon/crypto';

const provider = await import('@bitahon/browser-crypto');
initCryptoProvider(provider.default);
```

Once initialized with the chosen crypto-provider, you can proceed to utilize the methods provided by the ICryptoProvider interface.

```ts
import crypto from '@bitahon/crypto';

const data: Buffer = await crypto.randomBytes(64);
const hash: Buffer = crypto.sha256(data);

console.log(hash.toString('hex'));
```

## API

### Interfaces

- [ICryptoProvider](src/index.ts)
  - ecc: IEcc
  - randomBytes
  - sha256
  - hash256
  - hmacSHA512
  - magicHash
  - encrypt
  - decrypt
  - randomPrivateKey
  - ecdh
- [IEcc](src/index.ts)
  - [XOnlyPointAddTweakResult](src/index.ts)
  - [SignRecoverable](src/index.ts)

### Functions

- [initCryptoProvider](src/index.ts)

## License

[MIT](LICENSE)
