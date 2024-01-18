import React from 'react';
import Modal from "@/components/Modal";

import modalQRCode, {PayloadType, ResultType} from './modalQrCode';
import { useModal } from "@/lib/modals";

function ModalQRCodeTransport() {
  const [data, close] = useModal<PayloadType, ResultType>(modalQRCode.UID);
  const {visible} = data ?? {};

  const closeHandler = React.useCallback(() => {
    close({
      type: 'cancel',
      data: null,
    });
  }, [close]);

  // const successHandler = React.useCallback(
  //   (data: Buffer) => {
  //     close({
  //       type: 'success',
  //       data,
  //     });
  //   },
  //   [close],
  // );

  return (
    <Modal visible={visible} onClose={closeHandler}>
      <div>dededefefef</div>
    </Modal>
  )
}

export default ModalQRCodeTransport;
