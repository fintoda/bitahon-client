import React from 'react';

import Context from './Context';
import {IContext} from './types';

function useSession(): [IContext['session'], IContext['setSession']] {
  const {session, setSession} = React.useContext(Context);
  return [session, setSession];
}
export default useSession;
