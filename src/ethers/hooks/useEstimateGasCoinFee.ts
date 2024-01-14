import { useCallback, useState } from 'react';

import { isProviderRpcError } from '@/src/ethers/errors';
import { useAccount, useProvider } from '@/src/ethers/hooks';

export function useEstimateGasCoinFee() {
  const { provider } = useProvider();
  const { account } = useAccount();
  const [error, setError] = useState<string | null>(null);

  const getSendCoinFee = useCallback(
    async (toAddress: string, amount: bigint) => {
      try {
        if (provider) {
          // const a = new Interface(TOKENS['usdt'].abi).encodeFunctionData('transfer', [
          //   '0xD02AfF6ec46e081137453D33743DE12a0b7D9001',
          //   0.001,
          // ]);
          //
          // console.log(a);
          const feeData = await provider.getFeeData();
          const maxFeePerGas = feeData.maxFeePerGas;
          // const maxFeePerGas = 0n;
          // const maxPriorityFeePerGas = 0n;
          const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

          if (!(maxFeePerGas && maxPriorityFeePerGas)) {
            setError('Cent estimate maxFeePerGas and maxPriorityFeePerGas');
          }

          const gasAmount = await provider.estimateGas({
            to: toAddress,
            from: account,
            value: amount,
            maxFeePerGas,
            maxPriorityFeePerGas,
          });

          const estimatedFee = BigInt(gasAmount * (maxFeePerGas || 1n));

          return { amount: estimatedFee, maxFeePerGas, maxPriorityFeePerGas };
        }
      } catch (error) {
        if (isProviderRpcError(error)) {
          setError(error.message);
        }
      }
    },
    [account, provider]
  );

  return { getSendCoinFee, error };
}
