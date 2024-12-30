import React, {Suspense} from 'react';
import {CircularProgress, Container} from '@mui/material';
import App from '@/components/App';
import CryptoProvider from '@/components/CryptoProvider';

export default function Home() {
  return (
    <main className="main">
      <Suspense
        fallback={
          <Container
            sx={{
              display: 'flex',
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress size={48} />
          </Container>
        }
      >
        <CryptoProvider>
          <App />
        </CryptoProvider>
      </Suspense>
    </main>
  );
}
