import React, {CSSProperties} from 'react';
import {ChanksDecoder} from './ChanksDecoder';
import {Scanner, IScannerProps, useDevices} from '@yudiel/react-qr-scanner';

export interface QrCodeReceiverProps extends IScannerProps {
  onScanFinish: (value: Buffer) => void;
  className?: string;
  onChunksChanged?: (chunks: boolean[]) => void;
}

export const useMediaDevices = (): {
  devices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo | undefined;
  setPreferredDeviceId: React.Dispatch<
    React.SetStateAction<MediaDeviceInfo['deviceId'] | null>
  >;
} => {
  const devices = useDevices();
  const videoDevices = devices.filter(
    (device) => device.deviceId && device.kind === 'videoinput',
  );
  const [preferredDeviceId, setPreferredDeviceId] = React.useState<
    string | null
  >(() => {
    return videoDevices[0] ? videoDevices[0].deviceId : null;
  });
  const currentDevice = videoDevices.find(
    (device) => device.deviceId === preferredDeviceId,
  );
  return {
    devices,
    currentDevice: currentDevice || videoDevices[0],
    setPreferredDeviceId,
  };
};

export function QrCodeReceiver({
  className = '',
  onChunksChanged,
  onScanFinish,
  onError = () => {},
  onScan = () => {},
  styles,
  ...rest
}: QrCodeReceiverProps) {
  const chunksDecoder = React.useRef(new ChanksDecoder()).current;
  const [cameraFliped, setCameraFliped] = React.useState(false);
  const {devices, currentDevice, setPreferredDeviceId} = useMediaDevices();

  const flipCamera = () => {
    setCameraFliped(!cameraFliped);
  };

  const scanHandler: IScannerProps['onScan'] = (value) => {
    onScan(value);
    const code = value[0];
    if (!code || !code.rawValue) {
      return;
    }
    if (chunksDecoder.isDone()) {
      return;
    }
    const scanned = chunksDecoder.decodeChunk(code.rawValue);
    if (scanned && onChunksChanged) {
      onChunksChanged?.(chunksDecoder.chunks.map((it) => (it ? true : false)));
    }
    if (chunksDecoder.isDone()) {
      const action = chunksDecoder.decodeChunks();
      if (action) {
        onScanFinish(action);
      }
    }
  };

  const videoStyles: CSSProperties = {
    position: 'static',
    ...styles?.video,
  };

  if (cameraFliped) {
    videoStyles.transform = 'scaleX(-100%)';
  }

  return (
    <div className={`qrcode-receiver ${className}`}>
      <div
        className="qrcode-receiver_header"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
          gap: 8,
        }}
      >
        <select
          className="qrcode-receiver_camera-select"
          style={{maxWidth: '100%'}}
          value={currentDevice?.deviceId ?? ''}
          onChange={(e: React.FormEvent<HTMLSelectElement>) => {
            const _deviceId = e.currentTarget.value;
            _deviceId && setPreferredDeviceId(_deviceId);
          }}
        >
          {devices.map((device) => {
            return (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            );
          })}
        </select>
        <button className="qrcode-receiver_button_flip" onClick={flipCamera}>
          Flip Camera
        </button>
      </div>
      <Scanner
        key={currentDevice ? currentDevice.deviceId : 'none'}
        onScan={scanHandler}
        onError={onError}
        scanDelay={10}
        components={{finder: false}}
        constraints={{
          facingMode: {
            ideal: 'environment',
          },
          deviceId: currentDevice ? currentDevice.deviceId : '',
        }}
        styles={{
          container: {padding: 0, ...styles?.container},
          video: videoStyles,
        }}
        {...rest}
      />
    </div>
  );
}
