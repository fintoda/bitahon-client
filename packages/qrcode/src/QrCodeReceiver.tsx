
import React from 'react';
import { ChanksDecoder } from './ChanksDecoder';
import {QrScanner, QrScannerProps, useMediaDevices} from '@yudiel/react-qr-scanner';

export {useMediaDevices};

export interface QrCodeReceiverProps extends QrScannerProps {
  onScanFinish: (value: Buffer) => void;
  className?: string;
  renderProgress?: ({chunks}: {chunks: boolean[]}) => React.ReactNode;
}

export function QrCodeReceiver({
  className = '',
  renderProgress,
  onScanFinish,
  onError = () => {},
  onDecode = () => {},
  ...rest
}: QrCodeReceiverProps) {
  const chunksDecoder = React.useRef(new ChanksDecoder()).current;
  const [chunks, setChunks] = React.useState<boolean[]>([]);

  const scanHandler = (value: string) => {
    onDecode(value);
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
        onScanFinish(action);
      }
    }
  };

  return (
    <div className={`qrcode-receiver ${className}`}>
      {renderProgress?.({chunks})}
      <QrScanner
        onDecode={scanHandler}
        onError={onError}
        scanDelay={10}
        {...rest}
      />
    </div>
  );
}
