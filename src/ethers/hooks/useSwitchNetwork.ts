import { ethers } from 'ethers';

import { getExplorerLink } from '@/helpers/getExplorerLink';
import { CHAIN_INFO, RPC_URLS, SupportedChainId } from '@/src/ethers/constants/chainsinfo';
import { isProviderRpcError } from '@/src/ethers/errors';
import { useProvider } from '@/src/ethers/hooks/useProvider';

export function useSwitchNetwork() {
  const { metamaskProvider } = useProvider();

  if (!metamaskProvider) return;

  const switchChain = async (chainId: SupportedChainId) => {
    try {
      // send a request to the wallet to switch the network and select the Ethereum mainnet
      await metamaskProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.toBeHex(chainId) }],
      });
    } catch (error) {
      if (isProviderRpcError(error)) {
        if (error.code === 4001) {
          console.error("the user doesn't want to change the network!");
        } else if (error.code === 4902) {
          const necessaryChain = CHAIN_INFO[chainId];

          await metamaskProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainId,
                chainName: necessaryChain.chainName,
                rpcUrls: RPC_URLS[SupportedChainId.SmartChain],
                nativeCurrency: necessaryChain.nativeCurrency,
                blockExplorerUrls: [getExplorerLink(chainId)],
              },
            ],
          });

          try {
            await metamaskProvider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId }],
            });
          } catch (error) {
            console.error('Added network but could not switch chains', error);
          }
        } else {
          console.error(`Error ${error.code}: ${error.message}`);
        }
      }
    }
  };

  return switchChain;
}
