import {APP_ID} from '@bitahon/protocol';

export interface IAction<T> {
  app: APP_ID;
  method: number;
  authRequired: boolean;
  encodeParams(): Promise<Buffer>;
  decodeResult(data: Buffer): Promise<T>;
}

export type ECDSASignResult = {
  v: number;
  r: Buffer;
  s: Buffer;
};
