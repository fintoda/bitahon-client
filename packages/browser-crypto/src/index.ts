import {IEcc, ICryptoProvider} from '@bitahon/crypto';
import CryptoJS from 'crypto-js';
import * as secp256k1 from 'tiny-secp256k1';
import varuint from 'varuint-bitcoin';

function wordsToBytes(data: CryptoJS.lib.WordArray): Uint8Array {
  const dataArray = new Uint8Array(data.sigBytes);
  for (let i = 0x0; i < data.sigBytes; i++) {
    dataArray[i] = (data.words[i >>> 0x2] >>> (0x18 - (i % 0x4) * 0x8)) & 0xff;
  }
  return dataArray;
}

function bytesToWords(src: Uint8Array): CryptoJS.lib.WordArray {
  return CryptoJS.lib.WordArray.create(src as unknown as number[]);
}

type SignRecoverable = {
  signature: Uint8Array;
  recoveryId: 0 | 1 | 2 | 3;
};

interface XOnlyPointAddTweakResult {
  parity: 1 | 0;
  xOnlyPubkey: Uint8Array;
}

export class Ecc implements IEcc {
  isPoint(A: Uint8Array): boolean {
    return secp256k1.isPoint(A);
  }
  isPrivate(d: Uint8Array): boolean {
    return secp256k1.isPrivate(d);
  }
  pointAddScalar(
    A: Uint8Array,
    tweak: Uint8Array,
    compressed = true,
  ): Uint8Array | null {
    return secp256k1.pointAddScalar(A, tweak, compressed);
  }
  pointFromScalar(d: Uint8Array, compressed = true): Uint8Array | null {
    return secp256k1.pointFromScalar(d, compressed);
  }
  pointMultiply(
    A: Uint8Array,
    tweak: Uint8Array,
    compressed = true,
  ): Uint8Array | null {
    return secp256k1.pointMultiply(A, tweak, compressed);
  }
  pointCompress(A: Uint8Array, compressed = true): Uint8Array {
    return secp256k1.pointCompress(A, compressed);
  }
  signRecoverable(h: Uint8Array, d: Uint8Array): SignRecoverable {
    const sign = secp256k1.signRecoverable(h, d);
    return {
      signature: sign.signature,
      recoveryId: sign.recoveryId,
    };
  }
  recover(
    h: Uint8Array,
    signature: Uint8Array,
    recoveryId: number,
    compressed = true,
  ): Uint8Array | null {
    return secp256k1.recover(
      h,
      signature,
      recoveryId as secp256k1.RecoveryIdType,
      compressed,
    );
  }
  isXOnlyPoint(p: Uint8Array): boolean {
    return secp256k1.isXOnlyPoint(p);
  }
  xOnlyPointAddTweak(
    p: Uint8Array,
    tweak: Uint8Array,
  ): XOnlyPointAddTweakResult | null {
    return secp256k1.xOnlyPointAddTweak(p, tweak);
  }
}

export class CryptoProvider implements ICryptoProvider {
  ecc: IEcc;

  constructor() {
    this.ecc = new Ecc();
  }

  async randomBytes(length: number): Promise<Buffer> {
    return Buffer.from(crypto.getRandomValues(new Uint8Array(length)));
  }

  sha256(src: Buffer): Buffer {
    const hash = CryptoJS.SHA256(bytesToWords(src));
    return Buffer.from(wordsToBytes(hash));
  }

  hash256(src: Buffer): Buffer {
    return this.sha256(this.sha256(src));
  }

  hmacSHA512(key: Buffer, data: Buffer): Buffer {
    const hash = CryptoJS.HmacSHA512(bytesToWords(data), bytesToWords(key));
    return Buffer.from(wordsToBytes(hash));
  }

  magicHash(message: Buffer, prefix?: Buffer): Buffer {
    if (!prefix) {
      prefix = Buffer.from('\u0018Bitcoin Signed Message:\n', 'utf8');
    }

    const messageVISize = varuint.encodingLength(message.length);

    const buffer = Buffer.allocUnsafe(
      prefix.length + messageVISize + message.length,
    );

    prefix.copy(buffer, 0);
    varuint.encode(message.length, buffer, prefix.length);
    message.copy(buffer, prefix.length + messageVISize);

    return this.hash256(buffer);
  }

  async encrypt(key: Buffer, data: Buffer): Promise<Buffer> {
    const iv = await this.randomBytes(16);

    const enc = CryptoJS.AES.encrypt(bytesToWords(data), bytesToWords(key), {
      iv: bytesToWords(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return Buffer.concat([iv, wordsToBytes(enc.ciphertext)]);
  }

  async decrypt(key: Buffer, data: Buffer): Promise<Buffer> {
    const iv = data.slice(0, 16);
    const value = data.slice(16);

    const dec = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({
        ciphertext: bytesToWords(value),
      }),
      bytesToWords(key),
      {
        iv: bytesToWords(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );

    return Buffer.from(wordsToBytes(dec));
  }

  async randomPrivateKey(): Promise<Buffer> {
    let priv: Buffer;

    do {
      priv = await this.randomBytes(32);
    } while (!secp256k1.isPrivate(priv));

    return priv;
  }

  ecdh(pub: Buffer, priv: Buffer): Buffer {
    if (!this.ecc.isPoint(pub)) {
      throw new Error('invalid public');
    }
    if (!this.ecc.isPrivate(priv)) {
      throw new Error('invalid private');
    }
    const point = this.ecc.pointMultiply(pub, priv, true);
    if (!point) {
      throw new Error('ecdh error');
    }
    return this.sha256(Buffer.from(point));
  }
}

const cryptoProvider = new CryptoProvider();

export default cryptoProvider;
