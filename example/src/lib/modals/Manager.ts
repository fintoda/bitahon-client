import {IContext, Payload, CloseReason} from './types';

type Modals = IContext['modals'];

type Subscriber = (value: Modals) => void;

class Manager {
  private subscribers = new Set<Subscriber>([]);
  private modals: Modals;

  constructor() {
    this.modals = {};
  }

  subscribe(cb: Subscriber) {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  register(uid: string) {
    this.updateModals(uid, {
      visible: false,
      payload: {},
    });
  }

  private updateModals<T>(key: string, data: T) {
    this.modals[key] = {
      ...this.modals[key],
      ...data,
    };
    this.subscribers.forEach((cb) => cb({...this.modals}));
    return this.modals;
  }

  getModals() {
    return {...this.modals};
  }

  open<T extends Payload>(uid: string, payload?: T) {
    if (!uid) {
      // eslint-disable-next-line no-console
      console.warn('Modals open: uid is required');
      return;
    }
    this.updateModals(uid, {
      visible: true,
      payload: payload,
    });
  }

  openAsync<T extends Payload, R extends CloseReason>(uid: string, payload?: T): Promise<R> {
    return new Promise((resolver) => {
      this.updateModals(uid, {
        visible: true,
        payload: payload,
        onClose: (reason: R) => resolver(reason),
      });
    });
  }

  update<T extends Payload>(uid: string, payload: T) {
    if (!uid) {
      // eslint-disable-next-line no-console
      console.warn('Modals open: uid is required');
      return;
    }
    const modal = this.modals[uid];
    this.updateModals(uid, {
      ...modal,
      payload: {...modal.payload, ...payload},
    });
  }

  close<T extends CloseReason>(uid: string, payload: T) {
    if (!uid) {
      // eslint-disable-next-line no-console
      console.warn('Modals close: uid is required');
      return;
    }
    const current = this.modals[uid];
    if (current?.onClose && current?.visible) {
      current?.onClose(payload);
    }
    this.updateModals(uid, {
      visible: false,
    });
  }
}

const manager = new Manager();

export default manager;
