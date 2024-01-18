import React from 'react';
import {Button, CircularProgress} from '@mui/material';
import SplashView from '@/components/SplashView';
import {Client} from '@bitahon/client';
import {QRCodeModalProvider} from '@/components/QRCodeModalProvider';

console.log(Client)

export default function SessionStart() {
  const [submitting, setSubmitting] = React.useState(false);

  const startSessionHandler = async () => {
    setSubmitting(true);
    try {
      // TODO test
      const client = new Client(new QRCodeModalProvider());
      const result = await client.auth({
        title: 'Example Title',
        description: 'Example Description',
      });
      console.log(result);
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
