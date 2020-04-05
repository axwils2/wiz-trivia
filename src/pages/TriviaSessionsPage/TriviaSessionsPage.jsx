// @flow
import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { compose } from "recompose";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { withAuthorization, withEmailVerification } from "components/Session";
import { TriviaSessionsList, NewTriviaSessionModal } from "./components";
import * as ROUTES from "constants/routes";

const TriviaSessionsPage = () => (
  <Container maxWidth={"md"}>
    <Typography variant={"h4"}>Sessions</Typography>
    <TriviaSessionsList />
    <NewTriviaSessionModal />
  </Container>
);

const condition = authUser => !!authUser;
export default compose(withEmailVerification, withAuthorization(condition))(
  TriviaSessionsPage
);
