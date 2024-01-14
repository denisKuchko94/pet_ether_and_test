import { Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { ContractKeys, SupportedChainId, TOKENS } from '@/src/ethers/constants/chainsinfo';
import { useChain, useProvider } from '@/src/ethers/hooks/index';
import { getContract } from '@/src/ethers/utils/common';

export function useTokenInfo(token?: ContractKeys) {
  const [contract, setContract] = useState<Contract | null>(null);

  const { chainId } = useChain();
  const isMainnet = chainId === SupportedChainId.SmartChain;

  const { provider } = useProvider();

  const getMainContract = useCallback(async () => {
    if (!provider) return null;

    try {
      if (isMainnet && token) {
        const mainContract = await getContract(isMainnet ? TOKENS[token].dev : '', TOKENS[token].abi, provider);

        setContract(mainContract);
      }
    } catch (error) {
      console.error('Failed to get mainnet contract', error);
      setContract(null);
    }
  }, [isMainnet, provider, token]);

  useEffect(() => {
    getMainContract();
  }, [getMainContract]);

  return contract;
}
