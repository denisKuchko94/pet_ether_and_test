import { Contract } from 'ethers';
import { useCallback } from 'react';

import { ContractKeys } from '@/src/ethers/constants/chainsinfo';
import { useProvider, useTokenInfo } from '@/src/ethers/hooks/index';

export function useTransfer(token?: ContractKeys) {
  const { signer } = useProvider();
  const contract = useTokenInfo(token);

  const connection = contract?.connect(signer);

  const transfer = useCallback(
    async (toAddress: string, amount: bigint) => {
      try {
        if (token && connection) {
          const res = await (connection as Contract).transfer(toAddress, amount);

          return res;
        } else {
          const res = await signer?.sendTransaction({
            to: toAddress,
            value: amount,
          });

          return res;
        }
      } catch (error) {
        console.error('Failed to send transaction', error);
      }
    },
    [connection, signer, token]
  );

  return transfer;
}
