import { useEffect, useState } from "react";
import { Grid, Typography, IconButton, Slider, Switch } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Autorenew";

import { useSnackbar } from "../../store/snackbar";

const alpha = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*_-+=";

const PasswordGenerator = () => {
  const snackbar = useSnackbar();

  const [password, setPassword] = useState("hello World");

  const [length, setLength] = useState(10);
  const [includeUpperCase, setIncludeUpperCase] = useState(true);
  const [includeLowerCase, setIncludeLowerCase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialChar, setIncludeSpecialChar] = useState(true);

  const generatePassword = () => {
    let allChars = alpha;

    if (includeUpperCase) allChars = allChars.concat(alpha.toUpperCase());
    if (includeSpecialChar) allChars = allChars.concat(symbols);
    if (includeNumbers) allChars = allChars.concat(numbers);

    const passwordCharacters = [];

    for (let i = 0; i < length; i++) {
      const index = allChars[Math.floor(Math.random() * allChars.length)];
      passwordCharacters.push(index);
    }

    setPassword(passwordCharacters.join(""));
  };

  useEffect(() => {
    generatePassword();
  }, [
    length,
    includeUpperCase,
    includeLowerCase,
    includeNumbers,
    includeSpecialChar,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);

    snackbar.showSnackbar("Copied to clipboard", "info");
  };

  return (
    <div>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={(theme) => ({
          backgroundColor: theme.palette.grey[200],
          padding: "20px",
          borderRadius: "5px",
          mt: 2,
        })}
        spacing={2}
      >
        <Grid item xs={10}>
          <Typography
            variant="h4"
            textAlign="center"
            sx={{ overflowX: "auto" }}
            id="generated-password"
          >
            {password}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton sx={{ mr: 2 }} onClick={handleCopy}>
            <ContentCopyIcon />
          </IconButton>

          <IconButton onClick={generatePassword}>
            <RefreshIcon />
          </IconButton>
        </Grid>
      </Grid>

      <Typography
        variant="subtitle1"
        style={{ marginTop: "15px", marginBottom: "10px" }}
      >
        Password Generator options
      </Typography>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          padding: "10px",
          "&:hover": { backgroundColor: "#eee" },
          borderRadius: "5px",
        }}
      >
        <Grid item xs={2}>
          <Typography>Length: {length}</Typography>
        </Grid>
        <Grid item xs={10}>
          <Slider
            value={length}
            valueLabelDisplay="auto"
            min={1}
            max={50}
            onChange={(e, v) => setLength(v as number)}
          />
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          padding: "10px",
          "&:hover": { backgroundColor: "#eee" },
          borderRadius: "5px",
        }}
      >
        <Grid item xs={2}>
          <Typography>Include A-Z</Typography>
        </Grid>
        <Grid item xs={10}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Switch
              checked={includeUpperCase}
              onChange={(e, v) => setIncludeUpperCase(v)}
            />
          </div>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          padding: "10px",
          "&:hover": { backgroundColor: "#eee" },
          borderRadius: "5px",
        }}
      >
        <Grid item xs={2}>
          <Typography>Include a-z</Typography>
        </Grid>
        <Grid item xs={10}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Switch
              checked={includeLowerCase}
              onChange={(e, v) => setIncludeLowerCase(v)}
            />
          </div>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          padding: "10px",
          "&:hover": { backgroundColor: "#eee" },
          borderRadius: "5px",
        }}
      >
        <Grid item xs={2}>
          <Typography>Include 0-9</Typography>
        </Grid>
        <Grid item xs={10}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Switch
              checked={includeNumbers}
              onChange={(e, v) => setIncludeNumbers(v)}
            />
          </div>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          padding: "10px",
          "&:hover": { backgroundColor: "#eee" },
          borderRadius: "5px",
        }}
      >
        <Grid item xs={2}>
          <Typography>Include {symbols}</Typography>
        </Grid>
        <Grid item xs={10}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Switch
              checked={includeSpecialChar}
              onChange={(e, v) => setIncludeSpecialChar(v)}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default PasswordGenerator;
