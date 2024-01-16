import {IBip32Path, ITokenMetadata} from './common';
import protocol from './protocol';

export enum METHOD_ID {
  GET_PUBLIC_KEY = 1,
  SIGN_PERSONAL_MESSAGE = 2,
  SIGN_TRANSACTION = 3,
}

export interface ISignPersonalMessage {
  network: number;
  path: IBip32Path;
  msg: Uint8Array;
}

export const SignPersonalMessage = protocol.lookupType('tron.SignPersonalMessage');

export function encodeSignPersonalMessage(obj: ISignPersonalMessage): Uint8Array {
  return SignPersonalMessage.encode(
    SignPersonalMessage.fromObject(obj),
  ).finish();
}

export function decodeSignPersonalMessage(data: Uint8Array): ISignPersonalMessage {
  return SignPersonalMessage.toObject(
    SignPersonalMessage.decode(data),
  ) as ISignPersonalMessage;
}

export interface ISignTransaction {
  network: number;
  path: IBip32Path;
  rawTx: Uint8Array;
  tokens: ITokenMetadata[];
}

export const SignTransaction = protocol.lookupType('tron.SignTransaction');

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
