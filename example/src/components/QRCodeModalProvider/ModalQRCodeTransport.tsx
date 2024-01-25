import React from 'react';
import Modal from "@/components/Modal";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import modalQRCode, {PayloadType, ResultType} from './modalQrCode';
import { useModal } from "@/lib/modals";
import {QrCodeSender, QrCodeReceiver, QrCodeReceiverProps, useMediaDevices} from '@bitahon/qrcode';
import { FormControl, InputLabel, MenuItem, useMediaQuery } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const DEFAULT_CONSTRAINTS = {
  width: { min: 640, ideal: 720, max: 1920 },
  height: { min: 640, ideal: 720, max: 1080 }
};

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
  constraints?: MediaTrackConstraintSet;
}

type MediaTrackSettingsWithLabel = MediaTrackSettings & {label: string};

function QrCodeReceiverComponent({
  onScanFinish,
  constraints = DEFAULT_CONSTRAINTS,
}: QrCodeReceiverComponentProps) {
  const devices = useMediaDevices(constraints);
  const [enumDevices, setEnumDevices] = React.useState<MediaTrackSettingsWithLabel[]>([]);
  const [cameraFliped, setCameraFliped] = React.useState(false);
  const [currentDeviceId, setCurrentDeviceId] = React.useState<string>('');

  const flipCamera = () => {
    setCameraFliped(!cameraFliped);
  }

  React.useEffect(() => {
    async function mergeDevices(_devices: MediaTrackSettings[]) {
      try {
        const map: {[K: string]: MediaDeviceInfo} = {};
        const result = await navigator.mediaDevices.enumerateDevices();
        result.forEach(it => {
          map[it.deviceId] = it;
        });
        const devicesWithLabel: MediaTrackSettingsWithLabel[] = _devices.map(it => {
          const _deviceId = it.deviceId;
          return {
            ...it,
            label: _deviceId && map[_deviceId] ? map[_deviceId].label : '',
          }
        });
        setEnumDevices(devicesWithLabel);
        if (devicesWithLabel[0]) {
          setCurrentDeviceId(devicesWithLabel[0].deviceId ?? '');
        }
      } catch (err) {
        console.error(err);
      }
    }
    mergeDevices(devices);
  }, [devices]);

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
             <FormControl sx={{ minWidth: 100 }} size="small">
                <InputLabel id="devices-select-label">Devices</InputLabel>
                <Select
                  labelId="devices-select-label"
                  value={currentDeviceId}
                  label="Devices"
                  onChange={(e: SelectChangeEvent) => {
                    const _deviceId = e.target.value;
                    _deviceId && setCurrentDeviceId(_deviceId);
                  }}
                >
                  {enumDevices.map((device) => {
                    return (
                      <MenuItem key={device.deviceId} value={device.deviceId}>
                        <div>{device.label || device.deviceId}</div>
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <div>{`${percent}%`}</div>
                <Button onClick={flipCamera}>Flip Camera</Button>
              </Stack>
          </div>
        )
      }}
    />
  )
}
