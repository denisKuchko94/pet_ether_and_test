import { Box, Button, Stack } from '@mui/material';
import * as React from 'react';
import { ChangeEvent, useCallback, useState } from 'react';

import { NumberFormatter } from '@/helpers';
import Input from '@/src/app/components/Input';
import { useAllowance } from '@/src/ethers/hooks';

export default function IncreaseAllowance() {
  const { allowance, increaseAllowance } = useAllowance();
  const [amount, setAmount] = useState<string>('');

  const handleChangeAmount = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setAmount(e.target.value),
    []
  );

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      if (amount) {
        await increaseAllowance(NumberFormatter.parseUnits(amount, 18));
      }
    },
    [amount, increaseAllowance]
  );

  return (
    <Box>
      <Stack component={'form'} onSubmit={handleSubmit} gap={'1rem'}>
        <Stack>
          TTK allowance:{' '}
          {!!allowance &&
            NumberFormatter.formatUnitsToDisplay(allowance, {
              decimals: Number(18),
              maxFractionalLength: 4,
            })}
        </Stack>

        <Input
          name={'amount'}
          type={'number'}
          label={'Amount'}
          placeholder={'Set Amount'}
          onChange={handleChangeAmount}
          value={amount}
        />

        <Button type={'submit'} fullWidth>
          Increase allowance
        </Button>
      </Stack>
    </Box>
  );
}
