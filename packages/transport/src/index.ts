import pako from 'pako';

import crypto from '@bitahon/crypto';

export type ChunkData = {
  v: number;
  chunkNumber: number;
  chunksCount: number;
  data: Buffer;
};

export function encodeQRCodeChunks(data: Buffer, mtu: number = 256): string[] {
  const compressData = pako.deflate(data);
  const checkSum = crypto.sha256(data).slice(0, 4);
  const transportData = Buffer.concat([checkSum, compressData]);

  const packets_count = Math.ceil(transportData.length / mtu);
  const packets_size = Math.ceil(transportData.length / packets_count);
  const results: string[] = [];

  for (let i = 0; i < packets_count; i++) {
    const header = Buffer.alloc(5);
    header.writeUInt8(0x01, 0);
    header.writeUInt16BE(i, 1);
    header.writeUInt16BE(packets_count, 3);

    const offset = i * packets_size;

    const chunk = Buffer.concat([
      header,
      transportData.slice(offset, offset + packets_size),
    ]);

    results.push(chunk.toString('base64'));
  }

  return results;
}

export function decodeQRCodeChunk(src: string): ChunkData {
  const chunk = Buffer.from(src, 'base64');

  if (chunk.length <= 9) {
    throw new Error('decode error');
  }

  const v = chunk.readUInt8(0);

  if (v !== 0x01) {
    throw new Error('decode error');
  }

  return {
    v,
    chunkNumber: chunk.readUInt16BE(1),
    chunksCount: chunk.readUInt16BE(3),
    data: chunk.slice(5),
  };
}

export function decodeChunks(chunks: ChunkData[]): Buffer {
  const results: Buffer[] = [];
  const items = new Map<number, Buffer>();

  for (const chunk of chunks) {
    if (
      chunk.chunkNumber > chunk.chunksCount ||
      chunk.chunksCount !== chunks.length
    ) {
      throw new Error('decode error');
    }

    items.set(chunk.chunkNumber, chunk.data);
  }

  for (let i = 0; i < chunks.length; i++) {
    const v = items.get(i);

    if (v) {
      results.push(v);
    } else {
      throw new Error('decode error');
    }
  }

  const rawData = Buffer.concat(results);
  const checkSum = rawData.slice(0, 4);
  const data = Buffer.from(pako.inflate(rawData.slice(4)));

  const check = crypto.sha256(data).slice(0, 4);

  if (check.compare(checkSum) !== 0) {
    throw new Error('decode error');
  }

  return data;
}
