export type SignRecoverable = {
  signature: Uint8Array;
  recoveryId: 0 | 1 | 2 | 3;
};

export interface XOnlyPointAddTweakResult {
  parity: 1 | 0;
  xOnlyPubkey: Uint8Array;
}

export interface IEcc {
  isPoint(A: Uint8Array): boolean;
  isPrivate(d: Uint8Array): boolean;
  pointAddScalar(
    A: Uint8Array,
    tweak: Uint8Array,
    compressed?: boolean,
  ): Uint8Array | null;
  pointFromScalar(d: Uint8Array, compressed?: boolean): Uint8Array | null;
  pointMultiply(
    A: Uint8Array,
    tweak: Uint8Array,
    compressed?: boolean,
  ): Uint8Array | null;
  pointCompress(A: Uint8Array, compressed: boolean): Uint8Array;
  signRecoverable(h: Uint8Array, d: Uint8Array): SignRecoverable;
  recover(
    h: Uint8Array,
    signature: Uint8Array,
    recoveryId: number,
    compressed?: boolean,
  ): Uint8Array | null;
  isXOnlyPoint(p: Uint8Array): boolean;
  xOnlyPointAddTweak(
    p: Uint8Array,
    tweak: Uint8Array,
  ): XOnlyPointAddTweakResult | null;
}

export interface ICryptoProvider {
  ecc: IEcc;
  randomBytes(length: number): Promise<Buffer>;
  sha256(src: Buffer): Buffer;
  hash256(src: Buffer): Buffer;
  hmacSHA512(key: Buffer, data: Buffer): Buffer;
  magicHash(msg: Buffer, prefix?: Buffer): Buffer;
  encrypt(key: Buffer, data: Buffer): Promise<Buffer>;
  decrypt(key: Buffer, data: Buffer): Promise<Buffer>;
  randomPrivateKey(): Promise<Buffer>;
  ecdh(pub: Buffer, priv: Buffer): Buffer;
}

const crypto: {
  provider?: ICryptoProvider;
} = {
  provider: undefined,
};

export function initCryptoProvider(provider: ICryptoProvider) {
  crypto.provider = provider;
}

const proxy = new Proxy(crypto, {
  get(target, prop: keyof ICryptoProvider) {
    if (!target.provider) {
      throw new Error(
        'crypto is not initialized, call initCryptoProvider(ICryptoProvider);',
      );
    }
    if (!(prop in target.provider)) {
      throw new Error(`method: crypto.${prop}() is not exist`);
    }
    return target.provider[prop];
  },
});

export default proxy as ICryptoProvider;
