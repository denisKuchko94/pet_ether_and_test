import { useCallback, useEffect, useState } from 'react';

import { CHAIN_INFO, SupportedChainId } from '@/src/ethers/constants/chainsinfo';
import { useAccount, useChain, useProvider } from '@/src/ethers/hooks/index';

export function useContractInfo() {
  const [wallet, setWallet] = useState<{
    balance: bigint;
    transactionsCount: number;
  } | null>(null);

  const { chainId } = useChain();
  const isMainnet = chainId === SupportedChainId.SmartChain;

  const { provider } = useProvider();
  const { account } = useAccount();

  const getWalletInfo = useCallback(async () => {
    if (!provider) return null;

    try {
      if (account) {
        const balance = await provider.getBalance(account);
        const transactionsCount = await provider.getTransactionCount(account);

        setWallet({ ...CHAIN_INFO[SupportedChainId.SmartChain].nativeCurrency, balance, transactionsCount });
      }
    } catch (error) {
      console.error('Failed to get mainnet contract', error);

      return setWallet(null);
    }
  }, [isMainnet, provider, account]);

  useEffect(() => {
    getWalletInfo();
  }, [getWalletInfo]);

  return { wallet, getWalletInfo };
}
