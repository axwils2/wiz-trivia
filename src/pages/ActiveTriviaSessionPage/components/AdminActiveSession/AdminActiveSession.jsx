// @flow
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import forEach from "lodash/forEach";
import flatten from "lodash/flatten";

import { firestore } from "components/Firebase";
import { docDataWithId, mapQuerySnapshot } from "functions/firestoreHelpers";
import { SessionHeader, SessionTable, SessionFooter } from "./components";
import type { TriviaSessionType } from "types/TriviaSessionTypes";

const AdminActiveSession = ({ match }: { match: * }) => {
  const [triviaSession, setTriviaSession] = useState(null);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
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

  if (!triviaSession) return null;
  if (triviaSession.status !== "active") {
    return (
      <Typography>This trivia session is {triviaSession.status}!</Typography>
    );
  }

  return (
    <Box>
      <SessionHeader triviaSession={triviaSession} />
      <SessionTable
        triviaSession={triviaSession}
        currentQuestion={triviaSession.currentQuestion}
      />
      <SessionFooter
        triviaSession={triviaSession}
        updateTriviaSession={updateTriviaSession}
        categories={categories}
        questions={questions}
      />
    </Box>
  );
};

export default withRouter(AdminActiveSession);
