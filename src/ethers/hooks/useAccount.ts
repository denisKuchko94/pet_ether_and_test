import { useCallback, useEffect, useState } from 'react';

import { isProviderRpcError } from '@/src/ethers/errors';
import { useProvider } from '@/src/ethers/hooks/useProvider';

const useAccount = () => {
  const { provider, metamaskProvider } = useProvider();
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<null | string>(null);

  const onAccountsChanged = useCallback((accounts: string[]) => {
    setAccount(accounts?.[0]?.toLowerCase() ?? null);
  }, []);

  const handleConnection = useCallback(async () => {
    try {
      const accounts = await metamaskProvider?.request({
        method: 'eth_requestAccounts',
      });

      const result = accounts?.[0]?.toLowerCase() ?? null;

      setAccount(result);

      return result;
    } catch (err) {
      setAccount(null);

      if (isProviderRpcError(err) && err.code === -32002) return setError('Click to Metamask extention ');

      return null;
    }
  }, [metamaskProvider]);

  const getAccount = useCallback(async () => {
    try {
      const signer = await provider?.getSigner();

      signer?.address && setAccount(signer?.address?.toLowerCase());

      return signer ?? null;
    } catch (err) {
      setAccount(null);

      return null;
    }
  }, [provider]);

  useEffect(() => {
    window?.ethereum?.on?.('accountsChanged', onAccountsChanged);

    return () => {
      window?.ethereum?.removeListener?.('accountsChanged', onAccountsChanged);
    };
  }, [onAccountsChanged]);

  useEffect(() => {
    getAccount();
  }, [getAccount]);

  return { account, getAccount, handleConnection, error };
};

export default useAccount;
