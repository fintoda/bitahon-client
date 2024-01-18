import React from 'react';

import Context from './Context';
import manager from './Manager';
import {CloseReason, IContext, IModal, Payload} from './types';

function useModal<P extends Payload = Payload, R extends CloseReason = CloseReason>(
  uid: string,
): [IModal<P, R>, (arg: R) => void] {
  const {modals} = React.useContext(Context) as IContext;
  const modal: IModal<P, R> = modals[uid];

  const close = React.useCallback(
    (reason: R) => {
      manager.close(uid, reason);
    },
    [uid],
  );

  return React.useMemo(() => {
    return [modal, close];
  }, [close, modal]);
}

export default useModal;
