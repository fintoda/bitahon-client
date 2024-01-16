import protocol from './protocol';

export interface IBip32Path {
  value: number[];
  curve: number;
}

export const Bip32Path = protocol.lookupType('common.Bip32Path');

export function encodeBip32Path(obj: IBip32Path): Uint8Array {
  return Bip32Path.encode(
    Bip32Path.fromObject(obj),
  ).finish();
}

export function decodeBip32Path(data: Uint8Array): IBip32Path {
  return Bip32Path.toObject(
    Bip32Path.decode(data),
  ) as IBip32Path;
}

export interface IGetPublicKey {
  network: number;
  path: IBip32Path;
}

export const GetPublicKey = protocol.lookupType('common.GetPublicKey');

export function encodeGetPublicKey(obj: IGetPublicKey): Uint8Array {
  return GetPublicKey.encode(
    GetPublicKey.fromObject(obj),
  ).finish();
}

export function decodeGetPublicKey(data: Uint8Array): IGetPublicKey {
  return GetPublicKey.toObject(
    GetPublicKey.decode(data),
  ) as IGetPublicKey;
}

export interface IGetPublicKeyResult {
  depth: number;
  index: number;
  publicKey: Uint8Array;
  chainCode: Uint8Array;
  fingerprint: number;
}

export const GetPublicKeyResult = protocol.lookupType('common.GetPublicKeyResult');

export function encodeGetPublicKeyResult(obj: IGetPublicKeyResult): Uint8Array {
  return GetPublicKeyResult.encode(
    GetPublicKeyResult.fromObject(obj),
  ).finish();
}

export function decodeGetPublicKeyResult(data: Uint8Array): IGetPublicKeyResult {
  return GetPublicKeyResult.toObject(
    GetPublicKeyResult.decode(data),
  ) as IGetPublicKeyResult;
}

export interface IECDSASignResult {
  v: number;
  r: Uint8Array;
  s: Uint8Array;
}

export const ECDSASignResult = protocol.lookupType('common.ECDSASignResult');

export function encodeECDSASignResult(obj: IECDSASignResult): Uint8Array {
  return ECDSASignResult.encode(
    ECDSASignResult.fromObject(obj),
  ).finish();
}

export function decodeECDSASignResult(data: Uint8Array): IECDSASignResult {
  return ECDSASignResult.toObject(
    ECDSASignResult.decode(data),
  ) as IECDSASignResult;
}

export interface ITokenMetadata {
  type: number;
  contract: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals?: number;
  icon?: Uint8Array;
  sign: Uint8Array;
}

export const TokenMetadata = protocol.lookupType('common.TokenMetadata');

export function encodeTokenMetadata(obj: ITokenMetadata): Uint8Array {
  return TokenMetadata.encode(
    TokenMetadata.fromObject(obj),
  ).finish();
}

export function decodeTokenMetadata(data: Uint8Array): ITokenMetadata {
  return TokenMetadata.toObject(
    TokenMetadata.decode(data),
  ) as ITokenMetadata;
}
