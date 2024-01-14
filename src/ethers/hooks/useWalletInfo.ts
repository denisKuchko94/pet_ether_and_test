import { useCallback, useEffect, useState } from 'react';

import { ContractKeys } from '@/src/ethers/constants/chainsinfo';
import { useAccount, useTokenInfo } from '@/src/ethers/hooks';

export function useWalletInfo(token: ContractKeys) {
  const [wallet, setWallet] = useState<{
    decimals: number;
    balance: bigint;
    symbol: 'eth' | ContractKeys;
  } | null>(null);
  const contract = useTokenInfo(token);
  const { account } = useAccount();

  const getWalletInfo = useCallback(async () => {
    if (!contract) {
      return setWallet(null);
    } else {
      try {
        const symbol = await contract.symbol();
        const balance = account ? await contract.balanceOf(account) : null;
        const decimals = await contract.decimals();

        setWallet({ symbol, balance, decimals });
      } catch (error) {
        console.error('Failed to get balance, decimal or symbol', error);

        return setWallet(null);
      }
    }
  }, [account, contract]);

  useEffect(() => {
    getWalletInfo();
  }, [getWalletInfo]);

  return { wallet, getWalletInfo };
}
