// @flow
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import toUpper from "lodash/toUpper";

import { firestore } from "components/Firebase";
import type { TriviaSessionType } from "types/TriviaSessionTypes";
import useNotify from "components/Notification";

const UpdateTriviaSessionForm = ({
  triviaSession
}: {
  triviaSession: TriviaSessionType
}) => {
  const notify = useNotify();
  const [name, setName] = useState(triviaSession.name);
  const [accessCode, setAccessCode] = useState(triviaSession.accessCode);
  const [waitingMessage, setWaitingMessage] = useState(
    triviaSession.waitingMessage || ""
  );
  const [leaderBoardVisible, setLeaderBoardVisible] = useState(
    triviaSession.leaderBoardVisible || false
  );
  const invalid = name === "" || accessCode === "";

  const updateTriviaSession = () => {
    firestore
      .triviaSession(triviaSession.uid)
      .update({ name, accessCode, waitingMessage })
      .then(() => {
        notify.success("Session successfully updated!");
      });
  };

  return (
    <Box marginBottom={"48px"}>
      <Typography variant={"h4"}>Session Details</Typography>
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
        id={"accessCode"}
        label="Access Code"
        variant="outlined"
        onChange={e => setAccessCode(toUpper(e.target.value))}
        margin={"normal"}
        value={accessCode}
        fullWidth
      />
      <TextField
        id={"WaitingMessage"}
        label="Waiting Message"
        variant="outlined"
        onChange={e => setWaitingMessage(e.target.value)}
        margin={"normal"}
        defaultValue={waitingMessage}
        fullWidth
      />
      <Box>
        <FormControlLabel
          value={leaderBoardVisible}
          control={<Radio />}
          label={
            "Do you want teams to be able to access a leader board during the session?"
          }
          checked={leaderBoardVisible}
          onChange={() => setLeaderBoardVisible(!leaderBoardVisible)}
        />
      </Box>
      <Button
        disabled={invalid}
        variant={"contained"}
        color={"primary"}
        onClick={updateTriviaSession}
        size={"large"}
        style={{ float: "right" }}
      >
        Update
      </Button>
    </Box>
  );
};

export default UpdateTriviaSessionForm;
