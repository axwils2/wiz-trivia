// @flow
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import {
  incorrectAnswerPenaltyLabel,
  questionAnswerFormatLabel
} from "functions/userFriendlyLabels";
import type { TriviaSessionType } from "types/TriviaSessionTypes";
import SessionInfoModal from "./SessionInfoModal";

const useStyles = makeStyles({
  waitingContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px"
  },
  sessionInfoButton: {
    minWidth: "fit-content",
    marginLeft: "32px"
  },
  divider: {
    margin: "16px 0"
  }
});

const SessionHeader = ({
  triviaSession
}: {
  triviaSession: TriviaSessionType
}) => {
  const classes = useStyles();
  const { currentQuestion, currentCategory } = triviaSession;

  if (!currentQuestion || !currentCategory) {
    return (
      <Box className={classes.waitingContainer}>
        <Typography variant={"h6"} display={"block"} gutterBottom>
          Your session is now live. Currently waiting on players to join the
          session. To begin the session and display questions to your teams,
          proceed to Question 1.
        </Typography>
        <Box className={classes.sessionInfoButton}>
          <SessionInfoModal accessCode={triviaSession.accessCode} />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant={"caption"} display={"block"}>
        Category: {currentCategory.name}
      </Typography>
      <Typography variant={"caption"} display={"block"}>
        Incorrect Answer Penalty:{" "}
        {incorrectAnswerPenaltyLabel(currentQuestion.incorrectAnswerPenalty)}
      </Typography>
      <Typography variant={"caption"} display={"block"}>
        Format: {questionAnswerFormatLabel(currentQuestion.answerFormat)}
      </Typography>
      <Typography variant={"overline"} display={"block"}>
        Question {currentQuestion.order}:
      </Typography>
      <Typography variant={"h6"} display={"block"}>
        {currentQuestion.body}
      </Typography>
      <Typography variant={"overline"} display={"block"}>
        Answer:
      </Typography>
      <Typography variant={"h6"} display={"block"}>
        {currentQuestion.answer}
      </Typography>
      <Divider className={classes.divider} />
    </Box>
  );
};

export default SessionHeader;
