import { Alert, Box, Button, Snackbar, Stack, Typography } from '@mui/material';
import { formatUnits, isAddress } from 'ethers';
import * as React from 'react';
import { ChangeEvent, useCallback, useState } from 'react';

import { NumberFormatter } from '@/helpers';
import Input from '@/src/app/components/Input';
import { ContractKeys } from '@/src/ethers/constants/chainsinfo';
import { useEstimateGasCoinFee, useTransfer } from '@/src/ethers/hooks';

export default function SendToken({
  decimals,
  token,
  updateBalance,
}: {
  token?: ContractKeys;
  decimals: number;
  updateBalance: () => void;
}) {
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [gas, setGas] = useState<{
    amount: bigint;
    maxFeePerGas: bigint | null;
    maxPriorityFeePerGas: bigint | null;
  } | null>(null);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; title: string } | null>(null);

  const transfer = useTransfer(token);
  const { getSendCoinFee, error } = useEstimateGasCoinFee();

  const handleChangeAddress = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setAddress(e.target.value),
    []
  );
  const handleChangeAmount = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setAmount(e.target.value),
    []
  );

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();

      if (isAddress(address)) {
        const result = await transfer(address, NumberFormatter.parseUnits(amount, decimals));

        if (result) {
          const { status, hash, gasUsed, value } = await result.wait();

          status && updateBalance();
          setMessage({ type: 'success', title: `Value:${value}, Status:${status}, Hash:${hash}, Gas:${gasUsed}` });
        }
      } else {
        setMessage({ type: 'error', title: 'Wrong wallet' });
      }
    },
    [address, amount, decimals, transfer, updateBalance]
  );

  const calculateGas = useCallback(async () => {
    const gasAmount = await getSendCoinFee(address, NumberFormatter.parseUnits(amount, decimals));

    gasAmount && setGas(gasAmount);

    if (error) {
      setMessage({ type: 'error', title: 'error' });
    }
  }, [address, amount, decimals, error, getSendCoinFee]);

  return (
    <Box>
      <Stack component={'form'} onSubmit={handleSubmit} gap={'1rem'}>
        <Stack>
          <>
            {gas?.amount && <Typography>Estimated gas:{formatUnits(gas.amount, 'ether')}</Typography>}
            {gas?.maxFeePerGas && (
              <Typography>Max fee per gas(ether):{formatUnits(gas.maxFeePerGas, 'ether')}</Typography>
            )}
            {gas?.maxPriorityFeePerGas && (
              <Typography>Max priority fee per gas(ether):{formatUnits(gas.maxPriorityFeePerGas, 'ether')}</Typography>
            )}
          </>
        </Stack>
        <Input
          name={'address'}
          label={'Address'}
          placeholder={'Set Address'}
          onChange={handleChangeAddress}
          value={address}
        />
        <Input
          name={'amount'}
          type={'number'}
          label={'Amount'}
          placeholder={'Set Amount'}
          onChange={handleChangeAmount}
          value={amount}
        />

        <Button type={'submit'} fullWidth>
          Send
        </Button>

        <Button fullWidth onClick={calculateGas} variant={'text'} disabled={!amount || !isAddress(address)}>
          Calculate gas
        </Button>
      </Stack>
      <Snackbar open={!!message} autoHideDuration={6000} onClose={() => setMessage(null)}>
        <Alert onClose={() => setMessage(null)} severity={message?.type} sx={{ width: '100%' }}>
          {message?.title}
        </Alert>
      </Snackbar>
    </Box>
  );
}
