import {IBip32Path} from './common';
import protocol from './protocol';

export enum METHOD_ID {
  GET_PUBLIC_KEY = 1,
  SIGN_MESSAGE = 2,
  SIGN_TRANSACTION = 3,
}

export interface ISignMessage {
  network: number;
  path: IBip32Path;
  msg: Uint8Array;
}

export const SignMessage = protocol.lookupType('bitcoin.SignMessage');

export function encodeSignMessage(obj: ISignMessage): Uint8Array {
  return SignMessage.encode(
    SignMessage.fromObject(obj),
  ).finish();
}

export function decodeSignMessage(data: Uint8Array): ISignMessage {
  return SignMessage.toObject(
    SignMessage.decode(data),
  ) as ISignMessage;
}

export interface ISignTransaction {
  network: number;
  psbt: Uint8Array;
  paths: {
    [key: number]: IBip32Path;
  };
  changePaths: {
    [key: number]: IBip32Path;
  };
  finalize: boolean;
}

export const SignTransaction = protocol.lookupType('bitcoin.SignTransaction');

export function encodeSignTransaction(obj: ISignTransaction): Uint8Array {
  return SignTransaction.encode(
    SignTransaction.fromObject(obj),
  ).finish();
}

export function decodeSignTransaction(data: Uint8Array): ISignTransaction {
  return SignTransaction.toObject(
    SignTransaction.decode(data),
  ) as ISignTransaction;
}

export interface ISignTransactionResult {
  tx: Uint8Array;
}

export const SignTransactionResult = protocol.lookupType('bitcoin.SignTransactionResult');

export function encodeSignTransactionResult(obj: ISignTransactionResult): Uint8Array {
  return SignTransactionResult.encode(
    SignTransactionResult.fromObject(obj),
  ).finish();
}

export function decodeSignTransactionResult(data: Uint8Array): ISignTransactionResult {
  return SignTransactionResult.toObject(
    SignTransactionResult.decode(data),
  ) as ISignTransactionResult;
}
