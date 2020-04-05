// @flow
import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { firestore } from "components/Firebase";
import { docDataWithId } from "functions/firestoreHelpers";
import { UpdateCategoryForm, QuestionsTable } from "./components";
import * as ROUTES from "constants/routes";

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(8, 0, 2)
  }
}));

const CategoryPage = ({ match }: { match: * }) => {
  const classes = useStyles();
  const [category, setCategory] = useState(null);
  const triviaSessionUid = match.params.triviaSessionUid;
  const categoryUid = match.params.categoryUid;

  useEffect(
    () => {
      firestore
        .category(triviaSessionUid, categoryUid)
        .get()
        .then(doc => {
          const data = docDataWithId(doc);
          setCategory(data);
        });
    },
    [triviaSessionUid, categoryUid]
  );

  if (!category) return null;

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
        <Typography>Category/Questions</Typography>
      </Breadcrumbs>
      <UpdateCategoryForm
        category={category}
        triviaSessionUid={triviaSessionUid}
      />
      <Divider className={classes.divider} />
      <QuestionsTable category={category} triviaSessionUid={triviaSessionUid} />
    </Container>
  );
};

export default withRouter(CategoryPage);
