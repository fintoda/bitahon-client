
import React from 'react';
import {Html5QrcodeScanner, QrcodeSuccessCallback, QrcodeErrorCallback, Html5QrcodeResult} from 'html5-qrcode';
import { useEventEffect } from './hooks';
import { ChanksDecoder } from './ChanksDecoder';

const QRCODE_REGION_ID = 'html5-qrcode-id';

interface QrCodeReceiverProps {
  onScanned: (value: Buffer) => void;
  showProgress?: boolean;
  className?: string;
  fps?: number;
  onScan?: QrcodeSuccessCallback;
  onError?: QrcodeErrorCallback;
}

export {QrcodeSuccessCallback, QrCodeReceiverProps, QrcodeErrorCallback};

export function QrCodeReceiver({
  showProgress = true,
  className = '',
  fps = 30,
  onScanned,
  onError = () => {},
  onScan = () => {},
}: QrCodeReceiverProps) {
  const chunksDecoder = React.useRef(new ChanksDecoder()).current;
  const [chunks, setChunks] = React.useState<boolean[]>([]);
  const errorEvent = useEventEffect(onError);
  const scanEvent = useEventEffect(onScan);
  const scannedEvent = useEventEffect(onScanned);

  const scanHandler = React.useCallback((value: string, result: Html5QrcodeResult) => {
    scanEvent(value, result);
    if (!value) {
      return;
    }
    if (chunksDecoder.isDone()) {
      return;
    }
    chunksDecoder.decodeChunk(value);
    setChunks(chunksDecoder.chunks.map((it) => (it ? true : false)));
    if (chunksDecoder.isDone()) {
      const action = chunksDecoder.decodeChunks();
      if (action) {
        scannedEvent(action);
      }
    }
  }, [chunksDecoder, scanEvent, scannedEvent]);

  React.useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      QRCODE_REGION_ID,
      {
        fps: fps,
        useBarCodeDetectorIfSupported: true,
      },
      false,
    );
    scanner.render(scanHandler, errorEvent);
    return () => {
      scanner.clear().catch((error) => {
        console.error('Failed to clear html5QrcodeScanner. ', error);
      });
    };
  }, [errorEvent, fps, scanHandler]);

  const progress = React.useMemo(() => {
    const count = chunks.length;
    const recieved = chunks.filter((it) => it).length;
    return `${recieved}/${count}`;
  }, [chunks]);

  return (
    <div className={`qrcode-receiver ${className}`}>
      {showProgress ? (
        <div className="qrcode-receiver_progress">{progress}</div>
      ) : null}
      <div
        id={QRCODE_REGION_ID}
        className="qrcode-receiver_camera"
        style={{
          width: '512px',
          margin: '0 auto',
        }}
      />
    </div>
  );
}
