/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { TextField } from '@mui/material';

const MuiInput = ({ label, error, helperText, ...props }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      error={error}
      helperText={helperText}
      {...props}
    />
  );
};

export default MuiInput;
