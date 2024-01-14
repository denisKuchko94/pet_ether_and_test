import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Box, Stack } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { SyntheticEvent, useState } from 'react';

import { NumberFormatter } from '@/helpers';
import SendToken from '@/src/app/components/SendToken';
import { ContractKeys } from '@/src/ethers/constants/chainsinfo';

type Props = {
  updateBalance: () => void;

  tokens: Array<{
    decimals?: number | bigint;
    balance: bigint;
    symbol?: 'eth' | ContractKeys;
    transactionsCount?: number;
    token?: ContractKeys;
  }>;
};
export default function Amount({ tokens, updateBalance }: Props) {
  const [expanded, setExpanded] = useState<number | false>(false);

  const handleChange = (panel: number) => (event: SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Box
      sx={{
        border: '1px solid yellow',
        borderRadius: '1rem',
      }}
    >
      {tokens.map(({ decimals, balance, symbol, transactionsCount, token }, index) => {
        return (
          <Accordion
            key={symbol}
            expanded={expanded === index}
            onChange={handleChange(index)}
            sx={{
              backgroundColor: 'transparent',
              color: 'yellow',
            }}
          >
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
              <Typography>{symbol}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack>
                <Box component={'div'} display={'flex'} gap={'0.5rem'}>
                  <Typography>Amount:</Typography>
                  <Typography>
                    {NumberFormatter.formatUnitsToDisplay(balance, {
                      decimals: Number(decimals),
                      maxFractionalLength: 4,
                    })}
                  </Typography>
                  <Typography>{symbol}</Typography>
                </Box>
                <Typography>Decimals: {String(decimals)}</Typography>
                {transactionsCount && <Typography>Transactions amount: {transactionsCount}</Typography>}

                {symbol && token !== ContractKeys.AXLT ? (
                  <Box mt={'1rem'}>
                    <SendToken token={token} decimals={Number(decimals ?? 18)} updateBalance={updateBalance} />
                  </Box>
                ) : (
                  <Typography color={'red'}>Contract does not allow you to transfer AXLT</Typography>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  () => ({
    borderBottom: `1px solid yellow`,
    borderRadius: '0 0 1rem 1rem',

    '&::before': {
      display: 'none',
    },

    '& .MuiAccordionSummary-expandIconWrapper': {
      '& svg path': {
        fill: 'yellow',
      },
    },
  })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}));
