import { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../store/auth";
import Router from "next/router";
import Link from "next/link";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authData = useAuth();

  const onSubmit = async (event: any) => {
    event.preventDefault();
    authData.signup({
      name,
      email,
      password,
    }).then(isSuccess => {
      if (isSuccess) {
        Router.replace('/')
      }
    });
  };

  return (
    <Card sx={{ width: "400px" }}>
      <form onSubmit={onSubmit}>
        <CardContent>
          <Typography variant="h5" component="div">
            Signup
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Create a new account
          </Typography>

          <TextField
            sx={{ width: "100%", marginBottom: "1rem" }}
            id="name"
            label="Name"
            variant="outlined"
            disabled={authData.isLoading}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <TextField
            sx={{ width: "100%", marginBottom: "1rem" }}
            id="email"
            label="Email"
            variant="outlined"
            disabled={authData.isLoading}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <TextField
            sx={{ width: "100%" }}
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            disabled={authData.isLoading}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          {authData.errorMessage && (
            <Typography sx={{ mt: 1.5, fontSize: "0.9rem" }} color="error">
              {authData.errorMessage}
            </Typography>
          )}

          <Typography sx={{ mt: 1.5, fontSize: "0.9rem" }} color="text.secondary">
            Already have an account? <Link href="/login">Login</Link>.
          </Typography>
        </CardContent>
        <CardActions>
          <Grid container alignItems="center" justifyContent="right">
            <Grid item>
              <Button disabled={authData.isLoading} variant="contained" type="submit">
                {authData.isLoading ? <CircularProgress size={20} /> : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </form>
    </Card>
  );
};

export default Signup;
