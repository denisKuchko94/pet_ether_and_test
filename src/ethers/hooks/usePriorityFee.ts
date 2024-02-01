import { BrowserProvider, formatUnits } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { isProviderRpcError } from '@/src/ethers/errors';

export function usePriorityFee(provider: BrowserProvider | null, blocks: number = 5, percentage = [25, 50, 75]) {
  const [priorityFee, setPriorityFee] = useState<{ small: bigint; medium: bigint; max: bigint; baseFeePerGas: bigint }>(
    {
      small: 0n,
      medium: 0n,
      max: 0n,
      baseFeePerGas: 0n,
    }
  );

  const [error, setError] = useState<string | null>(null);

  const gasPriorityFee = useCallback(
    async (provider: BrowserProvider, blocks: number = 5, percentage = [25, 50, 75]) => {
      try {
        const feeHistory = await provider.send('eth_feeHistory', [blocks, 'latest', percentage]);

        const pendingBlock = await provider.getBlock('pending');
        const baseFeePerGas = pendingBlock?.baseFeePerGas;

        const result = {
          small: average(feeHistory.reward.map((item: bigint[]) => BigInt(formatUnits(item[0], 'wei')))),
          medium: average(feeHistory.reward.map((item: bigint[]) => BigInt(formatUnits(item[1], 'wei')))),
          max: average(feeHistory.reward.map((item: bigint[]) => BigInt(formatUnits(item[2], 'wei')))),
          baseFeePerGas: baseFeePerGas ?? 0n,
        };

        setPriorityFee(result);

        return { result };
      } catch (error) {
        console.error(error);
        if (isProviderRpcError(error)) {
          setError(error.message);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (provider) {
      gasPriorityFee(provider, blocks, percentage);
    }
  }, [gasPriorityFee, provider]);

  return { gasPriorityFee, error, priorityFee };
}

const average = (amount: bigint[]) => {
  const sum = amount.reduce((acc, item) => acc + item, 0n);

  return sum / BigInt(amount.length);
};
