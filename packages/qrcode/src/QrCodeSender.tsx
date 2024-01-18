import React, {CSSProperties} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import { useTimer } from './hooks';

export interface QrCodeSenderProps {
  qrcodes: string[];
  speed?: number
  size?: number;
  level?: string;
  bgColor?: string;
  fgColor?: string;
  style?: CSSProperties;
  includeMargin?: boolean;
}

export function QrCodeSender({qrcodes, size = 250, speed = 1000}: QrCodeSenderProps) {
  const [current, setCurrent] = React.useState(0);
  const {run, stop} = useTimer(speed);

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

  return qrcodes && qrcodes[current] ? <QRCodeSVG value={qrcodes[current]} size={size} /> : null;
}
