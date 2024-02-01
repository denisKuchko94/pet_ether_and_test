import { Stack, styled, Typography } from '@mui/material';

import { NumberFormatter } from '@/helpers';
import { useProvider } from '@/src/ethers/hooks';
import { usePriorityFee } from '@/src/ethers/hooks/usePriorityFee';

export default function BlockPriorityFee() {
  const { provider } = useProvider();
  const { priorityFee } = usePriorityFee(provider);

  return (
    <Stack gap={'1rem'}>
      <Stack>
        <Typography>
          Base fee:
          {NumberFormatter.formatUnitsToDisplay(priorityFee.baseFeePerGas, {
            decimals: 18,
            maxFractionalLength: 18,
          })}
        </Typography>
      </Stack>
      <Stack direction={'row'} justifyContent={'center'} gap={'0.5rem'} m={'0.5rem 0'}>
        <StyledBlock>
          <Typography> Min fee:</Typography>

          <Typography>
            {NumberFormatter.formatUnitsToDisplay(priorityFee.small, {
              decimals: 18,
              maxFractionalLength: 18,
            })}
          </Typography>
        </StyledBlock>
        <StyledBlock>
          <Typography> Medium fee:</Typography>

          <Typography>
            {NumberFormatter.formatUnitsToDisplay(priorityFee.medium, {
              decimals: 18,
              maxFractionalLength: 18,
            })}
          </Typography>
        </StyledBlock>
        <StyledBlock>
          <Typography> Max fee:</Typography>

          <Typography>
            {NumberFormatter.formatUnitsToDisplay(priorityFee.max, {
              decimals: 18,
              maxFractionalLength: 18,
            })}
          </Typography>
        </StyledBlock>
      </Stack>
    </Stack>
  );
}

export const StyledBlock = styled(Stack, { name: 'StyledBlock' })(() => ({
  width: '100%',
  height: '100%',
  gap: '0.5rem',
  padding: '0.5rem',
  alignItems: 'center',
  borderRadius: '1rem',
  border: '1px solid yellow',
}));
