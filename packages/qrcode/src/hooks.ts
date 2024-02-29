import React from 'react';

export function useTimer(delay: number = 1000) {
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  const stop = React.useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  const run = React.useCallback(
    (callback: () => void) => {
      stop();
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

type FlipStatus = 'yes' | 'no';
const STORAGE_CAMEAR_FLIP_KEY = '@bitahon/qrcode/cameraFlipped';

export const useCameraFlip = (): [FlipStatus, (value: FlipStatus) => void] => {
  const [fliped, setFliped] = React.useState(() => {
    let value: FlipStatus = 'no';
    if (window.localStorage) {
      const d = window.localStorage.getItem(STORAGE_CAMEAR_FLIP_KEY);
      value = d === 'yes' ? d : 'no';
    }
    return value;
  });
  const set = React.useCallback((value: FlipStatus) => {
    if (window?.localStorage) {
      window.localStorage.setItem(STORAGE_CAMEAR_FLIP_KEY, value)
    }
    setFliped(value);
  }, []);
  return [fliped, set];
}