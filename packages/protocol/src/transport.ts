import protocol from './protocol';

export const ApiTransport = protocol.lookupType('transport.ApiTransport');

export interface IApiTransport {
  data: Uint8Array;
  sign?: Uint8Array;
}

export function encodeApiTransport(obj: IApiTransport): Uint8Array {
  return ApiTransport.encode(
    ApiTransport.fromObject(obj),
  ).finish();
}

export function decodeApiTransport(data: Uint8Array): IApiTransport {
  return ApiTransport.toObject(
    ApiTransport.decode(data),
  ) as IApiTransport;
}
