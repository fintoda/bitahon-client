import React from 'react';
import Modal from "@/components/Modal";
import Button from '@mui/material/Button';
import modalQRCode, {PayloadType, ResultType} from './modalQrCode';
import { useModal } from "@/lib/modals";
import {QrCodeSender, QrCodeReceiver} from '@bitahon/qrcode';
import  '@bitahon/qrcode/dist/style.css';

function ModalQRCodeTransport() {
  const [data, close] = useModal<PayloadType, ResultType>(modalQRCode.UID);
  const {visible, payload} = data ?? {};

  if (!visible) {
    return null;
  }

  return <ModalQRCodeTransportView close={close} visible={visible} payload={payload} />
}

export default ModalQRCodeTransport;

interface ModalQRCodeTransportViewProps {
  visible: boolean;
  payload: PayloadType;
  close: (reason: ResultType) => void;
}

function ModalQRCodeTransportView({visible, close, payload}: ModalQRCodeTransportViewProps) {
 
  const [step, setStep] = React.useState<'request' | 'response'>('request');

  const closeHandler = React.useCallback(() => {
    close({
      type: 'cancel',
      data: null,
    });
  }, [close]);

  const successHandler = React.useCallback((data: Buffer) => {
    close({
      type: 'success',
      data: data,
    });
  }, [close]);

  const title = step  === 'request' ?  'QR Code' : 'Scan QR Code';
  const showResponse = () => setStep('response');

  return (
    <Modal open={visible} title={title} fullWidth={true} maxWidth={'sm'} onClose={closeHandler}
      footer={step  === 'request' ? (
        <Button onClick={showResponse}>Next</Button>
      ): null}
    >
       {step === 'response' ? (
          <QrCodeReceiver onScanned={successHandler} />
        ) : (
          <div className="text-center">
            <QrCodeSender data={payload.data} size={300} speed={1000} />
          </div>
        )}
    </Modal>
  )
}
