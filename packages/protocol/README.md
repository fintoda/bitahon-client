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
import {APP_ID, common, session, transport} from '@bitahon/protocol';

const bip32Path: common.IBip32Path = {
  value: [2147483692, 2147483648, 2147483648, 0, 0], // 44'/0'/0'/0/0
  curve: 1, // secp256k1
};

const params: Uint8Array = common.encodeGetPublicKey({
  network: 1, // Bitcoin Mainnet
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

### transport

#### Interfaces

- IApiTransport

#### Functions

- encodeApiTransport(obj: IApiTransport): Uint8Array
- decodeApiTransport(data: Uint8Array): IApiTransport

### session

### wallet

### common

### bitcoin

### ethereum

### tron

## License
