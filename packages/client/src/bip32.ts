import crypto from './crypto';

const HIGHEST_BIT = 0x80000000;
const UINT31_MAX = HIGHEST_BIT - 1;
const UINT32_MAX = 0xffffffff;

export function isUInt31(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0 && value <= UINT31_MAX;
}

export function parseBip32Path(src: string): number[] {
  const res = [];
  const path = src.toLowerCase().split('/');

  for (const item of path) {
    if (item === 'm') {
      continue;
    }

    if (item.slice(-1) === "'") {
      const index = parseInt(item.slice(0, -1), 10);
      if (!isUInt31(index)) {
        throw new TypeError('Missing index uint31');
      }
      res.push(HIGHEST_BIT + index);
    } else {
      const index = parseInt(item, 10);
      if (!isUInt31(index)) {
        throw new TypeError('Missing index uint31');
      }
      res.push(index);
    }
  }

  return res;
}

export function validateBip32Path(path: number[]): boolean {
  if (!path.length) {
    return false;
  }
  for (const item of path) {
    if (!Number.isSafeInteger(item) || item < 0 || item > UINT32_MAX) {
      return false;
    }
  }
  return true;
}

export function createBip32Path(path: number[], isRoot = false): string {
  let res = isRoot ? 'm/' : '';
  res += path
    .map((item) => (item >= HIGHEST_BIT ? `${item - HIGHEST_BIT}'` : `${item}`))
    .join('/');
  return res;
}

export enum Bip32Curve {
  'secp256k1' = 1,
  'secp256k1-decred' = 2,
  'secp256k1-groestl' = 3,
  'secp256k1-smart' = 4,
  'nist256p1' = 5,
  'ed25519' = 6,
  'ed25519-sha3' = 7,
  'ed25519-keccak' = 8,
  'curve25519' = 9,
}

export interface IBip32Path {
  value: number[];
  curve: number;
}

export class Bip32Path implements IBip32Path {
  readonly value: number[];
  readonly curve: Bip32Curve;

  constructor(obj: IBip32Path) {
    this.value = obj.value;
    this.curve = obj.curve;
  }

  static fromString(path: string, curve: Bip32Curve): Bip32Path {
    return new Bip32Path({
      value: parseBip32Path(path),
      curve,
    });
  }

  get length(): number {
    return this.value.length;
  }

  isValid(): boolean {
    return validateBip32Path(this.value);
  }

  toString(): string {
    return createBip32Path(this.value);
  }

  toJSON() {
    return this.toString();
  }
}

export interface IBip32Node {
  depth: number;
  index: number;
  publicKey: Buffer;
  chainCode: Buffer;
  fingerprint: number;
}

export class Bip32Node implements IBip32Node {
  readonly depth: number;
  readonly index: number;
  readonly publicKey: Buffer;
  readonly chainCode: Buffer;
  readonly fingerprint: number;

  constructor(node: IBip32Node) {
    this.depth = node.depth;
    this.index = node.index;
    this.publicKey = node.publicKey;
    this.chainCode = node.chainCode;
    this.fingerprint = node.fingerprint;
  }

  derive(index: number): Bip32Node {
    if (!Number.isSafeInteger(index) || index < 0 || index > UINT32_MAX) {
      throw new Error('invalid index');
    }

    const data = Buffer.allocUnsafe(37);
    this.publicKey.copy(data, 0);
    data.writeUInt32BE(index, 33);

    const I = crypto.hmacSHA512(this.chainCode, data);

    const IL = I.slice(0, 32);
    const IR = I.slice(32);

    if (!crypto.ecc.isPrivate(IL)) {
      return this.derive(index + 1);
    }

    const Ki = crypto.ecc.pointAddScalar(this.publicKey, IL, true);

    if (!Ki) {
      return this.derive(index + 1);
    }

    return new Bip32Node({
      depth: this.depth + 1,
      index,
      publicKey: Buffer.from(Ki),
      chainCode: IR,
      fingerprint: this.fingerprint,
    });
  }

  derivePath(path: number[]): Bip32Node {
    return path.reduce<Bip32Node>((prev, index) => {
      return prev.derive(index);
    }, this);
  }
}
