import React from 'react';
import {Button, CircularProgress} from '@mui/material';
import SplashView from '@/components/SplashView';
import { useSession } from '@/lib/session';

export default function SessionStart() {
  const [session] = useSession();
  const [submitting, setSubmitting] = React.useState(false);
  
  const handlerSubmit = async () => {
    setSubmitting(true);
    try {
      if (!session) {
        return false;
      }
      // const action = new bitcoin.GetPublicKeyAction({
      //   network: 1,
      //   path: path,
      // });
      // const clientSession = ClientSession.fromBuffer(
      //   Buffer.from(session.session),
      // );
      // const client = new Client(new ModalQrCodeProvider(), clientSession);
      // const response = await client.request(action);
      // const node = new Bip32Node(response);
      // const addr = createAddress(addressType.value, node.publicKey, network);
      // const xpub = createXpub(node, addressType.value, network);
      // setResponse({
      //   addr,
      //   xpub,
      // });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(true);
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






// 'use client';
// import React from 'react';
// import {Box, Button, CircularProgress, Stack} from '@mui/material';

// import {createAddress, createXpub} from '@/lib/bitcoin/BitcoinWallet';
// import networks, {INetwork} from '@/lib/bitcoin/networks';
// import {toast} from '@/lib/toastify';

// import {Client, ClientSession} from '@/client';
// 
// import {Bip32Node} from '@/client/bip32';

// import useSession from '@/features/Session/useSession';

// import Modal from '@/shared/ui/modals/Modal';

// import LabelText from '@/components/LabelText';
// import ModalQrCodeProvider from '@/components/modals/modalQRCodeProvider';
// import SelectAddressType from '@/components/SelectAddressType';
// import SelectNetworks from '@/components/SelectNetworks';
// import TextFieldBase from '@/components/TextFieldBase';

// import {AddressTypeOption, NetworkOption} from './types';

// const networksOptions: NetworkOption[] = Object.entries(networks).map(
//   ([networkId, config]) => {
//     return {
//       networkId,
//       ...config,
//     } as NetworkOption;
//   },
// );

// type Response = {
//   addr: string;
//   xpub: string;
// };

// function createAddressesOptions(
//   address: INetwork['addresses'] | null,
// ): AddressTypeOption[] {
//   if (!address) {
//     return [];
//   }
//   return Object.entries(address)
//     .filter(([, config]) => {
//       return config;
//     })
//     .map(([addressType, config]) => {
//       return {
//         value: addressType,
//         ...config,
//       } as AddressTypeOption;
//     });
// }

// function BitcoinGetPubKeyFormAction() {
//  
//   const [loading, setLoading] = React.useState(false);
//   const [network, setNetwork] = React.useState<NetworkOption | null>(
//     networksOptions[0],
//   );
//   const [addressType, setAddressType] =
//     React.useState<AddressTypeOption | null>(null);
//   const [path, setPath] = React.useState('');
//   const [response, setResponse] = React.useState<Response | null>(null);

//   const changeAddressTypeHandler = (_addrType: AddressTypeOption | null) => {
//     setAddressType(_addrType);
//     setPath(_addrType ? `${_addrType.path}/0/0` : '');
//   };

//   const changeNetworkHandler = (_network: NetworkOption | null) => {
//     changeAddressTypeHandler(null);
//     setNetwork(_network);
//   };

//   const addressTypeOptions = React.useMemo(() => {
//     return createAddressesOptions(network ? network.addresses : null);
//   }, [network]);

//   const disableSubmit = loading || !network || !addressType || !path;


//   return (
//     <>
//       <Modal
//         visible={!!response}
//         title="Response"
//         onClose={() => setResponse(null)}
//       >
//         {response ? (
//           <>
//             <LabelText label="address:" value={response.addr} />
//             <LabelText label="xpub:" value={response.xpub} />
//           </>
//         ) : null}
//       </Modal>
//     </>
//   );
// }

