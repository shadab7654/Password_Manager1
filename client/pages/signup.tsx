import type { NextPage } from "next";
import { Grid } from "@mui/material";
import Signup from "../src/components/Signup";

const Home: NextPage = () => {
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
        <Signup />
      </Grid>
    </Grid>
  );
};

export default Home;
