// @flow
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Container from "@material-ui/core/Container";

import { firestore } from "components/Firebase";
import { docDataWithId } from "functions/firestoreHelpers";
import { UpdateQuestionForm } from "./components";

const QuestionPage = ({ match }: { match: * }) => {
  const [question, setQuestion] = useState(null);

  useEffect(
    () => {
      firestore
        .question(
          match.params.triviaSessionUid,
          match.params.categoryUid,
          match.params.questionUid
        )
        .get()
        .then(doc => {
          const data = docDataWithId(doc);
          setQuestion(data);
        });
    },
    [
      match.params.triviaSessionUid,
      match.params.categoryUid,
      match.params.questionUid
    ]
  );

  if (!question) return null;

  return (
    <Container maxWidth={"md"}>
      <UpdateQuestionForm
        question={question}
        triviaSessionUid={match.params.triviaSessionUid}
        categoryUid={match.params.categoryUid}
      />
    </Container>
  );
};

export default withRouter(QuestionPage);
