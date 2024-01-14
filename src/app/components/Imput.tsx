import { TextField, TextFieldProps } from '@mui/material';
import * as React from 'react';

export default function Input(props: TextFieldProps) {
  return (
    <TextField
      sx={{
        borderRadius: '1rem',
        border: '1px solid yellow',

        input: {
          color: 'yellow',
        },
        label: {
          color: 'yellow',
        },

        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      }}
      // variant={'filled'}
      {...props}
    />
  );
}
