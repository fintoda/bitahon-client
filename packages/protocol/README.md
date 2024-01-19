# @bitahon/protocol

This library provides an implementation of the Bitahon Protocol Buffers (protobuf) messages.

## Installation

### General

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @bitahon/protocol
```

## Usage

```ts
import {
  APP_ID,
  common,
  session,
  transport,
  bitcoin,
} from '@bitahon/protocol';

const bip32Path: common.IBip32Path = {
  value: [2147483692, 2147483648, 2147483648, 0, 0], // 44'/0'/0'/0/0
  curve: 1, // secp256k1
};

const params: Uint8Array = common.encodeGetPublicKey({
  network: bitcoin.NETWORK_ID.BITCOIN_MAINNET,
  path: bip32Path,
});

const request: Uint8Array = session.encodeApiRequest({
  id: 1,
  app: APP_ID.BITCOIN,
  method: 1, // GET_PUBLIC_KEY
  params,
});

const payload: Uint8Array = transport.encodeApiTransport({
  data: request,
  // sign,
});
```

## API

### APP_ID

| Application | uint32 |
| --- | --- |
| WALLET | 1 |
| BITCOIN | 2 |
| ETHEREUM | 3 |
| TRON | 4 |

### transport

#### Interfaces

- [IApiTransport](src/transport.ts)

#### Functions

- [encodeApiTransport](src/transport.ts)
- [decodeApiTransport](src/transport.ts)

### session

#### Interfaces

- [IApiRequest](src/session.ts)
- [IApiResponse](src/session.ts)

#### Functions

- [encodeApiRequest](src/session.ts)
- [encodeApiResponse](src/session.ts)
- [decodeApiRequest](src/session.ts)
- [decodeApiResponse](src/session.ts)

### wallet

#### METHOD_ID

| Method | uint32 |
| --- | --- |
| NEW_SESSION | 1 |

#### Interfaces

- [INewSession](src/wallet.ts)
- [INewSessionResult](src/wallet.ts)

#### Functions

- [encodeNewSession](src/wallet.ts)
- [encodeNewSessionResult](src/wallet.ts)
- [decodeNewSession](src/wallet.ts)
- [decodeNewSessionResult](src/wallet.ts)

### common

#### Interfaces

- [IBip32Path](src/common.ts)
- [IGetPublicKey](src/common.ts)
- [IGetPublicKeyResult](src/common.ts)
- [IECDSASignResult](src/common.ts)
- [ITokenMetadata](src/common.ts)

#### Functions

- [encodeBip32Path](src/common.ts)
- [decodeBip32Path](src/common.ts)
- [encodeGetPublicKey](src/common.ts)
- [decodeGetPublicKey](src/common.ts)
- [encodeGetPublicKeyResult](src/common.ts)
- [decodeGetPublicKeyResult](src/common.ts)
- [encodeECDSASignResult](src/common.ts)
- [decodeECDSASignResult](src/common.ts)
- [encodeTokenMetadata](src/common.ts)
- [decodeTokenMetadata](src/common.ts)

### bitcoin

#### NETWORK_ID

| Network | uint32 |
| --- | --- |
| BITCOIN_MAINNET | 1 |
| BITCOIN_TESTNET | 2 |
| LITECOIN_MAINNET | 3 |
| LITECOIN_TESTNET | 4 |
| DOGECOIN_MAINNET | 5 |

#### METHOD_ID

| Method | uint32 |
| --- | --- |
| GET_PUBLIC_KEY | 1 |
| SIGN_MESSAGE | 2 |
| SIGN_TRANSACTION | 3 |

#### Interfaces

- [ISignMessage](src/bitcoin.ts)
- [ISignTransaction](src/bitcoin.ts)
- [ISignTransactionResult](src/bitcoin.ts)

#### Functions

- [encodeSignMessage](src/bitcoin.ts)
- [decodeSignMessage](src/bitcoin.ts)
- [encodeSignTransaction](src/bitcoin.ts)
- [decodeSignTransaction](src/bitcoin.ts)
- [encodeSignTransactionResult](src/bitcoin.ts)
- [decodeSignTransactionResult](src/bitcoin.ts)

### ethereum

#### NETWORK_ID

| Network | uint32 |
| --- | --- |
| ETHEREUM_MAINNET | 1 |
| ETHEREUM_GOERLI | 2 |
| POLYGON_MAINNET | 3 |
| OPTIMISM_MAINNET | 4 |
| ARBITRUM_MAINNET | 5 |
| BSC_MAINNET | 6 |
| AVALANCHE_MAINNET | 7 |
| WBT_MAINNET | 8 |
| BASE_MAINNET | 9 |

#### METHOD_ID

| Method | uint32 |
| --- | --- |
| GET_PUBLIC_KEY | 1 |
| SIGN_PERSONAL_MESSAGE | 2 |
| SIGN_EIP712_MESSAGE | 3 |
| SIGN_EIP712_HASHED_MESSAGE | 4 |
| SIGN_TRANSACTION | 5 |

#### Interfaces

- [ISignPersonalMessage](src/ethereum.ts)
- [ISignEIP712Message](src/ethereum.ts)
- [ISignEIP712HashedMessage](src/ethereum.ts)
- [ISignTransaction](src/ethereum.ts)

#### Functions

- [encodeSignPersonalMessage](src/ethereum.ts)
- [decodeSignPersonalMessage](src/ethereum.ts)
- [encodeSignEIP712Message](src/ethereum.ts)
- [decodeSignEIP712Message](src/ethereum.ts)
- [encodeSignEIP712HashedMessage](src/ethereum.ts)
- [decodeSignEIP712HashedMessage](src/ethereum.ts)
- [encodeSignTransaction](src/ethereum.ts)
- [decodeSignTransaction](src/ethereum.ts)

### tron

#### NETWORK_ID

| Network | uint32 |
| --- | --- |
| TRON_MAINNET | 1 |
| TRON_TESTNET | 2 |

#### METHOD_ID

| Method | uint32 |
| --- | --- |
| GET_PUBLIC_KEY | 1 |
| SIGN_PERSONAL_MESSAGE | 2 |
| SIGN_TRANSACTION | 3 |

#### Interfaces

- [ISignPersonalMessage](src/tron.ts)
- [ISignTransaction](src/tron.ts)

#### Functions

- [encodeSignPersonalMessage](src/tron.ts)
- [decodeSignPersonalMessage](src/tron.ts)
- [encodeSignTransaction](src/tron.ts)
- [decodeSignTransaction](src/tron.ts)

## License

[MIT](LICENSE)
