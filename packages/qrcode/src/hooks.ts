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
