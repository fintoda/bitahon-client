import {APP_ID, common, tron} from '@bitahon/protocol';

import {Bip32Curve, Bip32Path} from '../bip32';

import {ECDSASignResult, IAction} from './types';

export type GetPublicKeyParams = {
  network: tron.NETWORK_ID;
  path: string;
};

export type GetPublicKeyResult = {
  depth: number;
  index: number;
  publicKey: Buffer;
  chainCode: Buffer;
  fingerprint: number;
};

export type SignPersonalMessageParams = {
  network: tron.NETWORK_ID;
  path: string;
  msg: Buffer;
};

export type SignTransactionParams = {
  network: tron.NETWORK_ID;
  path: string;
  rawTx: Buffer;
  tokens?: common.ITokenMetadata[];
};

export class GetPublicKeyAction implements IAction<GetPublicKeyResult> {
  readonly app = APP_ID.TRON;
  readonly method = tron.METHOD_ID.GET_PUBLIC_KEY;
  readonly authRequired = true;
  readonly params: GetPublicKeyParams;

  constructor(params: GetPublicKeyParams) {
    this.params = params;
  }

  async encodeParams(): Promise<Buffer> {
    const path = Bip32Path.fromString(this.params.path, Bip32Curve.secp256k1);
    if (!path.isValid()) {
      throw new Error(`invalid bip32 path: "${this.params.path}"`);
    }

    const params = common.encodeGetPublicKey({
      network: this.params.network,
      path,
    });

    return Buffer.from(params);
  }

  async decodeResult(data: Buffer): Promise<GetPublicKeyResult> {
    const result = common.decodeGetPublicKeyResult(data);

    const res: GetPublicKeyResult = {
      depth: result.depth,
      index: result.index,
      publicKey: Buffer.from(result.publicKey),
      chainCode: Buffer.from(result.chainCode),
      fingerprint: result.fingerprint,
    };

    return res;
  }
}

export class SignPersonalMessageAction implements IAction<ECDSASignResult> {
  readonly app = APP_ID.TRON;
  readonly method = tron.METHOD_ID.SIGN_PERSONAL_MESSAGE;
  readonly authRequired = true;
  readonly params: SignPersonalMessageParams;

  constructor(params: SignPersonalMessageParams) {
    this.params = params;
  }

  async encodeParams(): Promise<Buffer> {
    const path = Bip32Path.fromString(this.params.path, Bip32Curve.secp256k1);
    if (!path.isValid()) {
      throw new Error(`invalid bip32 path: "${this.params.path}"`);
    }

    const params = tron.encodeSignPersonalMessage({
      network: this.params.network,
      path,
      msg: this.params.msg,
    });

    return Buffer.from(params);
  }

  async decodeResult(data: Buffer): Promise<ECDSASignResult> {
    const result = common.decodeECDSASignResult(data);

    const res: ECDSASignResult = {
      v: result.v,
      r: Buffer.from(result.r),
      s: Buffer.from(result.s),
    };

    return res;
  }
}

export class SignTransactionAction implements IAction<ECDSASignResult> {
  readonly app = APP_ID.TRON;
  readonly method = tron.METHOD_ID.SIGN_TRANSACTION;
  readonly authRequired = true;
  readonly params: SignTransactionParams;

  constructor(params: SignTransactionParams) {
    this.params = params;
  }

  async encodeParams(): Promise<Buffer> {
    const path = Bip32Path.fromString(this.params.path, Bip32Curve.secp256k1);
    if (!path.isValid()) {
      throw new Error(`invalid bip32 path: "${this.params.path}"`);
    }

    const params = tron.encodeSignTransaction({
      network: this.params.network,
      path,
      rawTx: this.params.rawTx,
      tokens: this.params.tokens || [],
    });

    return Buffer.from(params);
  }

  async decodeResult(data: Buffer): Promise<ECDSASignResult> {
    const result = common.decodeECDSASignResult(data);

    const res: ECDSASignResult = {
      v: result.v,
      r: Buffer.from(result.r),
      s: Buffer.from(result.s),
    };

    return res;
  }
}
