import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useVault, IVaultItem, VaultItemTypeMap } from "../../store/vault";
import { useSnackbar } from "../../store/snackbar";
import PasswordInput from "../Input/PasswordInput";
import InputBox from "../Input/InputBox";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export interface ViewVaultItemProps {
  item?: IVaultItem;
  handleClose: () => void;
}

const ViewVaultItem: React.FC<ViewVaultItemProps> = ({ item, handleClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const vaultData = useVault();
  const snackbar = useSnackbar();

  const [name, setName] = useState("");

  // Password Input
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");

  // Secure Notes
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setUserName(item.userName || "");
      setPassword(item.password || "");
      setUrl(item.url || "");

      setNotes(item.notes || "");
    }
  }, [item]);

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!item) {
      return;
    }

    const newList = [...vaultData.vaultList];
    const itemIndex = newList.findIndex((e) => e.id === item.id);

    if (itemIndex !== -1) {
      let newItem: IVaultItem = {
        ...item,
        name,
        type: vaultData.selectedVaultType,
      };

      if (!name) {
        snackbar.showSnackbar("Name is requried", "error");
        return;
      }

      if (vaultData.selectedVaultType === VaultItemTypeMap.password) {
        newItem = { ...newItem, userName, password, url };
      } else if (vaultData.selectedVaultType === VaultItemTypeMap.notes) {
        newItem = { ...newItem, notes };
      }

      newList[itemIndex] = { ...newItem };

      vaultData.updateVaultItem(newList).then((isSuccess) => {
        if (isSuccess) {
          snackbar.showSnackbar("Item updated successfully", "success");
          onClose();
        }
      });
    }
  };

  const onClose = () => {
    setIsEditing(false);
    handleClose();
  };

  const onDelete = () => {
    if (!item) {
      return;
    }

    vaultData
      .updateVaultItem([...vaultData.vaultList].filter((e) => e.id !== item.id))
      .then((isSuccess) => {
        if (isSuccess) {
          snackbar.showSnackbar("Item deleted successfully", "success");
          setIsDeleteOpen(false);
          onClose();
        }
      });
  };

  const getFormInputs = () => {
    if (vaultData.selectedVaultType === VaultItemTypeMap.notes) {
      return (
        <>
          <InputBox
            sx={{ mt: 1 }}
            autoFocus
            margin="dense"
            id="notes"
            label="Secure Notes"
            type="text"
            fullWidth
            rows={4}
            multiline
            variant="standard"
            showCopy={!isEditing}
            disabled={vaultData.isUpdating || !isEditing}
            value={notes}
            onChange={(e) => setNotes(e)}
          />
        </>
      );
    }

    if (vaultData.selectedVaultType === VaultItemTypeMap.password) {
      return (
        <>
          <InputBox
            sx={{ mt: 1 }}
            autoFocus
            margin="dense"
            id="username"
            label="User Name"
            type="text"
            fullWidth
            variant="standard"
            showCopy={!isEditing}
            disabled={vaultData.isUpdating || !isEditing}
            value={userName}
            onChange={(e) => setUserName(e)}
          />
          <PasswordInput
            sx={{ mt: 1 }}
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            fullWidth
            variant="standard"
            showCopy={!isEditing}
            disabled={vaultData.isUpdating || !isEditing}
            value={password}
            onChange={(e) => setPassword(e)}
          />
          <InputBox
            sx={{ mt: 1 }}
            autoFocus
            margin="dense"
            id="url"
            label="URL"
            type="text"
            fullWidth
            variant="standard"
            disabled={vaultData.isUpdating || !isEditing}
            value={url}
            onChange={(e) => setUrl(e)}
          />
        </>
      );
    }
  };

  return (
    <>
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={onDelete}
      />
      <Dialog open={!!item} onClose={onClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>{name}</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <InputBox
              sx={{ mt: 1 }}
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              disabled={vaultData.isUpdating || !isEditing}
              value={name}
              onChange={(e) => setName(e)}
            />

            {getFormInputs()}

            {vaultData.updateErrorMessage && (
              <Typography sx={{ mt: 1.5, fontSize: "0.9rem" }} color="error">
                {vaultData.updateErrorMessage}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={vaultData.isUpdating}>
              Cancel
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => setIsDeleteOpen(true)}
              disabled={vaultData.isUpdating}
            >
              Delete
            </Button>
            {isEditing ? (
              <Button
                startIcon={<EditIcon />}
                disabled={vaultData.isUpdating}
                onClick={onSubmit}
              >
                {vaultData.isUpdating ? (
                  <CircularProgress size={20} />
                ) : (
                  "Update"
                )}
              </Button>
            ) : (
              <Button
                startIcon={<EditIcon />}
                disabled={vaultData.isUpdating}
                onClick={() => setIsEditing(true)}
              >
                {vaultData.isUpdating ? <CircularProgress size={20} /> : "Edit"}
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ViewVaultItem;
