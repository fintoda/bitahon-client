import manager from './Manager';
import {CloseReason, Payload} from './types';

class Modal<P extends Payload = Payload, R extends CloseReason = CloseReason> {
  public UID: string;
  constructor(uid: string) {
    this.UID = uid;
    manager.register(this.UID);
  }

  open(payload?: P): void {
    manager.open(this.UID, payload);
  }

  async openAsync(payload?: P): Promise<R> {
    return await manager.openAsync(this.UID, payload);
  }

  close(payload: R) {
    manager.close(this.UID, payload);
  }

  update(payload: Partial<P>) {
    manager.update(this.UID, payload);
  }
}

export default Modal;
