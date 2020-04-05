// @flow
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { SignUpLink } from "pages/SignUpPage";
import { PasswordForgetLink } from "pages/PasswordForgetPage";
import { auth } from "components/Firebase";
import * as ROUTES from "constants/routes";

const SignInForm = ({ history }: { history: * }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const invalid = password === "" || email === "";

  const onSubmit = e => {
    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        history.push(ROUTES.TRIVIA_SESSIONS);
      })
      .catch(error => {
        setError(error);
      });
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        name="email"
        onChange={e => setEmail(e.target.value)}
        label={"Email"}
        variant={"outlined"}
        margin={"normal"}
        fullWidth
      />
      <TextField
        name="password"
        onChange={e => setPassword(e.target.value)}
        type="password"
        label={"Password"}
        variant={"outlined"}
        margin={"normal"}
        fullWidth
      />
      <Button
        disabled={invalid}
        type={"submit"}
        variant={"contained"}
        size={"large"}
        color={"primary"}
        fullWidth
      >
        Sign In
      </Button>
      {error && <Typography color={"error"}>{error.message}</Typography>}
    </form>
  );
};

export default withRouter(SignInForm);
