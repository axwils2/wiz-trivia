// @flow
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import filter from "lodash/filter";
import map from "lodash/map";

import type { TeamType, TeamAnswerType } from "types/TeamTypes";
import type { QuestionType } from "types/QuestionTypes";
import type { CategoryType } from "types/CategoryTypes";
import { firestore } from "components/Firebase";
import AnswerSection from "./AnswerSection";

type Props = {
  team: TeamType,
  triviaSessionUid: string,
  currentQuestion: QuestionType,
  currentCategory: CategoryType
};

const useStyles = makeStyles({
  pageContainer: {
    paddingBottom: "48px"
  },
  buttonContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    padding: "0 16px 16px",
    width: "100%"
  },
  divider: {
    margin: "16px 0"
  }
});

const defaultAnswer = (categoryUid, questionUid) => {
  return {
    body: "",
    categoryUid: categoryUid,
    questionUid: questionUid,
    status: "pending",
    wagerAmount: 0,
    wagerAwardedAmount: null
  };
};

const CurrentQuestion = (props: Props) => {
  const { team, triviaSessionUid, currentQuestion, currentCategory } = props;
  const classes = useStyles();
  const [answer, setAnswer] = useState(
    defaultAnswer(currentCategory.uid, currentQuestion.uid)
  );
  const [submitted, setSubmitted] = useState(false);
  const invalid =
    answer.body === "" ||
    (currentCategory.wagerType === "oneThroughSix" && answer.wagerAmount === 0);

  useEffect(
    () => {
      const pastAnswer = team.answers.find(
        answer => answer.questionUid === currentQuestion.uid
      );

      setAnswer(
        pastAnswer || defaultAnswer(currentCategory.uid, currentQuestion.uid)
      );
      setSubmitted(!!pastAnswer);
    },
    [currentQuestion, currentCategory, team.answers]
  );

  const updateAnswer = (updates: $Shape<TeamAnswerType>) => {
    setAnswer({ ...answer, ...updates });
  };

  const onSubmit = () => {
    setSubmitted(true);

    const answers = team.answers;
    answers.push(answer);

    firestore.team(triviaSessionUid, team.uid).update({ answers });
  };

  return (
    <Box className={classes.pageContainer}>
      <Typography variant={"caption"} display={"block"}>
        Category: {currentCategory.name}
      </Typography>
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
          filter(team.answers, a => a.categoryUid === currentCategory.uid),
          a => a.wagerAmount
        )}
      />
      <Box className={classes.buttonContainer}>
        <Button
          disabled={submitted || invalid}
          fullWidth
          variant={"contained"}
          color={"primary"}
          size={"large"}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CurrentQuestion;
