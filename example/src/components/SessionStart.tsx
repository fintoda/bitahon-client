import React from 'react';
import {Button, CircularProgress} from '@mui/material';
import { useSession } from '@/lib/session';
import SplashView from '@/components/SplashView';
import {Client} from '@bitahon/client';

console.log(Client)

const sleep = (delay: number = 1000) => new Promise(resolve => setTimeout(resolve, delay, true));

export default function SessionStart() {
  const [,setSession] = useSession();
  const [submitting, setSubmitting] = React.useState(false);

  const startSessionHandler = async () => {
    setSubmitting(true);
    try {
      // TODO test
      await sleep(3000);
      setSession({
        proof: new Uint8Array(),
        session: new Uint8Array(),
        wallet: 'test',
      })
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SplashView>
      <Button
        onClick={startSessionHandler}
        variant="contained"
        disabled={submitting}
      >
        {submitting ? (
          <CircularProgress sx={{mr: 1}} color="info" size={20} />
        ) : null}
        Login
      </Button>
    </SplashView>
  );
}
