import {transport, session} from '@bitahon/protocol';

import {IAction} from './actions/types';
import {
  NewSessionAction,
  NewSessionParams,
  NewSessionResult,
} from './actions/wallet';
import crypto from './crypto';

export interface IClientConnectionProvider {
  send(data: Buffer): Promise<Buffer>;
}

export class ClientSession {
  readonly publicKey: Buffer;

  private privateKey: Buffer;
  private ecdh: Buffer;

  constructor(pub: Buffer, priv: Buffer) {
    this.publicKey = pub;
    this.privateKey = priv;
    this.ecdh = crypto.ecdh(pub, priv);
  }

  static fromBuffer(buffer: Buffer): ClientSession {
    const pub = buffer.slice(0, 33);
    const priv = buffer.slice(33, 65);
    return new ClientSession(pub, priv);
  }

  static fromString(str: string): ClientSession {
    return ClientSession.fromBuffer(Buffer.from(str, 'base64'));
  }

  encrypt(data: Buffer): Promise<Buffer> {
    return crypto.encrypt(this.ecdh, data);
  }

  decrypt(data: Buffer): Promise<Buffer> {
    return crypto.decrypt(this.ecdh, data);
  }

  sign(data: Buffer): Buffer {
    const sign = crypto.ecc.signRecoverable(
      crypto.sha256(data),
      this.privateKey,
    );
    return Buffer.concat([sign.signature, Buffer.from([sign.recoveryId])]);
  }

  toBuffer(): Buffer {
    return Buffer.concat([this.publicKey, this.privateKey]);
  }

  toString(): string {
    return this.toBuffer().toString('base64');
  }

  toJSON() {
    return this.toString();
  }
}

export class ClientRequest<T> {
  readonly id: number;
  readonly data: Buffer;

  protected action: IAction<T>;
  protected session?: ClientSession;

  constructor(
    action: IAction<T>,
    id: number,
    data: Buffer,
    session?: ClientSession,
  ) {
    this.id = id;
    this.data = data;

    this.action = action;
    this.session = session;
  }

  async response(data: Buffer): Promise<T> {
    const apiTransport = transport.decodeApiTransport(data);
    const apiTransportData = Buffer.from(apiTransport.data);

    if (!apiTransport.sign) {
      if (this.action.authRequired) {
        throw new Error('auth required');
      }

      const res = session.decodeApiResponse(apiTransportData);
      if (res.id !== this.id) {
        throw new Error('invalid response id');
      }
      return this.action.decodeResult(Buffer.from(res.result));
    }

    if (!this.session) {
      throw new Error('session required');
    }

    const sign = apiTransport.sign.slice(0, 64);
    const recId = apiTransport.sign[64];

    const pub = crypto.ecc.recover(
      crypto.sha256(apiTransportData),
      sign,
      recId,
      true,
    );
    if (!pub) {
      throw new Error('wrong signature');
    }
    if (this.session.publicKey.compare(pub) !== 0) {
      throw new Error('wrong signature');
    }

    const decData = await this.session.decrypt(apiTransportData);

    const res = session.decodeApiResponse(decData);
    if (res.id !== this.id) {
      throw new Error('invalid response id');
    }

    return this.action.decodeResult(Buffer.from(res.result));
  }
}

export class Client {
  private connection: IClientConnectionProvider;
  private reqId: number = 0;
  private session?: ClientSession;

  constructor(connection: IClientConnectionProvider, session?: ClientSession) {
    this.connection = connection;
    this.session = session;
  }

  setSession(session: ClientSession) {
    this.session = session;
  }

  async request<T>(action: IAction<T>): Promise<T> {
    this.reqId++;

    const data = session.encodeApiRequest({
      id: this.reqId,
      app: action.app,
      method: action.method,
      params: await action.encodeParams(),
    });

    let req: Uint8Array;

    if (!action.authRequired) {
      req = transport.encodeApiTransport({
        data,
      });
    } else {
      if (!this.session) {
        throw new Error('action required session');
      }

      const enc = await this.session.encrypt(Buffer.from(data));
      const sign = this.session.sign(enc);

      req = transport.encodeApiTransport({
        data: enc,
        sign,
      });
    }

    const cr = new ClientRequest(
      action,
      this.reqId,
      Buffer.from(req),
      this.session,
    );

    const responseData = await this.connection.send(cr.data);

    return cr.response(responseData);
  }

  async auth(params: NewSessionParams): Promise<NewSessionResult> {
    const action = new NewSessionAction(params);
    const res = await this.request(action);
    const session = ClientSession.fromBuffer(res.session);
    this.setSession(session);

    return res;
  }
}
