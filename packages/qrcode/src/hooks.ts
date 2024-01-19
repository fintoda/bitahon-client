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