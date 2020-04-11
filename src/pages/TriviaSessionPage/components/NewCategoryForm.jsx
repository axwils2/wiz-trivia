// @flow
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import toLower from "lodash/toLower";

import { firestore } from "components/Firebase";
import { categoryWagerLabels } from "constants/userFriendlyLabels";
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
  const [wagerType, setWagerType] = useState(null);
  const invalid = name === "" || !wagerType;
  const triviaSessionUid = match.params.triviaSessionUid;

  const createCategory = () => {
    firestore
      .categories(triviaSessionUid)
      .add({
        name,
        nameInsensitive: toLower(name),
        createdAt: firestore.timestamp().now(),
        order: newOrderValue || 0,
        wagerType
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
      <FormControl component="fieldset">
        <FormLabel component="legend">Wager Type</FormLabel>
        <RadioGroup
          aria-label="wager type"
          name="wagerType"
          value={wagerType}
          onChange={e => setWagerType(e.target.value)}
        >
          {categoryWagerLabels.map(labelObject => (
            <FormControlLabel
              key={labelObject.value}
              value={labelObject.value}
              control={<Radio />}
              label={labelObject.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
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
