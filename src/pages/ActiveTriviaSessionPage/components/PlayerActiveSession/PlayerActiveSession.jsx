// @flow
import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { firestore } from "components/Firebase";
import { docDataWithId } from "functions/firestoreHelpers";
import { CurrentQuestion } from "./components";

const cookies = new Cookies();

const PlayerActiveSession = () => {
  const [cookieData, setCookieData] = useState({});
  const [team, setTeam] = useState(null);
  const [triviaSession, setTriviaSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookie = cookies.get(
      process.env.REACT_APP_ACTIVE_SESSION_COOKIE_NAME
    );
    if (!cookie) {
      setLoading(false);
      return;
    }
    setCookieData(cookie);
  }, []);

  useEffect(
    () => {
      if (!cookieData.triviaSessionUid) return;

      const unsubscribe = firestore
        .triviaSession(cookieData.triviaSessionUid)
        .onSnapshot(doc => {
          setTriviaSession(docDataWithId(doc));
        });
      return () => unsubscribe();
    },
    [cookieData.triviaSessionUid]
  );

  useEffect(
    () => {
      if (!cookieData.triviaSessionUid || !cookieData.teamUid) return;

      const unsubscribe = firestore
        .team(cookieData.triviaSessionUid, cookieData.teamUid)
        .onSnapshot(doc => {
          setTeam(docDataWithId(doc));
          setLoading(false);
        });
      return () => unsubscribe();
    },
    [cookieData.triviaSessionUid, cookieData.teamUid]
  );

  if (loading)
    return (
      <Box textAlign={"center"} marginTop={"48px"}>
        <CircularProgress />
      </Box>
    );

  if (!triviaSession || !team)
    return <Typography>Error loading data</Typography>;

  if (triviaSession.status !== "active")
    return (
      <Typography>
        This trivia session is either disabled or complete!
      </Typography>
    );

  if (!triviaSession.currentQuestion || !triviaSession.currentCategory)
    return (
      <Typography variant={"h6"}>
        {triviaSession.waitingMessage || "Please wait for the session to begin"}
      </Typography>
    );

  return (
    <CurrentQuestion
      team={team}
      triviaSessionUid={triviaSession.uid}
      currentQuestion={triviaSession.currentQuestion}
      currentCategory={triviaSession.currentCategory}
    />
  );
};

export default PlayerActiveSession;
