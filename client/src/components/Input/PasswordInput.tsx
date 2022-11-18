import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  StandardTextFieldProps,
  InputBaseProps,
  SxProps,
} from "@mui/material";
import { useState } from "react";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useSnackbar } from "../../store/snackbar";

interface PasswordBoxProps {
  value: string;
  onChange: (val: string) => void;
  id: string;
  label: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  variant?: StandardTextFieldProps["variant"];
  margin?: InputBaseProps["margin"];
  sx?: SxProps;
  showCopy?: boolean;
}

const PasswordInput: React.FC<PasswordBoxProps> = ({
  value,
  onChange,
  id,
  label,
  fullWidth,
  disabled,
  variant,
  autoFocus,
  margin,
  sx,
  showCopy,
}) => {
  const snackbar = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleCopy = () => {
    const copyText = document.getElementById(id) as any;

    if (!copyText) {
      console.error("No copy element");
    }

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);

    snackbar.showSnackbar("Copied to clipboard", "info");
  };

  return (
    <FormControl
      sx={sx}
      fullWidth={fullWidth}
      disabled={disabled}
      variant={variant}
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        id={id}
        autoFocus={autoFocus}
        margin={margin}
        disabled={disabled}
        fullWidth={fullWidth}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            {showCopy && (
              <IconButton
                aria-label="copy to clipboard"
                onClick={handleCopy}
                onMouseDown={handleMouseDownPassword}
              >
                <ContentCopyIcon />
              </IconButton>
            )}
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default PasswordInput;
