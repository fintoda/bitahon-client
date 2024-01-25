import React from 'react';
import Modal from "@/components/Modal";
import Button from '@mui/material/Button';
import modalQRCode, {PayloadType, ResultType} from './modalQrCode';
import { useModal } from "@/lib/modals";
import {QrCodeSender, QrCodeReceiver, QrCodeReceiverProps} from '@bitahon/qrcode';
import {Box, useMediaQuery} from '@mui/material';

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
          <QrCodeReceiverComponent onScanFinish={successHandler} />
        ) : (
          <div className="text-center">
            <QrCodeSender data={payload.data} size={matchesSmall ? 280 : 300} speed={1000} />
          </div>
        )}
    </Modal>
  )
}

interface QrCodeReceiverComponentProps {
  onScanFinish: QrCodeReceiverProps['onScanFinish'];
}

function QrCodeReceiverComponent({
  onScanFinish,
}: QrCodeReceiverComponentProps) {
  const [chunksScanned, setChunksScanned] = React.useState<boolean[]>([]);

  const progress = React.useMemo(() => {
    const count = chunksScanned.length;
    let percent = 0;
    if (count) {
      const recieved = chunksScanned.filter((it) => it).length;
      percent = Math.ceil((recieved * 100) / count);
    }
    return percent;
  }, [chunksScanned]);
  
  return (
    <>
      <Box sx={{mb: 1}}>{`${progress}%`}</Box>
      <QrCodeReceiver
        onError={(err) => console.error(err)}
        onScanFinish={onScanFinish}
        onDecode={(res) => console.log('onDecode', res)}
        onChunksChanged={setChunksScanned}
      />
    </>
  )
}
