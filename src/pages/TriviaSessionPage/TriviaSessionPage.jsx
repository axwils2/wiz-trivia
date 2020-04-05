// @flow
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";

import { firestore } from "components/Firebase";
import { docDataWithId } from "functions/firestoreHelpers";
import type { TriviaSessionType } from "types/TriviaSessionTypes";

const TriviaSessionPage = ({ match }: { match: * }) => {
  const [triviaSession, setTriviaSession] = useState(null);
  const [updates, setUpdates] = useState({});

  useEffect(
    () => {
      firestore
        .triviaSession(match.params.uid)
        .get()
        .then(doc => {
          const data = docDataWithId(doc);
          setTriviaSession(data);
        });
    },
    [match.params.uid]
  );

  const updateTriviaSession = () => {
    if (!triviaSession || isEmpty(updates)) return null;

    firestore
      .triviaSession(triviaSession.uid)
      .update(updates)
      .then(() => {
        setTriviaSession({ ...triviaSession, ...updates });
      });
  };

  if (!triviaSession) return null;

  return (
    <Container maxWidth={"md"}>
      <Typography variant={"h4"}>Trivia Session</Typography>
      <TextField
        id={"name"}
        label="Name"
        variant="outlined"
        onChange={e => setUpdates({ ...updates, name: e.target.value })}
        margin={"normal"}
        value={updates.name ? updates.name : triviaSession.name}
        fullWidth
      />
      <TextField
        id={"accessCode"}
        label="Access Code"
        variant="outlined"
        onChange={e =>
          setUpdates({ ...updates, accessCode: toUpper(e.target.value) })
        }
        margin={"normal"}
        value={
          updates.accessCode ? updates.accessCode : triviaSession.accessCode
        }
        fullWidth
      />
      <Button
        variant={"contained"}
        color={"primary"}
        onClick={updateTriviaSession}
        size={"large"}
        style={{ float: "right" }}
      >
        Update
      </Button>
    </Container>
  );
};

export default withRouter(TriviaSessionPage);
