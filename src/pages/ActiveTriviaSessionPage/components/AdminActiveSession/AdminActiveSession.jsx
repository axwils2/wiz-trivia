// @flow
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { firestore } from "components/Firebase";
import { docDataWithId, mapQuerySnapshot } from "functions/firestoreHelpers";
import { SessionHeader, SessionTable, SessionFooter } from "./components";
import type { TriviaSessionType } from "types/TriviaSessionTypes";

const AdminActiveSession = ({ match }: { match: * }) => {
  const [triviaSession, setTriviaSession] = useState(null);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const triviaSessionUid = match.params.triviaSessionUid;

  useEffect(
    () => {
      if (!triviaSessionUid) return;
      firestore
        .categories(triviaSessionUid)
        .orderBy("order", "asc")
        .get()
        .then(querySnapshot => {
          const categoryData = mapQuerySnapshot(querySnapshot);
          setCategories(categoryData);

          firestore
            .triviaSessionQuestions(triviaSessionUid)
            .orderBy("order", "asc")
            .get()
            .then(querySnapshot => {
              const questionData = mapQuerySnapshot(querySnapshot);
              setQuestions(questionData);
            });
        });
      const unsubscribe = firestore
        .triviaSession(triviaSessionUid)
        .onSnapshot(doc => {
          setTriviaSession(docDataWithId(doc));
        });
      return () => unsubscribe();
    },
    [triviaSessionUid]
  );

  const updateTriviaSession = (updates: $Shape<TriviaSessionType>) => {
    firestore.triviaSession(triviaSessionUid).update(updates);
  };

  const completeTriviaSession = () => {
    updateTriviaSession({ status: "complete" });
    setSessionCompleted(true);
  };

  if (!triviaSession) return null;
  if (triviaSession.status === "disabled") {
    return (
      <Typography>
        This trivia session is not yet active! Go back to the table view and
        start the session.
      </Typography>
    );
  }

  if (triviaSession.status === "complete") {
    return (
      <Box paddingBottom={"48px"}>
        <Typography>
          This trivia session is complete! Here are the results:
        </Typography>
        <SessionTable triviaSession={triviaSession} currentQuestion={null} />
      </Box>
    );
  }

  return (
    <Box paddingBottom={"48px"}>
      <SessionHeader triviaSession={triviaSession} />
      <SessionTable
        triviaSession={triviaSession}
        sessionCompleted={sessionCompleted}
      />
      <SessionFooter
        triviaSession={triviaSession}
        updateTriviaSession={updateTriviaSession}
        completeTriviaSession={completeTriviaSession}
        categories={categories}
        questions={questions}
      />
    </Box>
  );
};

export default withRouter(AdminActiveSession);
