# @bitahon/api

This library serves as a client for the Bitahon API.

## Installation

### General

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @bitahon/api
```

## Usage

ERC20:
```ts
import {ethereumToken} from '@bitahon/api';
import {ethereum} from '@bitahon/protocol';

const token = await ethereumToken({
  network: ethereum.NETWORK_ID.ETHEREUM_MAINNET,
  contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
});

console.log(token.name, token.symbol, token.decimals);
```

TRC20:
```ts
import {tronToken} from '@bitahon/api';
import {tron} from '@bitahon/protocol';

const token = await tronToken({
  network: tron.NETWORK_ID.TRON_MAINNET,
  contract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
});

console.log(token.name, token.symbol, token.decimals);
```

TRC10:
```ts
import {tronToken} from '@bitahon/api';
import {tron} from '@bitahon/protocol';

const token = await tronToken({
  network: tron.NETWORK_ID.TRON_MAINNET,
  contract: '1002000',
});

console.log(token.name, token.symbol, token.decimals);
```

## API

#### Functions

- [ethereumToken](src/index.ts)
- [tronToken](src/index.ts)

## License

[MIT](LICENSE)
