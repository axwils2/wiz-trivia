// @flow
import React from "react";
import { compose } from "recompose";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { withAuthorization, withEmailVerification } from "components/Session";
import { TriviaSessionsTable, NewTriviaSessionModal } from "./components";

const useStyles = makeStyles(theme => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingBottom: theme.spacing(2)
  }
}));

const TriviaSessionsPage = () => {
  const classes = useStyles();

  return (
    <Container maxWidth={"md"}>
      <div className={classes.header}>
        <Typography variant={"h4"}>Sessions (Limit 10)</Typography>
        <NewTriviaSessionModal />
      </div>
      <TriviaSessionsTable />
    </Container>
  );
};

const condition = authUser => !!authUser;
export default compose(withEmailVerification, withAuthorization(condition))(
  TriviaSessionsPage
);
