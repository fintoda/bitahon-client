# @bitahon/browser-crypto

Implementation of Bitahon [ICryptoProvider](../crypto) for use on the web.

Depends on:
- [crypto-js](https://www.npmjs.com/package/crypto-js)
- [tiny-secp256k1](https://www.npmjs.com/package/tiny-secp256k1)

## Installation

### General

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @bitahon/browser-crypto
```

## Usage

Initialize the required crypto-provider implementing the ICryptoProvider interface.

```ts
import {initCryptoProvider} from '@bitahon/crypto';

const provider = await import('@bitahon/browser-crypto');
initCryptoProvider(provider.default);
```

Once initialized, you can proceed to utilize the methods provided by the ICryptoProvider interface.

```ts
import crypto from '@bitahon/crypto';

const data: Buffer = await crypto.randomBytes(64);
const hash: Buffer = crypto.sha256(data);

console.log(hash.toString('hex'));
```

## API

[@bitahon/crypto](../crypto)

## License

[MIT](LICENSE)
