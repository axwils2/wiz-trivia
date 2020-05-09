// @flow
import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import Tooltip from "@material-ui/core/Tooltip";
import findIndex from "lodash/findIndex";
import reject from "lodash/reject";

import { firestore } from "components/Firebase";
import type { TriviaSessionStatusType } from "types/TriviaSessionTypes";
import { AuthUserContext } from "components/Session";
import { mapQuerySnapshot } from "functions/firestoreHelpers";
import ButtonLink from "components/ButtonLink";
import * as ROUTES from "constants/routes";

const useStyles = makeStyles({
  smallCell: {
    width: "70px",
    paddingLeft: 0
  }
});

const TriviaSessionsTable = ({
  history,
  archived
}: {
  history: *,
  archived: boolean
}) => {
  const classes = useStyles();
  const authUser = useContext(AuthUserContext);
  const [sessions, setSessions] = useState([]);

  useEffect(
    () => {
      firestore
        .triviaSessions()
        .where("userUid", "==", authUser.uid)
        .where("archived", "==", archived)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get()
        .then(querySnapshot => {
          const data = mapQuerySnapshot(querySnapshot);
          setSessions(data);
        });
    },
    [authUser.uid, archived]
  );

  const onButtonClick = (uid: string, status: TriviaSessionStatusType) => {
    if (status === "complete") return resetSession(uid);
    return activateSession(uid);
  };

  const activateSession = (uid: string) => {
    firestore
      .triviaSession(uid)
      .update({ status: "active" })
      .then(() => {
        history.push(ROUTES.ACTIVE_TRIVIA_SESSION.linkPath(uid));
      });
  };

  const archiveSession = (uid: string, archived: boolean) => {
    firestore
      .triviaSession(uid)
      .update({ archived, status: "disabled" })
      .then(() => {
        setSessions(reject(sessions, session => session.uid === uid));
      });
  };

  const resetSession = (uid: string) => {
    const updates = {
      currentQuestion: null,
      currentCategory: null,
      leaderBoard: [],
      status: "disabled"
    };
    firestore
      .triviaSession(uid)
      .update(updates)
      .then(() => {
        const sessionsClone = Array.from(sessions);
        const sessionIndex = findIndex(
          sessions,
          session => session.uid === uid
        );
        sessionsClone[sessionIndex] = { ...sessions[sessionIndex], ...updates };
        setSessions(sessionsClone);
      });
  };

  const buttonText = (status: TriviaSessionStatusType) => {
    if (status === "disabled") return "Start";
    if (status === "complete") return "Reset";
    return "View";
  };

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
            <TableCell align="right" className={classes.smallCell} />
            <TableCell align="right" className={classes.smallCell} />
            <TableCell align="right" className={classes.smallCell} />
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map(session => (
            <TableRow key={session.uid}>
              <TableCell component="th" scope="row">
                {session.name}
              </TableCell>
              <TableCell align="right">{session.accessCode}</TableCell>
              <TableCell align="right">{session.status}</TableCell>
              <TableCell align="right" className={classes.smallCell}>
                <Button
                  onClick={() => onButtonClick(session.uid, session.status)}
                  variant={"contained"}
                  size={"small"}
                  color={"primary"}
                >
                  {buttonText(session.status)}
                </Button>
              </TableCell>
              <TableCell align="right" className={classes.smallCell}>
                <ButtonLink
                  to={ROUTES.TRIVIA_SESSION.linkPath(session.uid)}
                  variant={"contained"}
                  size={"small"}
                  color={"primary"}
                >
                  Edit
                </ButtonLink>
              </TableCell>
              <TableCell align="right" className={classes.smallCell}>
                <Tooltip
                  title={
                    session.archived ? "Unarchive Session" : "Archive Session"
                  }
                >
                  <IconButton
                    onClick={() =>
                      archiveSession(session.uid, !session.archived)
                    }
                    size={"small"}
                  >
                    {session.archived ? <UnarchiveIcon /> : <ArchiveIcon />}
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default withRouter(TriviaSessionsTable);
