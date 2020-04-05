// @flow
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";

import { firestore } from "components/Firebase";
import { docDataWithId } from "functions/firestoreHelpers";
import { UpdateCategoryForm, QuestionsTable } from "./components";

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(8, 0, 2)
  }
}));

const CategoryPage = ({ match }: { match: * }) => {
  const classes = useStyles();
  const [category, setCategory] = useState(null);

  useEffect(
    () => {
      firestore
        .category(match.params.triviaSessionUid, match.params.categoryUid)
        .get()
        .then(doc => {
          const data = docDataWithId(doc);
          setCategory(data);
        });
    },
    [match.params.triviaSessionUid, match.params.categoryUid]
  );

  if (!category) return null;

  return (
    <Container maxWidth={"md"}>
      <UpdateCategoryForm
        category={category}
        triviaSessionUid={match.params.triviaSessionUid}
      />
      <Divider className={classes.divider} />
      <QuestionsTable
        category={category}
        triviaSessionUid={match.params.triviaSessionUid}
      />
    </Container>
  );
};

export default withRouter(CategoryPage);
