// @flow
import React, { useState } from "react";
import { compose } from "recompose";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";

import { withAuthorization, withEmailVerification } from "components/Session";
import { TriviaSessionsTable, NewTriviaSessionModal } from "./components";

const useStyles = makeStyles(theme => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingBottom: theme.spacing(2)
  },
  archiveFilterButton: {
    marginRight: "8px"
  }
}));

const TriviaSessionsPage = () => {
  const classes = useStyles();
  const [archived, setArchived] = useState(false);

  return (
    <Container maxWidth={"md"}>
      <Breadcrumbs aria-label={"breadcrumbs"}>
        <Typography>Sessions</Typography>
      </Breadcrumbs>
      <div className={classes.header}>
        <Typography variant={"h4"}>Sessions (Limit last 10)</Typography>
        <div>
          <Button
            onClick={() => setArchived(!archived)}
            variant={"contained"}
            color={"primary"}
            className={classes.archiveFilterButton}
          >
            {archived ? "Active" : "Archived"}
          </Button>
          <NewTriviaSessionModal />
        </div>
      </div>
      <TriviaSessionsTable archived={archived} />
    </Container>
  );
};

const condition = authUser => !!authUser;
export default compose(withEmailVerification, withAuthorization(condition))(
  TriviaSessionsPage
);
