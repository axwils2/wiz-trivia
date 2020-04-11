// @flow
import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import toUpper from "lodash/toUpper";
import toLower from "lodash/toLower";

import { AuthUserContext } from "components/Session";
import { firestore } from "components/Firebase";
import * as ROUTES from "constants/routes";

const NewTriviaSessionForm = ({ history }: { history: * }) => {
  const authUser = useContext(AuthUserContext);
  const [accessCode, setAccessCode] = useState("");
  const [name, setName] = useState("");
  const invalid = accessCode === "" || name === "";

  const createTriviaSession = () => {
    firestore
      .triviaSessions()
      .add({
        accessCode,
        name,
        nameInsensitive: toLower(name),
        status: "disabled",
        userUid: authUser.uid,
        createdAt: firestore.timestamp().now()
      })
      .then(docRef => {
        history.push(ROUTES.TRIVIA_SESSION.linkPath(docRef.id));
      });
  };

  return (
    <Container maxWidth={"sm"}>
      <Typography variant={"h6"}>Create New Trivia Session</Typography>
      <TextField
        id={"accessCode"}
        label="Access Code"
        variant="outlined"
        onChange={e => setAccessCode(toUpper(e.target.value))}
        margin={"normal"}
        value={accessCode}
        fullWidth
      />
      <TextField
        id={"name"}
        label="Name"
        variant="outlined"
        onChange={e => setName(e.target.value)}
        margin={"normal"}
        value={name}
        fullWidth
      />
      <Button
        disabled={invalid}
        variant={"contained"}
        onClick={createTriviaSession}
        size={"large"}
        fullWidth
      >
        Create
      </Button>
    </Container>
  );
};

export default withRouter(NewTriviaSessionForm);
