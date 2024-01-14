import detectEthereumProvider from '@metamask/detect-provider';
import { BrowserProvider, Eip1193Provider, ethers, JsonRpcSigner } from 'ethers';
import { useEffect, useState } from 'react';

export function useProvider() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [metamaskProvider, setMetamaskProvider] = useState<Eip1193Provider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [hasConnection, setHasConnection] = useState(false);

  const getProvider = async () => {
    if (window.ethereum === null) {
      setHasConnection(false);
      console.error('MetaMask not installed');
    } else {
      const metamaskProvider = await detectEthereumProvider<Eip1193Provider>({ mustBeMetaMask: true });

      if (metamaskProvider && metamaskProvider === window.ethereum) {
        const provider = new BrowserProvider(metamaskProvider);

        const signer = await provider?.getSigner();

        setProvider(provider ?? null);
        setMetamaskProvider(metamaskProvider);
        setSigner(signer);
        setHasConnection(true);
      }
    }
  };

  useEffect(() => {
    if (ethers) {
      getProvider();
    }
  }, []);

  return { provider, metamaskProvider, signer, hasConnection };
}
