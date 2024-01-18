# @bitahon/transport

The library implements functions and data types for encoding data into a series of QR Code messages for the Bitahon Protocol.

Depends on:
- [pako](https://www.npmjs.com/package/pako)

## Installation

### General

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @bitahon/transport
```

## Usage

```ts
import {
  encodeQRCodeChunks,
  decodeQRCodeChunk,
  decodeChunks,
} from '@bitahon/transport';

const src = Buffer.from('01020304', 'hex');

const chunks: string[] = encodeQRCodeChunks(src);

const chunk = decodeQRCodeChunk(chunks[0]);
console.log(chunk);

const dst: Buffer = decodeChunks([chunk]);
console.log(dst);
```

## API

### Interfaces

- [ChunkData](src/index.ts)

### Functions

- [encodeQRCodeChunks](src/index.ts)
- [decodeQRCodeChunk](src/index.ts)
- [decodeChunks](src/index.ts)

## License

[MIT](LICENSE)
