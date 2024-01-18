import React from 'react';
import {createPortal} from 'react-dom';

interface ReactPortalProps {
  children: React.ReactNode;
  visible: boolean;
}

function ReactPortal({visible, children}: ReactPortalProps) {
  const container = React.useRef(document.querySelector('body')).current;
  if (!visible) {
    return null;
  }
  return container ? createPortal(children, container) : null;
}

export default ReactPortal;
