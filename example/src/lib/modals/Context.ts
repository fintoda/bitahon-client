import React from 'react';

import {IContext} from './types';

const Context = React.createContext<IContext>({
  modals: {},
});

export default Context;
