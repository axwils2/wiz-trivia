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
import Button from "@material-ui/core/Button";
import orderBy from "lodash/orderBy";
import find from "lodash/find";

import { firestore } from "components/Firebase";
import { mapQuerySnapshot } from "functions/firestoreHelpers";
import type { TriviaSessionType } from "types/TriviaSessionTypes";
import type { TeamType } from "types/TeamTypes";

const initialAnswer = {
  body: null,
  wagerAmount: null,
  wagerAwardedAmount: null
};

const useStyles = makeStyles({
  table: {
    marginBottom: "24px"
  }
});

const SessionTable = ({
  triviaSession
}: {
  triviaSession: TriviaSessionType
}) => {
  const [teams, setTeams] = useState([]);
  const classes = useStyles();
  const { currentQuestion, currentCategory } = triviaSession;

  useEffect(
    () => {
      const unsubscribe = firestore
        .teams(triviaSession.uid)
        .get()
        .then(querySnapshot => {
          setTeams(mapQuerySnapshot(querySnapshot));
        });

      return () => unsubscribe();
    },
    [triviaSession.uid]
  );

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

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Team</TableCell>
            <TableCell>Total Points</TableCell>
            <TableCell align="right">Answer</TableCell>
            <TableCell align="right">Wager Amount</TableCell>
            <TableCell align="right">Wager Amount Awarded</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {orderBy(teams, ["name"], ["asc"]).map(team => {
            const answer = teamAnswer(team);

            return (
              <TableRow key={team.uid}>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.pointsTotal}</TableCell>
                <TableCell align="right">{answer.body}</TableCell>
                <TableCell align="right">{answer.wagerAmount}</TableCell>
                <TableCell align="right">
                  {answer.wagerAwardedAmount || answer.wagerAmount}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant={"contained"}
                    size={"small"}
                    color={"primary"}
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
