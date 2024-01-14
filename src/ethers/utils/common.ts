import { BrowserProvider, Contract, isAddress as isEatherAddress } from 'ethers';

export function isAddress(value: string): boolean {
  try {
    return isEatherAddress(value);
  } catch {
    return false;
  }
}

export async function getContract(address: string, ABI: any, provider: BrowserProvider, account?: string | undefined) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, await getProviderOrSigner(provider, account));
}

async function getProviderOrSigner(provider: BrowserProvider, account?: string) {
  return account ? await provider.getSigner(account) : provider;
}
