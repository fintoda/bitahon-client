import {IClientConnectionProvider} from '@bitahon/client';
import {encodeQRCodeChunks} from '@bitahon/transport';
import modalQRCode from './modalQrCode';

class CancelPromiseError extends Error {
  name: string = '';
  constructor(message: string = 'Canceled') {
    super(message);
    this.name = 'CancelPromiseError';
  }
}

class QRCodeModalProvider implements IClientConnectionProvider {
  async send(data: Buffer) {
    const dataChunks = encodeQRCodeChunks(data);
    const response = await modalQRCode.openAsync({qrcodes: dataChunks});
    if (!(response.type === 'success' && response.data)) {
      throw new CancelPromiseError();
    }
    return response.data;
  }
}

export default QRCodeModalProvider;
