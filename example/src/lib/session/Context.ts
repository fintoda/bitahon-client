import React from 'react';

import {IContext} from './types';

const Context = React.createContext<IContext>({
  session: null,
  setSession: () => {}
});

export default Context;
