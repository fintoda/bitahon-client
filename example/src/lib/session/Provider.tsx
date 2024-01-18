import React from 'react';

import Context from './Context';
import {IContext} from './types';

interface IProvider {
  children: React.ReactNode;
}

const STORAGE_KEY = 'bitahon-session';

const restoreSession = () => {
  if (typeof window !== "undefined") {
    const session = window.localStorage.getItem(STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  }
  return null;
};

const Provider = ({children}: IProvider) => {
  const [state, setState] = React.useState<IContext['session']>(restoreSession);

  const setSession = React.useCallback<IContext['setSession']>((session) => {
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setState(session);
  }, []);

  const value = React.useMemo((): IContext => {
    return {
      session: state,
      setSession,
    };
  }, [setSession, state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Provider;
