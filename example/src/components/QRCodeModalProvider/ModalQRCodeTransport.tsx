import React from 'react';
import Modal from "@/components/Modal";
import Button from '@mui/material/Button';
import modalQRCode, {PayloadType, ResultType} from './modalQrCode';
import { useModal } from "@/lib/modals";
import {QrCodeSender, QrCodeReceiver, QrCodeReceiverProps} from '@bitahon/qrcode';
import {useMediaQuery} from '@mui/material';

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
  const [devices, currentTrack] = useMediaDevices();
  const [cameraFliped, setCameraFliped] = React.useState(false);
  const [currentDeviceId, setCurrentDeviceId] = React.useState<string>('');

  const flipCamera = () => {
    setCameraFliped(!cameraFliped);
  }

  React.useEffect(() => {
    if (currentTrack && !currentDeviceId) {
      setCurrentDeviceId(currentTrack.deviceId ?? '');
    }
  }, [currentDeviceId, currentTrack]);

  return (
    <QrCodeReceiver
      onError={(err) => console.error(err)}
      onScanFinish={onScanFinish}
      onDecode={(res) => console.log('onDecode', res)}
      videoStyle={cameraFliped ? {transform: 'scaleX(-100%)'} : undefined}
      deviceId={currentDeviceId}
      renderProgress={({chunks}) => {
        const count = chunks.length;
        let percent = 0;
        if (count) {
          const recieved = chunks.filter((it) => it).length;
          percent = Math.ceil((recieved * 100) / count);
        } 
        return (
          <div>
            <select
              style={{maxWidth: '100%', marginBottom: 8}}
              value={currentDeviceId}
              onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                const _deviceId = e.currentTarget.value;
                _deviceId && setCurrentDeviceId(_deviceId);
              }}>
              {devices.map((device) => {
                return (
                  <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
                )
              })}
            </select>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
              <div>{`${percent}%`}</div>
              <button onClick={flipCamera}>Flip Camera</button>
            </div>
          </div>
        )
      }}
    />
  )
}

const useMediaDevices = (): [MediaDeviceInfo[], MediaTrackSettings | null] => {
  const [devices, setDivices] = React.useState<MediaDeviceInfo[]>([]);
  const [current, setCurrent] = React.useState<MediaTrackSettings | null>(null);

  const getDevices = React.useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      const videoTracks = mediaStream.getVideoTracks();
      const current = videoTracks[0] ? videoTracks[0].getSettings() : null;
      const devices = await navigator.mediaDevices.enumerateDevices();
      setDivices(devices.filter(device => device.deviceId && device.kind === 'videoinput'));
      setCurrent(current);
    } catch (err) {
      console.error(err);
    }
  }, []);

  React.useEffect(() => {
    getDevices();
  }, [getDevices]);

  return [devices, current];
};
