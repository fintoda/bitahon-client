import React from 'react';
import Modal from "@/components/Modal";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import modalQRCode, {PayloadType, ResultType} from './modalQrCode';
import { useModal } from "@/lib/modals";
import {QrCodeSender, QrCodeReceiver, QrCodeReceiverProps} from '@bitahon/qrcode';
import { FormControl, InputLabel, MenuItem, useMediaQuery } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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

function QrCodeReceiverComponent({onScanFinish}: QrCodeReceiverComponentProps) {
  const devices = useMediaDevices();
  const [cameraFliped, setCameraFliped] = React.useState(false);
  const [currentDeviceId, setCurrentDeviceId] = React.useState<string>('');

  const flipCamera = () => {
    setCameraFliped(!cameraFliped);
  }
 
  return (
    <QrCodeReceiver
      onError={(err) => console.error(err)}
      onScanFinish={onScanFinish}
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
                  {devices.map((device) => {
                    return (
                      <MenuItem key={device.deviceId} value={device.deviceId}>
                        <div>
                          <div>{device.deviceId}</div>
                          <div>{device.kind}</div>
                          <div>{device.label}</div>
                        </div>
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

const useMediaDevices = () => {
  const [state, setState] = React.useState<MediaDeviceInfo[]>([]);

  const getDevices = React.useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setState(devices.filter(device => device.deviceId));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getPermissions = React.useCallback(async () => {
    let permissions: PermissionStatus | null = null;
    try {
      permissions = await navigator.permissions.query({name: 'camera' as PermissionName});
    } catch (err) {
      console.log(err);
    }

    if (!permissions) {
      return;
    }

    if (permissions.state === 'granted') {
      getDevices();
      return;
    }
  
    permissions.onchange = () => {
      if (permissions?.state === 'granted') {
        getDevices();
      }
    }
  }, [getDevices]);

  React.useEffect(() => {
    getPermissions();
  }, [getPermissions]);

  return state;
};