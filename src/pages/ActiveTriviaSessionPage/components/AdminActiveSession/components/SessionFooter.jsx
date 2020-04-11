// @flow
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import TimerIcon from "@material-ui/icons/Timer";
import find from "lodash/find";

import CountdownTimer from "components/CountdownTimer";
import type { TriviaSessionType } from "types/TriviaSessionTypes";
import type { CategoryType } from "types/CategoryTypes";
import type { QuestionType } from "types/QuestionTypes";

type Props = {
  triviaSession: TriviaSessionType,
  updateTriviaSession: (updates: $Shape<TriviaSessionType>) => void,
  categories: Array<CategoryType>,
  questions: Array<QuestionType>
};

const useStyles = makeStyles({
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end"
  }
});

const SessionFooter = (props: Props) => {
  const classes = useStyles();
  const { triviaSession, updateTriviaSession, categories, questions } = props;
  const { currentQuestion, currentCategory } = triviaSession;
  const [nextQuestion, setNextQuestion] = useState(null);
  const [nextCategory, setNextCategory] = useState(null);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(
    () => {
      let newNextCategory = null;
      let newNextQuestion = null;

      if (!currentCategory || !currentQuestion) {
        // The session hasn't really started yet. Still waiting on teams
        newNextCategory = find(categories, category => category.order === 1);
        newNextQuestion = find(
          questions,
          question =>
            newNextCategory &&
            question.categoryUid === newNextCategory.uid &&
            question.order === 1
        );
      } else {
        newNextQuestion = find(
          questions,
          question =>
            question.categoryUid === currentCategory.uid &&
            question.order === currentQuestion.order + 1
        );
        if (!newNextQuestion) {
          // There are no more questions in this category. Move to the next one
          newNextCategory = find(
            categories,
            category => category.order === currentCategory.order + 1
          );

          if (!newNextCategory) {
            // No more categories in this session, so session is over
            setSessionComplete(true);
            return;
          } else {
            // We are in a new category, so start with first question of that category
            newNextQuestion = find(
              questions,
              question =>
                newNextCategory &&
                question.categoryUid === newNextCategory.uid &&
                question.order === 1
            );
            setSessionComplete(false);
          }
        } else {
          newNextCategory = currentCategory;
          setSessionComplete(false);
        }
      }

      setNextQuestion(newNextQuestion);
      setNextCategory(newNextCategory);
    },
    [currentQuestion, currentCategory, questions, categories]
  );

  const startTimer = () => {
    if (!currentQuestion) return null;

    updateTriviaSession({
      currentQuestion: { ...currentQuestion, timerOn: !currentQuestion.timerOn }
    });
  };

  const timerButtonText = () => {
    if (!currentQuestion) return null;
    const timerOn = currentQuestion.timerOn;
    if (!timerOn) {
      return (
        <Tooltip title={"Start 30 second timer for remaining teams"}>
          <TimerIcon color={"inherit"} />
        </Tooltip>
      );
    }

    return <CountdownTimer count={30} size={"small"} />;
  };

  if (sessionComplete) {
    return (
      <Button
        variant={"contained"}
        color={"primary"}
        onClick={() => updateTriviaSession({ status: "complete" })}
        size={"large"}
        style={{ float: "right" }}
      >
        Complete Session
      </Button>
    );
  }

  if (!nextQuestion || !nextCategory) return null;

  return (
    <Box className={classes.container}>
      {currentQuestion && (
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={startTimer}
          size={"large"}
          style={{ marginRight: "8px" }}
        >
          {timerButtonText()}
        </Button>
      )}
      <Button
        variant={"contained"}
        color={"primary"}
        onClick={() =>
          updateTriviaSession({
            currentQuestion: nextQuestion,
            currentCategory: nextCategory
          })
        }
        size={"large"}
      >
        Proceed to Category {nextCategory.order}, Question {nextQuestion.order}
      </Button>
    </Box>
  );
};

export default SessionFooter;
