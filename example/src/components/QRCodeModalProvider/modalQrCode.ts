import {Modal} from '@/lib/modals';

export type PayloadType = {
  title?: string;
  description?: string;
  qrcodes: string[];
};
export type ResultType = {
  type: 'cancel';
  data: null
} | {
  type: 'success';
  data: Buffer
}

const MODAL_UID = 'MODAL/QRCODE/PROVIDER';

const modalQRCode = new Modal<PayloadType, ResultType>(MODAL_UID);

export default modalQRCode;
