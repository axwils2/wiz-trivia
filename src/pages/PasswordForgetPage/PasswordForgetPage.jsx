// @flow
import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { PasswordForgetForm } from "./components";

const PasswordForgetPage = () => (
  <Container maxWidth={"xs"}>
    <Typography variant={"h4"} gutterBottom align={"center"}>
      Forget Password
    </Typography>
    <PasswordForgetForm />
  </Container>
);

export default PasswordForgetPage;
