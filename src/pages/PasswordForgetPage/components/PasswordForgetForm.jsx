// @flow
import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { auth } from "components/Firebase";
import * as ROUTES from "constants/routes";

const PasswordForgetForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const invalid = email === "";

  const onSubmit = event => {
    auth
      .doPasswordReset(email)
      .then(() => {
        setEmail("");
        setError(null);
        setSuccess(true);
      })
      .catch(error => {
        setError(error);
      });
    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        name="email"
        onChange={e => setEmail(e.target.value)}
        label={"Email"}
        variant={"outlined"}
        value={email}
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
        Reset Password
      </Button>
      {error && <Typography color={"error"}>{error.message}</Typography>}
      {success && (
        <Typography color={"primary"}>
          Check your email to reset your password. Then sign in{" "}
          <Link to={ROUTES.SIGN_IN}>here</Link>
        </Typography>
      )}
    </form>
  );
};

export default PasswordForgetForm;
