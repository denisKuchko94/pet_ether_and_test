import { useCallback, useEffect, useState } from 'react';

import { useNetwork } from '@/src/ethers/hooks/useNetwork';

const useChain = () => {
  const network = useNetwork();

  const [chainId, setChainId] = useState<number | null>(null);

  const onChainChanged = useCallback((chainId: string) => {
    const id = parseInt(chainId, 16);

    setChainId(Number.isNaN(id) ? null : id);
  }, []);

  const getChainId = useCallback(async () => {
    try {
      if (network) {
        const id = Number(network?.chainId);

        setChainId(!Number.isNaN(id) ? id : null);
      }
    } catch (err) {
      setChainId(null);
    }
  }, [network]);

  useEffect(() => {
    window?.ethereum?.on?.('chainChanged', onChainChanged);

    return () => {
      window?.ethereum?.removeListener?.('chainChanged', onChainChanged);
    };
  }, [onChainChanged]);

  useEffect(() => {
    getChainId();
  }, [getChainId]);

  return { chainId, getChainId };
};

export default useChain;
