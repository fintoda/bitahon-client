'use client';
import React from 'react';
import {Container, CircularProgress} from '@mui/material';
import {initCryptoProvider} from '@bitahon/crypto';
import browserCrypto from '@bitahon/browser-crypto';

export default function CryptoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = React.useState(false);
  const loadCrypto = async () => {
    initCryptoProvider(browserCrypto);
    setLoading(false);
  };

  React.useEffect(() => {
    loadCrypto();
  }, []);

  if (loading) {
    return (
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
    );
  }
  return children;
}
