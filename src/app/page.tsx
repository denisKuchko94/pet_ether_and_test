'use client';

import { Button, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

import Amount from '@/src/app/components/Amount';
import NestedList from '@/src/app/components/NestedList';
import { StyledHomeWrapper } from '@/src/app/styles';
import { ContractKeys, SupportedChainId } from '@/src/ethers/constants/chainsinfo';
import { useAccount, useChain } from '@/src/ethers/hooks';
import { useContractInfo } from '@/src/ethers/hooks/useContractInfo';
import { useSwitchNetwork } from '@/src/ethers/hooks/useSwitchNetwork';
import { useWalletInfo } from '@/src/ethers/hooks/useWalletInfo';

export default function Home() {
  const { account, handleConnection, error: accountError } = useAccount();
  const { chainId } = useChain();
  const switchNetwork = useSwitchNetwork();

  const { wallet: usdtWallet, getWalletInfo: getUsdt } = useWalletInfo(ContractKeys.USDT);
  const { wallet: axltWallet } = useWalletInfo(ContractKeys.AXLT);
  const { wallet: mainWallet, getWalletInfo: getMainCurrency } = useContractInfo();

  const uniteTokens = useMemo(() => {
    const result = [];

    mainWallet && result.push(mainWallet);
    usdtWallet && result.push({ ...usdtWallet, token: ContractKeys.USDT });
    axltWallet && result.push({ ...axltWallet, token: ContractKeys.AXLT });

    return result;
  }, [axltWallet, mainWallet, usdtWallet]);

  return (
    <StyledHomeWrapper>
      <Stack>
        {!account ? (
          <>
            <Typography>Metamask is not connected</Typography>
            <Typography color={'error'}>{accountError}</Typography>

            <Button onClick={handleConnection} variant={'outlined'}>
              Connect to Metamask
            </Button>
          </>
        ) : (
          <Stack direction={'row'} gap={'32px'}>
            <NestedList />
            <Stack>
              <Stack direction={'column'} gap={'30px'}>
                {!!chainId && <Typography variant={'h5'}> ChainId: {String(chainId)}</Typography>}
                {account && <Typography variant={'h5'}>Account: {account}</Typography>}
              </Stack>

              {Number(chainId) !== SupportedChainId.SmartChain && (
                <>
                  <Typography> You chain is not correct </Typography>
                  <Button
                    onClick={() => {
                      switchNetwork?.(SupportedChainId.SmartChain);
                    }}
                    variant={'outlined'}
                  >
                    Switch the net
                  </Button>
                </>
              )}
              <Amount
                tokens={uniteTokens}
                updateBalance={() => {
                  getMainCurrency();
                  getUsdt();
                }}
              />
            </Stack>
          </Stack>
        )}
      </Stack>
    </StyledHomeWrapper>
  );
}
