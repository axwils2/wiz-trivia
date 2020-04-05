// @flow
import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { SignUpLink } from "pages/SignUpPage";
import { PasswordForgetLink } from "pages/PasswordForgetPage";
import SignInForm from "./components/SignInForm";

const SignInPage = () => (
  <Container maxWidth={"xs"}>
    <Typography variant={"h4"} gutterBottom align={"center"}>
      Sign In
    </Typography>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </Container>
);

export default SignInPage;
