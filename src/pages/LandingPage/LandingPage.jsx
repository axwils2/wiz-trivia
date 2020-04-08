// @flow
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import toUpper from "lodash/toUpper";
import Cookies from "universal-cookie";

import { firestore } from "components/Firebase";
import { mapQuerySnapshot } from "functions/firestoreHelpers";
import * as ROUTES from "constants/routes";

const cookies = new Cookies();

const LandingPage = ({ history }: { history: * }) => {
  const [accessCode, setAccessCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const invalid = accessCode === "" || teamName === "";

  useEffect(
    () => {
      const cookie = cookies.get("wizTriviaSessionData");
      if (!cookie || !cookie.triviaSessionUid) return;

      history.push(
        ROUTES.ACTIVE_TRIVIA_SESSION.linkPath(cookie.triviaSessionUid)
      );
    },
    [history]
  );

  const startSession = () => {
    firestore
      .triviaSessions()
      .where("status", "==", "active")
      .where("accessCode", "==", accessCode)
      .limit(1)
      .get()
      .then(querySnapshot => {
        const session = mapQuerySnapshot(querySnapshot)[0];

        firestore
          .teams(session.uid)
          .add({
            name: teamName,
            pointsTotal: 0,
            answers: []
          })
          .then(docRef => {
            let dt = new Date();
            dt.setHours(dt.getHours() + 4);

            cookies.set(
              process.env.REACT_APP_ACTIVE_SESSION_COOKIE_NAME,
              JSON.stringify({
                teamUid: docRef.id,
                triviaSessionUid: session.uid
              }),
              {
                path: "/",
                expires: dt,
                secure: process.env.REACT_APP_SECURE_COOKIES === "true",
                sameSite: "strict"
              }
            );

            history.push(ROUTES.ACTIVE_TRIVIA_SESSION.linkPath(session.uid));
          });
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

export default withRouter(LandingPage);
