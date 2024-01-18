# @bitahon/client

The library implements core types of application-level actions for the Bitahon Protocol, as well as auxiliary classes that facilitate interactions with sessions and more.

## Installation

### General

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @bitahon/client
```

## Usage

Let's start by initializing the crypto-provider.

```ts
import {initCryptoProvider} from '@bitahon/crypto';

const provider = await import('@bitahon/browser-crypto');
initCryptoProvider(provider.default);
```

Additionally, it is necessary to implement the communication provider. Here, you can encode requests into QR Codes; check the [IClientConnectionProvider](src/client.ts) interface.

```ts
import {
  IClientConnectionProvider,
} from '@bitahon/client';

const connectionProvider: IClientConnectionProvider = {
  send: async (data: Buffer) => {
    // function for sending a Request that returns a Response buffers.
  },
};
```

Session creation. You can save the session if needed; check the [ClientSession](src/client.ts) class.

```ts
import {Client} from '@bitahon/client';

const client = new Client(connectionProvider);

await client.auth({
  title: 'Awesome Wallet',
  description: 'Wallet for Awesome Things',
});

localStorage.setItem('wallet_session', client.session.toString());
```

Session restoration may look like this.

```ts
import {ClientSession, Client} from '@bitahon/client';

const sessionData = localStorage.getItem('wallet_session');
const session = ClientSession.fromString(sessionData);

const client = new Client(connectionProvider, session);
```

An example of communication within a session, such as retrieving a public key, could be as follows:

```ts
import {bitcoin} from '@bitahon/client';

const action = new bitcoin.GetPublicKeyAction({
  network: 1,
  path: "44'/1'/0'/0/0",
});

const pub = await client.request(action);
console.log(pub);
```

## API

### Interfaces

- [IAction](src/client.ts)
- [IClientConnectionProvider](src/client.ts)
- [ECDSASignResult](src/client.ts)

### Classes

- [ClientSession](src/client.ts)
- [ClientRequest](src/client.ts)
- [Client](src/client.ts)

### Actions

#### wallet

- [NewSessionAction](src/actions/wallet.ts)

#### bitcoin

- [GetPublicKeyAction](src/actions/bitcoin.ts)
- [SignMessageAction](src/actions/bitcoin.ts)
- [SignTransactionAction](src/actions/bitcoin.ts)

#### ethereum

- [GetPublicKeyAction](src/actions/ethereum.ts)
- [SignPersonalMessageAction](src/actions/ethereum.ts)
- [SignEIP712MessageAction](src/actions/ethereum.ts)
- [SignEIP712HashedMessageAction](src/actions/ethereum.ts)
- [SignTransactionAction](src/actions/ethereum.ts)

#### tron

- [GetPublicKeyAction](src/actions/tron.ts)
- [SignPersonalMessageAction](src/actions/tron.ts)
- [SignTransactionAction](src/actions/tron.ts)

## License

[MIT](LICENSE)
