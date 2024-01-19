# @bitahon/qrcode

This module provides an implementation of the transport layer for QR Code communication in the Bitahon Protocol for React.

## Installation

### General

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @bitahon/qrcode
```

## Usage

```ts
import {QrCodeSender} from '@bitahon/qrcode';
import {transport} from '@bitahon/protocol';

function ExampleSender(props: { data: Buffer; }) {
  const payload: Uint8Array = transport.encodeApiTransport({
    data: props.data,
  });

  return (
    <QrCodeSender data={Buffer.from(payload)} size={300} speed={500} />
  );
}
```

```ts
import React from 'react';
import {QrCodeReceiver} from '@bitahon/qrcode';
import  '@bitahon/qrcode/dist/style.css';

function ExampleReceiver() {
  const successHandler = React.useCallback((data: Buffer) => {
    console.log(data.toString('hex'));
  }, []);

  return (
    <QrCodeReceiver onScanned={successHandler} />
  );
}
```

## API

### Interfaces

### Functions

## License

[MIT](LICENSE)
