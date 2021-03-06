// @flow
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Cookies from "universal-cookie";
import Confetti from "react-confetti";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { firestore } from "components/Firebase";
import { docDataWithId } from "functions/firestoreHelpers";
import { CurrentQuestion } from "./components";
import * as ROUTES from "constants/routes";

const cookies = new Cookies();

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    padding: "0 16px 16px",
    width: "100%",
    textAlign: "center"
  },
  totalPointsContainer: {
    margin: "64px auto 0",
    border: `6px solid ${theme.palette.secondary.main}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    height: "280px",
    width: "280px"
  },
  totalPoints: {
    fontWeight: "bold"
  }
}));

const PlayerActiveSession = ({ history }: { history: * }) => {
  const classes = useStyles();
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

  const clearCookie = () => {
    cookies.remove(process.env.REACT_APP_ACTIVE_SESSION_COOKIE_NAME, {
      path: "/"
    });

    history.push(ROUTES.LANDING);
  };

  if (loading)
    return (
      <Box textAlign={"center"} marginTop={"48px"}>
        <CircularProgress />
      </Box>
    );

  if (!triviaSession || !team)
    return <Typography>Error loading data</Typography>;

  if (triviaSession.status === "disabled")
    return (
      <Typography variant={"h6"}>
        This trivia session is either disabled!
      </Typography>
    );

  if (triviaSession.status === "complete")
    return (
      <Box>
        <Confetti />
        <Typography variant={"h6"} align={"center"}>
          This session is now complete! You finished with a score of:
        </Typography>
        <Box className={classes.totalPointsContainer}>
          <Typography
            variant={"h1"}
            display={"block"}
            align={"center"}
            className={classes.totalPoints}
          >
            {team.pointsTotal}
          </Typography>
        </Box>
        <Box className={classes.buttonContainer}>
          <Button
            variant={"contained"}
            fullWidth
            color={"primary"}
            size={"large"}
            onClick={clearCookie}
            style={{ maxWidth: "480px" }}
          >
            Leave Session
          </Button>
        </Box>
      </Box>
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
      leaderBoard={triviaSession.leaderBoard}
      currentQuestion={triviaSession.currentQuestion}
      currentCategory={triviaSession.currentCategory}
    />
  );
};

export default withRouter(PlayerActiveSession);
