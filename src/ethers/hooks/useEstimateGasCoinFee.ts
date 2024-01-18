import { Web3Provider } from '@ethersproject/providers';
import { useCallback, useState } from 'react';

import { isProviderRpcError } from '@/src/ethers/errors';
import { useAccount } from '@/src/ethers/hooks';

export function useEstimateGasCoinFee() {
  const { account } = useAccount();
  const [error, setError] = useState<string | null>(null);

  const getSendCoinFee = useCallback(
    async (toAddress: string, amount: bigint) => {
      try {
        // TODO why only this provider return maxFeePerGas and maxPriorityFeePerGas
        const provider = new Web3Provider(window.ethereum);

        const feeData = await provider?.getFeeData();

        const maxFeePerGas = BigInt(String(feeData.maxFeePerGas));
        const maxPriorityFeePerGas = BigInt(String(feeData.maxPriorityFeePerGas));

        if (!(maxFeePerGas && maxPriorityFeePerGas)) {
          setError('Cant estimate maxFeePerGas and maxPriorityFeePerGas');

          return;
        }

        const gasAmount = await provider.estimateGas({
          to: toAddress,
          from: account || '',
          value: amount,
          maxFeePerGas,
          maxPriorityFeePerGas,
        });

        const estimatedFee = BigInt(String(gasAmount)) * maxFeePerGas;

        return { amount: estimatedFee, maxFeePerGas, maxPriorityFeePerGas };
      } catch (error) {
        if (isProviderRpcError(error)) {
          setError(error.message);
        }
      }
    },
    [account]
  );

  return { getSendCoinFee, error };
}
