// TODO
import {IClientConnectionProvider} from '@/client';

import modalQRCode from './modalQrCode';

class CancelPromiseError extends Error {
  name: string = '';
  constructor(message: string = 'Canceled') {
    super(message);
    this.name = 'CancelPromiseError';
  }
}

const TestQRCodes = ['edewfwefwefwefwefw','wefwefwefwefwefwefwef']

class QRCodeModalProvider implements IClientConnectionProvider {
  async send(data: Buffer) {
    console.log('data', data);
    const response = await modalQRCode.openAsync({qrcodes: TestQRCodes});
    if (!(response.type === 'success' && response.data)) {
      throw new CancelPromiseError();
    }
    return response;
  }
}

export default QRCodeModalProvider;
