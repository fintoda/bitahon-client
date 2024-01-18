"use client"
import React from 'react'
import {Provider, useSession} from '@/lib/session';
import AppBar from '@/components/AppBar';
import SessionStart from '@/components/SessionStart';
import {initCryptoProvider} from '@bitahon/crypto';
import { CircularProgress, Container } from '@mui/material';
import SplashView from '@/components/SplashView';
import ProviderModals from '@/lib/modals';
import {ModalQRCodeTransport} from '@/components/QRCodeModalProvider';

async function loadCrypto() {
  const lib = await import('@bitahon/browser-crypto');
  initCryptoProvider(lib.default);
}

function Content() {
  const [session] = useSession();
  return session ? (
    <SplashView>
      <div className="text-center">TODO</div>
    </SplashView>
  ) : (
    <SessionStart />
  )
}

export default function Home() {
  const [isCryptoReady, setIsCryptoReady] = React.useState(false);

  React.useEffect(() => {
    loadCrypto()
      .then(() => {
        setIsCryptoReady(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isCryptoReady]);

  return (
    <main className="main">
      {isCryptoReady ? (
        <Provider>
          <ProviderModals>
            <AppBar />
            <Content />
            <ModalQRCodeTransport />
          </ProviderModals>
        </Provider>
      ) : (
        <Container sx={{display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
          <CircularProgress size={48} />
        </Container>
      )}
    </main>
  )
}
