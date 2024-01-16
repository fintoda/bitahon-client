import protocol from './protocol';

export interface INewSession {
  title: string;
  description: string;
  sign: Uint8Array;
}

export const NewSession = protocol.lookupType('wallet.NewSession');

export function encodeNewSession(obj: INewSession): Uint8Array {
  return NewSession.encode(
    NewSession.fromObject(obj),
  ).finish();
}

export function decodeNewSession(data: Uint8Array): INewSession {
  return NewSession.toObject(
    NewSession.decode(data),
  ) as INewSession;
}

export interface INewSessionResult {
  wallet: Uint8Array;
  proof: Uint8Array;
  sign: Uint8Array;
}

export const NewSessionResult = protocol.lookupType('wallet.NewSessionResult');

export function encodeNewSessionResult(obj: INewSessionResult): Uint8Array {
  return NewSessionResult.encode(
    NewSessionResult.fromObject(obj),
  ).finish();
}

export function decodeNewSessionResult(data: Uint8Array): INewSessionResult {
  return NewSessionResult.toObject(
    NewSessionResult.decode(data),
  ) as INewSessionResult;
}
