// @flow
import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { firestore } from "components/Firebase";
import { docDataWithId } from "functions/firestoreHelpers";
import { UpdateQuestionForm } from "./components";
import * as ROUTES from "constants/routes";

const QuestionPage = ({ match }: { match: * }) => {
  const [question, setQuestion] = useState(null);
  const triviaSessionUid = match.params.triviaSessionUid;
  const categoryUid = match.params.categoryUid;
  const questionUid = match.params.questionUid;

  useEffect(
    () => {
      firestore
        .question(triviaSessionUid, categoryUid, questionUid)
        .get()
        .then(doc => {
          const data = docDataWithId(doc);
          setQuestion(data);
        });
    },
    [triviaSessionUid, categoryUid, questionUid]
  );

  if (!question) return null;

  return (
    <Container maxWidth={"md"}>
      <Breadcrumbs
        aria-label={"breadcrumbs"}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <Link to={ROUTES.TRIVIA_SESSIONS}>Sessions</Link>
        <Link to={ROUTES.TRIVIA_SESSION.linkPath(triviaSessionUid)}>
          Session/Categories
        </Link>
        <Link to={ROUTES.CATEGORY.linkPath(triviaSessionUid, categoryUid)}>
          Category/Questions
        </Link>
        <Typography>Question</Typography>
      </Breadcrumbs>
      <UpdateQuestionForm
        question={question}
        triviaSessionUid={match.params.triviaSessionUid}
        categoryUid={match.params.categoryUid}
      />
    </Container>
  );
};

export default withRouter(QuestionPage);