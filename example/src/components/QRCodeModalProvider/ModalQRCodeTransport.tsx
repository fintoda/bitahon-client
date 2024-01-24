import React from 'react';
import Modal from "@/components/Modal";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import modalQRCode, {PayloadType, ResultType} from './modalQrCode';
import { useModal } from "@/lib/modals";
import {QrCodeSender, QrCodeReceiver} from '@bitahon/qrcode';
import { useMediaQuery } from '@mui/material';

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

const DialogSx = {
  '.MuiDialog-paper': {
    '@media (max-width: 568px)': {
      margin: 1,
      width: '100%',
    }
  },
  '.MuiDialogContent-root': {
    '@media (max-width: 568px)': {
      padding: 1,
    }
  }
}

function ModalQRCodeTransportView({visible, close, payload}: ModalQRCodeTransportViewProps) {
  const [step, setStep] = React.useState<'request' | 'response'>('request');
  const [cameraFliped, setCameraFliped] = React.useState(false);
  const matchesSmall = useMediaQuery('(max-width:568px)');

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

  const flipCamera = () => {
    setCameraFliped(!cameraFliped);
  }

  return (
    <Modal open={visible} title={title} fullWidth={true}
      maxWidth={'sm'} 
      onClose={closeHandler}
      footer={step  === 'request' ? (
        <Button onClick={showResponse}>Next</Button>
      ): null}
      sx={DialogSx}
    >
       {step === 'response' ? (
          <QrCodeReceiver
            onError={(err) => console.error(err)}
            onScanFinish={successHandler}
            onDecode={(res) => console.log('onDecode', res)}
            videoStyle={cameraFliped ? {transform: 'scaleX(-100%)'} : undefined}
            renderProgress={({chunks}) => {
              const count = chunks.length;
              let percent = 0;
              if (count) {
                const recieved = chunks.filter((it) => it).length;
                percent = Math.ceil((recieved * 100) / count);
              } 
              return (
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <div>{`${percent}%`}</div>
                  <Button onClick={flipCamera}>Flip Camera</Button>
                </Stack>
              )
            }}
          />
        ) : (
          <div className="text-center">
            <QrCodeSender data={payload.data} size={matchesSmall ? 280 : 300} speed={1000} />
          </div>
        )}
    </Modal>
  )
}
