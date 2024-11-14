import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ searchQuery, handleSearchChange }) {
  return (
    <TextField
      label="Search Posts"
      variant="outlined"
      fullWidth
      value={searchQuery}
      onChange={handleSearchChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon sx={{ color: 'white' }} />
          </InputAdornment>
        ),
        sx: {
          color: 'white',
        },
      }}
      sx={{
        maxWidth: '600px',
        '& .MuiInputLabel-root': {
          color: 'white',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'white',
          },
          '&:hover fieldset': {
            borderColor: 'white',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'white',
          },

        },
        
        '& .MuiFormLabel-colorPrimary': {
          color: 'white !important', 
        },
      }}
      className="rounded-lg"
    />
  );
}

export default SearchBar;
