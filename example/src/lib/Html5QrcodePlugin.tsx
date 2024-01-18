import React, {useEffect} from 'react';
import {Html5QrcodeScanner, QrcodeSuccessCallback} from 'html5-qrcode';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEventEffect<T extends (...args: any[]) => any>(handler: T) {
  const handlerRef = React.useRef(handler);

  React.useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return React.useCallback(
    (...args: Parameters<typeof handler>): ReturnType<typeof handler> => {
      return handlerRef.current?.(...args);
    },
    [],
  );
}

const qrcodeRegionId = 'html5-qrcode-id';

interface Html5QrcodePluginProps {
  fps?: number;
  width?: number | string;
  height?: number | string;
  onSuccess: QrcodeSuccessCallback;
  onError?: () => void;
}

const onErrorDummy = () => {};
const Html5QrcodePlugin = ({
  fps = 30,
  onSuccess,
  onError = onErrorDummy,
}: Html5QrcodePluginProps) => {
  const successHandler = useEventEffect(onSuccess);
  const errorHandler = useEventEffect(onError);

  useEffect(() => {
    if (!successHandler) {
      // eslint-disable-next-line no-console
      console.warn('Html5QrcodePlugin: is required callback.');
      return;
    }
    const scanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      {
        fps: fps,
        // qrbox: {
        //   width: 1920,
        //   height: 1080,
        // },
        useBarCodeDetectorIfSupported: true,
      },
      false,
    );
    scanner.render(successHandler, errorHandler);
    return () => {
      scanner.clear().catch((error) => {
        console.error('Failed to clear html5QrcodeScanner. ', error);
      });
    };
  }, [errorHandler, fps, successHandler]);

  return (
    <div
      className="html5-qrcode-id"
      id={qrcodeRegionId}
      style={{
        width: '512px',
        margin: '0 auto',
      }}
    />
  );
};

export default Html5QrcodePlugin;
