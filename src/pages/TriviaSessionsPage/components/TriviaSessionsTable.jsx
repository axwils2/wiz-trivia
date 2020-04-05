// @flow
import React, { useState, useEffect, useContext } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { firestore } from "components/Firebase";
import { AuthUserContext } from "components/Session";
import { mapQuerySnapshot } from "functions/firestoreHelpers";
import ButtonLink from "components/ButtonLink";
import * as ROUTES from "constants/routes";

const TriviaSessionsTable = () => {
  const authUser = useContext(AuthUserContext);
  const [sessions, setSessions] = useState([]);

  useEffect(
    () => {
      firestore
        .triviaSessions()
        .where("userId", "==", authUser.uid)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get()
        .then(querySnapshot => {
          const data = mapQuerySnapshot(querySnapshot);
          setSessions(data);
        });
    },
    [authUser.uid]
  );

  if (sessions.length === 0) {
    return <div>No sessions to display. Create some!</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Access Code</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map(session => (
            <TableRow key={session.uid}>
              <TableCell component="th" scope="row">
                {session.name}
              </TableCell>
              <TableCell align="right">{session.accessCode}</TableCell>
              <TableCell align="right">
                {session.active ? "active" : "disabled"}
              </TableCell>
              <TableCell align="right">
                <ButtonLink
                  to={ROUTES.TRIVIA_SESSION.linkPath(session.uid)}
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
  );
};

export default TriviaSessionsTable;
