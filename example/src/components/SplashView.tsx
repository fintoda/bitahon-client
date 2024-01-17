import React from 'react';
import Image from 'next/image';
import logoIcon from "@/app/logo.svg";
import {Container, Stack} from '@mui/material';

const sx = {
  container: {display: 'flex', paddingTop: '10%', flexGrow: 1, justifyContent: 'center'},
  logo: {width: 200, height: 'auto', maxWidth: '100%', marginBottom: 2},
}

interface SplashViewProps {
  children?: React.ReactNode;
}

export default function SplashView({children}: SplashViewProps) {
  return (
    <Container sx={sx.container}>
      <Stack>
        <Image
          priority={true}
          src={logoIcon}
          alt="Logo"
          style={sx.logo}
        />
        {children}
      </Stack>
    </Container>
  );
}
