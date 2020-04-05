// @flow
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import toUpper from "lodash/toUpper";

const LandingPage = () => {
  const [accessCode, setAccessCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const invalid = accessCode === "" || teamName === "";

  const startSession = () => {};

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
