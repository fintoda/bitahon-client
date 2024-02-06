import axios from 'axios';
import {common, ethereum, tron} from '@bitahon/protocol';

const DEFAULT_API = 'https://bitahon-api.fintoda.com/api/v1';
const DEFAULT_TIMEOUT = 25_000;

export type TokenMetadataResult = {
  type: number;
  contract: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals?: number;
  icon?: string;
  sign: string;
};

function validateResult(data: TokenMetadataResult): boolean {
  if (data.type !== 1 && data.type !== 2) {
    return false;
  }

  if (!data.chainId || !data.contract || !data.name || !data.symbol || !data.sign) {
    return false;
  }

  return true;
}

function parseResult(data: TokenMetadataResult): common.ITokenMetadata {
  const metadata: common.ITokenMetadata = {
    type: data.type as common.TokenType,
    contract: data.contract,
    chainId: data.chainId,
    name: data.name,
    symbol: data.symbol,
    decimals: data.decimals,
    icon: data.icon ? Buffer.from(data.icon, 'base64') : undefined,
    sign: Buffer.from(data.sign, 'base64'),
  };

  return metadata;
}

export async function ethereumToken({
  network,
  contract,
  api = DEFAULT_API,
  timeout = DEFAULT_TIMEOUT,
}: {
  network: ethereum.NETWORK_ID;
  contract: string;
  api?: string;
  timeout?: number;
}): Promise<common.ITokenMetadata> {
  const res = await axios<TokenMetadataResult>({
    method: 'GET',
    baseURL: api,
    url: `/ethereum/${network}/${contract}`,
    timeout,
  });

  if (!validateResult(res.data)) {
    throw new Error('invalid response');
  }

  return parseResult(res.data);
}

export async function tronToken({
  network,
  contract,
  api = DEFAULT_API,
  timeout = DEFAULT_TIMEOUT,
}: {
  network: tron.NETWORK_ID;
  contract: string;
  api?: string;
  timeout?: number;
}): Promise<common.ITokenMetadata> {
  const res = await axios<TokenMetadataResult>({
    method: 'GET',
    baseURL: api,
    url: `/tron/${network}/${contract}`,
    timeout,
  });

  if (!validateResult(res.data)) {
    throw new Error('invalid response');
  }

  return parseResult(res.data);
}
