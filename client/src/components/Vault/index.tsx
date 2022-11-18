import { useEffect, useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  List,
  ListSubheader,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  styled,
} from "@mui/material";

import { Password, Notes, LockReset } from "@mui/icons-material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import VaultItem from "./VaultItem";
import AddVaultItem from "./AddVaultItem";
import ViewVaultItem from "./ViewVaultItem";
import PasswordGenerator from "./PasswordGenerator";

import { useVault, IVaultItem, VaultItemTypeMap } from "../../store/vault";

const StyledListItemButton = styled(ListItemButton)(({ theme }) => {
  return {
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.light,
    },
  };
});

function convertToCSV(objArray: any) {
  const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  let str = "";

  if (array.length <= 0) return array;

  let line = "";

  for (const index in array[0]) {
    if (line != "") line += ",";

    line += index;
  }

  str += line + "\r\n";

  for (let i = 0; i < array.length; i++) {
    line = "";
    for (const index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  console.log(str);
  return str;
}

const Vault = () => {
  const vaultData = useVault();
  const [openItem, setOpenItem] = useState<IVaultItem | undefined>(undefined);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    vaultData.getVaultItems();
  }, []);

  const getMainContent = () => {
    if (showGenerator) {
      return <PasswordGenerator />;
    }

    if (vaultData.isLoading) {
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      );
    }

    if (vaultData.selectedVaultList.length === 0) {
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography color="text.secondary">No items found.</Typography>
        </div>
      );
    }

    return vaultData.selectedVaultList.map((elem) => (
      <VaultItem
        onItemSelect={() => setOpenItem(elem)}
        item={elem}
        key={elem.id}
      />
    ));
  };

  const exportAsJson = () => {
    const jsonse = JSON.stringify(vaultData.vaultList);
    const blob = new Blob([jsonse], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "vault.json");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsCSV = () => {
    const jsonse = convertToCSV(vaultData.vaultList);
    const blob = new Blob([jsonse], { type: "application/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "vault.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSidebar = () => {
    return (
      <List
        sx={{ width: "100%", maxWidth: 360 }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Vault Items
          </ListSubheader>
        }
      >
        <StyledListItemButton
          selected={
            !showGenerator &&
            vaultData.selectedVaultType === VaultItemTypeMap.password
          }
          onClick={() => {
            setShowGenerator(false);
            vaultData.setSelectedVaultType(VaultItemTypeMap.password);
          }}
        >
          <ListItemIcon>
            <Password />
          </ListItemIcon>
          <ListItemText primary="Passwords" />
        </StyledListItemButton>
        <StyledListItemButton
          selected={
            !showGenerator &&
            vaultData.selectedVaultType === VaultItemTypeMap.notes
          }
          onClick={() => {
            setShowGenerator(false);
            vaultData.setSelectedVaultType(VaultItemTypeMap.notes);
          }}
        >
          <ListItemIcon>
            <Notes />
          </ListItemIcon>
          <ListItemText primary="Secure Notes" />
        </StyledListItemButton>
        <StyledListItemButton
          selected={showGenerator}
          onClick={() => {
            setShowGenerator(true);
          }}
        >
          <ListItemIcon>
            <LockReset />
          </ListItemIcon>
          <ListItemText primary="Password Generator" />
        </StyledListItemButton>
        <StyledListItemButton
          onClick={() => {
            exportAsJson();
          }}
        >
          <ListItemIcon>
            <FileDownloadIcon />
          </ListItemIcon>
          <ListItemText primary="Export as JSON" />
        </StyledListItemButton>
        <StyledListItemButton
          onClick={() => {
            exportAsCSV();
          }}
        >
          <ListItemIcon>
            <FileDownloadIcon />
          </ListItemIcon>
          <ListItemText primary="Export as CSV" />
        </StyledListItemButton>
      </List>
    );
  };

  return (
    <div>
      <ViewVaultItem
        item={openItem}
        handleClose={() => setOpenItem(undefined)}
      />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={4}>
          {getSidebar()}
        </Grid>
        <Grid item xs={8}>
          {showGenerator || <AddVaultItem />}
          {getMainContent()}
        </Grid>
      </Grid>
    </div>
  );
};

export default Vault;
