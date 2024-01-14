import { Network } from 'ethers';
import { useEffect, useState } from 'react';

import { useProvider } from '@/src/ethers/hooks/useProvider';

export function useNetwork() {
  const [network, setNetwork] = useState<Network | null>(null);
  const { provider } = useProvider();

  const getNetwork = async () => {
    if (provider) {
      const network = await provider.getNetwork();

      setNetwork(network);
    }
  };

  useEffect(() => {
    getNetwork();
  }, [provider]);

  return network;
}
