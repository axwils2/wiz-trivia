// @flow
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import orderBy from "lodash/orderBy";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import flatten from "lodash/flatten";

import { firestore } from "components/Firebase";
import { mapQuerySnapshot } from "functions/firestoreHelpers";
import type { TriviaSessionType } from "types/TriviaSessionTypes";
import type { TeamType, TeamAnswerType } from "types/TeamTypes";

const initialAnswer = {
  body: null,
  wagerAmount: null,
  wagerAwardedAmount: null,
  categoryUid: "",
  questionUid: "",
  status: "draft"
};

const useStyles = makeStyles({
  table: {
    marginBottom: "24px"
  },
  draft: {},
  pending: {
    backgroundColor: "#ddddd3"
  },
  correct: {
    backgroundColor: "#8ee48e"
  },
  incorrect: {
    backgroundColor: "#fa9797"
  }
});

const SessionTable = ({
  triviaSession
}: {
  triviaSession: TriviaSessionType
}) => {
  const [teams, setTeams] = useState([]);
  const [wagerAwardedAmounts, setWagerAwardedAmounts] = useState([]);
  const [orderedBy, setOrderedBy] = useState("name");
  const [orderDirection, setOrderDirection] = useState("asc");
  const classes = useStyles();
  const { currentQuestion, currentCategory } = triviaSession;

  useEffect(
    () => {
      const unsubscribe = firestore
        .teams(triviaSession.uid)
        .onSnapshot(querySnapshot => {
          const data = mapQuerySnapshot(querySnapshot);
          setTeams(data);

          const amountsArray = flatten(
            data.map(team => {
              return team.answers.map(answer => {
                return {
                  teamUid: team.uid,
                  questionUid: answer.questionUid,
                  amount: defaultWagerAwardedAmount(answer)
                };
              });
            })
          );
          setWagerAwardedAmounts(amountsArray);
        });

      return () => unsubscribe();
    },
    [triviaSession.uid]
  );

  const updateTeamAnswer = (team: TeamType) => {
    if (!currentQuestion) return null;

    const answers = team.answers;
    const answer = teamAnswer(team);
    const answerIndex = findIndex(answers, oldAnswer => oldAnswer === answer);
    const newWagerAwardedAmountObject = find(
      wagerAwardedAmounts,
      amountObject =>
        amountObject.teamUid === team.uid &&
        amountObject.questionUid === currentQuestion.uid
    );
    const wagerAwardedAmount = newWagerAwardedAmountObject.amount || 0;
    const pointsTotal = team.pointsTotal + wagerAwardedAmount;
    answers[answerIndex] = {
      ...answer,
      wagerAwardedAmount,
      status: newStatus(wagerAwardedAmount)
    };

    firestore
      .team(triviaSession.uid, team.uid)
      .update({ answers, pointsTotal });
  };

  const newStatus = (wagerAwardedAmount: ?number) => {
    if (wagerAwardedAmount === 0) return "incorrect";
    if (wagerAwardedAmount === null || wagerAwardedAmount === undefined)
      return "pending";
    return "correct";
  };

  const updateWagerAwardedAmounts = (
    team: TeamType,
    wagerAwardedAmount: number
  ) => {
    if (!currentQuestion) return null;

    const safeWagerAwardedAmounts = Array.from(wagerAwardedAmounts);
    const wagerAwardedAmountObjectIndex = findIndex(
      wagerAwardedAmounts,
      amountObject =>
        amountObject.teamUid === team.uid &&
        amountObject.questionUid === currentQuestion.uid
    );
    const wagerAwardedAmountObject =
      wagerAwardedAmounts[wagerAwardedAmountObjectIndex];

    wagerAwardedAmountObject["amount"] = wagerAwardedAmount;
    safeWagerAwardedAmounts[
      wagerAwardedAmountObjectIndex
    ] = wagerAwardedAmountObject;
    setWagerAwardedAmounts(safeWagerAwardedAmounts);
  };

  const teamAnswer = (team: TeamType) => {
    if (!currentQuestion || !currentCategory) {
      return initialAnswer;
    }

    const answer = find(
      team.answers,
      answer => answer.questionUid === currentQuestion.uid
    );
    if (!answer) return initialAnswer;

    return answer;
  };

  const defaultWagerAwardedAmount = (answer: TeamAnswerType) => {
    if (
      answer.wagerAwardedAmount === undefined ||
      answer.wagerAwardedAmount === null
    )
      return answer.wagerAmount;

    return answer.wagerAwardedAmount;
  };

  const updateOrdering = (newOrderBy: string) => {
    if (newOrderBy === orderedBy) {
      const newDirection = orderDirection === "asc" ? "desc" : "asc";
      setOrderDirection(newDirection);
    } else {
      setOrderedBy(newOrderBy);
      setOrderDirection("asc");
    }
  };

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderedBy === "name"}
                direction={orderDirection}
                onClick={() => updateOrdering("name")}
              >
                Team Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderedBy === "pointsTotal"}
                direction={orderDirection}
                onClick={() => updateOrdering("pointsTotal")}
              >
                Total Points
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Answer</TableCell>
            <TableCell align="right">Wager Amount</TableCell>
            <TableCell align="right">Wager Amount Awarded</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {orderBy(teams, [orderedBy], [orderDirection]).map(team => {
            const answer = teamAnswer(team);

            return (
              <TableRow
                key={`${team.uid}-${answer.questionUid}`}
                className={classes[answer.status]}
              >
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.pointsTotal}</TableCell>
                <TableCell align="right">{answer.body}</TableCell>
                <TableCell align="right">{answer.wagerAmount}</TableCell>
                <TableCell align="right">
                  <TextField
                    type={"number"}
                    disabled={!answer.body}
                    variant={"outlined"}
                    onChange={e =>
                      updateWagerAwardedAmounts(team, parseInt(e.target.value))
                    }
                    defaultValue={defaultWagerAwardedAmount(answer)}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    disabled={!answer.body}
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => updateTeamAnswer(team)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SessionTable;
