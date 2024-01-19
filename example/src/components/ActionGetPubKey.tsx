import React from 'react';
import {Button, CircularProgress} from '@mui/material';
import SplashView from '@/components/SplashView';
import { useSession } from '@/lib/session';
import {bitcoin, ClientSession, Client} from '@bitahon/client';
import {QRCodeModalProvider} from '@/components/QRCodeModalProvider';

const DATA = {
  network: 1,
  path: "m/44'/0'/0'/0/0",
}

export default function ActionGetPubKey() {
  const [session] = useSession();
  const [submitting, setSubmitting] = React.useState(false);
  
  const handlerSubmit = async () => {
    setSubmitting(true);
    try {
      if (!session) {
        return false;
      }
      const action = new bitcoin.GetPublicKeyAction(DATA);
      const clientSession = ClientSession.fromBuffer(
        Buffer.from(session.session),
      );
      const client = new Client(new QRCodeModalProvider(), clientSession);
      const response = await client.request(action);
      console.log(response)
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SplashView>
      <Button
        onClick={handlerSubmit}
        variant="contained"
        disabled={submitting}
      >
        {submitting ? (
          <CircularProgress sx={{mr: 1}} color="info" size={20} />
        ) : null}
        Get Public Key
      </Button>
    </SplashView>
  );
}