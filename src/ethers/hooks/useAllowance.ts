import { useCallback, useEffect, useState } from 'react';

import { ContractKeys, TOKENS } from '@/src/ethers/constants/chainsinfo';
import { useAccount, useContract } from '@/src/ethers/hooks';

export function useAllowance() {
  const { account } = useAccount();
  const contract = useContract(TOKENS[ContractKeys.USDT].dev, TOKENS[ContractKeys.USDT].abi, true);
  const contractAddress = TOKENS[ContractKeys.AXLT].dev;

  const [allowance, setAllowance] = useState<bigint | null>(null);

  const getAllowance = useCallback(async () => {
    try {
      if (contract && account && contractAddress) {
        const allowance = await contract.allowance(account, contractAddress);

        setAllowance(allowance);
      }
    } catch (error) {
      console.error(error);
    }
  }, [account, contract, contractAddress]);

  const increaseAllowance = useCallback(
    async (amount: bigint) => {
      try {
        if (contract && account && amount) {
          const allowance = await contract.increaseAllowance(contractAddress, amount);
          const tx = await allowance.wait();

          if (tx.status) {
            getAllowance();
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [account, contract, getAllowance]
  );

  useEffect(() => {
    if (contract && account && contractAddress) {
      getAllowance();
    }
  }, [getAllowance, account, contract, contractAddress]);

  return { getAllowance, allowance, increaseAllowance };
}
