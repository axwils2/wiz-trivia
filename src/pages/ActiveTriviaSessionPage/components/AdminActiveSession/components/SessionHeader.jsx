// @flow
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import type { TriviaSessionType } from "types/TriviaSessionTypes";

const useStyles = makeStyles({
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
      <Typography variant={"h6"} gutterBottom>
        Your session is now live. Currently waiting on players to join the
        session. To begin the session and display questions to your teams, start
        the session.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant={"caption"} display={"block"}>
        Category: {currentCategory.name}
      </Typography>
      <Typography variant={"caption"} display={"block"}>
        Incorrect Answer Penalty: {currentQuestion.incorrectAnswerPenalty}
      </Typography>
      <Typography variant={"overline"} display={"block"}>
        Question:
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
