import { Grid, CircularProgress } from "@mui/material";
import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <CircularProgress size={50} />
      </Grid>
    </Grid>
  );
};
export default LoadingPage;
