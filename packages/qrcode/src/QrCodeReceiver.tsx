
import React, { CSSProperties } from 'react';
import { ChanksDecoder } from './ChanksDecoder';
import {QrScanner, QrScannerProps} from '@yudiel/react-qr-scanner';

export interface QrCodeReceiverProps extends QrScannerProps {
  onScanFinish: (value: Buffer) => void;
  className?: string;
  onChunksChanged?: (chunks: boolean[]) => void;
}

export const useMediaDevices = (): [MediaDeviceInfo[], MediaTrackSettings | null] => {
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


export function QrCodeReceiver({
  className = '',
  onChunksChanged,
  onScanFinish,
  onError = () => {},
  onDecode = () => {},
  videoStyle,
  ...rest
}: QrCodeReceiverProps) {
  const chunksDecoder = React.useRef(new ChanksDecoder()).current;
  const [cameraFliped, setCameraFliped] = React.useState(false);
  const [devices, currentTrack] = useMediaDevices();
  
  const [currentDeviceId, setCurrentDeviceId] = React.useState<string>('');

  const flipCamera = () => {
    setCameraFliped(!cameraFliped);
  }

  React.useEffect(() => {
    if (currentTrack && !currentDeviceId) {
      setCurrentDeviceId(currentTrack.deviceId ?? '');
    }
  }, [currentDeviceId, currentTrack]);

  const scanHandler = (value: string) => {
    onDecode(value);
    if (!value) {
      return;
    }
    if (chunksDecoder.isDone()) {
      return;
    }
    const scanned = chunksDecoder.decodeChunk(value);
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
  }

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
        }}>
        <select
          className="qrcode-receiver_camera-select"
          style={{maxWidth: '100%'}}
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
        <button
          className="qrcode-receiver_button_flip" 
          onClick={flipCamera}
        >
          Flip Camera
        </button>
      </div>
      <QrScanner
        onDecode={scanHandler}
        onError={onError}
        scanDelay={10}
        viewFinder={() => null}
        deviceId={currentDeviceId}
        containerStyle={{padding: 0}}
        videoStyle={{...videoStyles, ...videoStyle}}
        {...rest}
      />
    </div>
  );
}
