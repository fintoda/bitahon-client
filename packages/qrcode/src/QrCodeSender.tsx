import React, {CSSProperties} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import { useTimer } from './hooks';
import {
  encodeQRCodeChunks
} from '@bitahon/transport';

export interface QrCodeSenderProps {
  data: Buffer;
  mtu?: number | undefined
  speed?: number
  size?: number;
  level?: string;
  bgColor?: string;
  fgColor?: string;
  style?: CSSProperties;
  includeMargin?: boolean;
}

export function QrCodeSender({data, size = 250, speed = 1000, mtu, ...rest}: QrCodeSenderProps) {
  const [current, setCurrent] = React.useState(0);
  const {run, stop} = useTimer(speed);

  const qrcodes = React.useMemo(() => {
    return encodeQRCodeChunks(data, mtu);
  }, [data, mtu]); 

  React.useEffect(() => {
    if (!qrcodes || qrcodes.length <= 1) {
      stop();
      return;
    }
    run(() => {
      setCurrent((prev) => {
        let next = ++prev;
        if (!qrcodes[next]) {
          next = 0;
        }
        return next;
      });
    });
    return () => {
      stop();
      setCurrent(0);
    };
  }, [qrcodes, run, stop])

  return qrcodes && qrcodes[current] ? <QRCodeSVG value={qrcodes[current]} size={size} {...rest} /> : null;
}
