import {APP_ID, common, bitcoin} from '@bitahon/protocol';

import {Bip32Curve, Bip32Path} from '../bip32';

import {IAction} from './types';

export type GetPublicKeyParams = {
  network: bitcoin.NETWORK_ID;
  path: string;
};

export type GetPublicKeyResult = {
  depth: number;
  index: number;
  publicKey: Buffer;
  chainCode: Buffer;
  fingerprint: number;
};

export type SignMessageParams = {
  network: bitcoin.NETWORK_ID;
  path: string;
  msg: Buffer;
};

export type SignMessageResult = {
  v: number;
  r: Buffer;
  s: Buffer;
};

export type SignTransactionParams = {
  network: bitcoin.NETWORK_ID;
  psbt: Buffer;
  paths: {
    [key: number]: string;
  };
  changePaths: {
    [key: number]: string;
  };
  finalize: boolean;
};

export type SignTransactionResult = {
  tx: Buffer;
};

export class GetPublicKeyAction implements IAction<GetPublicKeyResult> {
  readonly app = APP_ID.BITCOIN;
  readonly method = bitcoin.METHOD_ID.GET_PUBLIC_KEY;
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

export class SignMessageAction implements IAction<SignMessageResult> {
  readonly app = APP_ID.BITCOIN;
  readonly method = bitcoin.METHOD_ID.SIGN_MESSAGE;
  readonly authRequired = true;
  readonly params: SignMessageParams;

  constructor(params: SignMessageParams) {
    this.params = params;
  }

  async encodeParams(): Promise<Buffer> {
    const path = Bip32Path.fromString(this.params.path, Bip32Curve.secp256k1);
    if (!path.isValid()) {
      throw new Error(`invalid bip32 path: "${this.params.path}"`);
    }

    const params = bitcoin.encodeSignMessage({
      network: this.params.network,
      path,
      msg: this.params.msg,
    });

    return Buffer.from(params);
  }

  async decodeResult(data: Buffer): Promise<SignMessageResult> {
    const result = common.decodeECDSASignResult(data);

    const res: SignMessageResult = {
      v: result.v,
      r: Buffer.from(result.r),
      s: Buffer.from(result.s),
    };

    return res;
  }
}

export class SignTransactionAction implements IAction<SignTransactionResult> {
  readonly app = APP_ID.BITCOIN;
  readonly method = bitcoin.METHOD_ID.SIGN_TRANSACTION;
  readonly authRequired = true;
  readonly params: SignTransactionParams;

  constructor(params: SignTransactionParams) {
    this.params = params;
  }

  async encodeParams(): Promise<Buffer> {
    if (!this.params.psbt.length) {
      throw new Error('invalid PSBT');
    }

    const paths: {
      [key: number]: Bip32Path;
    } = {};

    for (const i in this.params.paths) {
      paths[i] = Bip32Path.fromString(
        this.params.paths[i],
        Bip32Curve.secp256k1,
      );
      if (!paths[i].isValid()) {
        throw new Error(`invalid bip32 path: "${paths[i]}"`);
      }
    }

    const changePaths: {
      [key: number]: Bip32Path;
    } = {};

    for (const i in this.params.changePaths) {
      changePaths[i] = Bip32Path.fromString(
        this.params.changePaths[i],
        Bip32Curve.secp256k1,
      );
      if (!changePaths[i].isValid()) {
        throw new Error(`invalid bip32 path: "${this.params.changePaths[i]}"`);
      }
    }

    const params = bitcoin.encodeSignTransaction({
      network: this.params.network,
      psbt: this.params.psbt,
      paths,
      changePaths,
      finalize: this.params.finalize,
    });

    return Buffer.from(params);
  }

  async decodeResult(data: Buffer): Promise<SignTransactionResult> {
    const result = bitcoin.decodeSignTransactionResult(data);

    const res: SignTransactionResult = {
      tx: Buffer.from(result.tx),
    };

    return res;
  }
}
