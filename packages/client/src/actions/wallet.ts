import {APP_ID, wallet} from '@bitahon/protocol';
import crypto from '@bitahon/crypto';

import {IAction} from './types';

export type NewSessionParams = {
  title: string;
  description: string;
};

export type NewSessionResult = {
  wallet: Buffer;
  proof: Buffer;
  session: Buffer;
};

export class NewSessionAction implements IAction<NewSessionResult> {
  readonly app = APP_ID.WALLET;
  readonly method = wallet.METHOD_ID.NEW_SESSION;
  readonly authRequired = false;
  readonly params: NewSessionParams;

  private privateKey?: Buffer;

  constructor(params: NewSessionParams) {
    this.params = params;
  }

  async encodeParams(): Promise<Buffer> {
    this.privateKey = await crypto.randomPrivateKey();
    const msg = Buffer.concat([
      Buffer.from(this.params.title, 'utf8'),
      Buffer.from(this.params.description, 'utf8'),
    ]);
    const sign = crypto.ecc.signRecoverable(
      crypto.sha256(msg),
      this.privateKey,
    );

    const signEnc = Buffer.concat([
      sign.signature,
      Buffer.from([sign.recoveryId]),
    ]);

    const params = wallet.encodeNewSession({
      title: this.params.title,
      description: this.params.description,
      sign: signEnc,
    });

    return Buffer.from(params);
  }

  async decodeResult(data: Buffer): Promise<NewSessionResult> {
    if (!this.privateKey) {
      throw new Error('private key is not set');
    }

    const result = wallet.decodeNewSessionResult(data);

    if (
      result.wallet.length !== 32 ||
      result.proof.length !== 65 ||
      result.sign.length !== 65
    ) {
      throw new Error('invalid data');
    }

    const walletId = Buffer.from(result.wallet);
    const proof = Buffer.from(result.proof);

    const localPub = crypto.ecc.pointFromScalar(this.privateKey, true);
    if (!localPub) {
      throw new Error('wrong signature');
    }

    const localWalletPub = crypto.ecc.recover(
      crypto.magicHash(
        Buffer.concat([walletId, crypto.sha256(Buffer.from(localPub))]),
      ),
      proof.slice(0, 64),
      proof[64],
      true,
    );
    if (!localWalletPub) {
      throw new Error('wrong signature');
    }

    if (walletId.compare(crypto.sha256(Buffer.from(localWalletPub))) !== 0) {
      throw new Error('wrong signature');
    }

    const sign = Buffer.from(result.sign);

    const pub = crypto.ecc.recover(
      crypto.sha256(Buffer.concat([walletId, proof])),
      sign.slice(0, 64),
      sign[64],
      true,
    );
    if (!pub) {
      throw new Error('wrong signature');
    }

    const res: NewSessionResult = {
      wallet: walletId,
      proof,
      session: Buffer.concat([pub, this.privateKey]),
    };
    this.privateKey = undefined;

    return res;
  }
}
