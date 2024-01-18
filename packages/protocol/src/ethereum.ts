import {IBip32Path, ITokenMetadata} from './common';
import protocol from './protocol';

export enum NETWORK_ID {
  ETHEREUM_MAINNET = 1,
  ETHEREUM_GOERLI = 2,
  POLYGON_MAINNET = 3,
  OPTIMISM_MAINNET = 4,
  ARBITRUM_MAINNET = 5,
  BSC_MAINNET = 6,
  AVALANCHE_MAINNET = 7,
  WBT_MAINNET = 8,
  BASE_MAINNET = 9,
}

export enum METHOD_ID {
  GET_PUBLIC_KEY = 1,
  SIGN_PERSONAL_MESSAGE = 2,
  SIGN_EIP712_MESSAGE = 3,
  SIGN_EIP712_HASHED_MESSAGE = 4,
  SIGN_TRANSACTION = 5,
}

export interface ISignPersonalMessage {
  network: NETWORK_ID;
  path: IBip32Path;
  msg: Uint8Array;
}

export const SignPersonalMessage = protocol.lookupType('ethereum.SignPersonalMessage');

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

export interface ISignEIP712Message {
  network: NETWORK_ID;
  path: IBip32Path;
  msg: string;
}

export const SignEIP712Message = protocol.lookupType('ethereum.SignEIP712Message');

export function encodeSignEIP712Message(obj: ISignEIP712Message): Uint8Array {
  return SignEIP712Message.encode(
    SignEIP712Message.fromObject(obj),
  ).finish();
}

export function decodeSignEIP712Message(data: Uint8Array): ISignEIP712Message {
  return SignEIP712Message.toObject(
    SignEIP712Message.decode(data),
  ) as ISignEIP712Message;
}

export interface ISignEIP712HashedMessage {
  network: NETWORK_ID;
  path: IBip32Path;
  domainHash: Uint8Array;
  messageHash: Uint8Array;
}

export const SignEIP712HashedMessage = protocol.lookupType('ethereum.SignEIP712HashedMessage');

export function encodeSignEIP712HashedMessage(obj: ISignEIP712HashedMessage): Uint8Array {
  return SignEIP712HashedMessage.encode(
    SignEIP712HashedMessage.fromObject(obj),
  ).finish();
}

export function decodeSignEIP712HashedMessage(data: Uint8Array): ISignEIP712HashedMessage {
  return SignEIP712HashedMessage.toObject(
    SignEIP712HashedMessage.decode(data),
  ) as ISignEIP712HashedMessage;
}

export interface ISignTransaction {
  network: NETWORK_ID;
  path: IBip32Path;
  rawTx: Uint8Array;
  tokens: ITokenMetadata[];
}

export const SignTransaction = protocol.lookupType('ethereum.SignTransaction');

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
