// @flow
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import ViewListIcon from "@material-ui/icons/ViewList";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import filter from "lodash/filter";
import map from "lodash/map";
import findIndex from "lodash/findIndex";

import type { TeamType, TeamAnswerType } from "types/TeamTypes";
import type { QuestionType } from "types/QuestionTypes";
import type { CategoryType } from "types/CategoryTypes";
import type { LeaderBoardType } from "types/TriviaSessionTypes";
import { firestore } from "components/Firebase";
import CountdownTimer from "components/CountdownTimer";
import AnswerSection from "./AnswerSection";
import LeaderBoardSideDrawer from "./LeaderBoardSideDrawer";

type Props = {
  team: TeamType,
  triviaSessionUid: string,
  leaderBoard: LeaderBoardType,
  currentQuestion: QuestionType,
  currentCategory: CategoryType
};

const useStyles = makeStyles(theme => ({
  pageContainer: {
    paddingBottom: "48px"
  },
  questionDataContainer: {
    display: "flex",
    justifyContent: "space-between",
    height: "48px"
  },
  teamDataContainer: {
    display: "flex",
    flexDirection: "column"
  },
  buttonContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    padding: "0 16px 16px",
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  divider: {
    margin: "16px 0"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    padding: "24px"
  },
  pendingBackdrop: {
    backgroundColor: "rgba(0, 0, 0, .9)"
  },
  refreshedBackdrop: {
    backgroundColor: "rgba(38, 36, 191, .9)"
  },
  correctBackdrop: {
    backgroundColor: "rgba(58, 183, 58, .9)"
  },
  incorrectBackdrop: {
    backgroundColor: "rgba(191, 36, 36, .9)"
  },
  backdropText: {
    color: "#fff"
  }
}));

const defaultAnswer = (categoryUid, question) => {
  return {
    body: "",
    categoryUid: categoryUid,
    questionUid: question.uid,
    status: "draft",
    wagerAmount: question.defaultWager || 0,
    wagerAwardedAmount: null,
    wagerFormat: question.wagerFormat
  };
};

const CurrentQuestion = (props: Props) => {
  const {
    team,
    triviaSessionUid,
    currentQuestion,
    currentCategory,
    leaderBoard
  } = props;
  const classes = useStyles();
  const [answer, setAnswer] = useState(
    defaultAnswer(currentCategory.uid, currentQuestion)
  );
  const [submitted, setSubmitted] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [leaderBoardOpen, setLeaderBoardOpen] = useState(false);
  const invalid =
    answer.body === "" ||
    (currentQuestion.wagerFormat === "multipleChoice" &&
      answer.wagerAmount === 0);

  useEffect(
    () => {
      const pastAnswer = team.answers.find(
        answer => answer.questionUid === currentQuestion.uid
      );

      const newAnswer =
        pastAnswer || defaultAnswer(currentCategory.uid, currentQuestion);

      if (currentQuestion.timerOn) {
        setAnswer(prevAnswer => {
          if (
            prevAnswer.questionUid === newAnswer.questionUid &&
            prevAnswer.wagerAwardedAmount === newAnswer.wagerAwardedAmount &&
            prevAnswer.status === newAnswer.status
          ) {
            return prevAnswer;
          } else {
            return newAnswer;
          }
        });
      } else {
        setAnswer(newAnswer);
      }

      if (pastAnswer && pastAnswer.status === "refreshed") {
        setSubmitted(false);
        setBackdropOpen(true);
      } else {
        setSubmitted(!!pastAnswer);
        setBackdropOpen(newAnswer.status !== "draft");
      }
    },
    [currentQuestion, currentCategory, team.answers]
  );

  const updateAnswer = (updates: $Shape<TeamAnswerType>) => {
    setAnswer({ ...answer, ...updates });
  };

  const onSubmit = () => {
    setSubmitted(true);

    const answers = Array.from(team.answers);
    const pastAnswer = answers.find(
      answer => answer.questionUid === currentQuestion.uid
    );

    if (pastAnswer) {
      const pastAnswerIndex = findIndex(
        answers,
        answer => answer.questionUid === currentQuestion.uid
      );
      answers[pastAnswerIndex] = { ...answer, status: "pending" };
    } else {
      answers.push({ ...answer, status: "pending" });
    }

    firestore.team(triviaSessionUid, team.uid).update({ answers });
  };

  const handleBackdropClose = () => {
    if (answer.status !== "refreshed") return null;

    setBackdropOpen(false);
  };

  const backdropText = () => {
    const status = answer.status;
    const amount = answer.wagerAwardedAmount || 0;

    if (status === "refreshed") {
      return "The admin has allowed you to update your answer! Click your screen to update and resubmit.";
    } else if (status === "pending") {
      return "Waiting for admin to grade your answer...";
    } else if (status === "incorrect") {
      const messageStart = "Your answer was incorrect.";

      if (amount === 0) {
        return `${messageStart} You received 0 points.`;
      } else {
        return `${messageStart} You lost ${amount * -1} points.`;
      }
    } else if (status === "correct") {
      return `Your answer was correct! You received ${amount} points.`;
    }
  };

  return (
    <Box className={classes.pageContainer}>
      <Backdrop
        className={`${classes[`${answer.status}Backdrop`]} ${classes.backdrop}`}
        open={backdropOpen}
        onClick={handleBackdropClose}
      >
        <Typography
          variant={"h4"}
          className={classes.backdropText}
          align="center"
        >
          {backdropText()}
        </Typography>
      </Backdrop>
      <Box className={classes.questionDataContainer}>
        <Box>
          <Typography variant={"caption"} display={"block"}>
            Team: {team.name}
          </Typography>
          <Typography variant={"caption"} display={"block"}>
            Category: {currentCategory.name}
          </Typography>
        </Box>
        <Box className={classes.teamDataContainer}>
          <Typography variant={"caption"} display={"block"}>
            Total Points: <b>{team.pointsTotal}</b>
          </Typography>
          {currentQuestion.timerOn &&
            !submitted && (
              <CountdownTimer
                count={30}
                onCountdownComplete={() => setSubmitted(true)}
              />
            )}
        </Box>
      </Box>
      <Typography variant={"overline"} display={"block"}>
        Question:
      </Typography>
      <Typography variant={"h6"} display={"block"}>
        {currentQuestion.body}
      </Typography>
      <Divider className={classes.divider} />
      <AnswerSection
        answer={answer}
        updateAnswer={updateAnswer}
        currentQuestion={currentQuestion}
        currentCategory={currentCategory}
        previousCategoryWagerAmounts={map(
          filter(
            team.answers,
            a =>
              a.categoryUid === currentCategory.uid &&
              a.wagerFormat === "multipleChoice"
          ),
          a => a.wagerAmount
        )}
      />
      <Box className={classes.buttonContainer}>
        <Button
          variant={"contained"}
          color={"primary"}
          size={"large"}
          style={{ marginRight: "8px" }}
          onClick={() => setLeaderBoardOpen(true)}
        >
          <ViewListIcon />
        </Button>
        <Button
          disabled={submitted || invalid}
          variant={"contained"}
          fullWidth
          color={"primary"}
          size={"large"}
          onClick={onSubmit}
          style={{ maxWidth: "480px" }}
        >
          Submit
        </Button>
      </Box>
      <LeaderBoardSideDrawer
        open={leaderBoardOpen}
        onClose={() => setLeaderBoardOpen(false)}
        leaderBoard={leaderBoard}
      />
    </Box>
  );
};

export default CurrentQuestion;
