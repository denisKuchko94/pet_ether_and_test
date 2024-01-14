import { Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { useAccount, useChain } from '@/src/ethers/hooks';
import { useProvider } from '@/src/ethers/hooks/useProvider';
import { getContract } from '@/src/ethers/utils/common';

export function useContract(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
) {
  const [contract, setContract] = useState<Contract | null>(null);
  const { provider } = useProvider();
  const { account } = useAccount();
  const { chainId } = useChain();

  const setContractUsingAbi = useCallback(async () => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return setContract(null);
    let address: string | undefined;

    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];

    if (!address) return setContract(null);

    try {
      const contract = await getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined);

      setContract(contract);
    } catch (error) {
      console.error('Failed to get contract', error);

      return setContract(null);
    }
  }, [ABI, account, addressOrAddressMap, chainId, provider, withSignerIfPossible]);

  useEffect(() => {
    setContractUsingAbi();
  }, [setContractUsingAbi]);

  return contract;
}
