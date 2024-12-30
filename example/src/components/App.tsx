'use client';
import React from 'react';
import {Provider, useSession} from '@/lib/session';
import AppBar from '@/components/AppBar';
import SessionStart from '@/components/SessionStart';
import ProviderModals from '@/lib/modals';
import {ModalQRCodeTransport} from '@/components/QRCodeModalProvider';
import ActionGetPubKey from '@/components/ActionGetPubKey';

function Content() {
  const [session] = useSession();
  return session ? <ActionGetPubKey /> : <SessionStart />;
}

export default function App() {
  return (
    <Provider>
      <ProviderModals>
        <AppBar />
        <Content />
        <ModalQRCodeTransport />
      </ProviderModals>
    </Provider>
  );
}
