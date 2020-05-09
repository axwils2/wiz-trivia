// @flow
import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import toUpper from "lodash/toUpper";
import toLower from "lodash/toLower";
import trim from "lodash/trim";

import { AuthUserContext } from "components/Session";
import { firestore } from "components/Firebase";
import * as ROUTES from "constants/routes";

const NewTriviaSessionForm = ({ history }: { history: * }) => {
  const authUser = useContext(AuthUserContext);
  const [accessCode, setAccessCode] = useState("");
  const [name, setName] = useState("");
  const [waitingMessage, setWaitingMessage] = useState("");
  const [leaderBoardVisible, setLeaderBoardVisible] = useState(false);
  const invalid = accessCode === "" || name === "";

  const createTriviaSession = () => {
    firestore
      .triviaSessions()
      .add({
        accessCode: trim(accessCode),
        name,
        nameInsensitive: toLower(name),
        status: "disabled",
        userUid: authUser.uid,
        createdAt: firestore.timestamp().now(),
        leaderBoardVisible,
        leaderBoard: []
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
      <TextField
        id={"WaitingMessage"}
        label="Waiting Message"
        variant="outlined"
        onChange={e => setWaitingMessage(e.target.value)}
        margin={"normal"}
        value={waitingMessage}
        fullWidth
      />
      <FormControlLabel
        value={leaderBoardVisible}
        control={<Radio />}
        label={
          "Do you want teams to be able to access a leader board during the session?"
        }
        checked={leaderBoardVisible}
        onChange={() => setLeaderBoardVisible(!leaderBoardVisible)}
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
