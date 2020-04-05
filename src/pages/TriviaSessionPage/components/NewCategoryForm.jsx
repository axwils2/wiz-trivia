// @flow
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import toLower from "lodash/toLower";

import { firestore } from "components/Firebase";
import * as ROUTES from "constants/routes";

const NewCategoryForm = ({
  history,
  match,
  newOrderValue
}: {
  history: *,
  match: *,
  newOrderValue: number
}) => {
  const [name, setName] = useState("");
  const invalid = name === "";
  const triviaSessionUid = match.params.triviaSessionUid;

  const createCategory = () => {
    firestore
      .categories(triviaSessionUid)
      .add({
        name,
        nameInsensitive: toLower(name),
        createdAt: firestore.timestamp(),
        order: newOrderValue || 0
      })
      .then(docRef => {
        history.push(ROUTES.CATEGORY.linkPath(triviaSessionUid, docRef.id));
      });
  };

  return (
    <Container maxWidth={"sm"}>
      <Typography variant={"h6"}>Create New Category</Typography>
      <TextField
        id={"name"}
        label="Name"
        variant="outlined"
        onChange={e => setName(e.target.value)}
        margin={"normal"}
        value={name}
        fullWidth
      />
      <Button
        disabled={invalid}
        variant={"contained"}
        onClick={createCategory}
        size={"large"}
        fullWidth
      >
        Create
      </Button>
    </Container>
  );
};

export default withRouter(NewCategoryForm);
