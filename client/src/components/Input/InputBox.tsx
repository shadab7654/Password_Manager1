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

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useSnackbar } from "../../store/snackbar";

interface InputBoxProps {
  value: string;
  onChange: (val: string) => void;
  id: string;
  label: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  variant?: StandardTextFieldProps["variant"];
  margin?: InputBaseProps["margin"];
  rows?: InputBaseProps["rows"];
  maxRows?: InputBaseProps["maxRows"];
  multiline?: InputBaseProps["multiline"];
  sx?: SxProps;
  showCopy?: boolean;
  type?: "text" | "email";
}

const InputBox: React.FC<InputBoxProps> = ({
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
  type,
  rows,
  multiline,
  maxRows,
}) => {
  const snackbar = useSnackbar();

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
        type={type || "text"}
        rows={rows}
        multiline={multiline}
        maxRows={maxRows}
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        endAdornment={
          showCopy ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="copy to clipboard"
                onClick={handleCopy}
                onMouseDown={handleMouseDownPassword}
              >
                <ContentCopyIcon />
              </IconButton>
            </InputAdornment>
          ) : undefined
        }
      />
    </FormControl>
  );
};

export default InputBox;
