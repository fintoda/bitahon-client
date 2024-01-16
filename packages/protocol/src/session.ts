import protocol from './protocol';

export interface IApiRequest {
  id: number;
  app: number;
  method: number;
  params: Uint8Array;
}

export const ApiRequest = protocol.lookupType('session.ApiRequest');

export function encodeApiRequest(obj: IApiRequest): Uint8Array {
  return ApiRequest.encode(
    ApiRequest.fromObject(obj),
  ).finish();
}

export function decodeApiRequest(data: Uint8Array): IApiRequest {
  return ApiRequest.toObject(
    ApiRequest.decode(data),
  ) as IApiRequest;
}

export interface IApiResponse {
  id: number;
  result: Uint8Array;
}

export const ApiResponse = protocol.lookupType('session.ApiResponse');

export function encodeApiResponse(obj: IApiResponse): Uint8Array {
  return ApiResponse.encode(
    ApiResponse.fromObject(obj),
  ).finish();
}

export function decodeApiResponse(data: Uint8Array): IApiResponse {
  return ApiResponse.toObject(
    ApiResponse.decode(data),
  ) as IApiResponse;
}
