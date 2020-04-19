// @flow
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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
  const [repeatWagersDisabled, setRepeatWagersDisabled] = useState(false);
  const invalid = name === "";
  const triviaSessionUid = match.params.triviaSessionUid;

  const createCategory = () => {
    firestore
      .categories(triviaSessionUid)
      .add({
        name,
        nameInsensitive: toLower(name),
        createdAt: firestore.timestamp().now(),
        order: newOrderValue || 0,
        repeatWagersDisabled
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
      <FormControlLabel
        control={
          <Checkbox
            checked={repeatWagersDisabled}
            onChange={() => setRepeatWagersDisabled(prev => !prev)}
            name="repeatWagersDisabled"
            color="primary"
          />
        }
        label="Disable Repeat Wagers Within This Category (Multiple Choice Wager Format Only)"
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
