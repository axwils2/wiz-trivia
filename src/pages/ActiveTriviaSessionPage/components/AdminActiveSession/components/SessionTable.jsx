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
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import RefreshIcon from "@material-ui/icons/Refresh";
import orderBy from "lodash/orderBy";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import flatten from "lodash/flatten";
import sumBy from "lodash/sumBy";

import { firestore } from "components/Firebase";
import { mapQuerySnapshot } from "functions/firestoreHelpers";
import type { TriviaSessionType } from "types/TriviaSessionTypes";
import type {
  TeamType,
  TeamAnswerType,
  TeamAnswerStatusType
} from "types/TeamTypes";

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
  teamName: {
    display: "inline-block",
    marginRight: "4px"
  },
  editAmount: {
    width: "64px"
  },
  quickActions: {
    width: "108px"
  },
  draft: {},
  refreshed: {},
  pending: {
    backgroundColor: "#ddddd3"
  },
  correct: {
    backgroundColor: "#8ee48e"
  },
  incorrect: {
    backgroundColor: "#fa9797"
  },
  correctIcon: {
    color: "#038303"
  },
  incorrectIcon: {
    color: "#d62323"
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

  const updateTeamAnswer = (
    team: TeamType,
    newStatus: TeamAnswerStatusType
  ) => {
    if (!currentQuestion) return null;

    const answers = team.answers;
    const answer = teamAnswer(team);
    const answerIndex = findIndex(
      answers,
      oldAnswer => oldAnswer.questionUid === answer.questionUid
    );
    const penaltyType = currentQuestion.incorrectAnswerPenalty;
    let editAmount = wagerAwardedAmount(team) || 0;
    const answerUpdates = { status: newStatus, wagerAwardedAmount: editAmount };
    let pointsTotal = team.pointsTotal;

    if (newStatus === "refreshed") {
      answers[answerIndex] = { ...answer, ...answerUpdates };
    } else {
      if (newStatus === "incorrect") {
        if (
          editAmount === null ||
          editAmount === undefined ||
          penaltyType === "zeroPoints"
        ) {
          editAmount = 0;
        } else if (penaltyType === "negativePoints") {
          editAmount = editAmount * -1;
        }
      } else if (newStatus === "correct") {
        if (editAmount === null || editAmount === undefined) {
          editAmount = 0;
        } else if (editAmount < 0) {
          editAmount = editAmount * -1;
        }
      }

      const newWagerAwardedAmountObject = updateWagerAwardedAmounts(
        team,
        editAmount
      );
      let newAmount = 0;

      if (newWagerAwardedAmountObject) {
        newAmount = newWagerAwardedAmountObject.amount;
      }
      answerUpdates["wagerAwardedAmount"] = newAmount;

      if (answerIndex === -1) {
        answers.push({ ...answer, ...answerUpdates, wagerAmount: newAmount });
      } else {
        answers[answerIndex] = { ...answer, ...answerUpdates };
      }

      pointsTotal = sumBy(answers, answer => answer.wagerAwardedAmount || 0);
    }

    firestore
      .team(triviaSession.uid, team.uid)
      .update({ answers, pointsTotal });
  };

  const updateWagerAwardedAmounts = (
    team: TeamType,
    wagerAwardedAmount: number
  ) => {
    if (!currentQuestion) return null;

    const safeWagerAwardedAmounts = Array.from(wagerAwardedAmounts);
    const index = wagerAwardedAmountObjectIndex(team);
    if (index === null || index === -1) {
      const wagerAwardedAmountObject = {
        teamUid: team.uid,
        questionUid: currentQuestion.uid,
        amount: wagerAwardedAmount
      };

      safeWagerAwardedAmounts.push(wagerAwardedAmountObject);
      setWagerAwardedAmounts(safeWagerAwardedAmounts);
      return wagerAwardedAmountObject;
    } else {
      const wagerAwardedAmountObject = wagerAwardedAmounts[index];

      wagerAwardedAmountObject["amount"] = wagerAwardedAmount;
      safeWagerAwardedAmounts[index] = wagerAwardedAmountObject;
      setWagerAwardedAmounts(safeWagerAwardedAmounts);
      return wagerAwardedAmountObject;
    }
  };

  const wagerAwardedAmount = (team: TeamType) => {
    const index = wagerAwardedAmountObjectIndex(team);
    const answer = teamAnswer(team);
    const defaultAmount = defaultWagerAwardedAmount(answer);
    if (index === null) return defaultAmount;

    const wagerAwardedAmountObject = wagerAwardedAmounts[index];
    if (!wagerAwardedAmountObject) return defaultAmount;

    const amount = wagerAwardedAmountObject.amount;
    if (amount === null || amount === undefined) return defaultAmount;

    return amount;
  };

  const wagerAwardedAmountObjectIndex = (team: TeamType) => {
    if (!currentQuestion) return null;

    return findIndex(
      wagerAwardedAmounts,
      amountObject =>
        amountObject.teamUid === team.uid &&
        amountObject.questionUid === currentQuestion.uid
    );
  };

  const teamAnswer = (team: TeamType) => {
    if (!currentQuestion || !currentCategory) {
      return initialAnswer;
    }

    const answer = find(
      team.answers,
      answer => answer.questionUid === currentQuestion.uid
    );
    if (!answer)
      return {
        ...initialAnswer,
        questionUid: currentQuestion.uid,
        categoryUid: currentCategory.uid
      };

    return answer;
  };

  const defaultWagerAwardedAmount = (answer: TeamAnswerType) => {
    if (
      answer.wagerAwardedAmount === undefined ||
      answer.wagerAwardedAmount === null
    )
      return answer.wagerAmount || undefined;

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

  const deleteTeam = (team: TeamType) => {
    firestore.team(triviaSession.uid, team.uid).delete();
  };

  const incorrectButtonToolTipMessage = () => {
    if (
      !currentQuestion ||
      currentQuestion.incorrectAnswerPenalty === "zeroPoints"
    ) {
      return "Mark as incorrect and add 0 points to team score";
    }

    return "Mark as incorrect and subtract points from team score";
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
            <TableCell align="right">Edit Points</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderBy(teams, [orderedBy], [orderDirection]).map(team => {
            const answer = teamAnswer(team);
            const editAmount = wagerAwardedAmount(team);
            const disabled = !answer.body;

            return (
              <TableRow
                key={`${team.uid}-${answer.questionUid}`}
                className={classes[answer.status]}
              >
                <TableCell>
                  <div className={classes.teamName}>{team.name}</div>
                  <Tooltip title="Delete Team" placement={"top"}>
                    <IconButton
                      edge={"start"}
                      color={"inherit"}
                      aria-label={"delete"}
                      size={"small"}
                      onClick={() => deleteTeam(team)}
                    >
                      <DeleteIcon fontSize={"small"} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>{team.pointsTotal}</TableCell>
                <TableCell align="right">{answer.body}</TableCell>
                <TableCell align="right">{answer.wagerAmount}</TableCell>
                <TableCell align="right">
                  <TextField
                    type={"number"}
                    name={`wagerAwardedAmount-${team.uid}-${
                      answer.questionUid
                    }`}
                    variant={"outlined"}
                    className={classes.editAmount}
                    onChange={e =>
                      updateWagerAwardedAmounts(team, parseInt(e.target.value))
                    }
                    value={editAmount}
                  />
                </TableCell>
                <TableCell align="right" className={classes.quickActions}>
                  <Tooltip
                    title={incorrectButtonToolTipMessage()}
                    placement={"top"}
                  >
                    <span>
                      <IconButton
                        edge={"start"}
                        aria-label={"incorrect"}
                        size={"small"}
                        className={classes.incorrectIcon}
                        onClick={() => updateTeamAnswer(team, "incorrect")}
                      >
                        <CloseIcon fontSize={"small"} />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Allow Team To Answer Again" placement={"top"}>
                    <span>
                      <IconButton
                        disabled={disabled}
                        edge={"start"}
                        color={"inherit"}
                        aria-label={"refresh"}
                        size={"small"}
                        onClick={() => updateTeamAnswer(team, "refreshed")}
                      >
                        <RefreshIcon fontSize={"small"} />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip
                    title="Mark as correct and add points to team score"
                    placement={"top"}
                  >
                    <span>
                      <IconButton
                        edge={"start"}
                        aria-label={"correct"}
                        size={"small"}
                        className={classes.correctIcon}
                        onClick={() => updateTeamAnswer(team, "correct")}
                      >
                        <CheckIcon fontSize={"small"} />
                      </IconButton>
                    </span>
                  </Tooltip>
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
