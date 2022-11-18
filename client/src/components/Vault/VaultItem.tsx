import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import { IVaultItem } from "../../store/vault";

export interface VaultItemProps {
  item: IVaultItem;
  onItemSelect: () => void;
}

const VaultItem: React.FC<VaultItemProps> = ({ item, onItemSelect }) => {

  const onClick = () => {
    onItemSelect();
  };

  return (
    <Card sx={{ mb: 1.5 }}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant="body2">{item.name}</Typography>
          <Typography
            sx={{ fontSize: 14, mt: 1.5 }}
            color="text.secondary"
            gutterBottom
          >
            {item.userName}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VaultItem;
