'use client';
import React from 'react';
import {QRCodeSVG} from 'qrcode.react';

interface QrCodeRequestProps {
  speed?: number
  qrcodes: string[];
}

export function useTimer(delay: number) {
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  const stop = React.useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  const run = React.useCallback(
    (callback: () => void) => {
      stop();
      if (!delay) {
        return;
      }
      callback();
      timer.current = setInterval(() => {
        callback();
      }, delay);
    },
    [delay, stop],
  );

  React.useEffect(() => {
    return stop;
  }, [stop]);

  return {run, stop};
}

function QrCodeRequest({qrcodes, speed = 1000}: QrCodeRequestProps) {
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
      setCurrent(0);
      stop();
    };
  }, [qrcodes, run, stop])

  return (
    <div style={{width: '100%', textAlign: 'center'}}>
      {qrcodes && qrcodes[current] ? (
        <QRCodeSVG value={qrcodes[current]} size={250} />
      ) : null}
    </div>
  );
}

export default QrCodeRequest;
