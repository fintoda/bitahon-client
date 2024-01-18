import React from 'react';

import Context from './Context';
import manager from './Manager';
import {IContext} from './types';

interface IProvider {
  children: React.ReactNode;
}

const Provider = ({children}: IProvider) => {
  const [modals, setModals] = React.useState<IContext['modals']>(() =>
    manager.getModals(),
  );

  React.useEffect(() => {
    const unsubcribe = manager.subscribe((_modals) => {
      setModals(_modals);
    });
    return () => {
      unsubcribe();
    };
  }, []);

  const value = React.useMemo((): IContext => {
    return {
      modals,
    };
  }, [modals]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default Provider;
