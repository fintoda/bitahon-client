/* eslint-disable @typescript-eslint/no-explicit-any */
export type Payload = {[K: string]: any};

export type CloseReason = {
  type: string;
  data?: unknown;
};

export interface IModal<P extends Payload = Payload, R extends CloseReason = CloseReason> {
  visible: boolean;
  payload: P;
  onClose?: (arg: R) => void;
}

export type IModals = Record<string, IModal<any, any>>;

export interface IContext {
  modals: IModals;
}

export type TypeOrNever<T> = [T] extends [never] ? void : T;
