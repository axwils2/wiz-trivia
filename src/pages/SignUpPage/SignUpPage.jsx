// @flow
import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { SignUpForm } from "./components";

const SignUpPage = () => (
  <Container maxWidth={"xs"}>
    <Typography variant={"h4"} gutterBottom align={"center"}>
      Sign Up
    </Typography>
    <SignUpForm />
  </Container>
);

export default SignUpPage;
