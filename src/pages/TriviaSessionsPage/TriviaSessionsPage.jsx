// @flow
import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { compose } from "recompose";
import Container from "@material-ui/core/Container";

import { withAuthorization, withEmailVerification } from "components/Session";
import { TriviaSessionsList } from "./components";
import * as ROUTES from "constants/routes";

const TriviaSessionsPage = () => (
  <Container maxWidth={"md"}>
    <h1>Sessions</h1>
    <TriviaSessionsList />
  </Container>
);

const condition = authUser => !!authUser;
export default compose(withEmailVerification, withAuthorization(condition))(
  TriviaSessionsPage
);
