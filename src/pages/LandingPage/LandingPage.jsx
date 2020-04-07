// @flow
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import toUpper from "lodash/toUpper";

import { firestore } from "components/Firebase";
import { mapQuerySnapshot } from "functions/firestoreHelpers";

const LandingPage = () => {
  const [accessCode, setAccessCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const invalid = accessCode === "" || teamName === "";

  const startSession = () => {
    firestore
      .triviaSessions()
      .where("status", "==", "active")
      .where("accessCode", "==", accessCode)
      .limit(1)
      .get()
      .then(querySnapshot => {
        const session = mapQuerySnapshot(querySnapshot)[0];
        console.log(session);
      });
  };

  return (
    <Container maxWidth={"sm"}>
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
        id={"teamName"}
        label="Team Name"
        variant="outlined"
        onChange={e => setTeamName(toUpper(e.target.value))}
        margin={"normal"}
        value={teamName}
        fullWidth
      />
      <Button
        disabled={invalid}
        variant={"contained"}
        onClick={startSession}
        size={"large"}
        fullWidth
      >
        Play
      </Button>
    </Container>
  );
};

export default LandingPage;
