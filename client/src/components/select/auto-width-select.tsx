import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

type AutoWidthSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (event: SelectChangeEvent<string>) => void;
};

const AutoWidthSelect = ({
  label,
  value,
  options,
  onChange,
}: AutoWidthSelectProps) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 80 }}>
      <InputLabel id="demo-simple-select-autowidth-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={value}
        onChange={onChange}
        autoWidth
        label={label}
        sx={{ right: "0 !important" }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AutoWidthSelect;
