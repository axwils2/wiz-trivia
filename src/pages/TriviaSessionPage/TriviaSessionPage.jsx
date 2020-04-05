// @flow
import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { firestore } from "components/Firebase";
import { docDataWithId } from "functions/firestoreHelpers";
import { CategoriesTable, UpdateTriviaSessionForm } from "./components";
import * as ROUTES from "constants/routes";

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(8, 0, 2)
  }
}));

const TriviaSessionPage = ({ match }: { match: * }) => {
  const classes = useStyles();
  const [triviaSession, setTriviaSession] = useState(null);

  useEffect(
    () => {
      firestore
        .triviaSession(match.params.triviaSessionUid)
        .get()
        .then(doc => {
          const data = docDataWithId(doc);
          setTriviaSession(data);
        });
    },
    [match.params.triviaSessionUid]
  );

  if (!triviaSession) return null;

  return (
    <Container maxWidth={"md"}>
      <Breadcrumbs
        aria-label={"breadcrumbs"}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <Link to={ROUTES.TRIVIA_SESSIONS} color={"inherit"}>
          Sessions
        </Link>
        <Typography>Session/Categories</Typography>
      </Breadcrumbs>
      <UpdateTriviaSessionForm triviaSession={triviaSession} />
      <Divider className={classes.divider} />
      <CategoriesTable triviaSession={triviaSession} />
    </Container>
  );
};

export default withRouter(TriviaSessionPage);
