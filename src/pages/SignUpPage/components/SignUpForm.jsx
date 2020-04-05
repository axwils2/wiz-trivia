// @flow
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { firestore, auth } from "components/Firebase";
import * as ROUTES from "constants/routes";

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";
const ERROR_MSG_ACCOUNT_EXISTS =
  "An account with this E-Mail address already exists.";

const SignUpForm = ({ history }: { history: * }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const invalid =
    password !== confirmPassword ||
    password === "" ||
    email === "" ||
    name === "";

  const onSubmit = event => {
    auth
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return firestore.user(authUser.user.uid).set({
          name,
          email
        });
      })
      .then(() => {
        return auth.doSendEmailVerification();
      })
      .then(() => {
        history.push(ROUTES.TRIVIA_SESSIONS);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(error);
      });
    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        name="name"
        onChange={e => setName(e.target.value)}
        label={"Full Name"}
        variant={"outlined"}
        margin={"normal"}
        fullWidth
      />
      <TextField
        name="email"
        onChange={e => setEmail(e.target.value)}
        label={"Email"}
        variant={"outlined"}
        margin={"normal"}
        type={"email"}
        fullWidth
      />
      <TextField
        name="password"
        onChange={e => setPassword(e.target.value)}
        label={"Password"}
        variant={"outlined"}
        margin={"normal"}
        type={"password"}
        fullWidth
      />
      <TextField
        name="confirmPassword"
        onChange={e => setConfirmPassword(e.target.value)}
        label={"Confirm Password"}
        variant={"outlined"}
        margin={"normal"}
        type={"password"}
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
        Sign Up
      </Button>
      {error && <Typography color={"error"}>{error.message}</Typography>}
    </form>
  );
};

export default withRouter(SignUpForm);
