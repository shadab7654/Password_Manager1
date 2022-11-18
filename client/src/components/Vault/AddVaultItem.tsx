import * as uuid from "uuid";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";

import PasswordInput from "../Input/PasswordInput";
import { useVault, IVaultItem, VaultItemTypeMap } from "../../store/vault";
import { useSnackbar } from "../../store/snackbar";

export default function AddVaultItem() {
  const vaultData = useVault();
  const snackbar = useSnackbar();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  // Password Inputs
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");

  // Vault Inputs
  const [notes, setNotes] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clearData = () => {
    setName("");
    setUserName("");
    setPassword("");
    setUrl("");
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (!name) {
      snackbar.showSnackbar("Name is requried", "error");
      return;
    }

    let newItem: IVaultItem = {
      id: uuid.v4(),
      name,
      type: vaultData.selectedVaultType,
    };

    if (vaultData.selectedVaultType === VaultItemTypeMap.password) {
      newItem = { ...newItem, userName, password, url };
    } else if (vaultData.selectedVaultType === VaultItemTypeMap.notes) {
      newItem = { ...newItem, notes };
    }

    vaultData
      .updateVaultItem([...vaultData.vaultList, newItem])
      .then((isSuccess) => {
        if (isSuccess) {
          snackbar.showSnackbar("Item added successfully", "success");
          clearData();
          handleClose();
        }
      });
  };

  const getFormInputs = () => {
    if (vaultData.selectedVaultType === VaultItemTypeMap.notes) {
      return (
        <>
          <TextField
            autoFocus
            margin="dense"
            id="notes"
            label="Secure Note"
            type="text"
            multiline
            rows={4}
            fullWidth
            variant="standard"
            disabled={vaultData.isUpdating}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </>
      );
    }

    if (vaultData.selectedVaultType === VaultItemTypeMap.password) {
      return (
        <>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="User Name"
            type="text"
            fullWidth
            variant="standard"
            disabled={vaultData.isUpdating}
            value={userName}
            onChange={(e) => setUserName(e.target.value.trim())}
          />
          <PasswordInput
            sx={{ mt: 1 }}
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            fullWidth
            variant="standard"
            disabled={vaultData.isUpdating}
            value={password}
            onChange={(e) => setPassword(e)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="url"
            label="URL"
            type="text"
            fullWidth
            variant="standard"
            disabled={vaultData.isUpdating}
            value={url}
            onChange={(e) => setUrl(e.target.value.trim())}
          />
        </>
      );
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}
    >
      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        onClick={handleClickOpen}
      >
        Add Item
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>
          Add a new{" "}
          {vaultData.selectedVaultType === VaultItemTypeMap.password
            ? "Password"
            : "Secure Note"}
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              disabled={vaultData.isUpdating}
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
            />

            {getFormInputs()}

            {vaultData.updateErrorMessage && (
              <Typography sx={{ mt: 1.5, fontSize: "0.9rem" }} color="error">
                {vaultData.updateErrorMessage}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={vaultData.isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={vaultData.isUpdating}>
              {vaultData.isUpdating ? <CircularProgress size={20} /> : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
