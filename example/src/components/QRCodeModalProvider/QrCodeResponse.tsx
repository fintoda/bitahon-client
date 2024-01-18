import React from 'react';
import {Box} from '@mui/material';
import Html5QrcodePlugin from '@/lib/Html5QrcodePlugin';
import { ChanksDecoder } from './ChanksDecoder';

type SuccessHandler = (data: Buffer) => void;

interface QrCodeResponseProps {
  onResult: SuccessHandler;
}

function QrCodeResponse({onResult}: QrCodeResponseProps) {
  const chunksDecoder = React.useRef(new ChanksDecoder()).current;
  const [chunksPreview, setChunksPreview] = React.useState<boolean[]>([]);

  const onScanHandler = (data: string) => {
    if (!data) {
      return;
    }
    if (chunksDecoder.isDone()) {
      return;
    }
    chunksDecoder.decodeChunk(data);
    setChunksPreview(chunksDecoder.chunks.map((it) => (it ? true : false)));
    if (chunksDecoder.isDone()) {
      const action = chunksDecoder.decodeChunks();
      if (action) {
        onResult(action);
      }
    }
  }

  const progress = React.useMemo(() => {
    const count = chunksPreview.length;
    const exist = chunksPreview.filter((it) => it).length;
    return `${exist}/${count}`;
  }, [chunksPreview]);

  return (
    <>
      <Box sx={{mb: 1}}>
        <div>{progress}</div>
      </Box>
      <Html5QrcodePlugin onSuccess={onScanHandler} />
    </>
  );
}

export default QrCodeResponse;