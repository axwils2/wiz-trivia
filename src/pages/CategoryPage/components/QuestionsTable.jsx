// @flow
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import orderBy from "lodash/orderBy";
import max from "lodash/max";
import find from "lodash/find";
import findIndex from "lodash/findIndex";

import { firestore } from "components/Firebase";
import { mapQuerySnapshot } from "functions/firestoreHelpers";
import ButtonLink from "components/ButtonLink";
import * as ROUTES from "constants/routes";
import {
  incorrectAnswerPenaltyLabel,
  questionFormatLabel
} from "functions/userFriendlyLabels";
import NewQuestionModal from "./NewQuestionModal";
import type { CategoryType } from "types/CategoryTypes";
import type { QuestionType } from "types/QuestionTypes";

const useStyles = makeStyles(theme => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingBottom: theme.spacing(2)
  },
  orderCell: {
    width: "104px"
  }
}));

const QuestionsTable = ({
  category,
  triviaSessionUid
}: {
  category: CategoryType,
  triviaSessionUid: string
}) => {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);

  useEffect(
    () => {
      firestore
        .questions(triviaSessionUid, category.uid)
        .orderBy("order", "asc")
        .get()
        .then(querySnapshot => {
          const data = mapQuerySnapshot(querySnapshot);
          setQuestions(data);
        });
    },
    [category.uid, triviaSessionUid]
  );

  const updateQuestionOrders = (oldOrder: number, newOrder: number) => {
    const questionMoved = find(
      questions,
      question => question.order === oldOrder
    );
    const movedIndex = findIndex(
      questions,
      question => question.uid === questionMoved.uid
    );
    const questionReplaced = find(
      questions,
      question => question.order === newOrder
    );
    const replacedIndex = findIndex(
      questions,
      question => question.uid === questionReplaced.uid
    );

    updateQuestion(questionMoved.uid, { order: newOrder }).then(() => {
      updateQuestion(questionReplaced.uid, { order: oldOrder }).then(() => {
        const newQuestions = Array.from(questions);
        newQuestions[movedIndex] = {
          ...newQuestions[movedIndex],
          order: newOrder
        };
        newQuestions[replacedIndex] = {
          ...newQuestions[replacedIndex],
          order: oldOrder
        };

        setQuestions(newQuestions);
      });
    });
  };

  const updateQuestion = (uid: string, updates: *) => {
    return firestore
      .question(triviaSessionUid, category.uid, uid)
      .update(updates);
  };

  const maxOrder = () => {
    return max(questions.map(question => question.order)) || 0;
  };

  const afterQuestionCreate = (question: QuestionType) => {
    const newQuestions = Array.from(questions);
    newQuestions.push(question);

    setQuestions(newQuestions);
  };

  return (
    <>
      <div className={classes.header}>
        <Typography variant={"h4"}>Category Questions</Typography>
        <NewQuestionModal
          newOrderValue={maxOrder() + 1}
          afterQuestionCreate={afterQuestionCreate}
        />
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.orderCell}>Order</TableCell>
              <TableCell>Body</TableCell>
              <TableCell align="right">Answer</TableCell>
              <TableCell align="right">Format</TableCell>
              <TableCell align="right">Incorrect Answer Penalty</TableCell>
              <TableCell align="right">Options</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {orderBy(questions, ["order"], ["asc"]).map(question => (
              <TableRow key={question.uid}>
                <TableCell className={classes.orderCell}>
                  {question.order}
                  {question.order !== 1 && (
                    <IconButton
                      color={"inherit"}
                      aria-label={"moveUp"}
                      size={"small"}
                      onClick={() =>
                        updateQuestionOrders(question.order, question.order - 1)
                      }
                    >
                      <ArrowUpwardIcon />
                    </IconButton>
                  )}
                  {question.order !== maxOrder() && (
                    <IconButton
                      color={"inherit"}
                      aria-label={"moveDown"}
                      size={"small"}
                      onClick={() =>
                        updateQuestionOrders(question.order, question.order + 1)
                      }
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  {question.body}
                </TableCell>
                <TableCell align="right">{question.answer}</TableCell>
                <TableCell align="right">
                  {questionFormatLabel(question.format)}
                </TableCell>
                <TableCell align="right">
                  {incorrectAnswerPenaltyLabel(question.incorrectAnswerPenalty)}
                </TableCell>
                <TableCell align="right">
                  {question.options.join(", ")}
                </TableCell>
                <TableCell align="right">
                  <ButtonLink
                    to={ROUTES.QUESTION.linkPath(
                      triviaSessionUid,
                      category.uid,
                      question.uid
                    )}
                    variant={"contained"}
                    size={"small"}
                    color={"primary"}
                  >
                    Edit
                  </ButtonLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default QuestionsTable;
